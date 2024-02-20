"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_js_1 = __importDefault(require("../db.js"));
const users_js_1 = require("../controllers/users.js");
const router = express_1.default.Router();
router.get("/", users_js_1.getClients);
router.post("/", users_js_1.addClient);
router.patch("/:id", users_js_1.updateClient);
router.delete("/:id", users_js_1.deleteClient);
process.on("SIGINT", () => {
    db_js_1.default.end();
    console.log("Conexão com o banco de dados encerrada.");
    process.exit();
});
exports.default = router;
