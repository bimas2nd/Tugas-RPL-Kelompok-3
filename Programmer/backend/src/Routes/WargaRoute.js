import express from "express";
import { createWarga, deleteWargaById, getWarga, getWargaById, updateWarga } from "../Controllers/WargaController.js";
import { authMiddleware, onlyAdmin } from "../Middleware/Auth.js";

const router = express.Router();

router.get("/warga", authMiddleware, getWarga);
router.get("/warga/:id", authMiddleware, getWargaById);
router.post("/warga", authMiddleware, createWarga);
router.patch("/warga/:id", authMiddleware, updateWarga);
router.delete("/warga/:id", authMiddleware, onlyAdmin, deleteWargaById);

export default router;
