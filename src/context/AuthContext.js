import React, { createContext, useState } from "react";
import AuthService from "../services/AuthService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(AuthService.getCurrentUser());

  const login = async (username, password) => {
    const data = await AuthService.login(username, password);
    setUser(data);
    return data;
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
