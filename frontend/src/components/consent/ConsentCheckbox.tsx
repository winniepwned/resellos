import { View, Text, Pressable } from "react-native";

interface ConsentCheckboxProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

export default function ConsentCheckbox({
  label,
  description,
  checked,
  onChange,
}: ConsentCheckboxProps) {
  return (
    <Pressable
      className="flex-row items-start py-3"
      onPress={() => onChange(!checked)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
    >
      <View
        className={`w-6 h-6 rounded border-2 mr-3 mt-0.5 items-center justify-center ${
          checked ? "bg-blue-600 border-blue-600" : "border-gray-400"
        }`}
      >
        {checked && <Text className="text-white text-sm font-bold">✓</Text>}
      </View>
      <View className="flex-1">
        <Text className="text-base font-medium">{label}</Text>
        {description && <Text className="text-gray-500 text-sm mt-1">{description}</Text>}
      </View>
    </Pressable>
  );
}
