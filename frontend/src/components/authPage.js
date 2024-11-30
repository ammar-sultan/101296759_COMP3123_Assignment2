import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Alert,
  Snackbar,
} from "@mui/material";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import API from "../api";

const AuthPage = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success"); // "success" or "danger"

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignup) {
        const response = await API.post("/auth/signup", formData);
        setMessage(response.data.message);
        setMessageType("success");
        setIsSignup(false);
      } else {
        const { data } = await API.post("/auth/login", {
          email: formData.email,
          password: formData.password,
        });
        localStorage.setItem("token", data.token);
        setMessage(data.message);
        setMessageType("success");
        setTimeout(() => (window.location.href = "/employees"), 1000);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.errors?.map((err) => err.msg).join("\n") ||
        "An error occurred. Please try again.";
      setMessage(errorMessage);
      setMessageType("error");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f4f6f8",
        px: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 400,
          width: "100%",
          p: 3,
          borderRadius: 4,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#fff",
        }}
      >
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#1976d2" }}
        >
          {isSignup ? "Create Account" : "Welcome Back"}
        </Typography>
        <Typography
          variant="body2"
          align="center"
          gutterBottom
          sx={{ color: "#6c757d" }}
        >
          {isSignup
            ? "Join us and start your journey"
            : "Login to access your account"}
        </Typography>

        {message && (
          <Snackbar
            open={!!message}
            autoHideDuration={4000}
            onClose={() => setMessage(null)}
          >
            <Alert
              severity={messageType === "success" ? "success" : "error"}
              onClose={() => setMessage(null)}
            >
              {message}
            </Alert>
          </Snackbar>
        )}

        <CardContent>
          <form onSubmit={handleSubmit}>
            {isSignup && (
              <TextField
                fullWidth
                variant="outlined"
                label="Username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <Box component="span" sx={{ color: "#1976d2", mr: 1 }}>
                      <FaUser />
                    </Box>
                  ),
                }}
                required
              />
            )}
            <TextField
              fullWidth
              variant="outlined"
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <Box component="span" sx={{ color: "#1976d2", mr: 1 }}>
                    <FaEnvelope />
                  </Box>
                ),
              }}
              required
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <Box component="span" sx={{ color: "#1976d2", mr: 1 }}>
                    <FaLock />
                  </Box>
                ),
              }}
              required
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ py: 1.5, mt: 1 }}
            >
              {isSignup ? "Sign Up" : "Login"}
            </Button>
          </form>
        </CardContent>

        <CardActions
          sx={{ justifyContent: "center", flexDirection: "column", mt: 2 }}
        >
          <Typography variant="body2" align="center">
            {isSignup ? "Already have an account?" : "New here?"}{" "}
            <Box
              component="span"
              sx={{
                cursor: "pointer",
                color: "#1976d2",
                fontWeight: "bold",
                textDecoration: "underline",
              }}
              onClick={() => setIsSignup(!isSignup)}
            >
              {isSignup ? "Log in" : "Sign up"}
            </Box>
          </Typography>
        </CardActions>
      </Card>
    </Box>
  );
};

export default AuthPage;
