"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const users_js_1 = __importDefault(require("./routes/users.js"));
const suppliers_js_1 = __importDefault(require("./routes/suppliers.js"));
const products_js_1 = __importDefault(require("./routes/products.js"));
const invoices_js_1 = __importDefault(require("./routes/invoices.js"));
const db_js_1 = __importDefault(require("./db.js"));
const app = (0, express_1.default)();
const PORT = 5000;
app.use(body_parser_1.default.json());
app.use("/clients", users_js_1.default);
app.use("/suppliers", suppliers_js_1.default);
app.use("/products", products_js_1.default);
app.use("/invoices", invoices_js_1.default);
app.get("/", (req, res) => res.send("Hello from HomePage."));
db_js_1.default
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
