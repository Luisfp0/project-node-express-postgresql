import express from "express";
import bodyParser from "body-parser";
import usersRoutes from "./routes/users.js";
import suppliersRoutes from "./routes/suppliers.js";
import client from "./db.js";

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use("/users", usersRoutes);
app.use("/suppliers", suppliersRoutes);

app.get("/", (req, res) => res.send("Hello from homepage."));

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
