import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Snackbar,
  Alert,
  CircularProgress,
  IconButton,
  Box,
  Select,
  MenuItem,
  Pagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Delete, Edit, Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import API from "../api";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [searchDepartment, setSearchDepartment] = useState("");
  const [searchPosition, setSearchPosition] = useState("");
  const [sortOption, setSortOption] = useState("name");
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(6);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const { data } = await API.get("/employees");
        setEmployees(data);
      } catch (error) {
        setMessage("Error fetching employees.");
        setMessageType("error");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const handleSearch = async () => {
    try {
      const query = new URLSearchParams();
      if (searchDepartment) query.append("department", searchDepartment.trim());
      if (searchPosition) query.append("position", searchPosition.trim());

      if (!searchDepartment && !searchPosition) {
        setMessage("Please provide at least one search filter.");
        setMessageType("warning");
        return;
      }

      setLoading(true);
      const { data } = await API.get(`/employees/search?${query.toString()}`);
      setEmployees(data);
      setMessage("Search completed successfully.");
      setMessageType("success");
    } catch (error) {
      setMessage("Error searching employees.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmployee = async (id) => {
    try {
      setLoading(true);
      const response = await API.delete(`/employees/${id}`);
      setEmployees((prev) => prev.filter((employee) => employee._id !== id));
      setMessage(response.data.message || "Employee deleted successfully.");
      setMessageType("success");
    } catch (error) {
      setMessage("Error deleting employee.");
      setMessageType("error");
    } finally {
      setLoading(false);
      setDialogOpen(false); // Close dialog after completion
    }
  };

  const openDeleteDialog = (employee) => {
    setSelectedEmployee(employee);
    setDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setSelectedEmployee(null);
    setDialogOpen(false);
  };

  const handleViewEmployee = (id) => navigate(`/view-employee/${id}`);
  const handleUpdateEmployee = (id) => navigate(`/update-employee/${id}`);
  const handleAddEmployee = () => navigate("/add-employee");

  const sortedEmployees = [...employees].sort((a, b) => {
    if (sortOption === "name") return a.first_name.localeCompare(b.first_name);
    if (sortOption === "position") return a.position.localeCompare(b.position);
    if (sortOption === "department")
      return a.department.localeCompare(b.department);
    return 0;
  });

  const paginatedEmployees = sortedEmployees.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        align="left"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#1976d2" }}
      >
        Employee Database
      </Typography>

      <Snackbar
        open={!!message}
        autoHideDuration={4000}
        onClose={() => setMessage(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={messageType} onClose={() => setMessage(null)}>
          {message}
        </Alert>
      </Snackbar>

      <Box sx={{ mb: 4, display: "flex", flexWrap: "wrap", gap: 2 }}>
        <TextField
          label="Search by Department"
          variant="outlined"
          value={searchDepartment}
          onChange={(e) => setSearchDepartment(e.target.value)}
          fullWidth
          sx={{ flex: 1 }}
        />
        <TextField
          label="Search by Position"
          variant="outlined"
          value={searchPosition}
          onChange={(e) => setSearchPosition(e.target.value)}
          fullWidth
          sx={{ flex: 1 }}
        />
        <Select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          fullWidth
          variant="outlined"
          sx={{ flex: 1 }}
        >
          <MenuItem value="name">Sort by Name</MenuItem>
          <MenuItem value="position">Sort by Position</MenuItem>
          <MenuItem value="department">Sort by Department</MenuItem>
        </Select>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          disabled={loading}
          sx={{ flex: 1 }}
        >
          {loading ? <CircularProgress size={24} /> : "Search"}
        </Button>
      </Box>

      <Button
        variant="contained"
        color="success"
        onClick={handleAddEmployee}
        sx={{ mb: 4 }}
      >
        Add Employee
      </Button>

      <Grid container spacing={3}>
        {loading ? (
          [...Array(pageSize)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardContent>
                  <CircularProgress />
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : paginatedEmployees.length > 0 ? (
          paginatedEmployees.map((employee) => (
            <Grid item xs={12} sm={6} md={4} key={employee._id}>
              <Card
                sx={{
                  ":hover": {
                    boxShadow: 6,
                    transform: "scale(1.02)",
                    transition: "all 0.3s ease",
                  },
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: "bold" }}
                  >
                    {employee.first_name} {employee.last_name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Email: {employee.email}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Position: {employee.position}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Department: {employee.department}
                  </Typography>
                </CardContent>
                <CardActions>
                  <IconButton
                    color="primary"
                    onClick={() => handleViewEmployee(employee._id)}
                  >
                    <Visibility />
                  </IconButton>
                  <IconButton
                    color="warning"
                    onClick={() => handleUpdateEmployee(employee._id)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => openDeleteDialog(employee)}
                  >
                    <Delete />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography
            variant="body1"
            color="textSecondary"
            align="center"
            sx={{ width: "100%" }}
          >
            No employees found.
          </Typography>
        )}
      </Grid>

      {employees.length > pageSize && (
        <Grid container justifyContent="center" sx={{ mt: 4 }}>
          <Pagination
            count={Math.ceil(employees.length / pageSize)}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
          />
        </Grid>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete{" "}
            <strong>
              {selectedEmployee?.first_name} {selectedEmployee?.last_name}
            </strong>
            ? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={() => handleDeleteEmployee(selectedEmployee._id)}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EmployeeList;
