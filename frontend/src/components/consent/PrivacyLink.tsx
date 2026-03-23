import { Text, Pressable } from "react-native";
import { router } from "expo-router";

export default function PrivacyLink() {
  return (
    <Pressable onPress={() => router.push("/(settings)/privacy")}>
      <Text className="text-gray-500 text-sm underline">Datenschutzerklärung</Text>
    </Pressable>
  );
}
