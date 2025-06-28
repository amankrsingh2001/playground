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
const redis_1 = require("redis");
const createRedisConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { REDIS_HOST, REDIS_PORT, REDIS_USERNAME, REDIS_PASSWORD } = process.env;
        if (!REDIS_HOST || !REDIS_PORT) {
            throw new Error("Missing required Redis configuration in environment variables");
        }
        const RedisClient = (0, redis_1.createClient)({
            url: REDIS_USERNAME && REDIS_PASSWORD
                ? `redis://${REDIS_USERNAME}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`
                : `redis://${REDIS_HOST}:${REDIS_PORT}`
        });
        yield RedisClient.connect();
        console.log("Redis connected successfully");
        return RedisClient;
    }
    catch (error) {
        console.error("Redis connection error:", error);
        throw new Error(typeof error === "string" ? error : "Failed to connect to Redis");
    }
});
exports.default = createRedisConnection;
