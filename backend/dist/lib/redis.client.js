"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setRedisTTL = exports.getMultipleValues = exports.redisDequeue = exports.redisEnqueue = exports.pushToList = exports.deleteRedisField = exports.setRedisField = exports.HSETRedisField = exports.getHSETRedisField = exports.getRedisField = void 0;
// get functions
const getRedisField = (redisClient, field) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`getRedisField() - [field: ${field}]`);
        return yield redisClient.GET(field);
    }
    catch (error) {
        console.error(error);
        throw new Error("Error fetching redis field");
    }
});
exports.getRedisField = getRedisField;
const getHSETRedisField = (redisClient, field) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`getHSETRedisField() - [field: ${field}]`);
        return yield redisClient.HGETALL(field);
    }
    catch (error) {
        console.error(error);
        throw new Error("Error fetching hashset redis field");
    }
});
exports.getHSETRedisField = getHSETRedisField;
// set functions
const setRedisField = (redisClient_1, field_1, value_1, ...args_1) => __awaiter(void 0, [redisClient_1, field_1, value_1, ...args_1], void 0, function* (redisClient, field, value, ttl = 0) {
    try {
        console.log(`setRedisField() - [field: ${field}, value: ${value}, ttl: ${ttl}]`);
        yield redisClient.SET(field, value);
        if (ttl > 0) {
            yield redisClient.EXPIRE(field, ttl);
        }
    }
    catch (error) {
        console.error(error);
        throw new Error("Error inserting field");
    }
});
exports.setRedisField = setRedisField;
const setRedisTTL = (redisClient_1, ...args_1) => __awaiter(void 0, [redisClient_1, ...args_1], void 0, function* (redisClient, keys = [], ttl = 0) {
    try {
        if (!Array.isArray(keys) || keys.length === 0) {
            throw new Error("Keys must be a non-empty array.");
        }
        console.log(`setRedisTTL() - Setting TTL [${ttl}] for ${keys.length} keys`);
        if (ttl > 0) {
            for (const key of keys) {
                yield redisClient.EXPIRE(key, ttl);
            }
        }
    }
    catch (error) {
        console.error(error);
        throw new Error("Error setting TTL for keys");
    }
});
exports.setRedisTTL = setRedisTTL;
const HSETRedisField = (redisClient_1, key_1, field_1, value_1, ...args_1) => __awaiter(void 0, [redisClient_1, key_1, field_1, value_1, ...args_1], void 0, function* (redisClient, key, field, value, ttl = 0) {
    try {
        console.log(`HSETRedisField() - [key: ${key}, field: ${field}, value: ${value}, ttl: ${ttl}]`);
        yield redisClient.hSet(key, field, value);
        if (ttl > 0) {
            yield redisClient.EXPIRE(key, ttl);
        }
    }
    catch (error) {
        console.error(error);
        throw new Error("Error inserting hashset field");
    }
});
exports.HSETRedisField = HSETRedisField;
const deleteRedisField = (redisClient, field) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`deleteRedisField() - [field: ${field}]`);
        yield redisClient.DEL(field);
    }
    catch (error) {
        console.error(error);
        throw new Error("Error delete redis field");
    }
});
exports.deleteRedisField = deleteRedisField;
const redisEnqueue = (redisClient, queueName, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`redisEnqueue() - [queueName: ${queueName}, data: ${data}]`);
        yield redisClient.lPush(queueName, data);
    }
    catch (error) {
        console.error(error);
        throw new Error("Error enqueue redis field");
    }
});
exports.redisEnqueue = redisEnqueue;
const redisDequeue = (redisClient, queueName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`redisDequeue() - [queueName: ${queueName}]`);
        return yield redisClient.rPop(queueName);
    }
    catch (error) {
        console.error(error);
        throw new Error("Error dequeue redis field");
    }
});
exports.redisDequeue = redisDequeue;
const pushToList = (redisClient, key, value, expiryTime) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`pushToList() - [key: ${key}]`);
        yield redisClient.lPush(key, value);
        yield redisClient.EXPIRE(key, expiryTime);
    }
    catch (error) {
        console.error(error);
        throw new Error("Error pushing to list");
    }
});
exports.pushToList = pushToList;
const getMultipleValues = (redisClient_1, ...args_1) => __awaiter(void 0, [redisClient_1, ...args_1], void 0, function* (redisClient, keys = []) {
    try {
        const response = yield redisClient.mGet(keys);
        return response;
    }
    catch (error) {
        console.error(error);
        throw new Error("Error getting multiple values");
    }
});
exports.getMultipleValues = getMultipleValues;
