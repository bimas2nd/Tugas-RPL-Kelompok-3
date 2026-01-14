import { Stack, useRouter } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";
import BottomNav from "@/components/navigation/BottomNav";

export default function HomeLayout() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        <Stack screenOptions={{ headerShown: false }} />
      </View>

      <BottomNav />
    </SafeAreaView>
  );
}
