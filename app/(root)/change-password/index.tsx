import React, { useState } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";

import icons from "@/constants/icons";
import { updatePassword } from "@/lib/appwrite";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasNumber = /\d/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return (
      password.length >= minLength &&
      hasNumber &&
      hasUpperCase &&
      hasSpecialChar
    );
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!validatePassword(newPassword)) {
      Alert.alert(
        "Error",
        "New password does not meet the requirements. Please check the password requirements below."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }

    try {
      setIsUpdating(true);
      const success = await updatePassword(newPassword);

      if (success) {
        Alert.alert("Success", "Password changed successfully", [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]);
      } else {
        Alert.alert("Error", "Failed to change password. Please try again.");
      }
    } catch (error) {
      console.error("Password change error:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <SafeAreaView className="h-full bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-32 px-7"
      >
        {/* Header */}
        <View className="flex flex-row items-center gap-4 mt-5">
          <TouchableOpacity onPress={() => router.back()}>
            <Image source={icons.backArrow} className="size-6" />
          </TouchableOpacity>
          <Text className="text-xl font-rubik-bold">Change Password</Text>
        </View>

        {/* Password Form */}
        <View className="mt-8">
          <View className="mb-6">
            <Text className="text-base font-rubik-medium mb-2">
              Current Password
            </Text>
            <View className="relative">
              <TextInput
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Enter current password"
                secureTextEntry={!showCurrentPassword}
                className="bg-gray-50 p-4 rounded-xl text-base"
              />
              <TouchableOpacity
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-4 top-4"
              >
                <Text className="text-gray-500">
                  {showCurrentPassword ? "Hide" : "Show"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="mb-6">
            <Text className="text-base font-rubik-medium mb-2">
              New Password
            </Text>
            <View className="relative">
              <TextInput
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter new password"
                secureTextEntry={!showNewPassword}
                className="bg-gray-50 p-4 rounded-xl text-base"
              />
              <TouchableOpacity
                onPress={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-4"
              >
                <Text className="text-gray-500">
                  {showNewPassword ? "Hide" : "Show"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="mb-6">
            <Text className="text-base font-rubik-medium mb-2">
              Confirm New Password
            </Text>
            <View className="relative">
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm new password"
                secureTextEntry={!showConfirmPassword}
                className="bg-gray-50 p-4 rounded-xl text-base"
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-4"
              >
                <Text className="text-gray-500">
                  {showConfirmPassword ? "Hide" : "Show"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Password Requirements */}
          <View className="bg-gray-50 p-4 rounded-xl mb-8">
            <Text className="text-base font-rubik-medium mb-2">
              Password Requirements:
            </Text>
            <View className="gap-2">
              <Text className="text-gray-500">
                • At least 8 characters long
              </Text>
              <Text className="text-gray-500">
                • Contains at least one number
              </Text>
              <Text className="text-gray-500">
                • Contains at least one uppercase letter
              </Text>
              <Text className="text-gray-500">
                • Contains at least one special character
              </Text>
            </View>
          </View>

          {/* Change Password Button */}
          <TouchableOpacity
            onPress={handleChangePassword}
            disabled={isUpdating}
            className={`bg-primary-500 py-4 rounded-xl bg-blue-700 ${
              isUpdating ? "opacity-50" : ""
            }`}
          >
            <View className="flex flex-row items-center justify-center">
              {isUpdating ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white text-center text-lg font-rubik-medium">
                  Update Password
                </Text>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChangePassword;
