import { Request, Response } from "express";
import client from "../db.js";

export async function getInvoices(req: Request, res: Response) {
  try {
    const result = await client.query("SELECT * FROM invoices");
    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar notas fiscais:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

export async function addInvoice(req: Request, res: Response) {
  const { products, clientId, supplierId } = req.body;
  try {
    let totalPrice = 0;

    if (!products || products.length === 0) {
      return res
        .status(400)
        .json({ error: "Nenhum produto fornecido na solicitação" });
    }

    if (!clientId || clientId.length === 0) {
      return res
        .status(400)
        .json({ error: "Nenhum cliente fornecido na solicitação" });
    }

    if (!supplierId || supplierId.length === 0) {
      return res
        .status(400)
        .json({ error: "Nenhum fornecedor encontrado na solicitação" });
    }

    const clientQuery = await client.query(
      "SELECT * FROM clients WHERE client_id = $1",
      [clientId]
    );
    const clientData = clientQuery.rows[0];

    const supplierQuery = await client.query(
      "SELECT * FROM suppliers WHERE supplier_id = $1",
      [supplierId]
    );
    const supplierData = supplierQuery.rows[0];

    for (const productData of products) {
      const { productId, quantity } = productData;

      const productQuery = await client.query(
        "SELECT * FROM products WHERE product_id = $1",
        [productId]
      );

      if (productQuery.rows.length === 0) {
        return res
          .status(404)
          .json({ error: `Produto com id: '${productId}' não encontrado` });
      }
      const productPrice = productQuery.rows[0].product_price;
      totalPrice += productPrice * quantity;
    }

    const result = await client.query(
      "INSERT INTO invoices (price, client_name, client_id, supplier_name, supplier_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [
        totalPrice.toFixed(2),
        clientData.client_name,
        clientData.client_id,
        supplierData.supplier_name,
        supplierData.supplier_id,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao processar produtos:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

export async function updateInvoice(req: Request, res: Response) {
  const id = req.params.id;
  const { clientId, supplierId } = req.body;

  try {
    const checkInvoice = await client.query(
      "SELECT * FROM invoices WHERE invoice_id = $1",
      [id]
    );

    if (!clientId || clientId.length === 0) {
      return res
        .status(400)
        .json({ error: "Nenhum cliente fornecido na solicitação" });
    }

    if (!supplierId || supplierId.length === 0) {
      return res
        .status(400)
        .json({ error: "Nenhum fornecedor encontrado na solicitação" });
    }

    if (checkInvoice.rows.length === 0) {
      return res.status(404).json({ error: "Nota fiscal não encontrada" });
    }

    let query = "UPDATE invoices SET";

    const values = [];
    let parameterIndex = 1;

    if (clientId) {
      const clientQuery = await client.query(
        "SELECT * FROM clients WHERE client_id = $1",
        [clientId]
      );
      const clientData = clientQuery.rows[0];
      query += " client_id = $" + parameterIndex;
      values.push(clientId);
      parameterIndex++;
      query += ", client_name = $" + parameterIndex;
      values.push(clientData.client_name);
      parameterIndex++;
    }

    if (supplierId) {
      const supplierQuery = await client.query(
        "SELECT * FROM suppliers WHERE supplier_id = $1",
        [supplierId]
      );
      const supplierData = supplierQuery.rows[0];
      if (clientId) query += ",";
      query += " supplier_id = $" + parameterIndex;
      values.push(supplierId);
      parameterIndex++;
      query += ", supplier_name = $" + parameterIndex;
      values.push(supplierData.supplier_name);
      parameterIndex++;
    }

    query += " WHERE invoice_id = $" + parameterIndex;
    values.push(id);
    query += " RETURNING *";

    console.log(query);
    console.log(values);

    const result = await client.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao atualizar nota fiscal:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

export async function deleteInvoice(req: Request, res: Response) {
  const id = req.params.id;
  try {
    const checkInvoice = await client.query(
      "SELECT * FROM invoices WHERE invoice_id = $1",
      [id]
    );

    if (checkInvoice.rows.length === 0) {
      return res.status(404).json({ error: "Nota fiscal não encontrada" });
    }

    const result = await client.query(
      "DELETE FROM invoices WHERE invoice_id = $1 RETURNING *",
      [id]
    );
    res.json(`Nota fical número ${id} deletada.`);
  } catch (error) {
    console.error("Erro ao deletar produto:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}
