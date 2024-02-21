import pg from "pg";
const { Client } = pg;

const client = new Client({
  user: "postgres",
  host: "45.160.171.241",
  database: "financial",
  password: "123456789",
  port: 5432,
});

export default client;
