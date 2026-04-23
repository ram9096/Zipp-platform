import { User } from "../../models/user/user.js";
import bcrypt from "bcrypt"
import { logger } from "../../utils/logger.js";


export const findUserByEmail = (email)=>User.findOne({email})

export const authenticateUser = async(email,password)=>{
    try{

        //USER CHECKING

        const user = await findUserByEmail(email)
        
        if(!user){
            return {
                success:false,
                message:"User not found"
            }
        }

        //PASSWORD CHECKING

        const isPasswordValid =  await bcrypt.compare(password,user.password)

        if(!isPasswordValid){
            return {
                success:false,
                message:"Invalid password"
            }
        }

        return {
            success:true,
            message:"നമസ്കാരം 🙏",
            user:user
        }
        
    }catch(e){

        //ERROR HANDLING

        logger.error("LOGIN_SERVICE_ERROR", {
            message:e.message,
            stack:process.env.NODE_ENV === "development"? e.stack : undefined
        });

        return {
            success: false,
            message: "Internal server error"
        };
    }
}

export const createUser = async (data,role,location)=>{
    try{
        
        const emailValidation = await findUserByEmail(data.email)

        if(emailValidation){

            return {
                success:false,
                message:"Email already exist"
            }

        }

        const hashedPassword = await bcrypt.hash(data.password,10)

        if(role == "rider"){

            const user = await User.create({
                name:data.name,
                email:data.email,
                password:hashedPassword,
                phone:data.phone,
                role:role,
                location:{
                    coordinates: [location.lng, location.lat]
                }
            })

            return {
                
                success:true,
                userId:user._id,
                email:data.email
            } 
        }


    }catch(err){

        logger.error("REGISTER_USER_ERROR",{
            message:err.message,
            stack: process.env.NODE_ENV === "development"? err.stack : undefined
        })

        return {
            success:false,
            message:"Internal server error"
        }
    }
}