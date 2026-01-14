import { View, Text, ActivityIndicator, Image } from "react-native";
import { useEffect } from "react";
import { useAuthStore } from "@/features/auth/auth.store";

export default function Loadingpage() {

  return (
    <View className="flex-1 bg-white items-center justify-center px-6">
      <Image source={require("@/assets/images/logo-kelurahan.png")} className="w-40 h-40 mb-6" resizeMode="contain" />

      <View className="bg-green-100 px-8 py-3 rounded-xl mb-6">
        <Text className="text-green-700 font-bold text-lg">Bank Sampah & IPL</Text>
      </View>

      <Text className="text-gray-500 mb-3">Memuat...</Text>

      <ActivityIndicator size="large" color="#6366f1" />
    </View>
  );
}
