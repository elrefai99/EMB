import { createClient } from 'redis';

const redis: any = createClient({ url: String(process.env.REDIS_URL) });

redis.on("error", (err: any) => console.log("Redis Client Error", err));
redis.connect().then(() => console.log(`🛢️  Redis connected successfully: ${process.env.REDIS_URL}`));

process.on('SIGINT', async () => {
     await redis.disconnect();
     console.log('Redis connection closed');
     process.exit(0);
});

export default redis;
