import React, { useState } from "react";
import {
  Alert,
  Image,
  ImageSourcePropType,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Switch,
  Modal,
} from "react-native";
import { router } from "expo-router";

import { logout } from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/global-provider";
import { useNotifications } from "@/lib/notifications-provider";

import icons from "@/constants/icons";
import { settings } from "@/constants/data";

type RoutePath =
  | "/(root)/edit-profile"
  | "/(root)/my-bookings"
  | "/(root)/payments"
  | "/(root)/documents"
  | "/(root)/change-password"
  | "/(root)/connected-devices"
  | "/(root)/login-history"
  | "/(root)/security-questions"
  | "/(root)/notifications";

interface SettingsItemProp {
  icon: ImageSourcePropType;
  title: string;
  href?: RoutePath;
  textStyle?: string;
  showArrow?: boolean;
  rightComponent?: React.ReactNode;
}

const SettingsItem = ({
  icon,
  title,
  href,
  textStyle,
  showArrow = true,
  rightComponent,
}: SettingsItemProp) => {
  const content = (
    <>
      <View className="flex flex-row items-center gap-3">
        <Image source={icon} className="size-6" />
        <Text
          className={`text-lg font-rubik-medium text-black-300 ${textStyle}`}
        >
          {title}
        </Text>
      </View>

      <View className="flex flex-row items-center gap-2">
        {rightComponent}
        {showArrow && <Image source={icons.rightArrow} className="size-5" />}
      </View>
    </>
  );

  if (href) {
    return (
      <TouchableOpacity
        onPress={() => router.push(href)}
        className="flex flex-row items-center justify-between py-3"
      >
        {content}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity className="flex flex-row items-center justify-between py-3">
      {content}
    </TouchableOpacity>
  );
};

const Profile = () => {
  const { user, userType } = useGlobalContext();
  const { unreadCount } = useNotifications();
  const [notifications, setNotifications] = React.useState(true);
  const [language, setLanguage] = useState("English");
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [biometricLogin, setBiometricLogin] = useState(false);

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
  ];

  const handleLanguageSelect = (selectedLanguage: string) => {
    setLanguage(selectedLanguage);
    setShowLanguageModal(false);
    // TODO: Implement language change in the app
  };

  const handleLogout = async () => {
    const result = await logout();
    if (result) {
      Alert.alert("Success", "Logged out successfully");
    } else {
      Alert.alert("Error", "Failed to logout");
    }
  };

  const getRoleIcon = () => {
    switch (userType) {
      case "buyer":
        return icons.home;
      case "seller":
        return icons.person;
      default:
        return icons.people;
    }
  };

  const getRoleText = () => {
    switch (userType) {
      case "buyer":
        return "Property Buyer";
      case "seller":
        return "Property Seller";
      default:
        return "Guest User";
    }
  };

  const getRoleDescription = () => {
    switch (userType) {
      case "buyer":
        return "Looking to buy or rent properties";
      case "seller":
        return "Listing and selling properties";
      default:
        return "Browsing properties";
    }
  };

  return (
    <SafeAreaView className="h-full bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-32 px-7"
      >
        <View className="flex flex-row items-center justify-between mt-5">
          <Text className="text-xl font-rubik-bold">Profile</Text>
          <TouchableOpacity
            onPress={() => router.push("/(root)/notifications")}
            className="relative"
          >
            <Image source={icons.bell} className="size-5" />
            {unreadCount > 0 && (
              <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 items-center justify-center">
                <Text className="text-white text-xs font-rubik-medium">
                  {unreadCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Header */}
        {/* Profile Header */}
        <View className="flex flex-row justify-center mt-5">
          <View className="flex flex-col items-center relative mt-5">
            <Image
              source={{ uri: user?.profileImage }}
              className="size-44 relative rounded-full"
            />
            <TouchableOpacity
              onPress={() => router.push("/(root)/edit-profile")}
              className="absolute bottom-[4rem] right-2"
            >
              <Image source={icons.edit} className="size-7" />
            </TouchableOpacity>

            <Text className="text-2xl font-rubik-bold mt-2">{user?.name}</Text>
            <Text className="text-gray-500 mt-1">{user?.email}</Text>
          </View>
        </View>

        {/* User Role Section */}
        <View className="mt-6 bg-primary-50 p-4 rounded-xl">
          <View className="flex-row items-center">
            <View className="w-12 h-12 bg-primary-100 rounded-full items-center justify-center">
              <Image
                source={getRoleIcon()}
                className="w-6 h-6"
                resizeMode="contain"
              />
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-lg font-rubik-bold text-black-300">
                {getRoleText()}
              </Text>
              <Text className="text-sm font-rubik text-gray-500">
                {getRoleDescription()}
              </Text>
            </View>
          </View>
        </View>

        {/* Personal Information Section */}
        <View className="mt-10">
          <Text className="text-lg font-rubik-bold mb-4">
            Personal Information
          </Text>
          <View className="bg-gray-50 rounded-xl p-4">
            <SettingsItem
              icon={icons.person}
              title="Edit Profile"
              href="/(root)/edit-profile"
            />
            <TouchableOpacity
              onPress={() => router.push("/sign-up?switchRole=true")}
              className="flex flex-row items-center justify-between py-3"
            >
              <View className="flex flex-row items-center gap-3">
                <Image source={getRoleIcon()} className="size-6" />
                <Text className="text-lg font-rubik-medium text-black-300">
                  Change Account Type
                </Text>
              </View>
              <View className="flex flex-row items-center gap-2">
                <Image source={icons.rightArrow} className="size-5" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Account Settings Section */}
        <View className="mt-6">
          <Text className="text-lg font-rubik-bold mb-4">Account Settings</Text>
          <View className="bg-gray-50 rounded-xl p-4">
            <SettingsItem
              icon={icons.calendar}
              title="My Bookings"
              href="/(root)/my-bookings"
            />
            <SettingsItem
              icon={icons.wallet}
              title="Payments"
              href="/(root)/payments"
            />
            <SettingsItem
              icon={icons.info}
              title="Documents"
              href="/(root)/documents"
            />
            <SettingsItem
              icon={icons.shield}
              title="Change Password"
              href="/(root)/change-password"
            />
          </View>
        </View>

        {/* Preferences Section */}
        <View className="mt-6">
          <Text className="text-lg font-rubik-bold mb-4">Preferences</Text>
          <View className="bg-gray-50 rounded-xl p-4">
            <TouchableOpacity
              onPress={() => setShowLanguageModal(true)}
              className="flex flex-row items-center justify-between py-3"
            >
              <View className="flex flex-row items-center gap-3">
                <Image source={icons.language} className="size-6" />
                <Text className="text-lg font-rubik-medium text-black-300">
                  Language
                </Text>
              </View>
              <View className="flex flex-row items-center gap-2">
                <Text className="text-gray-500">{language}</Text>
                <Image source={icons.rightArrow} className="size-5" />
              </View>
            </TouchableOpacity>
            <View className="flex flex-row items-center justify-between py-3">
              <View className="flex flex-row items-center gap-3">
                <Image source={icons.bell} className="size-6" />
                <Text className="text-lg font-rubik-medium text-black-300">
                  Push Notifications
                </Text>
              </View>
              <Switch
                value={pushNotifications}
                onValueChange={setPushNotifications}
                trackColor={{ false: "#767676", true: "#81b0ff" }}
                thumbColor={pushNotifications ? "#007AFF" : "#f4f3f4"}
              />
            </View>
            <View className="flex flex-row items-center justify-between py-3">
              <View className="flex flex-row items-center gap-3">
                <Image source={icons.send} className="size-6" />
                <Text className="text-lg font-rubik-medium text-black-300">
                  Email Notifications
                </Text>
              </View>
              <Switch
                value={emailNotifications}
                onValueChange={setEmailNotifications}
                trackColor={{ false: "#767676", true: "#81b0ff" }}
                thumbColor={emailNotifications ? "#007AFF" : "#f4f3f4"}
              />
            </View>
          </View>
        </View>

        {/* Security Section */}
        <View className="mt-6">
          <Text className="text-lg font-rubik-bold mb-4">Security</Text>
          <View className="bg-gray-50 rounded-xl p-4">
            <View className="flex flex-row items-center justify-between py-3">
              <View className="flex flex-row items-center gap-3">
                <Image source={icons.shield} className="size-6" />
                <Text className="text-lg font-rubik-medium text-black-300">
                  Two-Factor Authentication
                </Text>
              </View>
              <Switch
                value={twoFactorAuth}
                onValueChange={setTwoFactorAuth}
                trackColor={{ false: "#767676", true: "#81b0ff" }}
                thumbColor={twoFactorAuth ? "#007AFF" : "#f4f3f4"}
              />
            </View>
            <View className="flex flex-row items-center justify-between py-3">
              <View className="flex flex-row items-center gap-3">
                <Image source={icons.person} className="size-6" />
                <Text className="text-lg font-rubik-medium text-black-300">
                  Biometric Login
                </Text>
              </View>
              <Switch
                value={biometricLogin}
                onValueChange={setBiometricLogin}
                trackColor={{ false: "#767676", true: "#81b0ff" }}
                thumbColor={biometricLogin ? "#007AFF" : "#f4f3f4"}
              />
            </View>
            <SettingsItem
              icon={icons.people}
              title="Connected Devices"
              href="/(root)/connected-devices"
              showArrow={true}
            />
            <SettingsItem
              icon={icons.shield}
              title="Login History"
              href="/(root)/login-history"
              showArrow={true}
            />
            <SettingsItem
              icon={icons.info}
              title="Security Questions"
              href="/(root)/security-questions"
              showArrow={true}
            />
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          className="mt-8 bg-red-50 py-4 rounded-xl flex-row items-center justify-center gap-2"
        >
          <Image source={icons.logout} className="size-5" />
          <Text className="text-danger text-lg font-rubik-medium">Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6">
            <View className="flex flex-row items-center justify-between mb-6">
              <Text className="text-xl font-rubik-bold">Select Language</Text>
              <TouchableOpacity onPress={() => setShowLanguageModal(false)}>
                <Image
                  source={icons.rightArrow}
                  className="size-6 rotate-180"
                />
              </TouchableOpacity>
            </View>
            <View className="gap-4">
              {languages.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  onPress={() => handleLanguageSelect(lang.name)}
                  className={`flex flex-row items-center justify-between py-3 ${
                    language === lang.name ? "bg-gray-50 rounded-xl px-4" : ""
                  }`}
                >
                  <Text className="text-lg font-rubik-medium">{lang.name}</Text>
                  {language === lang.name && (
                    <Image source={icons.rightArrow} className="size-5" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Profile;
