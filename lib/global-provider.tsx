import React, {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { Redirect } from "expo-router";
import { getCurrentUser, login } from "./appwrite";
import { useAppwrite } from "./useAppwrite";
import { Models } from "appwrite";
import { useRouter } from "expo-router";

export type UserType = "buyer" | "seller" | "guest";

interface GlobalContextType {
  isLoading: boolean;
  user: Models.User<Models.Preferences> | null;
  userType: UserType;
  isAuthenticated: boolean;
  setUser: (user: Models.User<Models.Preferences> | null) => void;
  setUserType: (type: UserType) => void;
  setIsAuthenticated: (authenticated: boolean) => void;
  checkUser: () => Promise<void>;
  handleLogin: () => Promise<boolean>;
}

interface User {
  $id: string;
  name: string;
  email: string;
  avatar: string;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

interface GlobalProviderProps {
  children: ReactNode;
}

export const GlobalProvider = ({ children }: GlobalProviderProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
    null
  );
  const [userType, setUserType] = useState<UserType>("guest");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
        const userType = currentUser.prefs?.userType || "guest";
        setUserType(userType as UserType);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setUserType("guest");
        router.replace("/sign-in");
      }
    } catch (error) {
      console.error("Error checking user:", error);
      setUser(null);
      setIsAuthenticated(false);
      setUserType("guest");
      router.replace("/sign-in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const currentUser = await login();
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
        const userType = currentUser.prefs?.userType || "guest";
        setUserType(userType as UserType);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    isLoading,
    user,
    userType,
    isAuthenticated,
    setUser,
    setUserType,
    setIsAuthenticated,
    checkUser,
    handleLogin,
  };

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};

export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (!context)
    throw new Error("useGlobalContext must be used within a GlobalProvider");

  return context;
};

export default GlobalProvider;
