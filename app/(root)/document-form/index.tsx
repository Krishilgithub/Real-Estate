import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";

import icons from "@/constants/icons";

const DocumentForm = () => {
  const { type, edit } = useLocalSearchParams();
  const [documentName, setDocumentName] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [image, setImage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (edit) {
      // In a real app, fetch document details here
      setDocumentName(type === "id" ? "ID Document" : "Proof of Address");
      setDocumentNumber(type === "id" ? "P123456789" : "UT123456");
    }
  }, [edit, type]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!documentName.trim() || !documentNumber.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!image) {
      Alert.alert("Error", "Please upload a document image");
      return;
    }

    setIsSaving(true);

    try {
      // In a real app, upload the image and save document details to backend
      await new Promise((resolve) => setTimeout(resolve, 1500));
      Alert.alert("Success", "Document saved successfully", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to save document");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView className="h-full bg-gray-50">
      <View className="flex-1 px-7">
        {/* Header */}
        <View className="flex flex-row items-center justify-between mt-5">
          <TouchableOpacity onPress={() => router.back()}>
            <Image source={icons.backArrow} className="size-6" />
          </TouchableOpacity>
          <Text className="text-xl font-rubik-bold">
            {edit ? "Edit Document" : "Add New Document"}
          </Text>
          <View className="size-6" />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName="pb-32"
        >
          {/* Document Type */}
          <View className="mt-8">
            <Text className="text-lg font-rubik-bold mb-4">Document Type</Text>
            <TextInput
              value={documentName}
              onChangeText={setDocumentName}
              placeholder="Enter document type"
              className="bg-white rounded-xl p-4 text-base font-rubik-medium"
            />
          </View>

          {/* Document Number */}
          <View className="mt-6">
            <Text className="text-lg font-rubik-bold mb-4">
              Document Number
            </Text>
            <TextInput
              value={documentNumber}
              onChangeText={setDocumentNumber}
              placeholder="Enter document number"
              className="bg-white rounded-xl p-4 text-base font-rubik-medium"
            />
          </View>

          {/* Document Image */}
          <View className="mt-6">
            <Text className="text-lg font-rubik-bold mb-4">Document Image</Text>
            <TouchableOpacity
              onPress={pickImage}
              className="bg-white rounded-xl p-4 border-2 border-dashed border-gray-300"
            >
              {image ? (
                <Image
                  source={{ uri: image }}
                  className="w-full h-48 rounded-lg"
                  resizeMode="cover"
                />
              ) : (
                <View className="items-center justify-center h-48">
                  <Image source={icons.upload} className="size-12 mb-2" />
                  <Text className="text-gray-500 font-rubik-medium">
                    Tap to upload document image
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            onPress={handleSave}
            disabled={isSaving}
            className="bg-blue-700 rounded-xl p-4 mt-8"
          >
            {isSaving ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center text-base font-rubik-medium">
                Save Document
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default DocumentForm;
