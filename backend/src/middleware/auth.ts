"use strict";
import { Request, Response, NextFunction } from "express";
import { getRedisField } from "../lib/redis.client";
import { AuthRequest } from "../lib/interfaces";

export default async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const sessionToken = req.headers["session-token"] as string;

        const nonSecurePaths = [
            "/",
        ];

        if (nonSecurePaths.includes(req.path)) return next();
        if (!sessionToken) {
            return res.status(400).send({ message: "Unauthorized Access" });
        }

        const userInfoStr: string | null = await getRedisField(req.redisClient, sessionToken);

        if (!userInfoStr) {
            return res.status(400).send({ message: "Token not found" });
        }

        const userInfo = JSON.parse(userInfoStr as unknown as string) as UserInfo;

        req.auth = {
            userId: userInfo.dbUserId,
            userInfo,
        };

        next();
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Something went wrong" });
    }
};