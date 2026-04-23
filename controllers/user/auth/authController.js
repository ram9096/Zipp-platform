import { authenticateUser, createUser } from "../../../services/user/authService.js"
import { logger } from "../../../utils/logger.js"
import { generateToken } from "../../../utils/jwt.js"
import { registerSchema } from "../../../validation/userValidate.js"
import { sentOtp } from "../../../services/user/otpService.js"

export const getLoginPage = (req,res)=>{
    res.render('user/auth/login')
}

export const loginUser = async (req,res)=>{
    
    try{
        
        //DATA GETTING

        const {email,password} = req.body

        if(!email||!password){
            return res.status(400).json({
                success:false,
                message:"Email and password is required!!"
            })
        }

        //AUTHENTICATING USER

        const authenticate = await authenticateUser(email,password)

        if(!authenticate.success){
            return res.status(401).json({
                success:false,
                message:authenticate.message
            })
        }

        //GENERATING JWT TOKEN

        const token = generateToken(authenticate.user)

        // JWT TOKEN RETURNING TO USER 

        res.cookie("accessToken",token,{
            httpOnly: true,
            secure: false,
            sameSite: "strict"
        })

        return res.status(200).json({
            success:true,
            redirect:"/home",
            message:authenticate.message
        })

    }catch(error){

        //ERROR HANDELING

        logger.error("LOGIN_ERROR", {
            message: error.message,
            stack: process.env.NODE_ENV === "development"? error.stack : undefined,
            route: req.originalUrl,
            method: req.method,
            time: new Date().toISOString()
        });

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export const registerUser = async (req,res)=>{

    try{

        const { data,role,location } = req.body
        
        // DATA VALIDATION 

        const validation = registerSchema.safeParse(data)

        if(!validation.success){
            
            const formattedMessage = Object.values(frontEndValidation.error.flatten().fieldErrors)
                .flat()
                .join(", ");
            return res.status(400).json({
                success:false,
                message: formattedMessage
            })
        }

        //CREATING THE USER HERE

        const userCreation = await createUser(data,role,location)
        
        if(!userCreation.success){
            
            return res.status(409).json({
                success:false,
                message:userCreation.message
            })
        }

        await sentOtp(userCreation.email,userCreation.userId)

        return res.status(200).json({
            success:true,
            redirect:"/auth/otp"
        })
        
    }catch(error){

        logger.error("LOGIN_ERROR", {
            message: error.message,
            stack: process.env.NODE_ENV === "development"? error.stack : undefined,
            route: req.originalUrl,
            method: req.method,
            time: new Date().toISOString()
        });
        
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }
}

export const getOtpPage = (req,res)=>{
    return res.render('User/auth/otp')
}