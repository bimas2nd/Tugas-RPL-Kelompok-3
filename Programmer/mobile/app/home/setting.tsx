import "../global.css";
import { View, Text, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { User, DoorOpen } from "lucide-react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

import { authService } from "@/features/auth/auth.service";

export default function Setting() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    if (loading) return;

    try {
      setLoading(true);
      await authService.logout();
    } catch (e) {
      console.error("Logout gagal", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 px-4 py-2">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-200 mb-6">
        <Ionicons onPress={() => router.replace("/home/dashboard")} name="arrow-back" size={22} color="#111" />
        <Text className="ml-3 text-lg font-semibold">Dashboard</Text>
      </View>

      {/* Menu */}
      <View>
        {/* Edit Profile */}
        <Pressable
          onPress={() => router.push("/home/profile")}
          className="bg-white flex-row mb-2 p-4 rounded-md items-center border border-gray-100"
        >
          <User size={24} color="#22c55e" />
          <Text className="text-gray-700 font-medium ml-2">Edit Profile</Text>
        </Pressable>

        {/* Logout */}
        <Pressable
          onPress={handleLogout}
          disabled={loading}
          className={`bg-white flex-row p-4 rounded-md items-center border border-gray-100 ${
            loading ? "opacity-50" : ""
          }`}
        >
          {loading ? <ActivityIndicator size="small" /> : <DoorOpen size={24} color="#ef4444" />}
          <Text className="text-gray-700 font-medium ml-2">{loading ? "Logging out..." : "Logout"}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
