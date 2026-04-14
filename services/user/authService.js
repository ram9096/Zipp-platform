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
        logger.error("LOGIN_SERVICE_ERROR", {
            message:e.message,
            stack:e.stack
        });

        return {
            success: false,
            message: "Internal server error"
        };
    }
}