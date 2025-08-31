"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  CircularProgress,
  Paper,
  Avatar,
  CardContent,
} from "@mui/material";
import {
  AccountCircle,
} from "@mui/icons-material";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const router = useRouter();

  // Cek apakah user sudah login, jika ya redirect ke dashboard
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");

      if (token && user) {
        console.log("User sudah login, mengarahkan ke dashboard");
        router.replace("/dashboard");
      }
    };

    // Hanya jalankan di client side
    if (typeof window !== "undefined") {
      checkAuth();
    }  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    console.log("Mencoba login dengan:", {
      email,
      password,
    });

    try {
      const result = await login(email, password);

      console.log("Hasil login:", result);

      if (result.success) {
        router.push("/dashboard");
      } else {
        setError(result.error || "Login gagal");
      }
    } catch (error) {
      console.error("Error saat login:", error);
      setError("Terjadi kesalahan saat login");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={4}
          sx={{
            borderRadius: 3,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box textAlign="center" mb={3}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: "#667eea",
                  margin: "0 auto 16px",
                  fontSize: "2rem",
                }}
              >
                <AccountCircle fontSize="inherit" />
              </Avatar>
              <Typography
                variant="h4"
                sx={{
                  color: "#333",
                  fontWeight: "bold",
                  mb: 1,
                }}
              >
                BPH Sekretaris
              </Typography>
              <Typography variant="body1" sx={{ color: "#666" }}>
                Sistem Pengelolaan Surat
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="NRA"
                type="nra"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />

              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  borderRadius: 2,
                  background:
                    "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  textTransform: "none",
                  "&:hover": {
                    background:
                      "linear-gradient(45deg, #5a67d8 30%, #6b46c1 90%)",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Masuk"                )}
              </Button>
            </Box>
          </CardContent>
        </Paper>
      </Container>
    </Box>
  );
}
