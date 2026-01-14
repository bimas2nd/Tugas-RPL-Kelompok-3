import { View, Text, ScrollView, Pressable } from "react-native";
import { ArrowLeft, ArrowUpRight, ArrowDownRight } from "lucide-react-native";
import { formatRupiah } from "@/lib/formatter";

export default function SaldoScreen() {
  return (
    <View className="flex-1 bg-white">
      {/* HEADER */}
      <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
        <ArrowLeft size={22} color="#111" />
        <Text className="text-lg font-bold ml-3">Saldo Bank Sampah</Text>
      </View>

      <ScrollView className="px-4 mt-4" showsVerticalScrollIndicator={false}>
        {/* SALDO CARD */}
        <View className="bg-white rounded-2xl p-4 border border-gray-100 mb-6">
          <Text className="text-gray-500 text-sm">Saldo Anda Saat Ini</Text>
          <Text className="text-green-600 text-3xl font-extrabold mt-1">{formatRupiah(125000)}</Text>
          <Text className="text-gray-400 text-xs mt-2">Perbarui terakhir: 12/11/2025</Text>
        </View>

        {/* RINGKASAN */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="font-bold text-base">Ringkasan Keuangan</Text>
            <Pressable>
              <Text className="text-green-600 text-sm">Lihat Semua</Text>
            </Pressable>
          </View>

          <View className="flex-row gap-3">
            {/* Setor */}
            <View className="flex-1 bg-green-50 rounded-xl p-4">
              <ArrowUpRight size={20} color="#16a34a" />
              <Text className="text-gray-600 text-sm mt-2">Penyetoran Bulan Ini</Text>
              <Text className="text-green-600 font-bold text-lg mt-1">{formatRupiah(150000)}</Text>
            </View>

            {/* Tarik */}
            <View className="flex-1 bg-red-50 rounded-xl p-4">
              <ArrowDownRight size={20} color="#dc2626" />
              <Text className="text-gray-600 text-sm mt-2">Penarikan Bulan Ini</Text>
              <Text className="text-red-600 font-bold text-lg mt-1">{formatRupiah(50000)}</Text>
            </View>
          </View>
        </View>

        {/* TRANSAKSI TERAKHIR */}
        <View>
          <View className="flex-row justify-between items-center mb-3">
            <Text className="font-bold text-base">Transaksi Terakhir</Text>
            <Pressable>
              <Text className="text-green-600 text-sm">Lihat Semua</Text>
            </Pressable>
          </View>

          {/* ITEM */}
          {[
            {
              type: "Penyetoran",
              date: "2023-10-26",
              amount: 50000,
              plus: true,
            },
            {
              type: "Penarikan",
              date: "2023-10-25",
              amount: 25000,
              plus: false,
            },
            {
              type: "Penyetoran",
              date: "2023-10-24",
              amount: 100000,
              plus: true,
            },
          ].map((item, index) => (
            <View key={index} className="flex-row items-center justify-between py-4 border-b border-gray-100">
              <View className="flex-row items-center">
                <View className={`w-10 h-10 rounded-full items-center justify-center ${item.plus ? "bg-green-50" : "bg-red-50"}`}>
                  {item.plus ? <ArrowUpRight size={18} color="#16a34a" /> : <ArrowDownRight size={18} color="#dc2626" />}
                </View>

                <View className="ml-3">
                  <Text className="font-semibold">{item.type}</Text>
                  <Text className="text-gray-400 text-xs">{item.date}</Text>
                </View>
              </View>

              <Text className={`font-bold ${item.plus ? "text-green-600" : "text-red-600"}`}>
                {item.plus ? "+" : "-"} {formatRupiah(item.amount)}
              </Text>
            </View>
          ))}
        </View>

        <View className="h-6" />
      </ScrollView>
    </View>
  );
}
