import { View, Text, TextInput, Pressable, ScrollView, Alert, ActivityIndicator } from "react-native";
import { useState } from "react";
import { wargaService } from "@/features/warga/warga.service";

import { authService } from "@/features/auth/auth.service";

export default function WargaForm() {
  const [nama, setNama] = useState("");
  const [nik, setNik] = useState("");
  const [alamat, setAlamat] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchMe = authService.fetchMe();

  const handleSubmit = async () => {
    if (!nama || !nik || !alamat) {
      Alert.alert("Validasi", "Semua field wajib diisi");
      return;
    }

    if (nik.length !== 16) {
      Alert.alert("Validasi", "NIK harus 16 digit");
      return;
    }

    try {
      setLoading(true);

      // 🧾 CREATE PROFILE
      await wargaService.createProfile({
        nama,
        nik,
        alamat,
      });

      // 🔄 REFRESH AUTH STATE
      await fetchMe;

      // ❗ TIDAK PERLU router.replace()
      // Root guard (_layout.tsx) akan redirect otomatis
    } catch (err: any) {
      Alert.alert("Gagal", err?.response?.data?.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 px-5 pt-6">
      <Text className="text-lg font-bold text-gray-800 mb-6">Lengkapi Data Warga</Text>

      <View className="bg-white rounded-2xl p-5 shadow-sm">
        <Text className="font-semibold text-gray-800 mb-4">Data Pribadi</Text>

        <Text className="text-gray-600 text-sm mb-1">Nama Lengkap</Text>
        <TextInput
          value={nama}
          onChangeText={setNama}
          placeholder="Contoh: Budi Santoso"
          className="border border-gray-200 rounded-xl px-4 py-3 mb-4 text-gray-800"
        />

        <Text className="text-gray-600 text-sm mb-1">NIK</Text>
        <TextInput
          value={nik}
          onChangeText={setNik}
          keyboardType="numeric"
          maxLength={16}
          placeholder="16 digit NIK"
          className="border border-gray-200 rounded-xl px-4 py-3 mb-4 text-gray-800"
        />

        <Text className="text-gray-600 text-sm mb-1">Alamat</Text>
        <TextInput
          value={alamat}
          onChangeText={setAlamat}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          placeholder="Alamat lengkap"
          className="border border-gray-200 rounded-xl px-4 py-3 mb-6 text-gray-800 h-24"
        />

        <Pressable
          disabled={loading}
          onPress={handleSubmit}
          className={`rounded-xl py-3 items-center mt-16 ${loading ? "bg-gray-400" : "bg-green-500"}`}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-semibold text-base">Simpan & Lanjutkan</Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}
