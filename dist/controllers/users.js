"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteClient = exports.updateClient = exports.addClient = exports.getClients = void 0;
const uuid_1 = require("uuid");
const db_js_1 = __importDefault(require("../db.js"));
async function getClients(req, res) {
    try {
        const query = "SELECT * FROM cliente";
        const result = await db_js_1.default.query(query);
        res.json(result.rows);
    }
    catch (error) {
        console.error("Erro ao buscar registros:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
}
exports.getClients = getClients;
async function addClient(req, res) {
    const { name } = req.body;
    try {
        const result = await db_js_1.default.query("INSERT INTO cliente (id, nome) VALUES ($1, $2) RETURNING *", [(0, uuid_1.v4)(), name]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        console.error("Erro ao criar cliente:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
}
exports.addClient = addClient;
async function updateClient(req, res) {
    const id = req.params.id;
    const { name } = req.body;
    try {
        const checkClient = await db_js_1.default.query("SELECT * FROM cliente WHERE id = $1", [id]);
        if (checkClient.rows.length === 0) {
            return res.status(404).json({ error: "Cliente não encontrado" });
        }
        const result = await db_js_1.default.query("UPDATE cliente SET nome = $1 WHERE id = $2 RETURNING *", [name, id]);
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error("Erro ao atualizar cliente:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
}
exports.updateClient = updateClient;
async function deleteClient(req, res) {
    const id = req.params.id;
    try {
        const checkClient = await db_js_1.default.query("SELECT * FROM cliente WHERE id = $1", [id]);
        if (checkClient.rows.length === 0) {
            return res.status(404).json({ error: "Cliente não encontrado" });
        }
        const result = await db_js_1.default.query("DELETE FROM cliente WHERE id = $1 RETURNING *", [id]);
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error("Erro ao deletar cliente:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
}
exports.deleteClient = deleteClient;
