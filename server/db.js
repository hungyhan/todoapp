// configure how to connect to ur database

// const Pool = require("pg").Pool;
// require("dotenv").config();

// // const devConfig = {
// //   user: process.env.PG_USER,
// //   password: process.env.PG_PASSWORD,
// //   host: process.env.PG_HOST,
// //   database: process.env.PG_DATABASE,
// //   port: process.env.PG_PORT,
// // };
// const devConfig = {
//   user: "postgres",
//   password: "123456",
//   // host: "host.docker.internal",
//   host: "localhost",
//   database: "perntodo",
//   port: 5432,
// };

// const proConfig = {
//   connectionString: process.env.DATABASE_URL, //heroku addons
// };

// const pool = new Pool(
//   process.env.NODE_ENV === "production" ? proConfig : devConfig,
// );

// module.exports = pool;

const { Pool } = require("pg");
require("dotenv").config();

const requiredVariables = [
  "DB_HOST",
  "DB_PORT",
  "DB_NAME",
  "DB_USER",
  "DB_PASSWORD",
];

for (const variableName of requiredVariables) {
  if (!process.env[variableName]) {
    throw new Error(`Missing environment variable: ${variableName}`);
  }
}

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),

  // PostgreSQL đang chạy nội bộ trong EKS nên thường không cần SSL.
  ssl: false,
});

pool.on("connect", () => {
  console.log("Connected to PostgreSQL");
});

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL pool error:", error);
});

module.exports = pool;
