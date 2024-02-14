import express from "express";
import { v4 as uuidv4 } from "uuid";
import client from "../db.js";

client.connect();

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM cliente");
    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar registros:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

router.post("/", async (req, res) => {
  const { name } = req.body;
  try {
    const result = await client.query(
      "INSERT INTO cliente (id, nome) VALUES ($1, $2) RETURNING *",
      [uuidv4(), name]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao criar cliente:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

process.on("SIGINT", () => {
  client.end();
  console.log("Conexão com o banco de dados encerrada.");
  process.exit();
});

export default router;
