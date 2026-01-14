import prisma from "../Database/prisma.js";
import bcrypt from "bcrypt";

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const Register = async (req, res) => {
  try {
    const { email, password, confirmPassword, role } = req.body;
    const SALT_ROUNDS = 10;

    // Cek Confirm Pass
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Password dan konfirmasi password tidak sama.",
      });
    }

    // Validasi password 
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;

    if (!strongPasswordRegex.test(password)) {
      return res.status(400).json({
        message: "Password minimal 8 karakter dan harus mengandung huruf besar, huruf kecil, angka, dan simbol.",
      });
    }

    // Cegah password mengandung email
    const emailPrefix = email.split("@")[0].toLowerCase();
    if (password.toLowerCase().includes(emailPrefix)) {
      return res.status(400).json({
        message: "Password tidak boleh mengandung email.",
      });
    }

    // Cek email sudah terdaftar
    const exist = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (exist) {
      return res.status(400).json({
        message: "Email sudah digunakan",
      });
    }

    // Hash Pass
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Simpan user
    await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        role
      },
    });

    res.status(201).json({
      message: "Registrasi berhasil.",
      profileComplete: false,
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan server",
      error: error.message,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validasi parameter
    if (!id) {
      return res.status(400).json({
        message: "ID user tidak boleh kosong",
      });
    }

    // Ambil data user
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Jika user tidak ditemukan
    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    // 4. Response sukses
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan server",
      error: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, password, confirmPassword, role } = req.body;

    // 1. Cari user berdasarkan ID
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    // Validasi password (jika diisi)
    let hashedPassword = user.password;

    if (password && password.trim() !== "") {
      if (password !== confirmPassword) {
        return res.status(400).json({
          message: "Password dan konfirmasi password tidak sama",
        });
      }

      const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;

      if (!strongPasswordRegex.test(password)) {
        return res.status(400).json({
          message: "Password tidak memenuhi standar keamanan",
        });
      }

      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Update user
    await prisma.user.update({
      where: { id },
      data: {
        email: email ?? user.email,
        role: role ?? user.role,
        password: hashedPassword,
      },
    });

    res.status(200).json({
      message: "User berhasil diupdate",
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan server",
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Validasi parameter
    if (!id) {
      return res.status(400).json({
        message: "ID user tidak boleh kosong",
      });
    }

    // Cek apakah user ada
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    // Hapus user
    await prisma.user.delete({
      where: { id },
    });

    res.status(200).json({
      message: "User berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan server",
      error: error.message,
    });
  }
};


