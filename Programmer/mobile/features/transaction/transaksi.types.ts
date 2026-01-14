export type TransactionType = "SETOR" | "TARIK";
export type TransactionStatus = "PENDING" | "VALIDATED" | "REJECTED";

export type WargaInfo = {
  id: string;
  nama: string;
  alamat?: string;
  nik?: string;
  url?: string;
};

export type AdminInfo = {
  id: string;
  nama: string;
};

export type Transaksi = {
  id: string;
  jumlah: number;
  beratKg?: number | null;

  tipe: TransactionType;
  status: TransactionStatus;

  tanggal: string;
  validatedAt?: string | null;

  catatan?: string | null;
  url?: string | null;

  saldoSebelum?: number | null;
  saldoSesudah?: number | null;

  warga?: WargaInfo;
  admin?: AdminInfo;
};

export type TransaksiResponse = {
  total: number;
  data: Transaksi[];
};
