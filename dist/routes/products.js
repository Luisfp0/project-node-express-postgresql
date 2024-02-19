import express from "express";
import client from "../db.js";
import { getProducts, addProducts, updateProduct, deleteProducts, } from "../controllers/products.js";
const router = express.Router();
router.get("/", getProducts);
router.post("/", addProducts);
router.patch("/:id", updateProduct);
router.delete("/:id", deleteProducts);
process.on("SIGINT", () => {
    client.end();
    console.log("Conexão com o banco de dados encerrada.");
    process.exit();
});
export default router;
