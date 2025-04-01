import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  Text,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import { useDebouncedCallback } from "use-debounce";

import icons from "@/constants/icons";
import { useLocalSearchParams, router, usePathname } from "expo-router";
import { categories } from "@/constants/data";

const Search = () => {
  const path = usePathname();
  const params = useLocalSearchParams<{ query?: string; filter?: string }>();
  const [search, setSearch] = useState(params.query || "");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(
    params.filter || "All"
  );
  const searchInputRef = useRef<TextInput>(null);

  const debouncedSearch = useDebouncedCallback((text: string) => {
    router.setParams({ query: text });
  }, 500);

  useEffect(() => {
    setSearch(params.query || "");
  }, [params.query]);

  const handleSearch = (text: string) => {
    setSearch(text);
    debouncedSearch(text);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    router.setParams({ filter: category });
    setShowFilterModal(false);
  };

  const handleFilterPress = () => {
    Keyboard.dismiss();
    setShowFilterModal(true);
  };

  return (
    <>
      <View className="flex flex-row items-center justify-between w-full px-4 rounded-lg bg-accent-100 border border-primary-100 mt-5 py-2">
        <View className="flex-1 flex flex-row items-center justify-start z-50">
          <Image source={icons.search} className="size-5" />
          <TextInput
            ref={searchInputRef}
            value={search}
            onChangeText={handleSearch}
            placeholder="Search for anything"
            className="text-sm font-rubik text-black-300 ml-2 flex-1"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            blurOnSubmit={false}
            keyboardType="default"
            enablesReturnKeyAutomatically={true}
            onSubmitEditing={() => {
              Keyboard.dismiss();
            }}
            style={{ padding: 0 }}
          />
        </View>

        <TouchableOpacity onPress={handleFilterPress}>
          <Image source={icons.filter} className="size-5" />
        </TouchableOpacity>
      </View>

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowFilterModal(false)}>
          <View className="flex-1 bg-black/50 justify-end">
            <TouchableWithoutFeedback>
              <View className="bg-white rounded-t-3xl p-6">
                <View className="flex flex-row items-center justify-between mb-6">
                  <Text className="text-xl font-rubik-bold">
                    Filter by Category
                  </Text>
                  <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                    <Image source={icons.backArrow} className="size-6" />
                  </TouchableOpacity>
                </View>
                <View className="gap-4">
                  {categories.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleCategorySelect(item.category)}
                      className={`flex flex-row items-center justify-between py-3 ${
                        selectedCategory === item.category
                          ? "bg-gray-50 rounded-xl px-4"
                          : ""
                      }`}
                    >
                      <Text className="text-lg font-rubik-medium">
                        {item.title}
                      </Text>
                      {selectedCategory === item.category && (
                        <Image source={icons.star} className="size-5" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

export default Search;
