import prisma from "../Database/prisma.js";
import path from "path";
import fs from "fs";

export const setorSampah = async (req, res) => {
  try {
    const { beratKg, catatan } = req.body;

    // validasi berat
    if (!beratKg || isNaN(beratKg) || Number(beratKg) <= 0) {
      return res.status(400).json({
        msg: "Berat sampah wajib diisi dan harus lebih dari 0 kg",
      });
    }

    // validasi warga
    if (!req.warga?.id) {
      return res.status(401).json({
        msg: "Warga tidak terautentikasi",
      });
    }

    // ambil harga dari setting 
    const hargaSetting = await prisma.settingTransaksi.findUnique({
      where: { key: "HARGA_PER_KG" },
    });

    if (!hargaSetting) {
      return res.status(500).json({
        msg: "Harga setor belum disetting oleh admin",
      });
    }

    const hargaPerKg = Number(hargaSetting.value);
    if (isNaN(hargaPerKg) || hargaPerKg <= 0) {
      return res.status(500).json({
        msg: "Harga setor tidak valid",
      });
    }

    // hitung total
    const total = Number(beratKg) * hargaPerKg;

    let url = null;

    const isMultipart = req.headers["content-type"]?.includes("multipart/form-data");

    if (isMultipart && req.files?.file) {
      const file = req.files.file;
      const fileSize = file.data.length;
      const ext = path.extname(file.name).toLowerCase();
      const allowedType = [".png", ".jpg", ".jpeg"];

      if (!allowedType.includes(ext)) {
        return res.status(422).json({
          msg: "Format gambar harus PNG / JPG / JPEG",
        });
      }

      if (fileSize > 5_000_000) {
        return res.status(422).json({
          msg: "Ukuran gambar maksimal 5 MB",
        });
      }

      const uploadDir = path.join(process.cwd(), "public/images");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileName = `setor-${Date.now()}-${file.md5}${ext}`;
      const filePath = path.join(uploadDir, fileName);

      await file.mv(filePath);

      url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    }

    const transaksi = await prisma.transaksi.create({
      data: {
        jumlah: total,
        beratKg: Number(beratKg),
        tipe: "SETOR",
        status: "PENDING",
        catatan: catatan || null,
        url,
        wargaId: req.warga.id,

        saldoSebelum: null,
        saldoSesudah: null,
        adminId: null,
        validatedAt: null,
      },
    });

    return res.status(201).json({
      msg: "Setor sampah berhasil diajukan dan menunggu validasi admin",
      transaksi,
    });
  } catch (error) {
    console.error("SETOR SAMPAH ERROR:", error);
    return res.status(500).json({
      msg: "Gagal mengajukan setor sampah",
    });
  }
};



// GET /transaksi/setor/pending
export const getSetorPending = async (req, res) => {
  try {
    const data = await prisma.transaksi.findMany({
      where: {
        tipe: "SETOR",
        status: "PENDING",
      },
      orderBy: {
        tanggal: "desc",
      },
      select: {
        id: true,
        jumlah: true,
        tanggal: true,
        catatan: true,
        url: true,
        status: true,

        warga: {
          select: {
            id: true,
            nama: true,
            alamat: true,
            nik: true,
            url: true,
          },
        },
      },
    });

    res.status(200).json({
      total: data.length,
      data,
    });
  } catch (error) {
    console.error("GET SETOR PENDING ERROR:", error);
    res.status(500).json({
      msg: "Gagal mengambil data setor pending",
    });
  }
};


// PATCH /transaksi/setor/:id/validate
export const validateSetor = async (req, res) => {
  const { id } = req.params;

  try {
    // ===== AMBIL TRANSAKSI =====
    const transaksi = await prisma.transaksi.findUnique({
      where: { id },
      include: {
        warga: true,
      },
    });

    // ===== VALIDASI DASAR =====
    if (!transaksi) {
      return res.status(404).json({
        msg: "Transaksi tidak ditemukan",
      });
    }

    if (transaksi.tipe !== "SETOR") {
      return res.status(400).json({
        msg: "Transaksi ini bukan transaksi setor",
      });
    }

    if (transaksi.status !== "PENDING") {
      return res.status(400).json({
        msg: "Transaksi sudah diproses sebelumnya",
      });
    }

    // ===== TRANSACTION ATOMIC =====
    const result = await prisma.$transaction(async (tx) => {
      // Lock logic via transaction flow
      const saldoSebelum = transaksi.warga.saldo;
      const saldoSesudah = saldoSebelum.plus(transaksi.jumlah);

      // Update transaksi
      const updatedTransaksi = await tx.transaksi.update({
        where: { id },
        data: {
          status: "VALIDATED",
          validatedAt: new Date(),
          adminId: req.admin.id,
          saldoSebelum,
          saldoSesudah,
        },
      });

      // Update saldo warga 
      await tx.warga.update({
        where: { id: transaksi.wargaId },
        data: {
          saldo: saldoSesudah,
        },
      });

      return updatedTransaksi;
    });

    return res.status(200).json({
      msg: "Setoran berhasil divalidasi, saldo warga bertambah",
      transaksi: result,
    });
  } catch (error) {
    console.error("VALIDATE SETOR ERROR:", error);
    return res.status(500).json({
      msg: "Gagal memvalidasi setoran",
    });
  }
};


