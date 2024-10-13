const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/userSchema");
const { body, validationResult } = require("express-validator");

const router = express.Router();

// User Signup
router.post(
  "/signup",
  [
    body("username").isString(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const { username, email, password } = req.body;

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = new User({ username, email, password: hashedPassword });
      await user.save();
      res
        .status(201)
        .json({ message: "User created successfully.", user_id: user._id });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// User Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }
    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid email or password." });
    }
    res.status(200).json({ message: "Login successful." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
