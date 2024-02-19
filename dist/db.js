import pg from "pg";
const { Client } = pg;
const client = new Client({
    user: "postgres",
    host: "localhost",
    database: "financial",
    password: "123456789",
    port: 5432,
});
export default client;
