import { View, Text, ScrollView, TextInput, Pressable } from "react-native";
import { ArrowLeft, Check } from "lucide-react-native";
import { useState } from "react";
import { formatRupiah } from "@/lib/formatter";

const BANKS = ["BCA", "Mandiri", "BNI", "BRI"];

export default function TarikSaldoScreen() {
  const [method, setMethod] = useState<"CASH" | "BANK">("CASH");
  const [selectedBank, setSelectedBank] = useState("BCA");
  const [showBank, setShowBank] = useState(false);

  return (
    <View className="flex-1 bg-white">
      {/* HEADER */}
      <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
        <ArrowLeft size={22} />
        <Text className="text-lg font-bold ml-3">Tarik Saldo</Text>
      </View>

      <ScrollView className="px-4 mt-4" showsVerticalScrollIndicator={false}>
        {/* SALDO */}
        <View className="bg-white rounded-2xl p-4 border border-gray-100 mb-6">
          <Text className="text-gray-500 text-sm">Saldo Anda Saat Ini</Text>
          <Text className="text-green-600 text-3xl font-extrabold mt-1">{formatRupiah(125000)}</Text>
          <Text className="text-gray-400 text-xs mt-2">Perbarui terakhir: 12/11/2025</Text>
        </View>

        {/* FORM */}
        <View className="bg-white rounded-2xl p-4 border border-gray-100">
          {/* JUMLAH */}
          <Text className="font-semibold mb-2">Jumlah Penarikan</Text>
          <View className="flex-row items-center border border-gray-300 rounded-xl px-3 h-12">
            <Text className="text-gray-500 mr-2">Rp</Text>
            <TextInput
              keyboardType="numeric"
              className="flex-1 text-base"
              placeholder="0"
            />
          </View>

          {/* METODE */}
          <Text className="font-semibold mt-5 mb-2">Metode Penarikan</Text>

          {/* CASH */}
          <Pressable onPress={() => setMethod("CASH")} className="flex-row items-center mb-3">
            <View
              className={`w-5 h-5 rounded-full border-2 mr-2 ${method === "CASH" ? "border-green-600 bg-green-600" : "border-gray-400"}`}
            />
            <Text>Cash</Text>
          </Pressable>

          {/* BANK */}
          <Pressable onPress={() => setMethod("BANK")} className="flex-row items-center mb-3">
            <View
              className={`w-5 h-5 rounded-full border-2 mr-2 ${method === "BANK" ? "border-green-600 bg-green-600" : "border-gray-400"}`}
            />
            <Text>Transfer Bank</Text>
          </Pressable>

          {/* BANK SELECT */}
          {method === "BANK" && (
            <View className="mt-2">
              <Pressable
                onPress={() => setShowBank(!showBank)}
                className="border border-gray-300 rounded-xl px-3 h-12 justify-center"
              >
                <Text className="text-gray-700">{selectedBank}</Text>
              </Pressable>

              {showBank && (
                <View className="border border-gray-200 rounded-xl mt-2 overflow-hidden">
                  {BANKS.map((bank) => (
                    <Pressable
                      key={bank}
                      onPress={() => {
                        setSelectedBank(bank);
                        setShowBank(false);
                      }}
                      className="flex-row items-center px-4 py-3"
                    >
                      <Text className="flex-1">{bank}</Text>
                      {selectedBank === bank && <Check size={16} color="#16a34a" />}
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {/* BUTTON */}
      <View className="p-4">
        <Pressable className="bg-indigo-500 rounded-xl py-4">
          <Text className="text-white text-center font-bold text-base">Tarik Saldo</Text>
        </Pressable>
      </View>
    </View>
  );
}
