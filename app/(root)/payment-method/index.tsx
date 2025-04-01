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
import { router, useLocalSearchParams } from "expo-router";

import icons from "@/constants/icons";

const PaymentMethod = () => {
  const { type, edit } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const handleSave = async () => {
    if (!cardNumber || !cardName || !expiryDate || !cvv) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);
      // TODO: Implement payment method save logic
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated API call
      Alert.alert("Success", "Payment method saved successfully", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error("Save payment method error:", error);
      Alert.alert("Error", "Failed to save payment method. Please try again.");
    } finally {
      setIsLoading(false);
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
          <Text className="text-xl font-rubik-bold">
            {edit ? "Edit Payment Method" : "Add Payment Method"}
          </Text>
          <TouchableOpacity
            onPress={handleSave}
            disabled={isLoading}
            className={`${isLoading ? "opacity-50" : ""}`}
          >
            {isLoading ? (
              <ActivityIndicator color="#007AFF" />
            ) : (
              <Text className="text-primary text-lg font-rubik-medium">
                Save
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Payment Method Form */}
        <View className="mt-8 space-y-6">
          <View>
            <Text className="text-sm font-rubik-medium text-gray-500 mb-2">
              Card Number
            </Text>
            <TextInput
              value={cardNumber}
              onChangeText={setCardNumber}
              placeholder="1234 5678 9012 3456"
              keyboardType="numeric"
              maxLength={19}
              className="bg-gray-50 p-4 rounded-xl text-lg font-rubik-medium"
            />
          </View>

          <View>
            <Text className="text-sm font-rubik-medium text-gray-500 mb-2">
              Cardholder Name
            </Text>
            <TextInput
              value={cardName}
              onChangeText={setCardName}
              placeholder="Enter cardholder name"
              className="bg-gray-50 p-4 rounded-xl text-lg font-rubik-medium"
            />
          </View>

          <View className="flex flex-row gap-4">
            <View className="flex-1">
              <Text className="text-sm font-rubik-medium text-gray-500 mb-2">
                Expiry Date
              </Text>
              <TextInput
                value={expiryDate}
                onChangeText={setExpiryDate}
                placeholder="MM/YY"
                keyboardType="numeric"
                maxLength={5}
                className="bg-gray-50 p-4 rounded-xl text-lg font-rubik-medium"
              />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-rubik-medium text-gray-500 mb-2">
                CVV
              </Text>
              <TextInput
                value={cvv}
                onChangeText={setCvv}
                placeholder="123"
                keyboardType="numeric"
                maxLength={4}
                className="bg-gray-50 p-4 rounded-xl text-lg font-rubik-medium"
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PaymentMethod;
