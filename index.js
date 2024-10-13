const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routers/user");
const employeeRoutes = require("./routers/employee");

const app = express();
app.use(express.json());

const DB_URL =
  "mongodb+srv://adminDb:ILoveMyExBaoBao3214@cluster0.362ps.mongodb.net/comp3123_assigment1?retryWrites=true&w=majority";

mongoose
  .connect(DB_URL, {
    dbName: "comp3123_assigment1",
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error: ", err);
  });

app.get("/", (req, res) => {
  res.send("Hello, Welcome to COMP3123 Assignment One");
});

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/emp", employeeRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
