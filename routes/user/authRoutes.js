import express from "express"
import { getHomePage, getLoginPage, getOtpPage, loginUser, registerUser, verifyUserOtp } from "../../controllers/user/auth/authController.js"
import { authMiddleware, otpMiddleware } from "../../middlewares/userMiddleware.js"

let router = express.Router()

//LOGIN ROUTES

router.get('/login',getLoginPage)
router.post('/login',loginUser)

//REGISTER ROUTES

router.post('/register',registerUser)

//HOME ROUTES

router.get('/home',authMiddleware,getHomePage) 

//OTP ROUTES

router.get('/otp',otpMiddleware,getOtpPage)
router.post('/otp',verifyUserOtp)

export default router