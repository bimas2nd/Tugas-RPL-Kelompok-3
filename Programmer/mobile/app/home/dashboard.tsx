import { View, Text, ScrollView, Pressable, Image, RefreshControl } from "react-native";
import { useCallback, useState } from "react";
import { useRouter } from "expo-router";

import SaldoCard from "@/components/saldo/SaldoCard";
import Card from "@/components/ui/Card";
import { HandCoins, Recycle, Settings } from "lucide-react-native";

import { useAuthStore } from "@/features/auth/auth.store";
import { authService } from "@/features/auth/auth.service";

import { useEffect } from "react";
import { mySetorHistoryService } from "@/features/transaction/transaksi.service";
import { Transaksi } from "@/features/transaction/transaksi.types";


export default function Dashboard() {
  const router = useRouter();

  const profile = useAuthStore((s) => s.profile);
  const hydrated = useAuthStore((s) => s.hydrated);

  const [refreshing, setRefreshing] = useState(false);

  const [transaksi, setTransaksi] = useState<Transaksi[]>([]);
  const [loadingTransaksi, setLoadingTransaksi] = useState(false);


  // 🔄 pull-to-refresh → cukup refetch /me
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await authService.fetchMe();
    } finally {
      setRefreshing(false);
    }
  }, []);

  const fetchTransaksi = async () => {
    setLoadingTransaksi(true);
    try {
      const data = await mySetorHistoryService();
      setTransaksi(data.slice(0, 5)); // ambil 5 terakhir
    } catch (e) {
      console.log("FETCH TRANSAKSI ERROR", e);
    } finally {
      setLoadingTransaksi(false);
    }
  };

  useEffect(() => {
    if (hydrated) {
      fetchTransaksi();
    }
  }, [hydrated]);

  const loading = !hydrated || !profile;

  return (
    <ScrollView
      className="flex-1 bg-gray-100 px-4 pt-2"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#22c55e"]} tintColor="#22c55e" />
      }
    >
      {/* HEADER */}
      <View className="mb-4 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Image
            source={profile?.url ? { uri: profile.url } : require("@/assets/images/logo-kelurahan.png")}
            className="w-12 h-12 rounded-full mr-3"
          />

          <View>
            <Text className="text-gray-600">Halo,</Text>
            <Text className="text-lg font-bold">{loading ? "Memuat..." : profile.nama}</Text>
          </View>
        </View>

        <Pressable onPress={() => router.push("/home/setting")}>
          <Settings />
        </Pressable>
      </View>

      {/* SALDO */}
      <SaldoCard saldo={profile?.saldo ?? 0} nama={profile?.nama} avatarUrl={profile?.url} loading={loading} />

      {/* AKSI CEPAT */}
      <Text className="mt-6 mb-3 font-semibold text-lg text-gray-700">Aksi Cepat</Text>

      <View className="flex-row justify-between">
        <Pressable onPress={() => router.push("/home/setor")} className="bg-white rounded-xl p-4 w-[48%] items-center">
          <View className="bg-gray-100 p-3 rounded-full mb-2">
            <Recycle size={24} color="#22c55e" />
          </View>
          <Text className="font-semibold">Setor Sampah</Text>
        </Pressable>

        <Pressable onPress={() => router.push("/home/tarik")} className="bg-white rounded-xl p-4 w-[48%] items-center">
          <View className="bg-gray-100 p-3 rounded-full mb-2">
            <HandCoins size={24} color="#22c55e" />
          </View>
          <Text className="font-semibold">Tarik Saldo</Text>
        </Pressable>
      </View>

      {/* RIWAYAT */}
      <View className="flex-row justify-between items-center mt-6 mb-2">
        <Text className="font-semibold text-lg text-gray-700">Riwayat Transaksi</Text>
        <Pressable onPress={() => router.push("/home/saldo")}>
          <Text className="text-green-600 text-sm">Lihat Semua</Text>
        </Pressable>
      </View>

      <Card>
        {loadingTransaksi ? (
          <Text className="text-gray-500 text-center py-4">Memuat transaksi...</Text>
        ) : transaksi.length === 0 ? (
          <Text className="text-gray-500 text-center py-4">Belum ada transaksi</Text>
        ) : (
          transaksi.map((item) => (
            <View key={item.id} className="flex-row justify-between items-center py-2 border-b border-gray-100">
              <View>
                <Text className="font-semibold">{item.tipe === "SETOR" ? "Setor Sampah" : "Tarik Saldo"}</Text>
                <Text className="text-xs text-gray-500">{new Date(item.tanggal).toLocaleDateString("id-ID")}</Text>
              </View>

              <View className="items-end">
                <Text className={`font-semibold ${item.tipe === "SETOR" ? "text-green-600" : "text-red-500"}`}>
                  {item.tipe === "SETOR" ? "+" : "-"} Rp {Number(item.jumlah).toLocaleString("id-ID")}
                </Text>

                <Text className="text-xs text-gray-500">{item.status}</Text>
              </View>
            </View>
          ))
        )}
      </Card>
    </ScrollView>
  );
}
