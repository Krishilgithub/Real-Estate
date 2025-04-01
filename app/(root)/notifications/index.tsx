import React from "react";
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

import { useNotifications } from "@/lib/notifications-provider";
import icons from "@/constants/icons";

const NotificationItem = ({
  title,
  message,
  type,
  read,
  timestamp,
  onPress,
}: {
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  timestamp: Date;
  onPress: () => void;
}) => {
  const getTypeColor = () => {
    switch (type) {
      case "success":
        return "bg-green-100";
      case "warning":
        return "bg-yellow-100";
      case "error":
        return "bg-red-100";
      default:
        return "bg-blue-100";
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case "success":
        return icons.check;
      case "warning":
        return icons.warning;
      case "error":
        return icons.error;
      default:
        return icons.info;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`bg-white rounded-xl p-4 mb-4 shadow-sm ${
        !read ? "border-l-4 border-primary" : ""
      }`}
    >
      <View className="flex flex-row items-start gap-3">
        <View className={`p-2 rounded-full ${getTypeColor()}`}>
          <Image source={getTypeIcon()} className="size-5" />
        </View>
        <View className="flex-1">
          <Text className="text-lg font-rubik-medium">{title}</Text>
          <Text className="text-gray-500 mt-1">{message}</Text>
          <Text className="text-gray-400 text-sm mt-2">
            {timestamp.toLocaleString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const Notifications = () => {
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    isNotificationsEnabled,
    toggleNotifications,
  } = useNotifications();

  const handleClearAll = () => {
    Alert.alert(
      "Clear Notifications",
      "Are you sure you want to clear all notifications?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear",
          style: "destructive",
          onPress: clearNotifications,
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
        <View className="flex flex-row items-center justify-between mt-5">
          <View className="flex flex-row items-center gap-4">
            <TouchableOpacity onPress={() => router.back()}>
              <Image source={icons.backArrow} className="size-6" />
            </TouchableOpacity>
            <Text className="text-xl font-rubik-bold">Notifications</Text>
          </View>
          <View className="flex flex-row items-center gap-4">
            <TouchableOpacity
              onPress={toggleNotifications}
              className={`p-2 rounded-lg ${
                isNotificationsEnabled ? "bg-green-100" : "bg-red-100"
              }`}
            >
              <Image
                source={isNotificationsEnabled ? icons.bell : icons.bellOff}
                className="size-5"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleClearAll}
              className="bg-red-100 p-2 rounded-lg"
            >
              <Image source={icons.delete} className="size-5" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Notifications List */}
        <View className="mt-8">
          {notifications.length === 0 ? (
            <View className="items-center justify-center py-10">
              <Image source={icons.bell} className="size-16 mb-4" />
              <Text className="text-gray-500 text-center font-rubik-medium">
                No notifications available
              </Text>
            </View>
          ) : (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                {...notification}
                onPress={() => markAsRead(notification.id)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Notifications;
