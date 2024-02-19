import express from "express";
import client from "../../db.js";
import { getInvoices, addInvoice, updateInvoice, deleteInvoice, } from "../controllers/invoices.js";
const router = express.Router();
router.get("/", getInvoices);
router.post("/", addInvoice);
router.patch("/:id", updateInvoice);
router.delete("/:id", deleteInvoice);
process.on("SIGINT", () => {
    client.end();
    console.log("Conexão com o banco de dados encerrada.");
    process.exit();
});
export default router;
