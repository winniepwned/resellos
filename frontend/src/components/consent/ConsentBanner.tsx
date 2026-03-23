import { View, Text, Pressable } from "react-native";
import { useConsentStore } from "@/stores/consent.store";

export default function ConsentBanner() {
  const hasShownBanner = useConsentStore((state) => state.hasShownBanner);
  const setHasShownBanner = useConsentStore((state) => state.setHasShownBanner);
  const setConsent = useConsentStore((state) => state.setConsent);

  if (hasShownBanner) return null;

  const handleAcceptAll = () => {
    setConsent("analytics", true);
    setConsent("marketing", true);
    setConsent("thirdParty", true);
    setHasShownBanner(true);
  };

  const handleRejectAll = () => {
    setConsent("analytics", false);
    setConsent("marketing", false);
    setConsent("thirdParty", false);
    setHasShownBanner(true);
  };

  return (
    <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-300 p-6 shadow-lg">
      <Text className="text-lg font-bold mb-2">Datenschutz-Einstellungen</Text>
      <Text className="text-gray-600 mb-4">
        Wir nutzen Cookies und ähnliche Technologien. Sie können Ihre Einwilligung jederzeit
        widerrufen.
      </Text>
      <View className="flex-row gap-3">
        {/* GDPR-7-DEFAULT: Reject equally prominent as Accept */}
        <Pressable className="flex-1 bg-gray-200 rounded-lg py-3" onPress={handleRejectAll}>
          <Text className="text-center font-semibold text-lg">Ablehnen</Text>
        </Pressable>
        <Pressable className="flex-1 bg-blue-600 rounded-lg py-3" onPress={handleAcceptAll}>
          <Text className="text-white text-center font-semibold text-lg">Akzeptieren</Text>
        </Pressable>
      </View>
    </View>
  );
}
