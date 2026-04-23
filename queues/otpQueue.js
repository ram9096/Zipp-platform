import { Queue } from "bullmq";
import { redis } from "../config/redis.js";
import dotenv from "dotenv"
dotenv.config()

const env = process.env.NODE_ENV == "development" ? "dev" : "prod"

export const otpQueue = new Queue(`${env}.auth.otp.send`,{
    connection:redis
})