import jwt from "jsonwebtoken"
import { logger } from "../utils/logger.js"

export const authMiddleware = (req,res,next)=>{
    try{
        
        //TOKEN CHECKING
        const token = req.cookies?.accessToken
        
        if(!token){
            return res.redirect("/auth/login")
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET)

        req.user = decoded

        next()

    }catch(err){

        //ERROR HANDELING
        logger.error("AUTH_PROTECTION_FAILED",{

            message:err.message,
            route:req.originalUrl,
            method:req.method,
            stack: process.env.NODE_ENV === "development" ? err.stack : undefined  

        })

        return res.redirect("/auth/login")
    }
}

export const otpMiddleware = (req,res,next)=>{

    try{
        
        //TOKEN CHECKING
        const token = req.cookies?.otpToken
        
        if(!token){
            return res.redirect("/auth/login")
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET)

        next()

    }catch(err){

        //ERROR HANDELING
        logger.error("OTP_PROTECTION_FAILED",{

            message:err.message,
            route:req.originalUrl,
            method:req.method,
            stack: process.env.NODE_ENV === "development" ? err.stack : undefined  

        })
        return res.redirect("/auth/login")
    }
}