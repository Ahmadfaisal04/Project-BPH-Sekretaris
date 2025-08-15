"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  Paper,
  Avatar,
} from "@mui/material";
import {
  AccountCircle,
  Security,
  Group,
  AdminPanelSettings,
} from "@mui/icons-material";

// Predefined users untuk demo
const demoUsers = [
  {
    email: "admin@bph.org",
    password: "admin123",
    role: "ketua",
    name: "Administrator",
    description: "Akses penuh ke semua fitur sistem",
    icon: <AdminPanelSettings />,
    color: "#f44336",
  },
  {
    email: "sekretaris@bph.org",
    password: "sekretaris123",
    role: "sekretaris",
    name: "Sekretaris",
    description: "Mengelola surat masuk dan keluar",
    icon: <Security />,
    color: "#2196f3",
  },
  {
    email: "anggota@bph.org",
    password: "anggota123",
    role: "anggota",
    name: "Anggota",
    description: "Melihat dan membuat laporan",
    icon: <Group />,
    color: "#4caf50",
  },
];

export default function LoginPage() {
  const [email, setEmail] = useState("admin@bph.org");
  const [password, setPassword] = useState("admin123");
  const [selectedRole, setSelectedRole] = useState("ketua");
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
    }
  }, [router]);

  // Handle role selection
  const handleRoleSelect = (user) => {
    setEmail(user.email);
    setPassword(user.password);
    setSelectedRole(user.role);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    console.log("Mencoba login dengan:", {
      email,
      password,
      role: selectedRole,
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
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          {/* Left Side - Role Selection */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={4}
              sx={{
                padding: 4,
                borderRadius: 3,
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
              }}
            >
              <Typography
                variant="h4"
                gutterBottom
                sx={{
                  color: "#333",
                  fontWeight: "bold",
                  textAlign: "center",
                  mb: 3,
                }}
              >
                Pilih Role Login
              </Typography>

              <Typography
                variant="body1"
                sx={{ color: "#666", textAlign: "center", mb: 4 }}
              >
                Pilih role untuk login otomatis dengan akun demo
              </Typography>

              <Grid container spacing={2}>
                {demoUsers.map((user) => (
                  <Grid item xs={12} key={user.role}>
                    <Card
                      sx={{
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        border:
                          selectedRole === user.role
                            ? "2px solid"
                            : "1px solid #ddd",
                        borderColor:
                          selectedRole === user.role ? user.color : "#ddd",
                        transform:
                          selectedRole === user.role
                            ? "scale(1.02)"
                            : "scale(1)",
                        "&:hover": {
                          transform: "scale(1.02)",
                          boxShadow: 4,
                        },
                      }}
                      onClick={() => handleRoleSelect(user)}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar
                            sx={{
                              bgcolor: user.color,
                              width: 48,
                              height: 48,
                            }}
                          >
                            {user.icon}
                          </Avatar>
                          <Box flex={1}>
                            <Box
                              display="flex"
                              alignItems="center"
                              gap={1}
                              mb={0.5}
                            >
                              <Typography
                                variant="h6"
                                sx={{ color: "#333", fontWeight: "bold" }}
                              >
                                {user.name}
                              </Typography>
                              <Chip
                                label={user.role.toUpperCase()}
                                size="small"
                                sx={{
                                  bgcolor: user.color,
                                  color: "white",
                                  fontWeight: "bold",
                                  fontSize: "0.75rem",
                                }}
                              />
                            </Box>
                            <Typography variant="body2" sx={{ color: "#666" }}>
                              {user.description}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ color: "#888", display: "block", mt: 1 }}
                            >
                              📧 {user.email}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>

          {/* Right Side - Login Form */}
          <Grid item xs={12} md={6}>
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
                    label="Email"
                    type="email"
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

                  <FormControl fullWidth margin="normal">
                    <InputLabel>Role</InputLabel>
                    <Select
                      value={selectedRole}
                      label="Role"
                      onChange={(e) => setSelectedRole(e.target.value)}
                      sx={{
                        borderRadius: 2,
                      }}
                    >
                      <MenuItem value="ketua">Ketua</MenuItem>
                      <MenuItem value="sekretaris">Sekretaris</MenuItem>
                      <MenuItem value="anggota">Anggota</MenuItem>
                    </Select>
                  </FormControl>

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
                      "Masuk"
                    )}
                  </Button>

                  <Box textAlign="center" mt={2}>
                    <Typography variant="body2" sx={{ color: "#888" }}>
                      Demo Mode - Pilih role di sebelah kiri untuk login
                      otomatis
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
