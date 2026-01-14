import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Setor() {
  const router = useRouter();
  const [tanggal] = useState("12 November 2025");
  const [jenis, setJenis] = useState("Organik");
  const [harga] = useState(2500);
  const [berat] = useState(0);
  

  const total = berat * harga;

  return (
    <ScrollView className="flex-1 bg-gray-50 px-4 pt-2">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-200">
        <Ionicons onPress={() => router.replace("/home/dashboard")} name="arrow-back" size={22} color="#111" />
        <Text className="ml-3 text-lg font-semibold">Transaksi Baru Bank Sampah</Text>
      </View>

      <ScrollView className="px-4 py-4" showsVerticalScrollIndicator={false}>
        {/* Detail Transaksi */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="font-semibold text-base mb-3">Detail Transaksi</Text>

          {/* Tanggal */}
          <Text className="text-gray-500 mb-1">Tanggal Transaksi</Text>
          <View className="flex-row items-center border border-gray-300 rounded-lg px-3 py-3 mb-4">
            <Ionicons name="calendar-outline" size={18} color="#666" />
            <Text className="ml-2 text-gray-700">{tanggal}</Text>
          </View>

          {/* Jenis Sampah */}
          <Text className="text-gray-500 mb-1">Jenis Sampah</Text>
          <View className="border border-gray-300 rounded-lg px-3 py-3 mb-4">
            <Text className="text-gray-700">{jenis}</Text>
          </View>

          {/* Harga */}
          <Text className="text-gray-500 mb-1">Harga per Kilogram</Text>
          <View className="flex-row items-center border border-gray-300 rounded-lg px-3 py-3">
            <Text className="text-gray-500 mr-2">Rp</Text>
            <Text className="text-gray-700 font-medium">{harga.toLocaleString("id-ID")}</Text>
          </View>
        </View>

        {/* Bukti Timbangan */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="font-semibold text-base mb-3">Bukti Timbangan</Text>

          <View className="border border-dashed border-gray-300 rounded-xl h-44 items-center justify-center bg-gray-50 mb-4">
            <Ionicons name="camera-outline" size={36} color="#666" />
            <Text className="text-gray-500 mt-2 text-center">Unggah foto hasil timbangan{"\n"}untuk dibaca AI</Text>
          </View>

          <TouchableOpacity className="bg-indigo-500 py-3 rounded-xl flex-row items-center justify-center">
            <Ionicons name="cloud-upload-outline" size={20} color="white" />
            <Text className="text-white font-semibold ml-2">Unggah Foto Timbangan</Text>
          </TouchableOpacity>

          <Text className="text-xs text-gray-400 mt-3 text-center">AI akan memproses gambar untuk membaca berat</Text>
        </View>

        {/* Total */}
        <View className="bg-white rounded-xl p-4 mb-24">
          <Text className="font-semibold text-base mb-2">Jumlah Uang Diterima</Text>

          <Text className="text-3xl font-bold text-green-500 mb-1">Rp {total.toLocaleString("id-ID")}</Text>

          <Text className="text-gray-400 text-sm">Estimasi dari berat {berat.toFixed(2)} Kg</Text>
        </View>
      </ScrollView>

      {/* Submit */}
      <View className="px-4 pb-6 bg-gray-50">
        <TouchableOpacity className="bg-green-500 py-4 rounded-xl flex-row items-center justify-center">
          <Ionicons name="checkmark-circle" size={22} color="white" />
          <Text className="text-white font-semibold ml-2">Simpan Transaksi</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
