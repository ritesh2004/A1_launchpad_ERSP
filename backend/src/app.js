import express from "express";
import router from "./routes/index.js";
import { configDotenv } from "dotenv";
import cors from "cors";
import { HTTP_STATUS_CODES } from "./utils/httpStatus.js";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";

configDotenv();

connectDB()
  .then(() => console.log("Database connected successfully"))
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1); // Exit the process if database connection fails
  });

const app = express();

app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(
    {
        origin: process.env.CORS_ORIGIN || "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    }
))
app.use("/api/v1", router);



export default app;
