import jwt from "jsonwebtoken";
import prisma from "../Database/prisma.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token tidak tersedia" });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Token tidak valid" });
      }

      // Cek apakah masi login
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { refreshToken: true },
      });

      // refreshToken = null -> Logout
      if (!user || !user.refreshToken) {
        return res.status(401).json({
          message: "Session telah berakhir, silakan login ulang",
        });
      }

      req.user = decoded;
      req.userId = decoded.id;
      next();
    });
  } catch (error) {
    return res.status(500).json({
      message: "Kesalahan autentikasi",
    });
  }
};

export const onlyAdmin = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { role: true },
    });

    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    if (user.role !== "ADMIN") {
      return res.status(403).json({
        message: "Akses ditolak (Admin Only)",
      });
    }

    req.admin = user;

    next();
  } catch (error) {
    return res.status(500).json({
      message: "Gagal validasi admin",
    });
  }
};

export const onlyWarga = async (req, res, next) => {
  try {
    const warga = await prisma.warga.findUnique({
      where: { userId: req.userId },
    });

    if (!warga) {
      return res.status(403).json({
        msg: "User belum memiliki profil warga",
      });
    }

    req.warga = warga;
    next();
  } catch (error) {
    console.error("ONLY WARGA ERROR:", error);
    return res.status(500).json({
      msg: "Gagal verifikasi warga",
    });
  }
};


