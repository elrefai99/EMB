import { Worker, Job } from "bullmq";
import dotenv from "dotenv";
import { jobProcessor } from "./job.proccess";
dotenv.config();
const worker = new Worker("emailQ", jobProcessor, {
     connection: {
          url: process.env.REDIS_URL,
     },
});

worker.on("completed", (job) => {
     console.log(`Email sent to ${job.data.email}`);
     job.updateProgress(100);
});

worker.on("failed", (job: Job | undefined, err: Error, _prev: string) => {
     if (job) {
          console.error(`Failed to send email to ${job.data.to}:`, err);
     } else {
          console.error(`Failed to send email: job is undefined`, err);
     }
});
