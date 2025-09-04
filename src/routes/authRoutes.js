// src/routes/authRoutes.js
import express from "express";
import { loginAdminOrUser } from "../controllers/userController.js";

const router = express.Router();
router.post("/login", loginAdminOrUser);

export default router;