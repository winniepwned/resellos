import { View, Text } from "react-native";
import { useAuthStore } from "@/stores/auth.store";

export default function HomeScreen() {
  const session = useAuthStore((state) => state.session);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold mb-4">Willkommen</Text>
      <Text className="text-gray-600">
        {session?.user?.email ?? "Nicht angemeldet"}
      </Text>
    </View>
  );
}
