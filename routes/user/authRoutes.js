import express from "express"
import { getLoginPage, getOtpPage, loginUser, registerUser } from "../../controllers/user/auth/authController.js"

let router = express.Router()

//LOGIN ROUTES

router.get('/login',getLoginPage)
router.post('/login',loginUser)

//REGISTER ROUTES

router.post('/register',registerUser)

router.get('/otp',getOtpPage)
export default router