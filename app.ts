import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
export const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:8000",
    credentials: true,
  }),
);
