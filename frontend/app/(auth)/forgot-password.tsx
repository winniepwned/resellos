import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { Link } from "expo-router";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async () => {
    if (!email) {
      Alert.alert("Fehler", "Bitte E-Mail eingeben.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      setSent(true);
    } catch {
      Alert.alert("Fehler", "Passwort-Reset fehlgeschlagen.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <View className="flex-1 justify-center px-6 bg-white">
        <Text className="text-2xl font-bold mb-4 text-center">E-Mail gesendet</Text>
        <Text className="text-gray-600 text-center mb-8">
          Prüfe dein Postfach für den Reset-Link.
        </Text>
        <Link href="/(auth)/login" className="text-blue-600 text-center">
          Zurück zum Login
        </Link>
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center px-6 bg-white">
      <Text className="text-3xl font-bold mb-8 text-center">Passwort vergessen</Text>

      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-6"
        placeholder="E-Mail"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        textContentType="emailAddress"
      />

      <Pressable
        className="bg-blue-600 rounded-lg py-4 mb-4"
        onPress={handleReset}
        disabled={loading}
      >
        <Text className="text-white text-center font-semibold text-lg">
          {loading ? "Laden..." : "Reset-Link senden"}
        </Text>
      </Pressable>

      <Link href="/(auth)/login" className="text-blue-600 text-center">
        Zurück zum Login
      </Link>
    </View>
  );
}
