import {
  Client,
  Account,
  ID,
  Databases,
  OAuthProvider,
  Avatars,
  Query,
  Storage,
} from "react-native-appwrite";
import * as Linking from "expo-linking";
import { openAuthSessionAsync } from "expo-web-browser";

export const config = {
  platform: "com.jsm.restate",
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
  galleriesCollectionId:
    process.env.EXPO_PUBLIC_APPWRITE_GALLERIES_COLLECTION_ID,
  reviewsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID,
  agentsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_AGENTS_COLLECTION_ID,
  propertiesCollectionId:
    process.env.EXPO_PUBLIC_APPWRITE_PROPERTIES_COLLECTION_ID,
  bookingsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_BOOKINGS_COLLECTION_ID,
  bucketId: process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID,
  usersCollectionId: process.env.EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID,
};

export const client = new Client();
client
  .setEndpoint(config.endpoint!)
  .setProject(config.projectId!)
  .setPlatform(config.platform!);

export const avatar = new Avatars(client);
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export async function login() {
  try {
    const redirectUri = Linking.createURL("/");

    const response = await account.createOAuth2Token(
      OAuthProvider.Google,
      redirectUri
    );
    if (!response) throw new Error("Create OAuth2 token failed");

    const browserResult = await openAuthSessionAsync(
      response.toString(),
      redirectUri
    );
    if (browserResult.type !== "success")
      throw new Error("Create OAuth2 token failed");

    const url = new URL(browserResult.url);
    const secret = url.searchParams.get("secret")?.toString();
    const userId = url.searchParams.get("userId")?.toString();
    if (!secret || !userId) throw new Error("Create OAuth2 token failed");

    const session = await account.createSession(userId, secret);
    if (!session) throw new Error("Failed to create session");

    // Get the current user after session creation
    const currentUser = await account.get();
    if (!currentUser.$id) throw new Error("Failed to verify user session");

    // Set default user type if not set
    if (!currentUser.prefs?.userType) {
      await account.updatePrefs({
        userType: "guest",
      });
    }

    return currentUser;
  } catch (error) {
    console.error("Login error:", error);
    return null;
  }
}

export async function logout() {
  try {
    // First check if we have a valid session
    const session = await account.getSession("current");
    if (!session) {
      return true; // Already logged out
    }

    // Only try to delete session if we have one
    await account.deleteSession("current");
    return true;
  } catch (error) {
    console.error("Logout error:", error);
    // For guest users or missing scope, consider it a successful logout
    if (
      error instanceof Error &&
      (error.message.includes("User (role: guests) missing scope (account)") ||
        error.message.includes("missing scope (account)"))
    ) {
      return true;
    }
    return false;
  }
}

export const getCurrentUser = async () => {
  try {
    // First check if we have a valid session
    const session = await account.getSession("current");
    if (!session) {
      return null;
    }

    const currentUser = await account.get();
    if (!currentUser) {
      return null;
    }
    return currentUser;
  } catch (error) {
    console.error("Error getting current user:", error);
    // For guest users or missing scope, just return null without throwing
    if (
      error instanceof Error &&
      (error.message.includes("User (role: guests) missing scope (account)") ||
        error.message.includes("missing scope (account)"))
    ) {
      return null;
    }
    return null;
  }
};

