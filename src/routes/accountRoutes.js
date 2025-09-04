// routes/accountRoutes.js
import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { getAccount, updateAccount, changePassword } from "../controllers/accountController.js";

const router = express.Router();

router.get("/account", authenticateToken, getAccount);
router.put("/account/update", authenticateToken, updateAccount);
router.put("/account/change-password", authenticateToken, changePassword);

export default router;
