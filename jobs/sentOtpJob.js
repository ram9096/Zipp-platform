import { sentOtpMail } from "../services/user/mailService.js";
import { logger } from "../utils/logger.js";

export const sentOtpJob = async (data)=>{
    try{    

        const { email,otp } = data

        await sentOtpMail(email,otp)

    }catch(err){
        logger.error("server error ",{error:err.message})
    }
}