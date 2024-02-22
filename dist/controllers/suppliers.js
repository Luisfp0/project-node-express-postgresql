"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSupplier = exports.updateSupplier = exports.addSupplier = exports.getSuppliers = void 0;
const uuid_1 = require("uuid");
const db_js_1 = __importDefault(require("../db.js"));
async function getSuppliers(req, res) {
    try {
        const result = await db_js_1.default.query("SELECT * FROM suppliers");
        res.json(result.rows);
    }
    catch (error) {
        console.error("Erro ao buscar registros:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
}
exports.getSuppliers = getSuppliers;
async function addSupplier(req, res) {
    const { name } = req.body;
    try {
        const result = await db_js_1.default.query("INSERT INTO suppliers (supplier_id, supplier_name) VALUES ($1, $2) RETURNING *", [(0, uuid_1.v4)(), name]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        console.error("Erro ao criar fornecedor:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
}
exports.addSupplier = addSupplier;
async function updateSupplier(req, res) {
    const id = req.params.id;
    const { name } = req.body;
    try {
        const checkClient = await db_js_1.default.query("SELECT * FROM suppliers WHERE supplier_id = $1", [id]);
        if (checkClient.rows.length === 0) {
            return res.status(404).json({ error: "Fornecedor não encontrado" });
        }
        const result = await db_js_1.default.query("UPDATE suppliers SET supplier_name = $1 WHERE supplier_id = $2 RETURNING *", [name, id]);
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error("Erro ao atualizar fornecedor:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
}
exports.updateSupplier = updateSupplier;
async function deleteSupplier(req, res) {
    const id = req.params.id;
    try {
        const checkClient = await db_js_1.default.query("SELECT * FROM suppliers WHERE supplier_id = $1", [id]);
        if (checkClient.rows.length === 0) {
            return res.status(404).json({ error: "Fornecedor não encontrado" });
        }
        const result = await db_js_1.default.query("DELETE FROM suppliers WHERE supplier_id = $1 RETURNING *", [id]);
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error("Erro ao deletar fornecedor:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
}
exports.deleteSupplier = deleteSupplier;
