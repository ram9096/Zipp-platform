import Redis from "ioredis";
import { logger } from "../utils/logger.js";

export const redis = new Redis({
    host:process.env.REDIS_HOST,
    port:process.env.REDIS_PORT,
    maxRetriesPerRequest: null
})


redis.on("connect",()=>{
    logger.info("Redis connected")
})

redis.on("error",(e)=>{
    logger.error("Redis error ",{ error:e.message })
})