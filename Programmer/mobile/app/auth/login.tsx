import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { LandPlot } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

import { authService } from "@/features/auth/auth.service";
import { useAuthStore } from "@/features/auth/auth.store";

export default function Login() {
  const router = useRouter();

  const { isAuthenticated, profileComplete, hydrated } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect SETELAH auth state siap
  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated) return;

    if (!profileComplete) {
      router.replace("/form/WargaForm");
    } else {
      router.replace("/");
    }
  }, [hydrated, isAuthenticated, profileComplete]);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email dan password wajib diisi");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await authService.login(email, password);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-gray-50 px-5"
      contentContainerStyle={{ paddingVertical: 24 }}
      keyboardShouldPersistTaps="handled"
    >
      <View className="items-center mb-6">
        <View className="bg-indigo-500 p-3 rounded-2xl mb-2">
          <LandPlot size={42} color="white" />
        </View>
        <Text className="text-gray-600 text-base">Sistem Informasi Terpadu</Text>
      </View>

      <View className="bg-white rounded-2xl p-5 shadow-sm">
        <Text className="text-lg font-bold text-gray-800 mb-1">Masuk Ke Aplikasi</Text>
        <Text className="text-gray-500 text-sm mb-5">Masukkan email dan password anda</Text>

        {error && <Text className="text-red-500 text-sm mb-3">{error}</Text>}

        <Text className="text-gray-700 font-semibold mb-1">Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="123@gmail.com"
          keyboardType="email-address"
          autoCapitalize="none"
          className="border border-gray-200 rounded-xl px-4 py-3 mb-4 text-gray-800"
        />

        <Text className="text-gray-700 font-semibold mb-1">Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Masukkan Password"
          secureTextEntry
          className="border border-gray-200 rounded-xl px-4 py-3 mb-6 text-gray-800"
        />

        <View className="mt-20">
          <Pressable
            onPress={handleLogin}
            disabled={loading}
            className={`rounded-xl py-3 items-center mb-4 ${loading ? "bg-gray-400" : "bg-indigo-500"}`}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-semibold text-base">Login</Text>
            )}
          </Pressable>

          <Text className="text-center text-gray-500 text-sm">
            Belum punya akun?{" "}
            <Text className="text-indigo-500 font-semibold" onPress={() => router.push("/auth/register")}>
              Daftar Di sini
            </Text>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
