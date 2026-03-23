import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="[id]" options={{ headerShown: true, headerTitle: "Details" }} />
    </Stack>
  );
}
