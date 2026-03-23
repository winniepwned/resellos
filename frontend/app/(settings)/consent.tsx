import { View, Text, Pressable, Switch } from "react-native";
import { useConsentStore } from "@/stores/consent.store";

export default function ConsentScreen() {
  const consents = useConsentStore((state) => state.consents);
  const toggleConsent = useConsentStore((state) => state.toggleConsent);

  return (
    <View className="flex-1 bg-white px-6 pt-8">
      <Text className="text-2xl font-bold mb-2">Einwilligungen</Text>
      <Text className="text-gray-600 mb-6">
        Verwalten Sie Ihre Einwilligungen gemäß DSGVO Art. 7.
      </Text>

      <View className="border-b border-gray-200 py-4 flex-row justify-between items-center">
        <View className="flex-1 mr-4">
          <Text className="text-lg font-semibold">Analytics</Text>
          <Text className="text-gray-500 text-sm">Anonymisierte Nutzungsstatistiken</Text>
        </View>
        <Switch
          value={consents.analytics}
          onValueChange={() => toggleConsent("analytics")}
        />
      </View>

      <View className="border-b border-gray-200 py-4 flex-row justify-between items-center">
        <View className="flex-1 mr-4">
          <Text className="text-lg font-semibold">Marketing</Text>
          <Text className="text-gray-500 text-sm">Personalisierte Inhalte und Angebote</Text>
        </View>
        <Switch
          value={consents.marketing}
          onValueChange={() => toggleConsent("marketing")}
        />
      </View>

      <View className="border-b border-gray-200 py-4 flex-row justify-between items-center">
        <View className="flex-1 mr-4">
          <Text className="text-lg font-semibold">Drittanbieter</Text>
          <Text className="text-gray-500 text-sm">Externe Services und Integrationen</Text>
        </View>
        <Switch
          value={consents.thirdParty}
          onValueChange={() => toggleConsent("thirdParty")}
        />
      </View>

      <Text className="text-gray-400 text-sm mt-6">
        Sie können Ihre Einwilligungen jederzeit widerrufen (Art. 7 Abs. 3 DSGVO).
      </Text>
    </View>
  );
}
