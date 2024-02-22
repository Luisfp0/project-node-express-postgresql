import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import client from "../db.js";

export async function getSuppliers(req: Request, res: Response) {
  try {
    const result = await client.query("SELECT * FROM suppliers");
    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar registros:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

export async function addSupplier(req: Request, res: Response) {
  const { name } = req.body;
  try {
    const result = await client.query(
      "INSERT INTO suppliers (supplier_id, supplier_name) VALUES ($1, $2) RETURNING *",
      [uuidv4(), name]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao criar fornecedor:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

export async function updateSupplier(req: Request, res: Response) {
  const id = req.params.id;
  const { name } = req.body;
  try {
    const checkClient = await client.query(
      "SELECT * FROM suppliers WHERE supplier_id = $1",
      [id]
    );

    if (checkClient.rows.length === 0) {
      return res.status(404).json({ error: "Fornecedor não encontrado" });
    }

    const result = await client.query(
      "UPDATE suppliers SET supplier_name = $1 WHERE supplier_id = $2 RETURNING *",
      [name, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao atualizar fornecedor:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

export async function deleteSupplier(req: Request, res: Response) {
  const id = req.params.id;
  try {
    const checkClient = await client.query(
      "SELECT * FROM suppliers WHERE supplier_id = $1",
      [id]
    );

    if (checkClient.rows.length === 0) {
      return res.status(404).json({ error: "Fornecedor não encontrado" });
    }

    const result = await client.query(
      "DELETE FROM suppliers WHERE supplier_id = $1 RETURNING *",
      [id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao deletar fornecedor:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}
