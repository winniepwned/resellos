import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { Link, router } from "expo-router";
import { useState } from "react";
import { useAuthStore } from "@/stores/auth.store";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const signUp = useAuthStore((state) => state.signUp);

  const handleRegister = async () => {
    if (!email || !password || !displayName) {
      Alert.alert("Fehler", "Bitte alle Felder ausfüllen.");
      return;
    }
    setLoading(true);
    try {
      await signUp(email, password);
      router.replace("/(app)/(tabs)/home");
    } catch {
      Alert.alert("Fehler", "Registrierung fehlgeschlagen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center px-6 bg-white">
      <Text className="text-3xl font-bold mb-8 text-center">Registrieren</Text>

      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
        placeholder="Anzeigename"
        value={displayName}
        onChangeText={setDisplayName}
        textContentType="name"
      />
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
        placeholder="E-Mail"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        textContentType="emailAddress"
      />
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-6"
        placeholder="Passwort"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        textContentType="newPassword"
      />

      <Pressable
        className="bg-blue-600 rounded-lg py-4 mb-4"
        onPress={handleRegister}
        disabled={loading}
      >
        <Text className="text-white text-center font-semibold text-lg">
          {loading ? "Laden..." : "Registrieren"}
        </Text>
      </Pressable>

      <Link href="/(auth)/login" className="text-blue-600 text-center">
        Bereits ein Konto? Anmelden
      </Link>

      <Link href="/(settings)/privacy" className="text-gray-500 text-center text-sm mt-8">
        Datenschutzerklärung
      </Link>
    </View>
  );
}
