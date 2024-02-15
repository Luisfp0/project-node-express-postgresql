import { v4 as uuidv4 } from "uuid";
import client from "../db.js";

export async function getInvoices(req, res) {
  try {
    const result = await client.query("SELECT * FROM invoices");
    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar notas fiscais:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

export async function addInvoice(req, res) {
  const { products, clientName, supplier } = req.body;
  try {
    let totalPrice = 0;
    if (!products || products.length === 0) {
      return res
        .status(400)
        .json({ error: "Nenhum produto fornecido na solicitação" });
    }

    for (const productData of products) {
      const { productName, quantity } = productData;

      const productQuery = await client.query(
        "SELECT * FROM products WHERE name = $1",
        [productName]
      );

      if (productQuery.rows.length === 0) {
        return res
          .status(404)
          .json({ error: `Produto '${productName}' não encontrado` });
      }

      const productPrice = parseFloat(
        productQuery.rows[0].price.replace(/[^\d.-]/g, "")
      );

      totalPrice += productPrice * quantity;
    }
  } catch (error) {
    console.error("Erro ao processar produtos:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

export async function updateInvoice(req, res) {
  const id = req.params.id;
  const { name, price } = req.body;
  try {
    const checkProduct = await client.query(
      "SELECT * FROM products WHERE id = $1",
      [id]
    );

    if (checkProduct.rows.length === 0) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    const values = [id];
    let query = "UPDATE products SET";

    let parameterIndex = 2;

    if (name) {
      query += " name = $" + parameterIndex++;
      values.push(name);
    }
    if (price) {
      query += " price = $" + parameterIndex++;
      values.push(price);
    }

    query += " WHERE id = $1 RETURNING *";

    const result = await client.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

export async function deleteInvoice(req, res) {
  const id = req.params.id;
  try {
    const checkClient = await client.query(
      "SELECT * FROM products WHERE id = $1",
      [id]
    );

    if (checkClient.rows.length === 0) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    const result = await client.query(
      "DELETE FROM products WHERE id = $1 RETURNING *",
      [id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao deletar produto:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}
