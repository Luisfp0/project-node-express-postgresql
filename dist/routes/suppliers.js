"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_js_1 = __importDefault(require("../db.js"));
const suppliers_js_1 = require("../controllers/suppliers.js");
const router = express_1.default.Router();
router.get("/", suppliers_js_1.getSuppliers);
router.post("/", suppliers_js_1.addSupplier);
router.patch("/:id", suppliers_js_1.updateSupplier);
router.delete("/:id", suppliers_js_1.deleteSupplier);
process.on("SIGINT", () => {
    db_js_1.default.end();
    console.log("Conexão com o banco de dados encerrada.");
    process.exit();
});
exports.default = router;
