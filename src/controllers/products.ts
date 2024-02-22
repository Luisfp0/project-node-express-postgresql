import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import client from "../db.js";

export async function getProducts(req: Request, res: Response) {
  try {
    const result = await client.query("SELECT * FROM products");
    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

export async function addProducts(req: Request, res: Response) {
  const { name, price } = req.body;
  try {
    const result = await client.query(
      "INSERT INTO products (product_id, product_name, product_price) VALUES ($1, $2, $3) RETURNING *",
      [uuidv4(), name, price]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

export async function updateProduct(req: Request, res: Response) {
  const id = req.params.id;
  const { name, price } = req.body;
  try {
    const checkProduct = await client.query(
      "SELECT * FROM products WHERE product_id = $1",
      [id]
    );

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

    const result = await client.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

export async function deleteProducts(req: Request, res: Response) {
  const id = req.params.id;
  try {
    const checkClient = await client.query(
      "SELECT * FROM products WHERE product_id = $1",
      [id]
    );

    if (checkClient.rows.length === 0) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    const result = await client.query(
      "DELETE FROM products WHERE product_id = $1 RETURNING *",
      [id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao deletar produto:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}
