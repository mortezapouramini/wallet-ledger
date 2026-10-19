import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorHandler } from "./src/middlewares/errorHandler.middleware";
import { userRoutes } from "./src/modules/users/user.routes";
export const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:8000",
    credentials: true,
  }),
);

app.use("/api/v1/users", userRoutes);

app.use(errorHandler);
