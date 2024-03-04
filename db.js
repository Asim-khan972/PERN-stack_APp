const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "shahmeer12",
  host: "localhost",
  port: 5432,
  database: "pertodo",
});

module.exports = { pool };
