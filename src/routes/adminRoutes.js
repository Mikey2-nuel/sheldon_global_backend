import express from "express";
const router = express.Router();
import { fetchAllWebsiteSetting, editWebsiteSetting } from "../controllers/adminController.js";

router.get("/website-settings", fetchAllWebsiteSetting);
//update a setting
router.put("/website-settings/", editWebsiteSetting);

export default router;
