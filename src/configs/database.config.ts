import {Pool} from 'pg'

export const databasePool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});


databasePool.on("connect", () => {
    console.log("Database connected successfully");
});
databasePool.on("error", (err) => {
    console.error("Database error:", err);
});

