import { Alert, Platform, Linking } from "react-native";
import MockRazorpayCheckout from "./mockRazorpay";
import { createPurchase, getCurrentUser } from "./appwrite";

// Try to import the real Razorpay
let RazorpayCheckout;
try {
  RazorpayCheckout = require("react-native-razorpay").default;
} catch (error) {
  console.log(
    "Razorpay native module not available, using mock implementation"
  );
  RazorpayCheckout = MockRazorpayCheckout;
}

// Razorpay credentials - in a real app, these should be in environment variables
const RAZORPAY_KEY_ID = "rzp_live_5sjhpXJ1IcN65m";
const RAZORPAY_KEY_SECRET = "xoXYykT6J5GhiZZovitmhJJX";

export interface PaymentOptions {
  propertyId: string;
  propertyName: string;
  amount: number; // amount in smallest currency unit (paise for INR)
  currency?: string;
  description?: string;
  onSuccess?: (paymentId: string) => void;
  onFailure?: (error: any) => void;
}

// Function to simulate payment success for testing when Razorpay SDK is not available
const simulatePayment = async (options: any): Promise<any> => {
  console.log("Using simulated payment as Razorpay SDK is not available");

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // For testing, we'll simulate a successful payment
  // In a real app, you would integrate with the Razorpay REST API
  // or redirect to the Razorpay web payment page

  const mockPaymentId = "pay_" + Math.random().toString(36).substring(2, 15);

  return {
    razorpay_payment_id: mockPaymentId,
    razorpay_order_id: "order_" + Math.random().toString(36).substring(2, 15),
    razorpay_signature:
      "signature_" + Math.random().toString(36).substring(2, 15),
  };
};

// Function to redirect to Razorpay website for payment
const redirectToRazorpayWeb = async (options: any): Promise<any> => {
  try {
    const baseUrl = "https://checkout.razorpay.com/v1/checkout.html";

    // Create URL parameters
    const params = new URLSearchParams({
      key: options.key,
      amount: options.amount,
      name: options.name,
      description: options.description,
      prefill_email: options.prefill.email || "",
      prefill_contact: options.prefill.contact || "",
      prefill_name: options.prefill.name || "",
      theme_color: options.theme.color.replace("#", ""),
      callback_url: "yourapp://payment-callback",
    });

    const url = `${baseUrl}?${params.toString()}`;

    // Open the URL in browser
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);

      // For demonstration purposes, we'll simulate success
      // In a real app, you'd need to implement the callback handling
      return simulatePayment(options);
    } else {
      throw new Error("Cannot open Razorpay website");
    }
  } catch (error) {
    console.error("Error redirecting to Razorpay web:", error);
    throw error;
  }
};

export const initiatePayment = async ({
  propertyId,
  propertyName,
  amount,
  currency = "INR",
  description = "Property Purchase",
  onSuccess,
  onFailure,
}: PaymentOptions) => {
  try {
    // Get current user
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      Alert.alert("Error", "Please login to make a purchase");
      return {
        success: false,
        error: new Error("User not logged in"),
      };
    }

    const options = {
      description,
      image: "https://your-app-logo-url.png", // Replace with your app logo
      currency,
      key: RAZORPAY_KEY_ID,
      amount: amount.toString(),
      name: "Restate",
      prefill: {
        email: currentUser.email || "",
        contact: currentUser.prefs?.phone || "",
        name: currentUser.name || "",
      },
      theme: { color: "#3c8aff" }, // Replace with your app's primary color
    };

    // Use mock or real Razorpay based on availability
    console.log("Initiating payment with options:", options);
    const paymentData = await RazorpayCheckout.open(options);
    console.log("Payment successful:", paymentData);

    // Create purchase record in database
    const purchase = await createPurchase({
      propertyId,
      userId: currentUser.$id,
      totalPrice: amount / 100, // Convert paise to rupees (assuming INR)
      status: "paid",
    });

    if (!purchase) {
      throw new Error("Failed to create purchase record");
    }

    // Call success callback if provided
    if (onSuccess) {
      onSuccess(paymentData.razorpay_payment_id);
    }

    return {
      success: true,
      paymentId: paymentData.razorpay_payment_id,
      purchaseId: purchase.$id,
    };
  } catch (error: any) {
    console.error("Payment failed:", error);

    // Call failure callback if provided
    if (onFailure) {
      onFailure(error);
    }

    // Show error alert if it's a user cancellation
    if (error.code === "PAYMENT_CANCELLED") {
      Alert.alert("Payment Cancelled", "You cancelled the payment");
    } else {
      Alert.alert(
        "Payment Failed",
        error.message || "Something went wrong with your payment"
      );
    }

    return {
      success: false,
      error,
    };
  }
};
