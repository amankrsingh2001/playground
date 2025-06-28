import * as dotenv from "dotenv";
dotenv.config({ override: true });
import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import { createRedisConnection } from "./adaptors";
import { RedisClientType } from 'redis';
import config from "./config";
const { app: { port } } = config;

// Extend the Express Request interface to include our custom properties
declare module "express" {
    interface Request {
    }
}

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
    // const routes = require("./routes");
    // app.use("/v1", routes);

    // binding mysql and redis client in express req.
    // so all the API's can use the connection.

    app.get("/", function (req: Request, res: Response) {
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