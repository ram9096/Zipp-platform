import { Worker } from "bullmq";
import { otpQueue } from "../queues/otpQueue.js";
import { sentOtpJob } from "../jobs/sentOtpJob.js";
import { logger } from "../utils/logger.js";
import { redis } from "../config/redis.js";

const env = process.env.NODE_ENV == "development" ? "dev" : "prod"

new Worker(
    `${env}.auth.otp.send` , async(job)=>{
        try{
            
            logger.info("Job started", {
                jobId: job.id,
                jobName: job.name,
            });

            switch(job.name){

                case "sent-otp":
                    await sentOtpJob(job.data)
                    break;
                default:
                    logger.warn("Unknown job type", {
                            jobName: job.name,
                    });
                    throw new Error("Unknown job type");
            }
            logger.info("Job completed", {
                jobId: job.id,
                jobName: job.name,
            });

        }catch(err){
            logger.error("Job failed", {
                jobId: job.id,
                jobName: job.name,
                error: err.message,
                stack: err.stack,
            });

            throw err

        }

    },
    { connection:redis }
)
