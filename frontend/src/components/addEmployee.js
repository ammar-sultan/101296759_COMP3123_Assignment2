import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Grid,
  Alert,
  Snackbar,
} from "@mui/material";
import { FaUser, FaEnvelope, FaBriefcase, FaBuilding } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import API from "../api";

const AddEmployee = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    position: "",
    department: "",
    salary: "",
    date_of_joining: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success");
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};
    const nameRegex = /^[A-Za-z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const textRegex = /^[A-Za-z0-9\s]+$/;
    const numberRegex = /^[0-9]+(\.[0-9]{1,2})?$/;

    if (!formData.first_name.trim()) {
      errors.first_name = "First Name is required.";
    } else if (!nameRegex.test(formData.first_name)) {
      errors.first_name = "First Name can only contain letters.";
    }

    if (!formData.last_name.trim()) {
      errors.last_name = "Last Name is required.";
    } else if (!nameRegex.test(formData.last_name)) {
      errors.last_name = "Last Name can only contain letters.";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required.";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Invalid email format.";
    }

    if (!formData.position.trim()) {
      errors.position = "Position is required.";
    } else if (!textRegex.test(formData.position)) {
      errors.position = "Position can only contain letters and numbers.";
    }

    if (!formData.department.trim()) {
      errors.department = "Department is required.";
    } else if (!textRegex.test(formData.department)) {
      errors.department = "Department can only contain letters and numbers.";
    }

    if (!formData.salary.trim()) {
      errors.salary = "Salary is required.";
    } else if (!numberRegex.test(formData.salary)) {
      errors.salary = "Salary must be a numeric value.";
    }

    if (!formData.date_of_joining.trim()) {
      errors.date_of_joining = "Date of Joining is required.";
    } else if (isNaN(Date.parse(formData.date_of_joining))) {
      errors.date_of_joining = "Invalid date format.";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await API.post("/employees", formData);
      setMessage("Employee added successfully!");
      setMessageType("success");
      setTimeout(() => navigate("/employees"), 2000);
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Error adding employee.";
      setMessage(errorMsg);
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
      <Card sx={{ maxWidth: 600, width: "100%", p: 4, borderRadius: 4 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ mb: 2 }}>
          Add Employee
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
            <Grid container spacing={2}>
              {[
                {
                  label: "First Name",
                  value: "first_name",
                  icon: <FaUser />,
                },
                {
                  label: "Last Name",
                  value: "last_name",
                  icon: <FaUser />,
                },
                {
                  label: "Email",
                  value: "email",
                  type: "email",
                  icon: <FaEnvelope />,
                },
                {
                  label: "Position",
                  value: "position",
                  icon: <FaBriefcase />,
                },
                {
                  label: "Department",
                  value: "department",
                  icon: <FaBuilding />,
                },
                { label: "Salary", value: "salary", type: "number" },
                {
                  label: "",
                  value: "date_of_joining",
                  type: "date",
                },
              ].map(({ label, value, icon, type = "text" }) => (
                <Grid item xs={12} key={value}>
                  <TextField
                    fullWidth
                    label={label}
                    type={type}
                    value={formData[value]}
                    onChange={(e) =>
                      setFormData({ ...formData, [value]: e.target.value })
                    }
                    error={!!errors[value]}
                    helperText={errors[value] || ""}
                    InputProps={{
                      startAdornment: icon && (
                        <Box
                          component="span"
                          sx={{
                            color: "#1976d2",
                            display: "flex",
                            alignItems: "center",
                            mr: 1,
                          }}
                        >
                          {icon}
                        </Box>
                      ),
                    }}
                  />
                </Grid>
              ))}
            </Grid>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 3,
              }}
            >
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ flexGrow: 1, mr: 1 }}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                sx={{ flexGrow: 1 }}
                onClick={() => navigate("/employees")}
              >
                Cancel
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AddEmployee;
