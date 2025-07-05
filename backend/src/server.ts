import * as dotenv from "dotenv";
dotenv.config({ override: true });
import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import { createRedisConnection } from "./adaptors";
import { RedisClientType } from 'redis';
import { createServer, Server as HttpServer } from 'http';
import { Server as SocketIoServer, Socket } from 'socket.io';
import config from "./config";
import { WebSocket } from "ws";
import { AuthenticatedWebSocket } from "./lib/interfaces";
import { authenticateWebSocket } from "./middleware/socketAuth";
const { app: { port } } = config;

let io: SocketIoServer;

interface CustomSocket extends Socket {
    redisClient?: RedisClientType;
}

// Extend the Express Request interface to include our custom properties

const app: Express = express();

let redisClient: RedisClientType;

const init = async (): Promise<void> => {
    try {
        console.log("Server is running on [%s] environment", process.env.NODE_ENV);

        // creating connections
        redisClient = await createRedisConnection();

        // starting express server
        await startExpressServer();
    } catch (error) {
        console.error(error as Error);
        process.exit(1);
    }
};

const startExpressServer = async (): Promise<void> => {
    app.disable("etag");
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());

    // auth middleware
    // app.use(checkValidator);
    // app.use(checkAuth);

    // using morgan middleware for API logs
    // app.use(morgan);

    // all routes
    const routes = require("./routes");
    app.use("/v1", routes);

    // binding mysql and redis client in express req.
    // so all the API's can use the connection.

    app.request.redisClient = redisClient;

    const server = createServer(app);
    const wsServer = new WebSocket.Server({ server });
    wsServer.on("connection", (ws: AuthenticatedWebSocket, req) => {
        console.log("New WebSocket connection");

        // Extract token from query parameters or headers
        const url = new URL(req.url!, `http://${req.headers.host}`);
        const token = url.searchParams.get("token") || req.headers["authorization"]?.split(" ")[1];

        if (!token) {
            ws.close(4002, "No token provided");
            return;
        }

        // Attach Redis client or reuse one
        ws.redisClient = redisClient;

        // Authenticate
        authenticateWebSocket(ws, token, redisClient).then(() => {
            // Now the socket is authenticated; set up message handlers
            ws.on("message", (message) => {
                console.log(`Received: ${message}`);
                // Handle messages here
            });

            ws.on("close", () => {
                console.log("WebSocket disconnected");
                if (ws.redisClient) {
                    ws.redisClient.quit().catch(console.error);
                }
            });
        });
    });

    app.get("/", (req: Request, res: Response) => {
        res.status(200).send({ message: "API Routes are up and working." });
    });

    app.listen(port, () => {
        console.log("server is running on port : %s", port);
    });
};



process.on("uncaughtException", (error: Error, source: string) => {
    console.error(error, source);
});

// initializing server
init();