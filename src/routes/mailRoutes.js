// routes/mailRoutes.js
import express from "express";
import { sendMailToAll, sendMailToUser } from "../controllers/mailController.js";

const router = express.Router();

router.post("/mail/all", sendMailToAll);
router.post("/mail/user", sendMailToUser);

export default router;
