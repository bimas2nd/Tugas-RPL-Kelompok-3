import express from "express";
import {setorSampah,
        getSetorPending,
        validateSetor,
        rejectSetor,
        tarikSaldo,
        validateTarik,
        rejectTarik,
        TransactionHistory} from "../Controllers/TransaksiController.js"
import { authMiddleware, onlyAdmin, onlyWarga } from "../Middleware/Auth.js";

const router = express.Router(); 

router.post("/transaksi/setor", authMiddleware, onlyWarga, setorSampah);
router.get("/transaksi/setor/pending", authMiddleware,  onlyAdmin, getSetorPending);
router.post("/transaksi/tarik", authMiddleware, onlyWarga, tarikSaldo);
router.get("/transaksi/setor/me", authMiddleware, onlyWarga, TransactionHistory);
router.patch("/transaksi/setor/:id/validate", authMiddleware, onlyAdmin, validateSetor);
router.patch("/transaksi/setor/:id/reject", authMiddleware, onlyAdmin, rejectSetor);
router.patch("/transaksi/tarik/:id/validate", authMiddleware, onlyAdmin, validateTarik);
router.patch("/transaksi/tarik/:id/reject", authMiddleware, onlyAdmin, rejectTarik);

export default router; 
