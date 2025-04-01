import React from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";

import icons from "@/constants/icons";

const BookingCard = ({ status = "upcoming" }) => (
  <TouchableOpacity className="bg-white rounded-xl p-4 mb-4 shadow-sm">
    <View className="flex flex-row justify-between items-start">
      <View className="flex-1">
        <Text className="text-lg font-rubik-bold">Luxury Villa</Text>
        <Text className="text-gray-500 mt-1">123 Main Street, City</Text>
        <View className="flex flex-row items-center mt-2">
          <Image source={icons.calendar} className="size-4 mr-1" />
          <Text className="text-gray-600">Jan 15 - Jan 20, 2024</Text>
        </View>
      </View>
      <View
        className={`px-3 py-1 rounded-full ${
          status === "upcoming" ? "bg-green-100" : "bg-gray-100"
        }`}
      >
        <Text
          className={`text-sm font-rubik-medium ${
            status === "upcoming" ? "text-green-600" : "text-gray-600"
          }`}
        >
          {status === "upcoming" ? "Upcoming" : "Completed"}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

const MyBookings = () => {
  return (
    <SafeAreaView className="h-full bg-gray-50">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-32 px-7"
      >
        {/* Header */}
        <View className="flex flex-row items-center justify-between mt-5">
          <TouchableOpacity onPress={() => router.back()}>
            <Image source={icons.backArrow} className="size-6" />
          </TouchableOpacity>
          <Text className="text-xl font-rubik-bold">My Bookings</Text>
          <View className="size-6" />
        </View>

        {/* Bookings List */}
        <View className="mt-8">
          <Text className="text-lg font-rubik-bold mb-4">
            Upcoming Bookings
          </Text>
          <BookingCard status="upcoming" />
          <BookingCard status="upcoming" />
          <BookingCard status="upcoming" />
        </View>

        <View className="mt-8">
          <Text className="text-lg font-rubik-bold mb-4">Past Bookings</Text>
          <BookingCard status="completed" />
          <BookingCard status="completed" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyBookings;
