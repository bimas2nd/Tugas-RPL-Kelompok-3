import { View, Pressable, Text } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { LayoutGrid, Recycle, HandCoins, Menu } from "lucide-react-native";

const tabs = [
  {
    label: "Menu Utama",
    icon: Menu,
    path: "/mainmenu",
  },
  {
    label: "Dashboard",
    icon: LayoutGrid,
    path: "/home/dashboard",
  },
  {
    label: "Setor Sampah",
    icon: Recycle,
    path: "/home/setor",
  },
  {
    label: "Tarik Saldo",
    icon: HandCoins,
    path: "/home/tarik",
  },
];

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View className="flex-row justify-between items-center border-t border-gray-200 bg-white px-4 py-2">
      {tabs.map((tab, i) => {
        const active = pathname === tab.path;
        const Icon = tab.icon;

        return (
          <Pressable key={i} onPress={() => router.push(tab.path)} className="items-center flex-1">
            <Icon size={22} color={active ? "#22c55e" : "#4b5563"} />
            <Text className={`text-xs mt-1 ${active ? "text-green-500 font-semibold" : "text-gray-600"}`}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
