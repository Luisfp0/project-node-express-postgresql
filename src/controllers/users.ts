import { v4 as uuidv4 } from "uuid";
import { Request, Response } from "express";
import client from "../db.js";

export async function getClients(req: Request, res: Response) {
  try {
    const query = "SELECT * FROM clients";
    const result = await client.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar registros:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

export async function addClient(req: Request, res: Response) {
  const { name } = req.body;
  try {
    const result = await client.query(
      "INSERT INTO clients (client_id, client_name) VALUES ($1, $2) RETURNING *",
      [uuidv4(), name]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao criar cliente:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

export async function updateClient(req: Request, res: Response) {
  const id = req.params.id;
  const { name } = req.body;
  try {
    const checkClient = await client.query(
      "SELECT * FROM clients WHERE client_id = $1",
      [id]
    );

    if (checkClient.rows.length === 0) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }

    const result = await client.query(
      "UPDATE clients SET client_name = $1 WHERE client_id = $2 RETURNING *",
      [name, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

export async function deleteClient(req: Request, res: Response) {
  const id = req.params.id;
  try {
    const checkClient = await client.query(
      "SELECT * FROM clients WHERE client_id = $1",
      [id]
    );

    if (checkClient.rows.length === 0) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }

    const result = await client.query(
      "DELETE FROM clients WHERE client_id = $1 RETURNING *",
      [id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao deletar cliente:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}
