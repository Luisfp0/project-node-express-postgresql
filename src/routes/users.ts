import express from "express";
import client from "../db.js";
import {
  getClients,
  addClient,
  updateClient,
  deleteClient,
} from "../controllers/users.js";

const router = express.Router();

router.get("/", getClients);

router.post("/", addClient);

router.patch("/:id", updateClient);

router.delete("/:id", deleteClient);

process.on("SIGINT", () => {
  client.end();
  console.log("Conexão com o banco de dados encerrada.");
  process.exit();
});

export default router;
