import { View, Text, Pressable, Alert } from "react-native";
import { router } from "expo-router";
import { useAuthStore } from "@/stores/auth.store";

export default function ProfileScreen() {
  const session = useAuthStore((state) => state.session);
  const signOut = useAuthStore((state) => state.signOut);

  const handleSignOut = async () => {
    await signOut();
    router.replace("/(auth)/login");
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Konto löschen",
      "Bist du sicher? Dein Konto wird in 30 Tagen endgültig gelöscht (DSGVO Art. 17).",
      [
        { text: "Abbrechen", style: "cancel" },
        { text: "Löschen", style: "destructive", onPress: () => {} },
      ]
    );
  };

  return (
    <View className="flex-1 bg-white px-6 pt-8">
      <Text className="text-2xl font-bold mb-2">Profil</Text>
      <Text className="text-gray-600 mb-8">{session?.user?.email ?? ""}</Text>

      <Pressable
        className="bg-blue-600 rounded-lg py-3 mb-4"
        onPress={() => router.push("/(settings)/data-export")}
      >
        <Text className="text-white text-center font-semibold">Daten exportieren (Art. 20)</Text>
      </Pressable>

      <Pressable
        className="bg-red-600 rounded-lg py-3 mb-4"
        onPress={handleDeleteAccount}
      >
        <Text className="text-white text-center font-semibold">Konto löschen (Art. 17)</Text>
      </Pressable>

      <Pressable
        className="border border-gray-300 rounded-lg py-3 mb-4"
        onPress={handleSignOut}
      >
        <Text className="text-center font-semibold">Abmelden</Text>
      </Pressable>
    </View>
  );
}
