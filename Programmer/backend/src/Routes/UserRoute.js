import express from "express";
import { getUsers, Register, getUserById, updateUser, deleteUser } from "../Controllers/UserController.js";
import { authMiddleware, onlyAdmin } from "../Middleware/Auth.js";

const router = express.Router();

router.get("/users", authMiddleware, onlyAdmin, getUsers);
router.get("/user/:id", authMiddleware, getUserById);
router.post("/register", Register);
router.patch("/user/:id", authMiddleware, updateUser);
router.delete("/user/:id", authMiddleware, onlyAdmin, deleteUser);

export default router;
 