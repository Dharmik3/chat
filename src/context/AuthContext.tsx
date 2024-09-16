import React, { createContext, useState, ReactNode } from "react";
import { User } from "../types";

interface AuthContextProps {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  setUser: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // store user from local storage if it's available else null
  const [user, setUser] =
    useState<User | null>(JSON.parse(localStorage.getItem("user") as string)) ||
    null;

  // remove user from localstorage and set null
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
