import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import adminRoutes from "./src/routes/adminRoutes.js";
import dotenv from 'dotenv';
dotenv.config();
import path from 'path';
import { fileURLToPath } from "url";
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import accountRoutes from "./src/routes/accountRoutes.js"
import mailRoutes from "./src/routes/mailRoutes.js"
import withdrawalRoutes from './src/routes/withdrawalRoutes.js';
import createPaymentRoute  from './src/routes/api/create-payment.js'
import ipnRoute   from './src/routes/api/ipn.js'
import investmentRoutes from "./src/routes/api/investment.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = process.env.PORT || 8000;

app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", accountRoutes);
app.use("/api", mailRoutes);
app.use('/api/withdrawals', withdrawalRoutes);
app.use("/api", createPaymentRoute);
app.use("/api", ipnRoute);
app.use("/api/investment", investmentRoutes);

// app.use("/uploads", express.static("uploads"));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get("/", (req, res) => {
  res.send("Sheldon Global Investment API is running");
});

app.listen(port, () => console.log(`Server is running on port ${port}`));

app.get("/ping", (req, res) => {
  res.send("pong");
});
