"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_js_1 = __importDefault(require("../db.js"));
const products_js_1 = require("../controllers/products.js");
const router = express_1.default.Router();
router.get("/", products_js_1.getProducts);
router.post("/", products_js_1.addProducts);
router.patch("/:id", products_js_1.updateProduct);
router.delete("/:id", products_js_1.deleteProducts);
process.on("SIGINT", () => {
    db_js_1.default.end();
    console.log("Conexão com o banco de dados encerrada.");
    process.exit();
});
exports.default = router;
