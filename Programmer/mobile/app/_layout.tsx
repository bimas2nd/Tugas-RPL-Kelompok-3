import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useAuthStore } from "@/features/auth/auth.store";
import { authService } from "@/features/auth/auth.service";
import { tokenStorage } from "@/lib/token";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  const { isAuthenticated, hydrated, profileComplete, setHydrated } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await tokenStorage.get();

        if (token) {
          await authService.fetchMe();
        } else {
          setHydrated();
        }
      } catch {
        setHydrated();
      }
    };

    initAuth();
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    const root = segments[0];

    const inAuth = root === "auth";
    const inForm = root === "form";

    if (!isAuthenticated) {
      if (!inAuth) {
        router.replace("/auth/login");
      }
      return;
    }

    if (!profileComplete) {
      if (!inForm) {
        router.replace("/form/WargaForm");
      }
      return;
    }

    if (inAuth || inForm) {
      router.replace("/");
    }
  }, [hydrated, isAuthenticated, profileComplete, segments]);

  /* ======================
     SPLASH SAAT HYDRATION
  ====================== */
  if (!hydrated) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Slot />;
}
