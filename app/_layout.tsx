import { useEffect } from "react";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { GlobalProvider } from "@/lib/global-provider";
import { useGlobalContext } from "@/lib/global-provider";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { logout } from "@/lib/appwrite";
import icons from "@/constants/icons";
import { Image } from "react-native";

import "./global.css";
import { NotificationsProvider } from "@/lib/notifications-provider";

function RootLayoutNav() {
  const { userType, setUserType } = useGlobalContext();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const success = await logout();
      if (success) {
        setUserType("guest");
        setTimeout(() => {
          router.replace("/sign-in");
        }, 0);
      }
    } catch (error) {
      console.error("Logout error:", error);
      setUserType("guest");
      router.replace("/sign-in");
    }
  };

  return (
    <Stack>
      <Stack.Screen
        name="(root)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="sign-in"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="sign-up"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}

function BuyerLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="(root)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="sign-in"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="sign-up"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}

function SellerLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="(root)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="sign-in"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="sign-up"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}

function GuestLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="(root)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="sign-in"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="sign-up"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}

function LayoutContent() {
  const { userType } = useGlobalContext();
  const [fontsLoaded] = useFonts({
    "Rubik-Bold": require("../assets/fonts/Rubik-Bold.ttf"),
    "Rubik-ExtraBold": require("../assets/fonts/Rubik-ExtraBold.ttf"),
    "Rubik-Light": require("../assets/fonts/Rubik-Light.ttf"),
    "Rubik-Medium": require("../assets/fonts/Rubik-Medium.ttf"),
    "Rubik-Regular": require("../assets/fonts/Rubik-Regular.ttf"),
    "Rubik-SemiBold": require("../assets/fonts/Rubik-SemiBold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NotificationsProvider>
      {userType === "buyer" ? (
        <BuyerLayout />
      ) : userType === "seller" ? (
        <SellerLayout />
      ) : userType === "guest" ? (
        <GuestLayout />
      ) : (
        <RootLayoutNav />
      )}
    </NotificationsProvider>
  );
}

export default function RootLayout() {
  return (
    <GlobalProvider>
      <LayoutContent />
    </GlobalProvider>
  );
}
