"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProducts = exports.updateProduct = exports.addProducts = exports.getProducts = void 0;
const uuid_1 = require("uuid");
const db_js_1 = __importDefault(require("../db.js"));
async function getProducts(req, res) {
    try {
        const result = await db_js_1.default.query("SELECT * FROM products");
        res.json(result.rows);
    }
    catch (error) {
        console.error("Erro ao buscar produtos:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
}
exports.getProducts = getProducts;
async function addProducts(req, res) {
    const { name, price } = req.body;
    try {
        const result = await db_js_1.default.query("INSERT INTO products (product_id, product_name, product_price) VALUES ($1, $2, $3) RETURNING *", [(0, uuid_1.v4)(), name, price]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        console.error("Erro ao criar produto:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
}
exports.addProducts = addProducts;
async function updateProduct(req, res) {
    const id = req.params.id;
    const { name, price } = req.body;
    try {
        const checkProduct = await db_js_1.default.query("SELECT * FROM products WHERE product_id = $1", [id]);
        if (checkProduct.rows.length === 0) {
            return res.status(404).json({ error: "Produto não encontrado" });
        }
        const values = [id];
        let query = "UPDATE products SET";
        let parameterIndex = 2;
        if (name) {
            query += " product_name = $" + parameterIndex++ + ",";
            values.push(name);
        }
        if (price) {
            query += " product_price = $" + parameterIndex++;
            values.push(price);
        }
        query += " WHERE product_id = $1 RETURNING *";
        const result = await db_js_1.default.query(query, values);
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error("Erro ao atualizar produto:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
}
exports.updateProduct = updateProduct;
async function deleteProducts(req, res) {
    const id = req.params.id;
    try {
        const checkClient = await db_js_1.default.query("SELECT * FROM products WHERE product_id = $1", [id]);
        if (checkClient.rows.length === 0) {
            return res.status(404).json({ error: "Produto não encontrado" });
        }
        const result = await db_js_1.default.query("DELETE FROM products WHERE product_id = $1 RETURNING *", [id]);
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error("Erro ao deletar produto:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
}
exports.deleteProducts = deleteProducts;
