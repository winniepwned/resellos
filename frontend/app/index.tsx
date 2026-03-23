import { Redirect } from "expo-router";
import { useAuthStore } from "@/stores/auth.store";

export default function Index() {
  const session = useAuthStore((state) => state.session);

  if (session) {
    return <Redirect href="/(app)/(tabs)/home" />;
  }

  return <Redirect href="/(auth)/login" />;
}
