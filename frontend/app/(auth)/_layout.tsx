import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: true, headerTitle: "" }}>
      <Stack.Screen name="login" options={{ title: "Login" }} />
      <Stack.Screen name="register" options={{ title: "Registrieren" }} />
      <Stack.Screen name="forgot-password" options={{ title: "Passwort vergessen" }} />
    </Stack>
  );
}
