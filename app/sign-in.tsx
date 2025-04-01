import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";

import { login } from "@/lib/appwrite";
import { Redirect, useRouter } from "expo-router";
import { useGlobalContext } from "@/lib/global-provider";
import icons from "@/constants/icons";
import images from "@/constants/images";

const Auth = () => {
  const { handleLogin } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      const success = await handleLogin();
      if (success) {
        router.replace("/");
      }
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <SafeAreaView className="bg-white h-full">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#000" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <Image
          source={images.onboarding}
          className="w-full h-1/3"
          resizeMode="contain"
        />

        <View className="px-10">
          <Text className="text-base text-center uppercase font-rubik text-black-200">
            Welcome Back
          </Text>

          <Text className="text-3xl font-rubik-bold text-black-300 text-center mt-2">
            Sign in to {"\n"}
            <Text className="text-primary-300">Real Scout</Text>
          </Text>

          <Text className="text-lg font-rubik text-black-200 text-center mt-12">
            Continue with Google
          </Text>

          <TouchableOpacity
            onPress={handleSignIn}
            disabled={isLoading}
            className={`mt-5 bg-white shadow-md shadow-zinc-300 rounded-full w-full py-4 ${
              isLoading ? "opacity-70" : ""
            }`}
          >
            <View className="flex flex-row items-center justify-center">
              {isLoading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <>
                  <Image
                    source={icons.google}
                    className="w-5 h-5"
                    resizeMode="contain"
                  />
                  <Text className="text-lg font-rubik-medium text-black-300 ml-2">
                    Sign in with Google
                  </Text>
                </>
              )}
            </View>
          </TouchableOpacity>

          <View className="mt-8">
            <Text className="text-center text-gray-500 font-rubik">
              Don't have an account?
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/sign-up")}
              className="mt-2"
            >
              <Text className="text-center text-primary-300 font-rubik">
                Sign up to get started
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Auth;
