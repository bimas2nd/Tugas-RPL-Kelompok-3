import api from "@/lib/api";

export type WargaPayload = {
  nama: string;
  nik: string;
  alamat: string;
};

export type UpdateWargaPayload = {
  nama?: string;
  nik?: string;
  alamat?: string;
  file?: any; 
};

export const wargaService = {
  createProfile(payload: WargaPayload) {
    return api.post("/warga", payload);
  },

  getById(id: string) {
    return api.get(`/warga/${id}`);
  },

  update(id: string, payload: UpdateWargaPayload) {
    const formData = new FormData();

    if (payload.nama !== undefined) formData.append("nama", payload.nama);

    if (payload.nik !== undefined) formData.append("nik", payload.nik);

    if (payload.alamat !== undefined) formData.append("alamat", payload.alamat);

    if (payload.file) {
      formData.append("file", payload.file);
    }

    return api.patch(`/warga/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
