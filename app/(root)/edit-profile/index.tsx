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
import * as ImagePicker from "expo-image-picker";

import { useGlobalContext } from "@/lib/global-provider";
import icons from "@/constants/icons";

const EditProfile = () => {
  const { user, setUser } = useGlobalContext();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");
  const [avatar, setAvatar] = useState(user?.avatar || null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    try {
      // Here you would typically make an API call to update the user profile
      // For now, we'll just update the local state
      setUser({
        ...user,
        name,
        email,
        phone,
        address,
        avatar,
      });

      Alert.alert("Success", "Profile updated successfully");
      router.back();
    } catch (error) {
      Alert.alert("Error", "Failed to update profile");
    }
  };

  return (
    <SafeAreaView className="h-full bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-32 px-7"
      >
        {/* Header */}
        <View className="flex flex-row items-center justify-between mt-5">
          <TouchableOpacity onPress={() => router.back()}>
            <Image source={icons.backArrow} className="size-6" />
          </TouchableOpacity>
          <Text className="text-xl font-rubik-bold">Edit Profile</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text className="text-primary text-lg font-rubik-medium">Save</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Picture */}
        <View className="flex flex-col items-center mt-8">
          <View className="relative">
            <Image
              source={{ uri: avatar || user?.avatar }}
              className="size-32 rounded-full"
            />
            <TouchableOpacity
              onPress={pickImage}
              className="absolute bottom-0 right-0 bg-primary rounded-full p-2"
            >
              <Image source={icons.edit} className="size-5" />
            </TouchableOpacity>
          </View>
          <Text className="text-gray-500 mt-2">Tap to change photo</Text>
        </View>

        {/* Form Fields */}
        <View className="mt-8 space-y-6">
          <View>
            <Text className="text-sm font-rubik-medium text-gray-500 mb-2">
              Full Name
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
              className="bg-gray-50 p-4 rounded-xl text-lg font-rubik-medium"
            />
          </View>

          <View>
            <Text className="text-sm font-rubik-medium text-gray-500 mb-2">
              Email
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              className="bg-gray-50 p-4 rounded-xl text-lg font-rubik-medium"
            />
          </View>

          <View>
            <Text className="text-sm font-rubik-medium text-gray-500 mb-2">
              Phone Number
            </Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              className="bg-gray-50 p-4 rounded-xl text-lg font-rubik-medium"
            />
          </View>

          <View>
            <Text className="text-sm font-rubik-medium text-gray-500 mb-2">
              Address
            </Text>
            <TextInput
              value={address}
              onChangeText={setAddress}
              placeholder="Enter your address"
              multiline
              numberOfLines={3}
              className="bg-gray-50 p-4 rounded-xl text-lg font-rubik-medium"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfile;
