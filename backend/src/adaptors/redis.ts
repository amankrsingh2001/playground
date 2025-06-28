import { createClient, RedisClientType } from "redis";
import config from "../config";

const createRedisConnection = async (): Promise<RedisClientType> => {
    try {
        const {
            REDIS_HOST,
            REDIS_PORT,
            REDIS_USERNAME,
            REDIS_PASSWORD
        } = process.env;

        if (!REDIS_HOST || !REDIS_PORT) {
            throw new Error("Missing required Redis configuration in environment variables");
        }

        const RedisClient: RedisClientType = createClient({
            url: REDIS_USERNAME && REDIS_PASSWORD
                ? `redis://${REDIS_USERNAME}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`
                : `redis://${REDIS_HOST}:${REDIS_PORT}`
        });

        await RedisClient.connect();

        console.log("Redis connected successfully");
        return RedisClient;
    } catch (error) {
        console.error("Redis connection error:", error);
        throw new Error(typeof error === "string" ? error : "Failed to connect to Redis");
    }
};

export default createRedisConnection;