import { createContext, useContext, useState } from "react";
import { AuthAPI, ADMIN_KEY_STORAGE_KEY } from "../api/client.js";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [adminKey, setAdminKey] = useState(() => localStorage.getItem(ADMIN_KEY_STORAGE_KEY) || "");

  async function login(password) {
    await AuthAPI.login(password); // throws (rejects) if the password is wrong
    localStorage.setItem(ADMIN_KEY_STORAGE_KEY, password);
    setAdminKey(password);
  }

  function logout() {
    localStorage.removeItem(ADMIN_KEY_STORAGE_KEY);
    setAdminKey("");
  }

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated: !!adminKey, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
