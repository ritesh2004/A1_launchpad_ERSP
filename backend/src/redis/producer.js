import IOredis from 'ioredis';
import { Queue } from 'bullmq';

const redis = new IOredis({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    maxRetriesPerRequest: null
});
const emailQueue = new Queue('emailQueue', { connection: redis });

export const addEmailToQueue = (emailData) => {
    emailQueue.add('sendEmail', emailData, {
        attempts: 3,
        backoff: 5000, // Retry after 5 seconds
    });
};