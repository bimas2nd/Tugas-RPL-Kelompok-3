import express from "express";
import { Login, Logout, Me, refreshToken } from "../Controllers/AuthController.js";
import { authMiddleware } from "../Middleware/Auth.js";

const router = express.Router();

router.post("/login", Login);
router.get("/me", authMiddleware, Me);
router.delete("/logout", Logout);
router.get("/token", refreshToken);

export default router;
