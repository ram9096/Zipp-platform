import { logger } from "../../utils/logger.js"

export const getLoginPage = (req,res)=>{
    res.render('user/auth/login')
}

export const loginUser = async (req,res)=>{
    try{
        const {email,password} = req.body
        
    }catch(error){
        logger.error("LOGIN ERROR", {
            message: error.message,
            stack: error.stack,
            route: "/login",
            method: "POST",
            user: req.body.email || "unknown",
            time: new Date().toISOString()
        });
    }
}