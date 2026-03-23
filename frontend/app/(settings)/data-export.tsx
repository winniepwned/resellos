import { View, Text, Pressable, Alert } from "react-native";
import { useState } from "react";

export default function DataExportScreen() {
  const [loading, setLoading] = useState(false);
  const [requested, setRequested] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      // TODO: Call backend /api/v1/me/export
      setRequested(true);
    } catch {
      Alert.alert("Fehler", "Export fehlgeschlagen.");
    } finally {
      setLoading(false);
    }
  };

  if (requested) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-2xl font-bold mb-4">Export angefordert</Text>
        <Text className="text-gray-600 text-center">
          Du erhältst eine Benachrichtigung, wenn dein Datenexport bereit ist (DSGVO Art. 20).
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="text-2xl font-bold mb-4">Daten exportieren</Text>
      <Text className="text-gray-600 text-center mb-8">
        Fordere einen Export aller deiner personenbezogenen Daten an (Art. 20 DSGVO — Recht auf Datenportabilität).
      </Text>
      <Pressable
        className="bg-blue-600 rounded-lg py-4 px-8"
        onPress={handleExport}
        disabled={loading}
      >
        <Text className="text-white text-center font-semibold text-lg">
          {loading ? "Wird angefordert..." : "Export starten (JSON)"}
        </Text>
      </Pressable>
    </View>
  );
}
