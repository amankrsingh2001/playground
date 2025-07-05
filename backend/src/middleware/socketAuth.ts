import { getRedisField } from "../lib/redis.client";
import { UserInfo, AuthenticatedWebSocket } from "../lib/interfaces";
import { RedisClientType } from "redis";

export const authenticateWebSocket = async (
    ws: AuthenticatedWebSocket,
    token: string,
    redisClient: RedisClientType
): Promise<void> => {
    try {
        let userInfoStr: string | null = await getRedisField(redisClient, token);

        if (!userInfoStr) {
            ws.close(4000, "Authentication failed: User not found");
            return;
        }

        let parsedUserInfo: UserInfo;
        try {
            parsedUserInfo = JSON.parse(userInfoStr);
        } catch (e) {
            ws.close(4001, "Invalid user info format in Redis");
            return;
        }

        // Attach authenticated user data to the socket
        ws.auth = {
            userId: parsedUserInfo.userId,
            userInfo: parsedUserInfo,
        };

        ws.userId = parsedUserInfo.userId;
        ws.userInfo = parsedUserInfo;
        ws.redisClient = redisClient;

        console.log(`WebSocket authenticated for user: ${parsedUserInfo.userId}`);
    } catch (error) {
        console.error("Error during WebSocket authentication:", error);
        ws.close(5000, "Internal server error");
    }
};