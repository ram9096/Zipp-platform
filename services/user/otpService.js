import { redis } from "../../config/redis.js";
import { generateOtp } from "../../utils/generateOtp.js";
import { hashOtp } from "../../utils/hash.js";
import { logger } from "../../utils/logger.js";
import { otpQueue } from "../../queues/otpQueue.js";

export const sentOtp = async (email,userId)=>{
    
    try{

        //OTP GENERATING AND HASHING IT AND STORING IN REDIS

        const otp = generateOtp()
        const hash = hashOtp(otp)
        await redis.set(`otp:${userId}`,hash,"EX",300)

        await otpQueue.add("sent-otp",{email,otp})
        
        return {
            success:true,
            message:"Otp successfully sent"
        }
    }catch(err){

        logger.error("Error while sending ",{error:err.message})
        return {
            success:false,
            message:"Server error"
        }
    }
}