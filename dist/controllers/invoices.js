"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteInvoice = exports.updateInvoice = exports.addInvoice = exports.getInvoices = void 0;
const db_js_1 = __importDefault(require("../db.js"));
async function getInvoices(req, res) {
    try {
        const result = await db_js_1.default.query("SELECT * FROM invoices");
        res.json(result.rows);
    }
    catch (error) {
        console.error("Erro ao buscar notas fiscais:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
}
exports.getInvoices = getInvoices;
async function addInvoice(req, res) {
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
        const clientQuery = await db_js_1.default.query("SELECT * FROM cliente WHERE id = $1", [clientId]);
        const clientData = clientQuery.rows[0];
        const supplierQuery = await db_js_1.default.query("SELECT * FROM fornecedor WHERE id = $1", [supplierId]);
        const supplierData = supplierQuery.rows[0];
        for (const productData of products) {
            const { productId, quantity } = productData;
            const productQuery = await db_js_1.default.query("SELECT * FROM products WHERE id = $1", [productId]);
            if (productQuery.rows.length === 0) {
                return res
                    .status(404)
                    .json({ error: `Produto com id: '${productId}' não encontrado` });
            }
            const productPrice = productQuery.rows[0].price;
            totalPrice += productPrice * quantity;
        }
        const result = await db_js_1.default.query("INSERT INTO invoices (price, clientname, clientid, suppliername, supplierid) VALUES ($1, $2, $3, $4, $5) RETURNING *", [
            totalPrice.toFixed(2),
            clientData.name,
            clientData.id,
            supplierData.name,
            supplierData.id,
        ]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        console.error("Erro ao processar produtos:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
}
exports.addInvoice = addInvoice;
async function updateInvoice(req, res) {
    const id = req.params.id;
    const { price, clientname, clientid, suppliername, supplierid } = req.body;
    try {
        const checkInvoice = await db_js_1.default.query("SELECT * FROM invoices WHERE id = $1", [id]);
        if (checkInvoice.rows.length === 0) {
            return res.status(404).json({ error: "Produto não encontrado" });
        }
        const values = [id];
        let query = "UPDATE invoices SET";
        let parameterIndex = 2;
        if (price) {
            query += " price = $" + parameterIndex++;
            values.push(price);
        }
        if (clientname) {
            query += " clientname = $" + parameterIndex++;
            values.push(clientname);
        }
        if (clientid) {
            query += " clientid = $" + parameterIndex++;
            values.push(clientid);
        }
        if (suppliername) {
            query += " suppliername = $" + parameterIndex++;
            values.push(suppliername);
        }
        if (supplierid) {
            query += " supplierid = $" + parameterIndex++;
            values.push(supplierid);
        }
        query += " WHERE id = $1 RETURNING *";
        const result = await db_js_1.default.query(query, values);
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error("Erro ao atualizar nota fiscal:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
}
exports.updateInvoice = updateInvoice;
async function deleteInvoice(req, res) {
    const id = req.params.id;
    try {
        const checkInvoice = await db_js_1.default.query("SELECT * FROM invoices WHERE invoicenumber = $1", [id]);
        if (checkInvoice.rows.length === 0) {
            return res.status(404).json({ error: "Nota fiscal não encontrada" });
        }
        const result = await db_js_1.default.query("DELETE FROM invoices WHERE invoicenumber = $1 RETURNING *", [id]);
        res.json(`Nota fical número ${id} deletada.`);
    }
    catch (error) {
        console.error("Erro ao deletar produto:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
}
exports.deleteInvoice = deleteInvoice;
