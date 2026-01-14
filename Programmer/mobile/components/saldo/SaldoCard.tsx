import { View, Text, Pressable, Image, ActivityIndicator } from "react-native";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react-native";
import { useRouter } from "expo-router";

type Props = {
  saldo: number;
  nama?: string;
  avatarUrl?: string | null;
  loading?: boolean;
};

export default function SaldoCard({ saldo, nama = "Pengguna", avatarUrl, loading = false }: Props) {
  const [showSaldo, setShowSaldo] = useState(false);
  const router = useRouter();

  return (
    <View className="bg-green-100 rounded-2xl p-4">
      {/* Header */}
      <View className="flex-row items-center mb-2">
        <Image
          source={avatarUrl ? { uri: avatarUrl } : require("@/assets/images/blank-profile.png")}
          className="w-12 h-12 rounded-full mr-3"
        />
        <Text className="text-green-800 mr-2 font-bold text-lg">Akun {nama}</Text>
      </View>

      {/* Body */}
      <View className="flex-1 mt-2">
        <View className="flex-row items-center mb-2">
          <Text className="text-gray-600 text-sm mr-2">Saldo Terkini</Text>

          <Pressable onPress={() => setShowSaldo((v) => !v)}>
            {showSaldo ? <EyeOff size={20} color="#16a34a" /> : <Eye size={20} color="#16a34a" />}
          </Pressable>
        </View>

        {/* Saldo */}
        <View className="flex-row items-center mt-1">
          {loading ? (
            <ActivityIndicator color="#16a34a" />
          ) : (
            <Text className="text-green-600 text-4xl font-extrabold mr-3">
              {showSaldo ? Number(saldo).toLocaleString("id-ID") : "•••••••"}
            </Text>
          )}
        </View>

        <Pressable
          onPress={() => router.push("/home/saldo")}
          className="mt-4 border border-green-500 rounded-lg px-3 py-2 w-28"
        >
          <Text className="text-green-600 text-md font-semibold text-center">Lihat Detail</Text>
        </Pressable>
      </View>
    </View>
  );
}
