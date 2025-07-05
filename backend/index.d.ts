import { RedisClientType } from 'redis';
import 'express';

declare module 'express-serve-static-core' {
    interface Request {
        redisClient: RedisClientType;
    }
}