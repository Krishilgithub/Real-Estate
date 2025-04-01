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
} from "react-native";
import { router } from "expo-router";

import icons from "@/constants/icons";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }

    // TODO: Implement password change API call
    Alert.alert("Success", "Password changed successfully");
    router.back();
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
            className="bg-primary py-4 rounded-xl"
          >
            <Text className="text-white text-center text-lg font-rubik-medium">
              Change Password
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChangePassword;
