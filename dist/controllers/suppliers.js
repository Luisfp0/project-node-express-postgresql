import { v4 as uuidv4 } from "uuid";
import client from "../db.js";
export async function getSuppliers(req, res) {
    try {
        const result = await client.query("SELECT * FROM fornecedor");
        res.json(result.rows);
    }
    catch (error) {
        console.error("Erro ao buscar registros:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
}
export async function addSupplier(req, res) {
    const { supplierName } = req.body;
    try {
        const result = await client.query("INSERT INTO fornecedor (id, nome) VALUES ($1, $2) RETURNING *", [uuidv4(), supplierName]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        console.error("Erro ao criar fornecedor:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
}
export async function updateSupplier(req, res) {
    const id = req.params.id;
    const { supplierName } = req.body;
    try {
        const checkClient = await client.query("SELECT * FROM fornecedor WHERE id = $1", [id]);
        if (checkClient.rows.length === 0) {
            return res.status(404).json({ error: "Fornecedor não encontrado" });
        }
        const result = await client.query("UPDATE fornecedor SET nome = $1 WHERE id = $2 RETURNING *", [supplierName, id]);
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error("Erro ao atualizar fornecedor:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
}
export async function deleteSupplier(req, res) {
    const id = req.params.id;
    try {
        const checkClient = await client.query("SELECT * FROM fornecedor WHERE id = $1", [id]);
        if (checkClient.rows.length === 0) {
            return res.status(404).json({ error: "Fornecedor não encontrado" });
        }
        const result = await client.query("DELETE FROM fornecedor WHERE id = $1 RETURNING *", [id]);
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error("Erro ao deletar fornecedor:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
}
