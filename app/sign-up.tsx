import React, { useState } from "react";
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

import { login, account } from "@/lib/appwrite";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useGlobalContext } from "@/lib/global-provider";
import icons from "@/constants/icons";
import images from "@/constants/images";

type UserType = "buyer" | "seller" | "guest";

const Auth = () => {
  const { handleLogin, setUserType } = useGlobalContext();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [selectedType, setSelectedType] = useState<UserType | null>(null);
  const router = useRouter();
  const params = useLocalSearchParams();
  const isSwitchingRole = params.switchRole === "true";

  const handleUserTypeSelect = (type: UserType) => {
    setSelectedType(type);
  };

  const updateUserType = async (type: UserType) => {
    try {
      await account.updatePrefs({
        userType: type,
      });
      setUserType(type);
      return true;
    } catch (error) {
      console.error("Error updating user type:", error);
      return false;
    }
  };

  const handleSignUp = async () => {
    if (!selectedType) {
      Alert.alert("Error", "Please select a user type");
      return;
    }

    try {
      setIsLoggingIn(true);
      if (isSwitchingRole) {
        // If switching role, update the user type
        const success = await updateUserType(selectedType);
        if (success) {
          Alert.alert("Success", "Account type updated successfully");
          router.replace("/");
        } else {
          Alert.alert("Error", "Failed to update account type");
        }
      } else {
        // If new signup, proceed with Google login
        const success = await handleLogin();
        if (success) {
          // After successful login, update the user type
          const typeSuccess = await updateUserType(selectedType);
          if (typeSuccess) {
            router.replace("/");
          } else {
            Alert.alert("Error", "Failed to set account type");
          }
        } else {
          Alert.alert("Error", "Failed to sign up. Please try again.");
        }
      }
    } catch (error) {
      console.error("Sign up error:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <Image
          source={images.onboarding}
          className="w-full h-1/3 mt-10"
          resizeMode="contain"
        />

        <View className="px-10">
          <Text className="text-base text-center uppercase font-rubik text-black-200">
            {isSwitchingRole
              ? "Change Your Account Type"
              : "Choose Your Account Type"}
          </Text>

          <Text className="text-3xl font-rubik-bold text-black-300 text-center mt-2">
            I want to be a {"\n"}
            <Text className="text-primary-300">Real Estate</Text>
          </Text>

          <View className="mt-8 space-y-4">
            <TouchableOpacity
              onPress={() => handleUserTypeSelect("buyer")}
              className={`p-4 rounded-xl border-2 ${
                selectedType === "buyer"
                  ? "border-primary-300 bg-primary-50"
                  : "border-gray-200"
              }`}
            >
              <View className="flex-row items-center">
                <View className="w-12 h-12 bg-primary-100 rounded-full items-center justify-center">
                  <Image
                    source={icons.home}
                    className="w-6 h-6"
                    resizeMode="contain"
                  />
                </View>
                <View className="ml-4 flex-1">
                  <Text className="text-lg font-rubik-bold text-black-300">
                    Buyer
                  </Text>
                  <Text className="text-sm font-rubik text-gray-500">
                    Looking to buy or rent properties
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleUserTypeSelect("seller")}
              className={`p-4 rounded-xl border-2 ${
                selectedType === "seller"
                  ? "border-primary-300 bg-primary-50"
                  : "border-gray-200"
              }`}
            >
              <View className="flex-row items-center">
                <View className="w-12 h-12 bg-primary-100 rounded-full items-center justify-center">
                  <Image
                    source={icons.person}
                    className="w-6 h-6"
                    resizeMode="contain"
                  />
                </View>
                <View className="ml-4 flex-1">
                  <Text className="text-lg font-rubik-bold text-black-300">
                    Seller
                  </Text>
                  <Text className="text-sm font-rubik text-gray-500">
                    Want to list your properties
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleUserTypeSelect("guest")}
              className={`p-4 rounded-xl border-2 ${
                selectedType === "guest"
                  ? "border-primary-300 bg-primary-50"
                  : "border-gray-200"
              }`}
            >
              <View className="flex-row items-center">
                <View className="w-12 h-12 bg-primary-100 rounded-full items-center justify-center">
                  <Image
                    source={icons.people}
                    className="w-6 h-6"
                    resizeMode="contain"
                  />
                </View>
                <View className="ml-4 flex-1">
                  <Text className="text-lg font-rubik-bold text-black-300">
                    Guest
                  </Text>
                  <Text className="text-sm font-rubik text-gray-500">
                    Just browsing properties
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleSignUp}
            disabled={isLoggingIn || !selectedType}
            className={`mt-8 bg-primary-300 rounded-full w-full py-4 ${
              !selectedType || isLoggingIn ? "opacity-50" : ""
            }`}
          >
            <View className="flex flex-row items-center justify-center">
              {isLoggingIn ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-lg font-rubik-medium text-white">
                  {isSwitchingRole
                    ? "Update Account Type"
                    : "Continue with Google"}
                </Text>
              )}
            </View>
          </TouchableOpacity>

          {!isSwitchingRole && (
            <TouchableOpacity
              onPress={() => router.push("/sign-in")}
              className="mt-4"
            >
              <Text className="text-center text-primary-300 font-rubik">
                Already have an account? Sign in
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Auth;
