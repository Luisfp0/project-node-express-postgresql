import client from "../db.js";
export async function getInvoices(req, res) {
    try {
        const result = await client.query("SELECT * FROM invoices");
        res.json(result.rows);
    }
    catch (error) {
        console.error("Erro ao buscar notas fiscais:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
}
export async function addInvoice(req, res) {
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
                .json({ error: "Nenhum fornecedor fornecido na solicitação" });
        }
        const clientQuery = await client.query("SELECT * FROM cliente WHERE id = $1", [clientId]);
        const supplierQuery = await client.query("SELECT * FROM fornecedor WHERE id = $1", [supplierId]);
        const clientData = clientQuery.rows[0];
        const supplier = supplierQuery.rows[0];
        for (const productData of products) {
            const { productId, quantity } = productData;
            const productQuery = await client.query("SELECT * FROM products WHERE id = $1", [productId]);
            if (productQuery.rows.length === 0) {
                return res
                    .status(404)
                    .json({ error: `Produto com id: '${productId}' não encontrado` });
            }
            const productPrice = parseFloat(productQuery.rows[0].price.replace(/[^\d.-]/g, ""));
            totalPrice += productPrice * quantity;
        }
        const formattedPrice = (totalPrice / 100).toFixed(2);
        const result = await client.query("INSERT INTO invoices (price, client, supplier) VALUES ($1, $2, $3) RETURNING *", [formattedPrice, clientData, supplier]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        console.error("Erro ao processar produtos:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
}
export async function updateInvoice(req, res) {
    const id = req.params.id;
    const { name, price } = req.body;
    try {
        const checkProduct = await client.query("SELECT * FROM products WHERE id = $1", [id]);
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
    }
    catch (error) {
        console.error("Erro ao atualizar produto:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
}
export async function deleteInvoice(req, res) {
    const id = req.params.id;
    try {
        const checkClient = await client.query("SELECT * FROM products WHERE id = $1", [id]);
        if (checkClient.rows.length === 0) {
            return res.status(404).json({ error: "Produto não encontrado" });
        }
        const result = await client.query("DELETE FROM products WHERE id = $1 RETURNING *", [id]);
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error("Erro ao deletar produto:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
}
