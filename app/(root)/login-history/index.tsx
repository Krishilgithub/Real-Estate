import React, { useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert,
  RefreshControl,
} from "react-native";
import { router } from "expo-router";

import icons from "@/constants/icons";

interface LoginEntry {
  id: number;
  device: string;
  location: string;
  date: string;
  time: string;
  status: "success" | "failed";
}

const LoginHistory = () => {
  const [loginHistory, setLoginHistory] = useState<LoginEntry[]>([
    {
      id: 1,
      device: "iPhone 13 Pro",
      location: "New York, USA",
      date: "2024-03-20",
      time: "14:30",
      status: "success",
    },
    {
      id: 2,
      device: "MacBook Pro",
      location: "San Francisco, USA",
      date: "2024-03-19",
      time: "09:15",
      status: "success",
    },
    {
      id: 3,
      device: "Unknown Device",
      location: "Unknown Location",
      date: "2024-03-18",
      time: "23:45",
      status: "failed",
    },
  ]);

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate API call to fetch new data
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const handleClearHistory = () => {
    Alert.alert(
      "Clear History",
      "Are you sure you want to clear your login history?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            setLoginHistory([]);
            Alert.alert("Success", "Login history cleared successfully");
          },
        },
      ]
    );
  };

  const getStatusColor = (status: "success" | "failed") => {
    return status === "success" ? "text-green-500" : "text-red-500";
  };

  return (
    <SafeAreaView className="h-full bg-gray-50">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-32 px-7"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Header */}
        <View className="flex flex-row items-center justify-between mt-5">
          <View className="flex flex-row items-center gap-4">
            <TouchableOpacity onPress={() => router.back()}>
              <Image source={icons.backArrow} className="size-6" />
            </TouchableOpacity>
            <Text className="text-xl font-rubik-bold">Login History</Text>
          </View>
          <TouchableOpacity
            onPress={handleClearHistory}
            className="bg-red-100 px-4 py-2 rounded-lg"
          >
            <Text className="text-red-500 font-rubik-medium">Clear All</Text>
          </TouchableOpacity>
        </View>

        {/* Login History List */}
        <View className="mt-8">
          {loginHistory.length === 0 ? (
            <View className="items-center justify-center py-10">
              <Image source={icons.info} className="size-16 mb-4" />
              <Text className="text-gray-500 text-center font-rubik-medium">
                No login history available
              </Text>
            </View>
          ) : (
            loginHistory.map((entry) => (
              <View
                key={entry.id}
                className="bg-white rounded-xl p-4 mb-4 shadow-sm"
              >
                <View className="flex flex-row items-center justify-between mb-2">
                  <View className="flex flex-row items-center gap-3">
                    <Image source={icons.phone} className="size-6" />
                    <Text className="text-lg font-rubik-medium">
                      {entry.device}
                    </Text>
                  </View>
                  <Text
                    className={`font-rubik-medium ${getStatusColor(
                      entry.status
                    )}`}
                  >
                    {entry.status === "success" ? "Successful" : "Failed"}
                  </Text>
                </View>
                <View className="flex flex-row items-center gap-2 mb-2">
                  <Image source={icons.location} className="size-4" />
                  <Text className="text-gray-500">{entry.location}</Text>
                </View>
                <View className="flex flex-row items-center gap-2">
                  <Image source={icons.calendar} className="size-4" />
                  <Text className="text-gray-500">
                    {entry.date} at {entry.time}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginHistory;
