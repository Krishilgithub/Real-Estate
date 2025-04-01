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

const DocumentCard = ({ type = "id" }) => (
  <TouchableOpacity className="bg-white rounded-xl p-4 mb-4 shadow-sm">
    <View className="flex flex-row items-center">
      <View className="bg-gray-100 rounded-full p-3 mr-4">
        <Image
          source={type === "id" ? icons.info : icons.document}
          className="size-6"
        />
      </View>
      <View className="flex-1">
        <Text className="text-lg font-rubik-bold">
          {type === "id" ? "ID Document" : "Proof of Address"}
        </Text>
        <Text className="text-gray-500 mt-1">
          {type === "id" ? "Passport" : "Utility Bill"}
        </Text>
      </View>
      <TouchableOpacity>
        <Image source={icons.edit} className="size-5" />
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);

const Documents = () => {
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
          <Text className="text-xl font-rubik-bold">Documents</Text>
          <View className="size-6" />
        </View>

        {/* Documents List */}
        <View className="mt-8">
          <Text className="text-lg font-rubik-bold mb-4">
            Required Documents
          </Text>
          <DocumentCard type="id" />
          <DocumentCard type="address" />
        </View>

        {/* Additional Documents */}
        <View className="mt-8">
          <Text className="text-lg font-rubik-bold mb-4">
            Additional Documents
          </Text>
          <TouchableOpacity className="bg-white rounded-xl p-4 mb-4 shadow-sm border-2 border-dashed border-gray-300">
            <View className="flex flex-row items-center justify-center">
              <Image source={icons.edit} className="size-5 mr-2" />
              <Text className="text-primary font-rubik-medium">
                Add New Document
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Document Guidelines */}
        <View className="mt-8 bg-white rounded-xl p-4 shadow-sm">
          <Text className="text-lg font-rubik-bold mb-2">
            Document Guidelines
          </Text>
          <Text className="text-gray-600 mb-2">
            • All documents must be clear and legible
          </Text>
          <Text className="text-gray-600 mb-2">
            • Documents must be less than 3 months old
          </Text>
          <Text className="text-gray-600">
            • Accepted formats: PDF, JPG, PNG
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Documents;
