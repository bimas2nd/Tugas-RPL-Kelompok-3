import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../Database/prisma.js";
import "dotenv/config";

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email dan password wajib diisi",
      });
    }

    // Cari user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        wargaProfile: true,
      },
    });
    
    if (!user) {
      return res.status(404).json({
        message: "Email tidak ditemukan",
      });
    }

    const profileComplete = user.role !== "WARGA" ? true : !!user.wargaProfile;

    // Cek password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({
        message: "Password salah",
      });
    }

    // Payload token
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    // Access Token (pendek)
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

    // Refresh Token (panjang)
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1d" });

    // Simpan refresh token ke DB
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    // Simpan refresh token ke cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 hari
    });

    return res.status(200).json({
      message: "Login berhasil",
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      profileComplete,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Terjadi kesalahan server",
      error: error.message,
    });
  }
};


export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);

    const user = await prisma.user.findFirst({
      where: { refreshToken },
    });

    if (!user) return res.sendStatus(403);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.sendStatus(403);

      const payload = {
        id: user.id,
        email: user.email,
        role: user.role,
      };

      const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

      res.json({ accessToken });
    });
  } catch (error) {
    res.sendStatus(500);
  }
};

export const Me = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    let profile = null;
    let profileComplete = true;

    if (user.role === "WARGA") {
      profile = await prisma.warga.findUnique({
        where: { userId: user.id },
        select: {
          id: true,
          nama: true,
          alamat: true,
          saldo: true,
          url: true,
        },
      });

      profileComplete = !!profile;
    }

    if (user.role === "ADMIN") {
      profile = await prisma.admin.findUnique({
        where: { userId: user.id },
        select: {
          id: true,
          nama: true,
          url: true,
        },
      });
    }

    if (user.role === "RW") {
      profile = await prisma.rw.findUnique({
        where: { userId: user.id },
        select: {
          id: true,
          nama: true,
          wilayah: true,
          url: true,
        },
      });
    }

    res.status(200).json({
      message: "Data user login",
      user,
      profile,
      profileComplete,
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan server",
      error: error.message,
    });
  }
};


export const Logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);

  const user = await prisma.user.findFirst({
    where: { refreshToken },
  });

  if (!user) return res.sendStatus(204);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: null },
  });

  res.clearCookie("refreshToken");
  return res.sendStatus(200);
};
