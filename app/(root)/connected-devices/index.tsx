import React, { useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { router } from "expo-router";

import icons from "@/constants/icons";

const DeviceCard = ({
  name,
  type,
  lastActive,
  onRemove,
}: {
  name: string;
  type: string;
  lastActive: string;
  onRemove: () => void;
}) => (
  <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
    <View className="flex flex-row items-center justify-between">
      <View className="flex flex-row items-center gap-3">
        <Image source={icons.phone} className="size-8" />
        <View>
          <Text className="text-lg font-rubik-medium">{name}</Text>
          <Text className="text-gray-500">{type}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={onRemove}>
        <Image source={icons.edit} className="size-5" />
      </TouchableOpacity>
    </View>
    <Text className="text-gray-500 mt-2">Last active: {lastActive}</Text>
  </View>
);

const ConnectedDevices = () => {
  const [devices, setDevices] = useState([
    {
      id: 1,
      name: "iPhone 13 Pro",
      type: "Mobile Device",
      lastActive: "2 minutes ago",
    },
    {
      id: 2,
      name: "MacBook Pro",
      type: "Desktop",
      lastActive: "1 hour ago",
    },
    {
      id: 3,
      name: "iPad Air",
      type: "Tablet",
      lastActive: "3 days ago",
    },
  ]);

  const handleRemoveDevice = (id: number) => {
    Alert.alert(
      "Remove Device",
      "Are you sure you want to remove this device?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            setDevices(devices.filter((device) => device.id !== id));
            Alert.alert("Success", "Device removed successfully");
          },
        },
      ]
    );
  };

  const handleAddDevice = () => {
    Alert.alert(
      "Add New Device",
      "To add a new device, you'll need to verify your identity. Would you like to proceed?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Proceed",
          onPress: () => {
            // TODO: Implement device verification flow
            Alert.alert(
              "Verification Required",
              "Please check your email for verification instructions."
            );
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="h-full bg-gray-50">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-32 px-7"
      >
        {/* Header */}
        <View className="flex flex-row items-center gap-4 mt-5">
          <TouchableOpacity onPress={() => router.back()}>
            <Image source={icons.backArrow} className="size-6" />
          </TouchableOpacity>
          <Text className="text-xl font-rubik-bold">Connected Devices</Text>
        </View>

        {/* Device List */}
        <View className="mt-8">
          {devices.map((device) => (
            <DeviceCard
              key={device.id}
              name={device.name}
              type={device.type}
              lastActive={device.lastActive}
              onRemove={() => handleRemoveDevice(device.id)}
            />
          ))}
        </View>

        {/* Add Device Button */}
        <TouchableOpacity
          onPress={handleAddDevice}
          className="mt-6 bg-blue-200 py-4 rounded-xl flex-row items-center justify-center gap-2"
        >
          <Image source={icons.edit} className="size-5" />
          <Text className="text-black text-lg font-rubik-medium">
            Add New Device
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ConnectedDevices;
