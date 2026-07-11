import jwt from "jsonwebtoken"

export const generateToken = (user)=>{

    return jwt.sign(
        {id:user._id,email:user.email},
        process.env.JWT_SECRET,
        {expiresIn:"1d"}        
    )
}

export const generateOtpToken = (email)=>{
    return jwt.sign(
        {email:email},
        process.env.JWT_SECRET,
        {expiresIn:"5m"}        
    )
}