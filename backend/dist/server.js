"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config({ override: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const adaptors_1 = require("./adaptors");
const config_1 = __importDefault(require("./config"));
const { app: { port } } = config_1.default;
// Extend the Express Request interface to include our custom properties
const app = (0, express_1.default)();
let redisClient;
const init = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Server is running on [%s] environment", process.env.NODE_ENV);
        // creating connections
        redisClient = yield (0, adaptors_1.createRedisConnection)();
        // starting express server
        yield startExpressServer();
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
});
const startExpressServer = () => __awaiter(void 0, void 0, void 0, function* () {
    app.disable("etag");
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use((0, cors_1.default)());
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
    app.get("/", (req, res) => {
        res.status(200).send({ message: "API Routes are up and working." });
    });
    app.listen(port, () => {
        console.log("server is running on port : %s", port);
    });
});
process.on("uncaughtException", (error, source) => {
    console.error(error, source);
});
// initializing server
init();
