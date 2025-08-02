import { Job } from "bullmq";

const sendEmail = async (data: any) => {
     console.log(data)
}

export const jobProcessor = async (job: Job): Promise<any> => {
     console.log("Processing job: ", job.name);
     job.updateProgress(0);
     await sendEmail(job.data);
};
