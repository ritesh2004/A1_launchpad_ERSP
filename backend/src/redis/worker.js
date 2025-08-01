import { Worker } from "bullmq";
import IOredis from 'ioredis';
import { sendEmail } from "../microservices/mailsender.service.js";
import dotenv from 'dotenv';
dotenv.config();

const redis = new IOredis({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    maxRetriesPerRequest: null
});

const emailWorker = new Worker('emailQueue', async job => {
    const { data } = job;
    await sendEmail(data.to, data.subject, data.html);
}, { connection: redis });

emailWorker.on('completed', (job) => {
    console.log(`Email job ${job.id} completed successfully`);
});
emailWorker.on('failed', (job, err) => {
    console.error(`Email job ${job.id} failed with error: ${err.message}`);
});