// PATCH /transaksi/setor/:id/reject
export const rejectSetor = async (req, res) => {
  const { id } = req.params;
  const { catatan } = req.body; // alasan penolakan (opsional)

  try {
    // ===== AMBIL TRANSAKSI =====
    const transaksi = await prisma.transaksi.findUnique({
      where: { id },
    });

    // ===== VALIDASI =====
    if (!transaksi) {
      return res.status(404).json({
        msg: "Transaksi tidak ditemukan",
      });
    }

    if (transaksi.tipe !== "SETOR") {
      return res.status(400).json({
        msg: "Transaksi ini bukan transaksi setor",
      });
    }

    if (transaksi.status !== "PENDING") {
      return res.status(400).json({ 
        msg: "Transaksi sudah diproses sebelumnya",
      });
    }

    // ===== UPDATE TRANSAKSI =====
    await prisma.transaksi.update({
      where: { id },
      data: {
        status: "REJECTED",
        validatedAt: new Date(), // waktu keputusan admin
        adminId: req.admin.id,
        catatan: catatan || transaksi.catatan || null,
        saldoSebelum: null,
        saldoSesudah: null,
      },
    });

    return res.status(200).json({
      msg: "Setoran berhasil ditolak",
    });
  } catch (error) {
    console.error("REJECT SETOR ERROR:", error);
    return res.status(500).json({
      msg: "Gagal menolak setoran",
    });
  }
};


// GET /transaksi/setor/me
export const TransactionHistory = async (req, res) => {
  try {
    if (!req.warga?.id) {
      return res.status(401).json({
        msg: "Warga tidak terautentikasi",
      });
    }

    const data = await prisma.transaksi.findMany({
      where: {
        wargaId: req.warga.id,
      },
      orderBy: {
        tanggal: "desc",
      },
      select: {
        id: true,
        jumlah: true,
        tanggal: true,
        status: true,
        catatan: true,
        url: true,
        tipe: true,

        saldoSebelum: true,
        saldoSesudah: true,
        validatedAt: true,

        // info admin 
        admin: {
          select: {
            id: true,
            nama: true,
          },
        },
      },
    });

    return res.status(200).json({
      total: data.length,
      data,
    });
  } catch (error) {
    console.error("MY SETOR HISTORY ERROR:", error);
    return res.status(500).json({
      msg: "Gagal mengambil riwayat setor",
    });
  }
};


export const tarikSaldo = async (req, res) => {
  try {
    const { jumlah, catatan } = req.body;

    if (!req.warga?.id) {
      return res.status(401).json({
        msg: "Warga tidak terautentikasi",
      });
    }

    if (!jumlah || isNaN(jumlah) || Number(jumlah) < 50000) {
      return res.status(400).json({
        msg: "Jumlah tarik harus lebih atau sama dengan dari 50000",
      });
    }

    // 🔒 cek saldo cukup
    if (req.warga.saldo.lt(jumlah)) {
      return res.status(400).json({
        msg: "Saldo tidak mencukupi",
      });
    }

    // buat transaksi TARIK (PENDING)
    const transaksi = await prisma.transaksi.create({
      data: {
        jumlah,
        tipe: "TARIK",
        status: "PENDING",
        catatan: catatan || null,
        wargaId: req.warga.id,

        saldoSebelum: null,
        saldoSesudah: null,
        adminId: null,
        validatedAt: null,
      },
    });

    return res.status(201).json({
      msg: "Permintaan tarik saldo berhasil, menunggu validasi admin",
      transaksi,
    });
  } catch (error) {
    console.error("TARIK SALDO ERROR:", error);
    return res.status(500).json({
      msg: "Gagal mengajukan tarik saldo",
    });
  }
};

export const validateTarik = async (req, res) => {
  const { id } = req.params;

  try {
    const transaksi = await prisma.transaksi.findUnique({
      where: { id },
      include: {
        warga: true,
      },
    });

    if (!transaksi) {
      return res.status(404).json({
        msg: "Transaksi tidak ditemukan",
      });
    }

    if (transaksi.tipe !== "TARIK") {
      return res.status(400).json({
        msg: "Ini bukan transaksi tarik",
      });
    }

    if (transaksi.status !== "PENDING") {
      return res.status(400).json({
        msg: "Transaksi sudah diproses",
      });
    }

    // 🔒 cek saldo cukup (double safety)
    if (transaksi.warga.saldo.lt(transaksi.jumlah)) {
      return res.status(400).json({
        msg: "Saldo warga tidak mencukupi",
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      const saldoSebelum = transaksi.warga.saldo;
      const saldoSesudah = saldoSebelum.minus(transaksi.jumlah);

      const updatedTransaksi = await tx.transaksi.update({
        where: { id },
        data: {
          status: "VALIDATED",
          validatedAt: new Date(),
          adminId: req.admin.id,
          saldoSebelum,
          saldoSesudah,
        },
      });

      await tx.warga.update({
        where: { id: transaksi.wargaId },
        data: {
          saldo: saldoSesudah,
        },
      });

      return updatedTransaksi;
    });

    return res.status(200).json({
      msg: "Tarik saldo berhasil divalidasi",
      transaksi: result,
    });
  } catch (error) {
    console.error("VALIDATE TARIK ERROR:", error);
    return res.status(500).json({
      msg: "Gagal memvalidasi tarik saldo",
    });
  }
};

export const rejectTarik = async (req, res) => {
  const { id } = req.params;
  const { alasan } = req.body;

  await prisma.transaksi.update({
    where: { id },
    data: {
      status: "REJECTED",
      catatan: alasan || "Ditolak admin",
      validatedAt: new Date(),
      adminId: req.admin.id,
    },
  });

  res.json({ msg: "Tarik saldo ditolak" });
};



