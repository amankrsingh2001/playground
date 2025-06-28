"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../.env') });
// Validate required environment variables
const requiredEnvVars = ['DB_HOST', 'DB_PORT', 'JWT_SECRET'];
requiredEnvVars.forEach(env => {
    if (!process.env[env]) {
        throw new Error(`Environment variable ${env} is missing`);
    }
});
// Define and export your configuration
const config = {
    db: {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        name: process.env.DB_NAME,
    },
    redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
    },
    app: {
        port: Number(process.env.APP_PORT),
        env: process.env.NODE_ENV || 'development',
        jwtSecret: process.env.JWT_SECRET,
    },
};
exports.default = config;
