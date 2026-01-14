import "./global.css"
import { View, Text, Image, Pressable } from "react-native";
import { Bell, Recycle, HandCoins } from "lucide-react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "@/features/auth/auth.store";

export default function MainMenu() {
  const router = useRouter();

  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const hydrated = useAuthStore((s) => s.hydrated);

  // fallback aman
  const displayName = hydrated ? profile?.nama || user?.email || "Pengguna" : "Memuat...";

  return (
    <SafeAreaView className="flex-1 bg-gray-50 px-4 pt-2">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-5">
        <View className="flex-row items-center">
          <Image source={require("@/assets/images/logo-kelurahan.png")} className="w-10 h-10 rounded-full mr-3" />
          <View>
            <Text className="text-gray-500 text-sm">Halo,</Text>
            <Text className="text-lg font-bold text-gray-800">{displayName}</Text>
          </View>
        </View>

        <Pressable className="p-2 rounded-full bg-gray-100">
          <Bell size={20} color="#374151" />
        </Pressable>
      </View>

      {/* Card Akun */}
      <View className="bg-green-100 rounded-2xl p-4 flex-row items-center mb-6">
        <Image source={require("@/assets/images/neko.jpeg")} className="w-12 h-12 rounded-full mr-3" />
        <Text className="font-bold text-green-800">Akun {displayName}</Text>
      </View>

      {/* Menu Utama */}
      <View className="flex-row flex-wrap justify-between">
        {/* Bank Sampah */}
        <Pressable
          onPress={() => router.push("/home/dashboard")}
          className="bg-white w-[48%] rounded-2xl p-5 items-center border border-gray-100"
        >
          <View className="bg-green-100 p-3 rounded-full mb-2">
            <Recycle size={22} color="#22c55e" />
          </View>
          <Text className="text-gray-700 font-medium">Bank Sampah</Text>
        </Pressable>

        {/* IPL */}
        <Pressable
          onPress={() => router.push("/home/ipl")}
          className="bg-white w-[48%] rounded-2xl p-5 items-center border border-gray-100"
        >
          <View className="bg-green-100 p-3 rounded-full mb-2">
            <HandCoins size={22} color="#22c55e" />
          </View>
          <Text className="text-gray-700 font-medium">IPL</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
