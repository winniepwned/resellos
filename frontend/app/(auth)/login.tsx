import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { Link, router } from "expo-router";
import { useState } from "react";
import { useAuthStore } from "@/stores/auth.store";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const signIn = useAuthStore((state) => state.signIn);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Fehler", "Bitte alle Felder ausfüllen.");
      return;
    }
    setLoading(true);
    try {
      await signIn(email, password);
      router.replace("/(app)/(tabs)/home");
    } catch {
      Alert.alert("Fehler", "Login fehlgeschlagen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center px-6 bg-white">
      <Text className="text-3xl font-bold mb-8 text-center">Anmelden</Text>

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
        textContentType="password"
      />

      <Pressable
        className="bg-blue-600 rounded-lg py-4 mb-4"
        onPress={handleLogin}
        disabled={loading}
      >
        <Text className="text-white text-center font-semibold text-lg">
          {loading ? "Laden..." : "Anmelden"}
        </Text>
      </Pressable>

      <Link href="/(auth)/forgot-password" className="text-blue-600 text-center mb-2">
        Passwort vergessen?
      </Link>
      <Link href="/(auth)/register" className="text-blue-600 text-center">
        Kein Konto? Registrieren
      </Link>

      <Link href="/(settings)/privacy" className="text-gray-500 text-center text-sm mt-8">
        Datenschutzerklärung
      </Link>
    </View>
  );
}
