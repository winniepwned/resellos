import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold">Detail: {id}</Text>
    </View>
  );
}
