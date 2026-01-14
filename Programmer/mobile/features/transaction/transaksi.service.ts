import {
  apiSetorSampah,
  apiTarikSaldo,
  apiMySetorHistory,
  apiGetSetorPending,
  apiValidateSetor,
  apiRejectSetor,
  apiValidateTarik,
  apiRejectTarik,
} from "./transaksi.api";

import { Transaksi } from "./transaksi.types";

/* =======================
   WARGA
======================= */
export const setorSampahService = async (params: {
  beratKg: number;
  catatan?: string;
  image?: {
    uri: string;
    name: string;
    type: string;
  };
}) => {
  const formData = new FormData();
  formData.append("beratKg", String(params.beratKg));

  if (params.catatan) {
    formData.append("catatan", params.catatan);
  }

  if (params.image) {
    formData.append("file", {
      uri: params.image.uri,
      name: params.image.name,
      type: params.image.type,
    } as any);
  }

  const res = await apiSetorSampah(formData);
  return res.data;
};

export const tarikSaldoService = async (jumlah: number, catatan?: string) => {
  const res = await apiTarikSaldo({ jumlah, catatan });
  return res.data;
};

export const mySetorHistoryService = async (): Promise<Transaksi[]> => {
  const res = await apiMySetorHistory();
  return res.data.data;
};

/* =======================
   ADMIN
======================= */
export const getSetorPendingService = async (): Promise<Transaksi[]> => {
  const res = await apiGetSetorPending();
  return res.data.data;
};

export const validateSetorService = async (id: string) => {
  const res = await apiValidateSetor(id);
  return res.data;
};

export const rejectSetorService = async (id: string, catatan?: string) => {
  const res = await apiRejectSetor(id, catatan);
  return res.data;
};

export const validateTarikService = async (id: string) => {
  const res = await apiValidateTarik(id);
  return res.data;
};

export const rejectTarikService = async (id: string, alasan?: string) => {
  const res = await apiRejectTarik(id, alasan);
  return res.data;
};
