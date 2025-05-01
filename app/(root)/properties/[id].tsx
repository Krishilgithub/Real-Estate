import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Platform,
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";

import icons from "@/constants/icons";
import images from "@/constants/images";
import Comment from "@/components/Comment";
import { facilities } from "@/constants/data";
import { useGlobalContext } from "@/lib/global-provider";

import { useAppwrite } from "@/lib/useAppwrite";
import { getPropertyById, createBooking, createPurchase } from "@/lib/appwrite";
import { initiatePayment } from "@/lib/razorpay";

const Property = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { user, userType } = useGlobalContext();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isBooking, setIsBooking] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDateType, setSelectedDateType] = useState<"start" | "end">(
    "start"
  );

  const windowHeight = Dimensions.get("window").height;

  const { data: property } = useAppwrite({
    fn: getPropertyById,
    params: {
      id: id!,
    },
  });

  const handleBookNow = async () => {
    if (!user) {
      Alert.alert(
        "Authentication Required",
        "Please sign in to book this property",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Sign In",
            onPress: () => router.push("/sign-in"),
          },
        ]
      );
      return;
    }

    if (userType !== "buyer") {
      Alert.alert(
        "Invalid User Type",
        "Only buyers can book properties. Please switch to a buyer account.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Switch Account",
            onPress: () => router.push("/sign-up?switchRole=true"),
          },
        ]
      );
      return;
    }

    // Set initial dates when opening modal
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

    setStartDate(tomorrow);
    setEndDate(dayAfterTomorrow);
    setShowBookingModal(true);
  };

  const handleBuyNow = async () => {
    if (!user) {
      Alert.alert(
        "Authentication Required",
        "Please sign in to purchase this property",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Sign In",
            onPress: () => router.push("/sign-in"),
          },
        ]
      );
      return;
    }

    if (!property) {
      Alert.alert("Error", "Property information not found");
      return;
    }

    if (userType !== "buyer") {
      Alert.alert(
        "Invalid User Type",
        "Only buyers can purchase properties. Please switch to a buyer account.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Switch Account",
            onPress: () => router.push("/sign-up?switchRole=true"),
          },
        ]
      );
      return;
    }

    try {
      setIsBooking(true);

      // Convert price to paise (smallest unit for INR) - assuming price is in dollars/rupees
      const amountInPaise = Math.round(property.price * 100);

      const result = await initiatePayment({
        propertyId: property.$id,
        propertyName: property.name,
        amount: amountInPaise,
        description: `Purchase of ${property.name}`,
        onSuccess: (paymentId) => {
          Alert.alert(
            "Payment Successful",
            `Your payment for ${property.name} was successful! Payment ID: ${paymentId}`,
            [
              {
                text: "View Purchases",
                onPress: () => {
                  router.push("/(root)/my-bookings");
                },
              },
              {
                text: "OK",
              },
            ]
          );
        },
        onFailure: (error) => {
          console.error("Payment error:", error);
          Alert.alert(
            "Payment Failed",
            "Your payment could not be processed. Please try again."
          );
        },
      });

      if (!result || !result.success) {
        throw new Error("Payment was not completed");
      }
    } catch (error) {
      console.error("Purchase error:", error);
      if (
        error instanceof Error &&
        error.message.includes("missing scope (account)")
      ) {
        Alert.alert(
          "Authentication Error",
          "Your session has expired. Please sign in again.",
          [
            {
              text: "Sign In",
              onPress: () => {
                router.push("/sign-in");
              },
            },
            {
              text: "Cancel",
              style: "cancel",
            },
          ]
        );
      } else if (
        error instanceof Error &&
        !error.message.includes("PAYMENT_CANCELLED")
      ) {
        // Don't show error for cancelled payments as Razorpay already shows an alert
        Alert.alert("Error", "Failed to process payment. Please try again.");
      }
    } finally {
      setIsBooking(false);
    }
  };

  const handleDateSelect = (date: Date) => {
    if (selectedDateType === "start") {
      setStartDate(date);
      // If end date is before new start date, update it
      if (endDate < date) {
        const newEndDate = new Date(date);
        newEndDate.setDate(newEndDate.getDate() + 1);
        setEndDate(newEndDate);
      }
    } else {
      setEndDate(date);
    }
    setShowDatePicker(false);
  };

  const handleConfirmBooking = async () => {
    if (!property || !user) {
      Alert.alert(
        "Authentication Error",
        "Your session has expired. Please sign in again.",
        [
          {
            text: "Sign In",
            onPress: () => {
              setShowBookingModal(false);
              router.push("/sign-in");
            },
          },
          {
            text: "Cancel",
            style: "cancel",
          },
        ]
      );
      return;
    }

    // Validate dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);

    if (start < today) {
      Alert.alert("Invalid Date", "Check-in date cannot be in the past");
      return;
    }

    if (end <= start) {
      Alert.alert("Invalid Date", "Check-out date must be after check-in date");
      return;
    }

    try {
      setIsBooking(true);
      setShowBookingModal(false); // Close modal before initiating payment

      // Convert price to paise (smallest unit for INR)
      const amountInPaise = Math.round(property.price * 100);

      const result = await initiatePayment({
        propertyId: property.$id,
        propertyName: property.name,
        amount: amountInPaise,
        description: `Booking of ${property.name} from ${formatDate(
          startDate
        )} to ${formatDate(endDate)}`,
        onSuccess: async (paymentId) => {
          // Create booking record after successful payment
          try {
            const booking = await createBooking({
              propertyId: property.$id,
              userId: user.$id,
              startDate: startDate.toISOString(),
              endDate: endDate.toISOString(),
              totalPrice: property.price,
              status: "confirmed", // Status confirmed since payment is already made
            });

            if (booking) {
              Alert.alert(
                "Booking Confirmed",
                `Your booking for ${property.name} was successful!`,
                [
                  {
                    text: "View Bookings",
                    onPress: () => {
                      router.push("/(root)/my-bookings");
                    },
                  },
                  {
                    text: "OK",
                  },
                ]
              );
            }
          } catch (error) {
            console.error("Create booking record error:", error);
            Alert.alert(
              "Warning",
              "Payment was successful, but we had trouble creating your booking record. Please contact support."
            );
          }
        },
        onFailure: (error) => {
          console.error("Payment error:", error);
          Alert.alert(
            "Payment Failed",
            "Your payment could not be processed. Please try again."
          );
        },
      });

      if (!result || !result.success) {
        throw new Error("Payment was not completed");
      }
    } catch (error) {
      console.error("Booking error:", error);
      if (
        error instanceof Error &&
        error.message.includes("missing scope (account)")
      ) {
        Alert.alert(
          "Authentication Error",
          "Your session has expired. Please sign in again.",
          [
            {
              text: "Sign In",
              onPress: () => {
                router.push("/sign-in");
              },
            },
            {
              text: "Cancel",
              style: "cancel",
            },
          ]
        );
      } else if (
        error instanceof Error &&
        !error.message.includes("PAYMENT_CANCELLED")
      ) {
        // Don't show error for cancelled payments as Razorpay already shows an alert
        Alert.alert("Error", "Failed to process payment. Please try again.");
      }
    } finally {
      setIsBooking(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-32 bg-white"
      >
        <View className="relative w-full" style={{ height: windowHeight / 2 }}>
          <Image
            source={{ uri: property?.image }}
            className="size-full"
            resizeMode="cover"
          />
          <Image
            source={images.whiteGradient}
            className="absolute top-0 w-full z-40"
          />

          <View
            className="z-50 absolute inset-x-7"
            style={{
              top: Platform.OS === "ios" ? 70 : 20,
            }}
          >
            <View className="flex flex-row items-center w-full justify-between">
              <TouchableOpacity
                onPress={() => router.back()}
                className="flex flex-row bg-primary-200 rounded-full size-11 items-center justify-center"
              >
                <Image source={icons.backArrow} className="size-5" />
              </TouchableOpacity>

              <View className="flex flex-row items-center gap-3">
                <Image
                  source={icons.heart}
                  className="size-7"
                  tintColor={"#191D31"}
                />
                <Image source={icons.send} className="size-7" />
              </View>
            </View>
          </View>
        </View>

        <View className="px-5 mt-7 flex gap-2">
          <Text className="text-2xl font-rubik-extrabold">
            {property?.name}
          </Text>

          <View className="flex flex-row items-center gap-3">
            <View className="flex flex-row items-center px-4 py-2 bg-primary-100 rounded-full">
              <Text className="text-xs font-rubik-bold text-primary-300">
                {property?.type}
              </Text>
            </View>

            <View className="flex flex-row items-center gap-2">
              <Image source={icons.star} className="size-5" />
              <Text className="text-black-200 text-sm mt-1 font-rubik-medium">
                {property?.rating} ({property?.reviews.length} reviews)
              </Text>
            </View>
          </View>

          <View className="flex flex-row items-center mt-5">
            <View className="flex flex-row items-center justify-center bg-primary-100 rounded-full size-10">
              <Image source={icons.bed} className="size-4" />
            </View>
            <Text className="text-black-300 text-sm font-rubik-medium ml-2">
              {property?.bedrooms} Beds
            </Text>
            <View className="flex flex-row items-center justify-center bg-primary-100 rounded-full size-10 ml-7">
              <Image source={icons.bath} className="size-4" />
            </View>
            <Text className="text-black-300 text-sm font-rubik-medium ml-2">
              {property?.bathrooms} Baths
            </Text>
            <View className="flex flex-row items-center justify-center bg-primary-100 rounded-full size-10 ml-7">
              <Image source={icons.area} className="size-4" />
            </View>
            <Text className="text-black-300 text-sm font-rubik-medium ml-2">
              {property?.area} sqft
            </Text>
          </View>

          <View className="w-full border-t border-primary-200 pt-7 mt-5">
            <Text className="text-black-300 text-xl font-rubik-bold">
              Agent
            </Text>

            <View className="flex flex-row items-center justify-between mt-4">
              <View className="flex flex-row items-center">
                <Image
                  source={{ uri: property?.agent.avatar }}
                  className="size-14 rounded-full"
                />

                <View className="flex flex-col items-start justify-center ml-3">
                  <Text className="text-lg text-black-300 text-start font-rubik-bold">
                    {property?.agent.name}
                  </Text>
                  <Text className="text-sm text-black-200 text-start font-rubik-medium">
                    {property?.agent.email}
                  </Text>
                </View>
              </View>

              <View className="flex flex-row items-center gap-3">
                <Image source={icons.chat} className="size-7" />
                <Image source={icons.phone} className="size-7" />
              </View>
            </View>
          </View>

          <View className="mt-7">
            <Text className="text-black-300 text-xl font-rubik-bold">
              Overview
            </Text>
            <Text className="text-black-200 text-base font-rubik mt-2">
              {property?.description}
            </Text>
          </View>

          <View className="mt-7">
            <Text className="text-black-300 text-xl font-rubik-bold">
              Facilities
            </Text>

            {property?.facilities.length > 0 && (
              <View className="flex flex-row flex-wrap items-start justify-start mt-2 gap-5">
                {property?.facilities.map((item: string, index: number) => {
                  const facility = facilities.find(
                    (facility) => facility.title === item
                  );

                  return (
                    <View
                      key={index}
                      className="flex flex-1 flex-col items-center min-w-16 max-w-20"
                    >
                      <View className="size-14 bg-primary-100 rounded-full flex items-center justify-center">
                        <Image
                          source={facility ? facility.icon : icons.info}
                          className="size-6"
                        />
                      </View>

                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        className="text-black-300 text-sm text-center font-rubik mt-1.5"
                      >
                        {item}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}
          </View>

          {property?.gallery.length > 0 && (
            <View className="mt-7">
              <Text className="text-black-300 text-xl font-rubik-bold">
                Gallery
              </Text>
              <FlatList
                contentContainerStyle={{ paddingRight: 20 }}
                data={property?.gallery}
                keyExtractor={(item) => item.$id}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <Image
                    source={{ uri: item.image }}
                    className="size-40 rounded-xl"
                  />
                )}
                contentContainerClassName="flex gap-4 mt-3"
              />
            </View>
          )}

          <View className="mt-7">
            <Text className="text-black-300 text-xl font-rubik-bold">
              Location
            </Text>
            <View className="flex flex-row items-center justify-start mt-4 gap-2">
              <Image source={icons.location} className="w-7 h-7" />
              <Text className="text-black-200 text-sm font-rubik-medium">
                {property?.address}
              </Text>
            </View>

            <Image
              source={images.map}
              className="h-52 w-full mt-5 rounded-xl"
            />
          </View>

          {property?.reviews.length > 0 && (
            <View className="mt-7">
              <View className="flex flex-row items-center justify-between">
                <View className="flex flex-row items-center">
                  <Image source={icons.star} className="size-6" />
                  <Text className="text-black-300 text-xl font-rubik-bold ml-2">
                    {property?.rating} ({property?.reviews.length} reviews)
                  </Text>
                </View>

                <TouchableOpacity>
                  <Text className="text-primary-300 text-base font-rubik-bold">
                    View All
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="mt-5">
                <Comment item={property?.reviews[0]} />
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <View className="absolute bg-white bottom-0 w-full rounded-t-2xl border-t border-r border-l border-primary-200 p-7">
        <View className="flex flex-row items-center justify-between gap-10">
          <View className="flex flex-col items-start">
            <Text className="text-black-200 text-xs font-rubik-medium">
              Price
            </Text>
            <Text
              numberOfLines={1}
              className="text-primary-300 text-start text-2xl font-rubik-bold"
            >
              ${property?.price}
            </Text>
          </View>

          {userType === "buyer" ? (
            <TouchableOpacity
              onPress={handleBuyNow}
              disabled={isBooking}
              className="flex-1 flex flex-row items-center justify-center bg-primary-300 py-3 rounded-full shadow-md shadow-zinc-400"
            >
              {isBooking ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white text-lg text-center font-rubik-bold">
                  Buy Now
                </Text>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleBookNow}
              disabled={isBooking}
              className="flex-1 flex flex-row items-center justify-center bg-primary-300 py-3 rounded-full shadow-md shadow-zinc-400"
            >
              {isBooking ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white text-lg text-center font-rubik-bold">
                  Book Now
                </Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Booking Modal */}
      <Modal
        visible={showBookingModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowBookingModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6">
            <View className="flex flex-row items-center justify-between mb-6">
              <Text className="text-xl font-rubik-bold">Book Property</Text>
              <TouchableOpacity onPress={() => setShowBookingModal(false)}>
                <Image source={icons.backArrow} className="size-6" />
              </TouchableOpacity>
            </View>

            <View className="space-y-4">
              <View>
                <Text className="text-base font-rubik-medium text-black-300 mb-2">
                  Check-in Date
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedDateType("start");
                    setShowDatePicker(true);
                  }}
                  className="flex flex-row items-center justify-between bg-gray-50 p-4 rounded-xl"
                >
                  <Text className="text-black-300 font-rubik">
                    {formatDate(startDate)}
                  </Text>
                  <Image source={icons.calendar} className="size-5" />
                </TouchableOpacity>
              </View>

              <View>
                <Text className="text-base font-rubik-medium text-black-300 mb-2">
                  Check-out Date
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedDateType("end");
                    setShowDatePicker(true);
                  }}
                  className="flex flex-row items-center justify-between bg-gray-50 p-4 rounded-xl"
                >
                  <Text className="text-black-300 font-rubik">
                    {formatDate(endDate)}
                  </Text>
                  <Image source={icons.calendar} className="size-5" />
                </TouchableOpacity>
              </View>

              <View className="flex flex-row items-center justify-between bg-gray-50 p-4 rounded-xl mt-4">
                <Text className="text-base font-rubik-medium text-black-300">
                  Total Price
                </Text>
                <Text className="text-xl font-rubik-bold text-primary-300">
                  ${property?.price}
                </Text>
              </View>

              <TouchableOpacity
                onPress={handleConfirmBooking}
                disabled={isBooking}
                className={`mt-6 bg-primary-300 py-4 rounded-xl ${
                  isBooking ? "opacity-50" : ""
                }`}
              >
                <View className="flex flex-row items-center justify-center">
                  {isBooking ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="text-white text-lg font-rubik-bold">
                      Confirm Booking
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Date Selection Modal */}
      <Modal
        visible={showDatePicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6 max-h-[80%]">
            <View className="flex flex-row items-center justify-between mb-6">
              <Text className="text-xl font-rubik-bold">
                Select {selectedDateType === "start" ? "Check-in" : "Check-out"}{" "}
                Date
              </Text>
              <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                <Image source={icons.backArrow} className="size-6" />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerClassName="pb-4"
            >
              <View className="space-y-4">
                {Array.from({ length: 30 }, (_, i) => {
                  const date = new Date();
                  date.setDate(date.getDate() + i + 1);
                  const isSelected =
                    selectedDateType === "start"
                      ? date.getTime() === startDate.getTime()
                      : date.getTime() === endDate.getTime();
                  const isDisabled =
                    selectedDateType === "end" && date <= startDate;

                  return (
                    <TouchableOpacity
                      key={i}
                      onPress={() => handleDateSelect(date)}
                      disabled={isDisabled}
                      className={`flex flex-row items-center justify-between p-4 rounded-xl ${
                        isSelected ? "bg-primary-100" : "bg-gray-50"
                      } ${isDisabled ? "opacity-50" : ""}`}
                    >
                      <Text
                        className={`font-rubik ${
                          isSelected ? "text-primary-300" : "text-black-300"
                        }`}
                      >
                        {formatDate(date)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Property;
