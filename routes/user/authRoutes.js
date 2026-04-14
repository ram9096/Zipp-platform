import express from "express"
import { getLoginPage } from "../../controllers/user/auth/authController.js"

let router = express.Router()

router.get('/',getLoginPage)


export default router