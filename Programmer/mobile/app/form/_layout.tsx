import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FormLayout() {
  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-gray-50">
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaView>
  );
}
