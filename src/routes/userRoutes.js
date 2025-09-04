import express from "express";
import { signupUser, fetchAllUsers, fetchAUser, editUser, deleteUser } from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Use multer middleware for file upload
router.post("/signup", upload.single("profile_pic"), signupUser);
router.get("/dashboard", verifyToken, (req, res) => {
  res.json({ message: `Welcome, user ${req.user.email}` });
});
//get all users
router.get("/users", fetchAllUsers);
//get a single user
router.get("/:id", fetchAUser);
//update a single user
router.put("/:id", editUser);
//delete a single user
router.delete("/:id", deleteUser);

export default router;
