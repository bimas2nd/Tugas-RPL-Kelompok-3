import prisma from "../Database/prisma.js";
import path from "path";
import fs from "fs";

export const getWarga = async (req, res) => {
  try {
    const users = await prisma.warga.findMany();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createWarga = async (req, res) => {
  try {
    const { nama, alamat, nik } = req.body;

    // Validasi nama
    if (!nama) {
      return res.status(400).json({ msg: "Nama wajib diisi" });
    }

    // 2. Cek apakah user sudah punya profile warga
    const existingWarga = await prisma.warga.findUnique({
      where: { userId: req.userId },
    });

    if (existingWarga) {
      return res.status(409).json({ msg: "Warga profile already exists" });
    }

    // handle file
    let fileName = null;
    let url = null;

    if (req.files && req.files.file) {
      const file = req.files.file;

      const fileSize = file.data.length;
      const ext = path.extname(file.name);
      fileName = file.md5 + ext;
      url = `${req.protocol}://${req.get("host")}/images/${fileName}`;

      const allowedType = [".png", ".jpg", ".jpeg"];

      if (!allowedType.includes(ext.toLowerCase())) {
        return res.status(422).json({ msg: "Invalid image extension" });
      }

      if (fileSize > 5_000_000) {
        return res.status(422).json({ msg: "Image must be less than 5 MB" });
      }

      // simpan file
      await new Promise((resolve, reject) => {
        file.mv(`./public/images/${fileName}`, (err) => {
          if (err) reject(err);
          resolve();
        });
      });
    }

    // create
    await prisma.warga.create({
      data: {
        nama,
        alamat,
        nik,
        user: {
          connect: { id: req.userId },
        },
      },
    });

    res.status(201).json({
      msg: "Warga created successfully",
      profileComplete: true,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      msg: "Failed to create warga",
      error: error.message,
    });
  }
};

export const getWargaById = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Validasi parameter
    if (!id) {
      return res.status(400).json({
        message: "ID warga tidak boleh kosong",
      });
    }

    // 2. Ambil data warga berdasarkan ID
    const warga = await prisma.warga.findUnique({
      where: { id },
      select: {
        id: true,
        nama: true,
        alamat: true,
        nik: true,
        url: true,
        saldo: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });

    // 3. Jika warga tidak ditemukan
    if (!warga) {
      return res.status(404).json({
        message: "Warga tidak ditemukan",
      });
    }

    // 4. Response sukses
    res.status(200).json(warga);
  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan server",
      error: error.message,
    });
  }
};

export const updateWarga = async (req, res) => {
  try {
    const { nama, alamat, nik } = req.body;

    // Auth guard
    if (!req.userId) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    // Ambil data warga milik user
    const warga = await prisma.warga.findUnique({
      where: { userId: req.userId },
    });

    if (!warga) {
      return res.status(404).json({ msg: "Warga profile tidak ditemukan" });
    }

    // Validasi nama
    if (nama !== undefined && !nama) {
      return res.status(400).json({ msg: "Nama tidak boleh kosong" });
    }

    // handle foto
    let newUrl = warga.url;

    if (req.files && req.files.file) {
      const file = req.files.file;

      const fileSize = file.data.length;
      const ext = path.extname(file.name);
      const fileName = file.md5 + ext;
      newUrl = `${req.protocol}://${req.get("host")}/images/${fileName}`;

      const allowedType = [".png", ".jpg", ".jpeg"];

      if (!allowedType.includes(ext.toLowerCase())) {
        return res.status(422).json({ msg: "Invalid image extension" });
      }

      if (fileSize > 5_000_000) {
        return res.status(422).json({ msg: "Image must be less than 5 MB" });
      }

      // simpan foto baru
      await new Promise((resolve, reject) => {
        file.mv(`./public/images/${fileName}`, (err) => {
          if (err) reject(err);
          resolve();
        });
      });

      // hapus foto lama
      if (warga.url) {
        const oldFile = warga.url.split("/images/")[1];
        const oldPath = `./public/images/${oldFile}`;

        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
    }

    // update
    await prisma.warga.update({
      where: { id: warga.id },
      data: {
        nama: nama ?? warga.nama,
        alamat: alamat ?? warga.alamat,
        nik: nik ?? warga.nik,
        url: newUrl,
      },
    });

    res.status(200).json({
      msg: "Warga updated successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      msg: "Failed to update warga",
      error: error.message,
    });
  }
};

export const deleteWargaById = async (req, res) => {
  try {
    const { id } = req.params;

    // validasi paramaters
    if (!id) {
      return res.status(400).json({
        msg: "ID warga wajib diisi",
      });
    }

    // find warga
    const warga = await prisma.warga.findUnique({
      where: { id },
    });

    if (!warga) {
      return res.status(404).json({
        msg: "Warga tidak ditemukan",
      });
    }

    // hapus foto
    if (warga.url) {
      const fileName = warga.url.split("/images/")[1];
      const filePath = `./public/images/${fileName}`;

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // hapus
    await prisma.warga.delete({
      where: { id },
    });

    res.status(200).json({
      msg: "Warga deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      msg: "Failed to delete warga",
      error: error.message,
    });
  }
};
