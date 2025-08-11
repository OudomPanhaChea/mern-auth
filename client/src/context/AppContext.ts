import { createContext } from "react";

export interface AppContextType {
  backendUrl: string;
  isLoggedin: boolean;
  setIsLoggedin: React.Dispatch<React.SetStateAction<boolean>>;
  userData: user | null;
  setUserData: React.Dispatch<React.SetStateAction<user | null>>;
  getUserData: () => Promise<void>;
}

interface user {
  name: string;
  email: string;
  isAccountVerified: boolean;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);
