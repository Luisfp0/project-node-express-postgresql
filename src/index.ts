import express from "express";
import bodyParser from "body-parser";
import usersRoutes from "./routes/users.js";
import suppliersRoutes from "./routes/suppliers.js";
import productsRoutes from "./routes/products.js";
import invoiceRoutes from "./routes/invoices.js";

import client from "./db.js";

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use("/users", usersRoutes);
app.use("/suppliers", suppliersRoutes);
app.use("/products", productsRoutes);
app.use("/invoices", invoiceRoutes);

app.get("/", (req, res) => res.send("Hello from HomePage."));

client
  .connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server running on port: http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Erro ao conectar ao banco de dados:", error);
    process.exit(1);
  });
