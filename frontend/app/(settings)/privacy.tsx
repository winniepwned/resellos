import { View, Text, ScrollView } from "react-native";

export default function PrivacyScreen() {
  return (
    <ScrollView className="flex-1 bg-white px-6 pt-8">
      <Text className="text-2xl font-bold mb-6">Datenschutzerklärung</Text>
      <Text className="text-gray-700 leading-6 mb-4">
        Wir verarbeiten Ihre personenbezogenen Daten gemäß der DSGVO.
        Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung).
      </Text>
      <Text className="text-lg font-semibold mb-2">Ihre Rechte</Text>
      <Text className="text-gray-700 leading-6 mb-2">
        - Auskunftsrecht (Art. 15 DSGVO)
      </Text>
      <Text className="text-gray-700 leading-6 mb-2">
        - Berichtigungsrecht (Art. 16 DSGVO)
      </Text>
      <Text className="text-gray-700 leading-6 mb-2">
        - Löschungsrecht (Art. 17 DSGVO)
      </Text>
      <Text className="text-gray-700 leading-6 mb-2">
        - Datenportabilität (Art. 20 DSGVO)
      </Text>
      <Text className="text-gray-700 leading-6 mb-4">
        - Widerspruchsrecht (Art. 21 DSGVO)
      </Text>
      <Text className="text-lg font-semibold mb-2">Kontakt</Text>
      <Text className="text-gray-700 leading-6 mb-8">
        Datenschutzbeauftragter: dpo@example.com
      </Text>
    </ScrollView>
  );
}
