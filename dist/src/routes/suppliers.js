import express from "express";
import client from "../../db.js";
import { getSuppliers, addSupplier, updateSupplier, deleteSupplier, } from "../controllers/suppliers.js";
const router = express.Router();
router.get("/", getSuppliers);
router.post("/", addSupplier);
router.patch("/:id", updateSupplier);
router.delete("/:id", deleteSupplier);
process.on("SIGINT", () => {
    client.end();
    console.log("Conexão com o banco de dados encerrada.");
    process.exit();
});
export default router;
