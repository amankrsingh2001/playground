import { Request } from "express";
import { RedisClientType } from "redis";
import { Socket } from "socket.io";
import { WebSocket } from "ws";

export interface UserInfo {
    userId: string;
    name: string;
    email: string;
}


export interface AuthRequest extends Request {
    auth?: {
        userId: string;
        userInfo: UserInfo;
    };
    redisClient: RedisClientType;
}

export interface AuthenticatedWebSocket extends WebSocket {
    userId?: string;
    userInfo?: UserInfo;
    redisClient?: RedisClientType;
    auth?: {
        userId: string;
        userInfo: UserInfo;
    };
}
