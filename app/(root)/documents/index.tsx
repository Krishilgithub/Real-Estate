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

const DocumentCard = ({ type = "id", onEdit }) => (
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
      <TouchableOpacity onPress={onEdit}>
        <Image source={icons.edit} className="size-5" />
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);

const Documents = () => {
  const handleAddDocument = () => {
    router.push("/(root)/document-form");
  };

  const handleEditDocument = (type: string) => {
    router.push({
      pathname: "/(root)/document-form",
      params: { type, edit: true },
    });
  };

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
          <DocumentCard type="id" onEdit={() => handleEditDocument("id")} />
          <DocumentCard
            type="address"
            onEdit={() => handleEditDocument("address")}
          />
        </View>

        {/* Additional Documents */}
        <View className="mt-8">
          <Text className="text-lg font-rubik-bold mb-4">
            Additional Documents
          </Text>
          <TouchableOpacity
            onPress={handleAddDocument}
            className="bg-white rounded-xl p-4 mb-4 shadow-sm border-2 border-dashed border-gray-300"
          >
            <View className="flex flex-row items-center justify-center">
              <Image source={icons.edit} className="size-5 mr-2" />
              <Text className="text-primary font-rubik-medium">
                Add New Document
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Document Guidelines */}
        <View className="mt-8">
          <Text className="text-lg font-rubik-bold mb-4">
            Document Guidelines
          </Text>
          <View className="bg-white rounded-xl p-4">
            <Text className="text-gray-600 font-rubik-medium mb-2">
              • All documents must be clear and legible
            </Text>
            <Text className="text-gray-600 font-rubik-medium mb-2">
              • Documents must be in PDF or image format
            </Text>
            <Text className="text-gray-600 font-rubik-medium mb-2">
              • Maximum file size: 5MB
            </Text>
            <Text className="text-gray-600 font-rubik-medium">
              • Documents must be current and not expired
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Documents;
