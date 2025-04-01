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

const PaymentCard = ({ status = "completed" }) => (
  <TouchableOpacity className="bg-white rounded-xl p-4 mb-4 shadow-sm">
    <View className="flex flex-row justify-between items-start">
      <View className="flex-1">
        <Text className="text-lg font-rubik-bold">Luxury Villa Booking</Text>
        <Text className="text-gray-500 mt-1">Booking #12345</Text>
        <View className="flex flex-row items-center mt-2">
          <Image source={icons.calendar} className="size-4 mr-1" />
          <Text className="text-gray-600">Jan 15, 2024</Text>
        </View>
      </View>
      <View className="items-end">
        <Text className="text-lg font-rubik-bold text-primary">$500</Text>
        <View
          className={`px-3 py-1 rounded-full mt-1 ${
            status === "completed" ? "bg-green-100" : "bg-yellow-100"
          }`}
        >
          <Text
            className={`text-sm font-rubik-medium ${
              status === "completed" ? "text-green-600" : "text-yellow-600"
            }`}
          >
            {status === "completed" ? "Completed" : "Pending"}
          </Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

const PaymentMethodCard = ({ type = "card" }) => (
  <TouchableOpacity className="bg-white rounded-xl p-4 mb-4 shadow-sm">
    <View className="flex flex-row items-center">
      <Image
        source={type === "card" ? icons.wallet : icons.wallet}
        className="size-8 mr-4"
      />
      <View className="flex-1">
        <Text className="text-lg font-rubik-bold">
          {type === "card" ? "Credit Card" : "Bank Account"}
        </Text>
        <Text className="text-gray-500 mt-1">
          {type === "card" ? "**** **** **** 1234" : "**** 5678"}
        </Text>
      </View>
      <TouchableOpacity>
        <Image source={icons.edit} className="size-5" />
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);

const Payments = () => {
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
          <Text className="text-xl font-rubik-bold">Payments</Text>
          <View className="size-6" />
        </View>

        {/* Payment Methods */}
        <View className="mt-8">
          <Text className="text-lg font-rubik-bold mb-4">Payment Methods</Text>
          <PaymentMethodCard type="card" />
          <PaymentMethodCard type="bank" />
          <TouchableOpacity className="bg-white rounded-xl p-4 mb-4 shadow-sm border-2 border-dashed border-gray-300">
            <View className="flex flex-row items-center justify-center">
              <Image source={icons.edit} className="size-5 mr-2" />
              <Text className="text-primary font-rubik-medium">
                Add New Method
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Payment History */}
        <View className="mt-8">
          <Text className="text-lg font-rubik-bold mb-4">Payment History</Text>
          <PaymentCard status="completed" />
          <PaymentCard status="completed" />
          <PaymentCard status="pending" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Payments;
