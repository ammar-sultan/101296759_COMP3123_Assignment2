// backend/routers/user.js
const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/userSchema");
const { body, validationResult } = require("express-validator");

const router = express.Router();

/**
 * User Signup
 * Route: POST /signup
 * Body: { username, email, password }
 */
router.post(
  "/signup",
  [
    body("username").trim().notEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { username, email, password } = req.body;

      // Check if the email is already registered
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists." });
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create a new user
      const user = new User({ username, email, password: hashedPassword });
      await user.save();

      res.status(201).json({
        message: "User created successfully.",
        user_id: user._id,
      });
    } catch (error) {
      console.error("Error during signup:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * User Login
 * Route: POST /login
 * Body: { email, password }
 */
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password." });
      }

      // Compare the password with the hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password." });
      }

      // If login is successful
      res.status(200).json({ message: "Login successful." });
    } catch (error) {
      console.error("Error during login:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

module.exports = router;
