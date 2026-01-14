import api from "@/lib/api";
import { TransaksiResponse, Transaksi } from "./transaksi.types";

export const apiSetorSampah = (formData: FormData) => {
  return api.post("/transaksi/setor", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const apiTarikSaldo = (payload: { jumlah: number; catatan?: string }) => {
  return api.post("/transaksi/tarik", payload);
};

export const apiMySetorHistory = () => {
  return api.get<TransaksiResponse>("/transaksi/setor/me");
};

export const apiGetSetorPending = () => {
  return api.get<TransaksiResponse>("/transaksi/setor/pending");
};

export const apiValidateSetor = (id: string) => {
  return api.patch(`/transaksi/setor/${id}/validate`);
};

export const apiRejectSetor = (id: string, catatan?: string) => {
  return api.patch(`/transaksi/setor/${id}/reject`, { catatan });
};

export const apiValidateTarik = (id: string) => {
  return api.patch(`/transaksi/tarik/${id}/validate`);
};

export const apiRejectTarik = (id: string, alasan?: string) => {
  return api.patch(`/transaksi/tarik/${id}/reject`, { alasan });
};
