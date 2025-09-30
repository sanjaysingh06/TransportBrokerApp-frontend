// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import AuthService from "../services/AuthService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(AuthService.getCurrentUser());

  // Keep user in sync with localStorage changes
  useEffect(() => {
    const storedUser = AuthService.getCurrentUser();
    if (storedUser) setUser(storedUser);
  }, []);

  const login = async (username, password) => {
    try {
      const data = await AuthService.login(username, password);
      if (data?.access) {
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
      }
      return data;
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    AuthService.logout();
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
