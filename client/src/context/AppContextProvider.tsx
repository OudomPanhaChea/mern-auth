import { useCallback, useEffect, useState } from "react";
import { AppContext, type AppContextType } from "./AppContext";
import axios from "axios";
import { toast } from "react-toastify";

interface props {
  children: React.ReactNode;
}

interface user {
  name: string;
  email: string;
  isAccountVerified: boolean;
}

export const AppContextProvider: React.FC<props> = ({ children }) => {
  axios.defaults.withCredentials = true;

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedin, setIsLoggedin] = useState<boolean>(false);
  const [userData, setUserData] = useState<user | null>(null);

  const getUserData = useCallback(async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/data");
      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  }, [backendUrl, setUserData]);

  const getAuthState = useCallback(async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/auth/is-auth");
      if (data.success) {
        setIsLoggedin(true);
        getUserData();
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  }, [backendUrl, getUserData, setIsLoggedin]);

  useEffect(() => {
    getAuthState();
  }, [getAuthState]);

  const value: AppContextType = {
    backendUrl,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
