import mongoose from "mongoose";
import { logger } from "../utils/logger.js";
import dotenv from "dotenv"
dotenv.config()

export const connectDB = async()=>{
    try{

        await mongoose.connect(process.env.MONGO_URL)
        logger.info("Mongo connected successfully")

    }catch(error){
        logger.error("MongoDB connection failed", { error: error.message })
        process.exit(1)
    }
}