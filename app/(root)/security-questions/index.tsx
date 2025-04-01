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
  Modal,
} from "react-native";
import { router } from "expo-router";

import icons from "@/constants/icons";

interface SecurityQuestion {
  id: number;
  question: string;
  answer: string;
}

const SecurityQuestions = () => {
  const [questions, setQuestions] = useState<SecurityQuestion[]>([
    {
      id: 1,
      question: "What was your first pet's name?",
      answer: "Max",
    },
    {
      id: 2,
      question: "In which city were you born?",
      answer: "New York",
    },
    {
      id: 3,
      question: "What is your mother's maiden name?",
      answer: "Smith",
    },
  ]);

  const [editingQuestion, setEditingQuestion] =
    useState<SecurityQuestion | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newAnswer, setNewAnswer] = useState("");

  const handleEdit = (question: SecurityQuestion) => {
    setEditingQuestion(question);
    setNewAnswer(question.answer);
    setIsModalVisible(true);
  };

  const handleSave = () => {
    if (!editingQuestion || !newAnswer.trim()) return;

    setQuestions(
      questions.map((q) =>
        q.id === editingQuestion.id ? { ...q, answer: newAnswer.trim() } : q
      )
    );

    setIsModalVisible(false);
    setEditingQuestion(null);
    setNewAnswer("");
    Alert.alert("Success", "Security question updated successfully");
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingQuestion(null);
    setNewAnswer("");
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
          <Text className="text-xl font-rubik-bold">Security Questions</Text>
        </View>

        {/* Security Questions List */}
        <View className="mt-8">
          {questions.map((question) => (
            <View
              key={question.id}
              className="bg-white rounded-xl p-4 mb-4 shadow-sm"
            >
              <View className="flex flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-lg font-rubik-medium">
                    {question.question}
                  </Text>
                  <Text className="text-gray-500 mt-1">
                    {question.answer.replace(/./g, "•")}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleEdit(question)}
                  className="ml-4"
                >
                  <Image source={icons.edit} className="size-5" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Edit Modal */}
        <Modal
          visible={isModalVisible}
          transparent
          animationType="fade"
          onRequestClose={handleCancel}
        >
          <View className="flex-1 bg-black/50 justify-center items-center px-6">
            <View className="bg-white w-full rounded-xl p-6">
              <Text className="text-xl font-rubik-bold mb-4">
                Edit Security Question
              </Text>
              <Text className="text-gray-600 mb-4">
                {editingQuestion?.question}
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 mb-4 font-rubik-medium"
                placeholder="Enter your answer"
                value={newAnswer}
                onChangeText={setNewAnswer}
                autoCapitalize="words"
              />
              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={handleCancel}
                  className="flex-1 bg-gray-200 py-3 rounded-lg"
                >
                  <Text className="text-center text-gray-700 font-rubik-medium">
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSave}
                  className="flex-1 bg-primary py-3 rounded-lg"
                >
                  <Text className="text-center text-white font-rubik-medium">
                    Save
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SecurityQuestions;
