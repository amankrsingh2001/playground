import { RedisClientType } from 'redis';

// get functions
const getRedisField = async (redisClient: RedisClientType, field: string): Promise<string | null> => {
    try {
        console.log(`getRedisField() - [field: ${field}]`);
        return await redisClient.GET(field);
    } catch (error) {
        console.error(error);
        throw new Error("Error fetching redis field");
    }
};

const getHSETRedisField = async (redisClient: RedisClientType, field: string): Promise<Record<string, string> | null> => {
    try {
        console.log(`getHSETRedisField() - [field: ${field}]`);
        return await redisClient.HGETALL(field);
    } catch (error) {
        console.error(error);
        throw new Error("Error fetching hashset redis field");
    }
};

// set functions
const setRedisField = async (redisClient: RedisClientType, field: string, value: string, ttl: number = 0): Promise<void> => {
    try {
        console.log(`setRedisField() - [field: ${field}, value: ${value}, ttl: ${ttl}]`);
        await redisClient.SET(field, value);

        if (ttl > 0) {
            await redisClient.EXPIRE(field, ttl);
        }
    } catch (error) {
        console.error(error);
        throw new Error("Error inserting field");
    }
};

const setRedisTTL = async (redisClient: RedisClientType, keys: string[] = [], ttl: number = 0): Promise<void> => {
    try {
        if (!Array.isArray(keys) || keys.length === 0) {
            throw new Error("Keys must be a non-empty array.");
        }

        console.log(`setRedisTTL() - Setting TTL [${ttl}] for ${keys.length} keys`);

        if (ttl > 0) {
            for (const key of keys) {
                await redisClient.EXPIRE(key, ttl);
            }
        }
    } catch (error) {
        console.error(error);
        throw new Error("Error setting TTL for keys");
    }
};

const HSETRedisField = async (
    redisClient: RedisClientType,
    key: string,
    field: string,
    value: string,
    ttl: number = 0
): Promise<void> => {
    try {
        console.log(`HSETRedisField() - [key: ${key}, field: ${field}, value: ${value}, ttl: ${ttl}]`);
        await redisClient.hSet(key, field, value);

        if (ttl > 0) {
            await redisClient.EXPIRE(key, ttl);
        }
    } catch (error) {
        console.error(error);
        throw new Error("Error inserting hashset field");
    }
};

const deleteRedisField = async (redisClient: RedisClientType, field: string): Promise<void> => {
    try {
        console.log(`deleteRedisField() - [field: ${field}]`);
        await redisClient.DEL(field);
    } catch (error) {
        console.error(error);
        throw new Error("Error delete redis field");
    }
};

const redisEnqueue = async (redisClient: RedisClientType, queueName: string, data: string): Promise<void> => {
    try {
        console.log(`redisEnqueue() - [queueName: ${queueName}, data: ${data}]`);
        await redisClient.lPush(queueName, data);
    } catch (error) {
        console.error(error);
        throw new Error("Error enqueue redis field");
    }
};

const redisDequeue = async (redisClient: RedisClientType, queueName: string): Promise<string | null> => {
    try {
        console.log(`redisDequeue() - [queueName: ${queueName}]`);
        return await redisClient.rPop(queueName);
    } catch (error) {
        console.error(error);
        throw new Error("Error dequeue redis field");
    }
};

const pushToList = async (redisClient: RedisClientType, key: string, value: string, expiryTime: number): Promise<void> => {
    try {
        console.log(`pushToList() - [key: ${key}]`);
        await redisClient.lPush(key, value);
        await redisClient.EXPIRE(key, expiryTime);
    } catch (error) {
        console.error(error);
        throw new Error("Error pushing to list");
    }
};

const getMultipleValues = async (redisClient: RedisClientType, keys: string[] = []): Promise<(string | null)[]> => {
    try {
        const response = await redisClient.mGet(keys);
        return response;
    } catch (error) {
        console.error(error);
        throw new Error("Error getting multiple values");
    }
};

export {
    getRedisField,
    getHSETRedisField,
    HSETRedisField,
    setRedisField,
    deleteRedisField,
    pushToList,
    redisEnqueue,
    redisDequeue,
    getMultipleValues,
    setRedisTTL,
};

export type { RedisClient };