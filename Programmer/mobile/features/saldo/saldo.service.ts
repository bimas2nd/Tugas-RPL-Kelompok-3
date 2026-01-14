import api from "@/lib/api";

export const getSaldo = async () => {
  const res = await api.get("/me");
  return res.data;
};