export async function getLatestProperties() {
  try {
    const result = await databases.listDocuments(
      config.databaseId!,
      config.propertiesCollectionId!,
      [Query.orderAsc("$createdAt"), Query.limit(5)]
    );

    return result.documents;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getProperties({
  filter,
  query,
  limit,
}: {
  filter: string;
  query: string;
  limit?: number;
}) {
  try {
    const buildQuery = [Query.orderDesc("$createdAt")];

    if (filter && filter !== "All")
      buildQuery.push(Query.equal("type", filter));

    if (query)
      buildQuery.push(
        Query.or([
          Query.search("name", query),
          Query.search("address", query),
          Query.search("type", query),
        ])
      );

    if (limit) buildQuery.push(Query.limit(limit));

    const result = await databases.listDocuments(
      config.databaseId!,
      config.propertiesCollectionId!,
      buildQuery
    );

    return result.documents;
  } catch (error) {
    console.error(error);
    return [];
  }
}

// write function to get property by id
export async function getPropertyById({ id }: { id: string }) {
  try {
    const result = await databases.getDocument(
      config.databaseId!,
      config.propertiesCollectionId!,
      id
    );
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function createBooking({
  propertyId,
  userId,
  startDate,
  endDate,
  totalPrice,
  status,
}: {
  propertyId: string;
  userId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
}) {
  try {
    if (!config.bookingsCollectionId) {
      throw new Error("Bookings collection ID is not configured");
    }

    const result = await databases.createDocument(
      config.databaseId!,
      config.bookingsCollectionId,
      ID.unique(),
      {
        propertyId,
        userId,
        startDate,
        endDate,
        totalPrice,
        status,
        createdAt: new Date().toISOString(),
      }
    );
    return result;
  } catch (error) {
    console.error("Create booking error:", error);
    if (error instanceof Error) {
      if (
        error.message.includes('Missing required parameter: "collectionId"')
      ) {
        console.error(
          "Bookings collection ID is not configured in environment variables"
        );
      } else if (error.message.includes("Invalid document structure")) {
        console.error(
          "Bookings collection schema is not properly configured. Please check the collection attributes in Appwrite."
        );
      }
    }
    return null;
  }
}

export async function createPurchase({
  propertyId,
  userId,
  totalPrice,
  status,
}: {
  propertyId: string;
  userId: string;
  totalPrice: number;
  status: string;
}) {
  try {
    if (!config.bookingsCollectionId) {
      throw new Error("Purchases collection ID is not configured");
    }

    const result = await databases.createDocument(
      config.databaseId!,
      config.bookingsCollectionId,
      ID.unique(),
      {
        propertyId,
        userId,
        totalPrice,
        status,
        createdAt: new Date().toISOString(),
      }
    );
    return result;
  } catch (error) {
    console.error("Create purchase error:", error);
    if (error instanceof Error) {
      if (
        error.message.includes('Missing required parameter: "collectionId"')
      ) {
        console.error(
          "Purchases collection ID is not configured in environment variables"
        );
      } else if (error.message.includes("Invalid document structure")) {
        console.error(
          "Purchases collection schema is not properly configured. Please check the collection attributes in Appwrite."
        );
      }
    }
    return null;
  }
}

export async function updatePassword(newPassword: string) {
  try {
    await account.updatePassword(newPassword);
    return true;
  } catch (error) {
    console.error("Update password error:", error);
    return false;
  }
}

export async function updateProfile({
  name,
  phone,
  address,
}: {
  name: string;
  phone?: string;
  address?: string;
}) {
  try {
    const result = await account.updateName(name);
    if (phone) {
      await account.updatePrefs({ phone });
    }
    if (address) {
      await account.updatePrefs({ address });
    }
    return result;
  } catch (error) {
    console.error("Update profile error:", error);
    return null;
  }
}

export async function uploadProfileImage(imageUri: string) {
  try {
    const response = await fetch(imageUri);
    const blob = await response.blob();

    const file = await storage.createFile(config.bucketId!, ID.unique(), blob);

    // Get the file URL
    const fileUrl = storage.getFileView(config.bucketId!, file.$id);

    // Get current user
    const currentUser = await account.get();

    // Update the user's profileImage in the database
    await databases.updateDocument(
      config.databaseId!,
      config.usersCollectionId!,
      currentUser.$id,
      {
        profileImage: fileUrl,
      }
    );

    return fileUrl;
  } catch (error) {
    console.error("Upload profile image error:", error);
    return null;
  }
}
