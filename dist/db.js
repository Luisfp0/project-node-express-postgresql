"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = __importDefault(require("pg"));
const { Client } = pg_1.default;
const client = new Client({
    user: "postgres",
    host: "localhost",
    database: "financial",
    password: "123456789",
    port: 5432,
});
exports.default = client;
