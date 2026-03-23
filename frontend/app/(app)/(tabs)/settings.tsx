import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";

export default function SettingsScreen() {
  return (
    <View className="flex-1 bg-white px-6 pt-8">
      <Text className="text-2xl font-bold mb-6">Einstellungen</Text>

      <Pressable
        className="py-4 border-b border-gray-200"
        onPress={() => router.push("/(settings)/privacy")}
      >
        <Text className="text-lg">Datenschutz</Text>
      </Pressable>

      <Pressable
        className="py-4 border-b border-gray-200"
        onPress={() => router.push("/(settings)/consent")}
      >
        <Text className="text-lg">Einwilligungen verwalten</Text>
      </Pressable>

      <Pressable
        className="py-4 border-b border-gray-200"
        onPress={() => router.push("/(settings)/data-export")}
      >
        <Text className="text-lg">Daten exportieren</Text>
      </Pressable>
    </View>
  );
}
