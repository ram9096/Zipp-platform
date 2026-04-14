import { authenticateUser } from "../../../services/user/authService.js"
import { logger } from "../../../utils/logger.js"
import { generateToken } from "../../../utils/jwt.js"


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

        res.cookie("accessToke",token,{
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
            stack: error.stack,
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