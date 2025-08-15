"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { authService } from "@/services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    console.log("AuthContext init - Token:", token ? "ada" : "tidak ada");
    console.log("AuthContext init - User:", savedUser ? "ada" : "tidak ada");

    if (token && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        console.log("User berhasil di-load dari localStorage:", parsedUser);
      } catch (error) {
        console.error("Error parsing user dari localStorage:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);
  const login = async (email, password) => {
    try {
      console.log("AuthContext - Mencoba login dengan:", { email });
      const result = await authService.login(email, password);

      console.log("AuthContext - Hasil login:", result);

      if (result.success) {
        // Token sudah disimpan di authService
        const userData = result.data.user;
        setUser(userData);

        console.log("AuthContext - User data set:", userData);
        console.log(
          "AuthContext - Token tersimpan:",
          localStorage.getItem("token") ? "Ya" : "Tidak"
        );

        return { success: true };
      }

      return {
        success: false,
        error: result.error || "Email atau password tidak valid",
      };
    } catch (error) {
      console.error("Login error di AuthContext:", error);
      return {
        success: false,
        error: "Terjadi kesalahan saat login. Silakan coba lagi.",
      };
    }
  };
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/");
  };

  const value = {
    user,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
