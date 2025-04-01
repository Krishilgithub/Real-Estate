import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="edit-profile/index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="my-bookings/index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="payments/index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="documents/index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="change-password/index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="connected-devices/index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="login-history/index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="security-questions/index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="notifications/index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="properties/[id]"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
