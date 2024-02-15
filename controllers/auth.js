const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const tokenPayload = {
      email: existingUser.email,
      userId: existingUser._id.toString(),
    };
    const tokenOptions = { expiresIn: "1h" };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, tokenOptions);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3600000,
    });

    res.status(200).json({ token });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.register = async (req, res, next) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, salt);

  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    res.status(400).json({ message: "Username or email already exists" });
    return;
  }

  const user = new User({
    username,
    email,
    password: hashedPassword,
  });

  const result = await user.save();
  const { password: userPassword, ...userWithoutPassword } = result.toJSON();

  res.status(200).json({
    message: "Signup successful",
    user: userWithoutPassword,
  });
};

exports.getUser = async (req, res, next) => {
  //return req.user
  res.status(200).json({ user: req.user });
};

exports.logout = async (req, res, next) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out" });
};
