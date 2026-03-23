import { View, Text, TextInput } from "react-native";
import { useState } from "react";

export default function SearchScreen() {
  const [query, setQuery] = useState("");

  return (
    <View className="flex-1 bg-white px-4 pt-4">
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
        placeholder="Produkt suchen..."
        value={query}
        onChangeText={setQuery}
      />
      <Text className="text-gray-500 text-center mt-8">
        {query ? `Suche nach "${query}"...` : "Suchbegriff eingeben"}
      </Text>
    </View>
  );
}
