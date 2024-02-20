"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_js_1 = __importDefault(require("../db.js"));
const invoices_js_1 = require("../controllers/invoices.js");
const router = express_1.default.Router();
router.get("/", invoices_js_1.getInvoices);
router.post("/", invoices_js_1.addInvoice);
router.patch("/:id", invoices_js_1.updateInvoice);
router.delete("/:id", invoices_js_1.deleteInvoice);
process.on("SIGINT", () => {
    db_js_1.default.end();
    console.log("Conexão com o banco de dados encerrada.");
    process.exit();
});
exports.default = router;
