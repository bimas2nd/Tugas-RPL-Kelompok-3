import { View } from "react-native";
import { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export default function Card({ children, className = "" }: CardProps) {
  return <View className={`bg-white rounded-2xl p-4 ${className}`}>{children}</View>;
}
