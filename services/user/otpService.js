import { redis } from "../../config/redis.js";
import { generateOtp } from "../../utils/generateOtp.js";
import { hashOtp } from "../../utils/hash.js";
import { logger } from "../../utils/logger.js";
import { otpQueue } from "../../queues/otpQueue.js";
import crypto from "crypto"

export const sentOtp = async (email)=>{
    
    try{

        //OTP GENERATING AND HASHING IT AND STORING IN REDIS

        const otp = generateOtp()
        const hash = hashOtp(otp)
        const tempToken = crypto.randomBytes(32).toString("hex");

        //RATE LIMITING 

        const rateKey = `auth:rate:${email}`
        const request = await redis.incr(rateKey)

        if(request == 1){
            await redis.expire(rateKey,60)
        }

        if(request>5){
            return {
                success:false,
                message:"Too many request. Try later"
            }
        }

        //STORING THE OTP

        await redis.set(`auth:otp:${tempToken}`,

            JSON.stringify({
                otpHash: hash,
                email,
                attempts: 0
            })

            ,"EX",300)
        
        //ADDING TO OTP QUEUE
        
        await otpQueue.add("sent-otp",{email,otp})
        
        return {
            success:true,
            message:"Otp successfully sent",
            tempToken:tempToken
        }
    }catch(err){

        logger.error("Error while sending ",{error:err.message})
        return {
            success:false,
            message:"Server error"
        }
    }
}

export const verifyOtp = async (token,otp)=>{
    

    try{

        //GETTING THE STORED OTP

        const storedOtp = await redis.get(`auth:otp:${token}`)

        //STORED DATA

        const parsedData = JSON.parse(storedOtp);

        if(!storedOtp){

            return {
                success:false,
                message:"Otp expired or not found"
            }
        }

        //VALIDATING IT 
        
        const incomingOtp = crypto
            .createHash("sha256")
            .update(otp)
            .digest("hex");
        
        if(incomingOtp != parsedData["otpHash"]){

            return {
                success:false,
                message:"Invalid otp"
            }
        }

        //DELETING IT

        await redis.del(`auth:otp:${token}`)

        return {
            success:true,
            message:"Otp successfully verified",
            redirect:"/auth/login"
        }

    }catch(err){

        logger.error("Error while verifying OTP ",{error:err.message})
        return {
            success:false,
            message:"Server error"
        }

    }
}