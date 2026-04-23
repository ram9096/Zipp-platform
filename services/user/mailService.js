import nodemailer from "nodemailer"
import fs from "fs"
import path from "path";
import { fileURLToPath } from "url"
import { logger } from "../../utils/logger.js";
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const templatePath = path.join(__dirname, "../../views/user/auth/mail.html")

let html = fs.readFileSync(templatePath,"utf-8")

const transporter = nodemailer.createTransport({

    service:"gmail",
    auth:{
        user:process.env.EMAIL,
        pass:process.env.PASSWORD
    }
})

export const sentOtpMail = async (email,otp)=>{
    try{

        html = html.replace("{{OTP_CODE}}",otp)

        const mailSettings = {
            from:process.env.EMAIL,
            to:email,
            subject:"One Time Password Zipp",
            html:html
        }

        //SENTING OTP VIA MAIL 

        await transporter.sendMail(mailSettings)

    }catch(err){
        logger.error("Error while sending ",{error:err.message})
    }
}