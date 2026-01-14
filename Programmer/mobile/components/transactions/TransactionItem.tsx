import { View, Text } from "react-native";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react-native";
import { formatRupiah } from "@/lib/formatter";

type Props = {
  title: string;
  date: string;
  amount: number;
  type: "IN" | "OUT";
};

export default function TransactionItem({ title, date, amount, type }: Props) {
  const isIn = type === "IN";

  return (
    <View className="flex-row items-center py-3">
      {/* Icon */}
      <View className={`w-8 h-8 rounded-full items-center pt-1 justify-center mr-3 ${isIn ? "#22c55e" : "#ef4444"}`}>
        {isIn ? <ArrowUpRight size={18} color="#22c55e" /> : <ArrowDownLeft size={18} color="#ef4444" />}
      </View>

      {/* Title & Date */}
      <View className="flex-1">
        <Text className="font-semibold text-gray-800">{title}</Text>
        <Text className="text-xs text-gray-500">{date}</Text>
      </View>

      {/* Amount & Status */}
      <View className="items-end">
        <Text className={`font-semibold ${isIn ? "text-green-600" : "text-red-500"}`}>
          {isIn ? "+" : "-"} {formatRupiah(amount)}
        </Text>
        <Text className="text-xs text-gray-500">Selesai</Text>
      </View>
    </View>
  );
}
