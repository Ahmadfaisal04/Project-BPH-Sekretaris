import { API_BASE_URL, API_ENDPOINTS, getHeaders } from "@/config/api";

export const authService = {
  login: async (email, password) => {
    try {
      console.log("Sending login request with:", { email, password });

      const response = await fetch(API_ENDPOINTS.AUTH_LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      console.log("Response status:", response.status);

      const responseData = await response.json();
      console.log("Response data:", responseData);

      if (!response.ok || responseData.status !== "success") {
        return {
          success: false,
          error: responseData.message || "Login gagal",
        };
      } // Backend mengembalikan structure: { status, message, data: { token, user } }
      const { token, user } = responseData.data;

      console.log("Token yang diterima:", token);
      console.log("User data yang diterima:", user);

      // Simpan token di localStorage
      localStorage.setItem("token", token);
      console.log("Token disimpan ke localStorage");

      // Simpan user data di localStorage
      localStorage.setItem("user", JSON.stringify(user));
      console.log("User data disimpan ke localStorage");

      // Verifikasi penyimpanan
      const verifyToken = localStorage.getItem("token");
      const verifyUser = localStorage.getItem("user");
      console.log(
        "Verifikasi - Token tersimpan:",
        verifyToken ? "Ya" : "Tidak"
      );
      console.log("Verifikasi - User tersimpan:", verifyUser ? "Ya" : "Tidak");

      return {
        success: true,
        data: {
          token,
          user,
        },
      };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: "Terjadi kesalahan saat login. Silakan coba lagi.",
      };
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken: () => {
    return localStorage.getItem("token");
  },
  isAuthenticated: () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const isAuth = !!(token && user);
    console.log("isAuthenticated check - Token:", token ? "ada" : "tidak ada");
    console.log("isAuthenticated check - User:", user ? "ada" : "tidak ada");
    console.log("isAuthenticated result:", isAuth);
    return isAuth;
  },

  validateToken: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/surat-masuk`, {
        method: "GET",
        headers: getHeaders(),
      });

      return response.status !== 401;
    } catch (error) {
      console.error("Validate token error:", error);
      return false;
    }
  },
};
