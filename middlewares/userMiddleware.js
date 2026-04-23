import jwt from "jsonwebtoken"
import { logger } from "../utils/logger"

export const authMiddleware = (req,res,next)=>{
    try{
        
        //TOKEN CHECKING
        const token = req.cookies.accessToken

        if(!token){
            return res.status(401).json({
                success:false,
                message:"Access token missing"
            })
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET)

        req.user = decoded

        next()

    }catch(err){

        //ERROR HANDELING
        logger.error("AUTH_LOGIN_FAILED",{

            message:err.message,
            route:req.originalUrl,
            method:req.method,
            stack: process.env.NODE_ENV === "development" ? err.stack : undefined  

        })
        return res.status(401).json({

            success:false,
            message:"Invalid or expired token"
            
        })
    }
}