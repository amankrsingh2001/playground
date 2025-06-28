interface RedisClient {
    GET: (field: string) => Promise<string | null>;
    HGETALL: (field: string) => Promise<Record<string, string> | null>;
    SET: (field: string, value: string) => Promise<void>;
    EXPIRE: (field: string, ttl: number) => Promise<void>;
    DEL: (field: string) => Promise<void>;
    lPush: (queueName: string, data: string) => Promise<void>;
    rPop: (queueName: string) => Promise<string | null>;
    hSet: (key: string, field: string, value: string) => Promise<void>;
    mGet: (keys: string[]) => Promise<(string | null)[]>;
}

// get functions
const getRedisField = async (redisClient: RedisClient, field: string): Promise<string | null> => {
    try {
        console.log(`getRedisField() - [field: ${field}]`);
        return await redisClient.GET(field);
    } catch (error) {
        console.error(error);
        throw new Error("Error fetching redis field");
    }
};

const getHSETRedisField = async (redisClient: RedisClient, field: string): Promise<Record<string, string> | null> => {
    try {
        console.log(`getHSETRedisField() - [field: ${field}]`);
        return await redisClient.HGETALL(field);
    } catch (error) {
        console.error(error);
        throw new Error("Error fetching hashset redis field");
    }
};

// set functions
const setRedisField = async (redisClient: RedisClient, field: string, value: string, ttl: number = 0): Promise<void> => {
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

const setRedisTTL = async (redisClient: RedisClient, keys: string[] = [], ttl: number = 0): Promise<void> => {
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
    redisClient: RedisClient,
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

const deleteRedisField = async (redisClient: RedisClient, field: string): Promise<void> => {
    try {
        console.log(`deleteRedisField() - [field: ${field}]`);
        await redisClient.DEL(field);
    } catch (error) {
        console.error(error);
        throw new Error("Error delete redis field");
    }
};

const redisEnqueue = async (redisClient: RedisClient, queueName: string, data: string): Promise<void> => {
    try {
        console.log(`redisEnqueue() - [queueName: ${queueName}, data: ${data}]`);
        await redisClient.lPush(queueName, data);
    } catch (error) {
        console.error(error);
        throw new Error("Error enqueue redis field");
    }
};

const redisDequeue = async (redisClient: RedisClient, queueName: string): Promise<string | null> => {
    try {
        console.log(`redisDequeue() - [queueName: ${queueName}]`);
        return await redisClient.rPop(queueName);
    } catch (error) {
        console.error(error);
        throw new Error("Error dequeue redis field");
    }
};

const pushToList = async (redisClient: RedisClient, key: string, value: string, expiryTime: number): Promise<void> => {
    try {
        console.log(`pushToList() - [key: ${key}]`);
        await redisClient.lPush(key, value);
        await redisClient.EXPIRE(key, expiryTime);
    } catch (error) {
        console.error(error);
        throw new Error("Error pushing to list");
    }
};

const getMultipleValues = async (redisClient: RedisClient, keys: string[] = []): Promise<(string | null)[]> => {
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