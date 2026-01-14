import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { User, LandPlot } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import axios from "axios"

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<"WARGA" | null>("WARGA");
  const isActive = selectedRole === "WARGA";

  const handleRegister = async () => {
    try {
      await axios.post("http://192.168.0.101:2257/register", {
        email,
        password,
        role: selectedRole,
        confirmPassword: confirmPassword,
      });
      router.replace("/auth/login");
    } catch (err: any) {
      console.log("FULL ERROR:", err.response?.data);
      alert(JSON.stringify(err.response?.data.message));
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 px-5" contentContainerStyle={{ paddingVertical: 24 }}>
      {/* Logo + Title */}
      <View className="items-center mb-6">
        <View className="bg-indigo-500 p-3 rounded-2xl mb-2">
          <LandPlot size={42} color="white" />
        </View>
        <Text className="text-gray-600 text-base">Sistem Informasi Terpadu</Text>
      </View>

      {/* Card */}
      <View className="bg-white rounded-2xl p-5 shadow-sm">
        <Text className="text-lg font-bold text-gray-800 mb-1">Daftar Akun Baru</Text>
        <Text className="text-gray-500 text-sm mb-5">Buat akun untuk mengakses layanan Bank Sampah</Text>

        {/* Pilih Role */}
        <Text className="text-gray-700 font-semibold mb-2">Pilih Role</Text>

        <Pressable onPress={() => setSelectedRole(isActive ? null : "WARGA")} className="mb-4">
          <View className="relative rounded-xl bg-white">
            {isActive && <View pointerEvents="none" className="absolute inset-0 z-10 rounded-xl border-2 border-indigo-500" />}
            <View className="flex-row items-center p-4 rounded-xl">
              <View className={`p-2 rounded-full mr-3 ${isActive ? "bg-indigo-100" : "bg-gray-100"}`}>
                <User size={18} color={isActive ? "#6366f1" : "#6b7280"} />
              </View>

              <View>
                <Text className="font-semibold text-gray-800">Warga</Text>
                <Text className="text-gray-500 text-xs">Nasabah Bank Sampah</Text>
              </View>
            </View>
          </View>
        </Pressable>

        {/* Email */}
        <Text className="text-gray-700 font-semibold mb-1">Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="123@gmail.com"
          keyboardType="email-address"
          className="border border-gray-200 rounded-xl px-4 py-3 mb-4 text-gray-800"
        />

        {/* Password */}
        <Text className="text-gray-700 font-semibold mb-1">Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Masukkan Password"
          secureTextEntry
          className="border border-gray-200 rounded-xl px-4 py-3 mb-6 text-gray-800"
        />

        {/* Konfirm Password */}
        <Text className="text-gray-700 font-semibold mb-1">Konfirmasi Password</Text>
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Masukkan konfirmasi password"
          secureTextEntry
          className="border border-gray-200 rounded-xl px-4 py-3 mb-6 text-gray-800"
        />

        {/* Button */}
        <Pressable onPress={handleRegister} className="bg-indigo-500 rounded-xl py-3 items-center mb-4">
          <Text className="text-white font-semibold text-base">Daftar</Text>
        </Pressable>

        {/* Login link */}
        <Text className="text-center text-gray-500 text-sm">
          Sudah punya akun?{" "}
          <Text className="text-indigo-500 font-semibold" onPress={() => router.push("/auth/login")}>
            Login Di sini
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
}
