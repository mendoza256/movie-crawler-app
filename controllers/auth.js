const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  console.log("email:", email, "password:", password);

  if (!email || !password) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }

  const existingUser = await User.findOne({ email });
  const isPasswordCorrect = await bcrypt.compare(
    password,
    existingUser.password
  );

  if (!existingUser || !isPasswordCorrect) {
    res.status(404).json({ message: "User password combination not found" });
    return;
  }

  // TODO move secret to .env
  const token = jwt.sign(
    { email: existingUser.email, userId: existingUser._id.toString() },
    "secret",
    { expiresIn: "1h" }
  );

  res
    .cookie("token", token, {
      httpOnly: true,
      maxAge: 3600000,
    })
    .redirect("/");

  if (existingUser && isPasswordCorrect) {
    res.status(200).json({ message: "Login successful" });
  } else {
    res.status(401).json({ message: "Login failed" });
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
  const token = req.cookies.token;
  if (!token) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

  try {
    const decodedToken = jwt.verify(token, "secret");
    const user = await User.findById(decodedToken.userId);
    if (!user) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(401).json({ message: "Not authenticated" });
  }
};

exports.logout = async (req, res, next) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out" });
};
