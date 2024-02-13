exports.postLogin = async (req, res, next) => {
  const { username, password } = req.body;
  console.log("username:", username, "password:", password);

  // TODO check if user exists in database
  // if user not existing, return error message

  if (username === "admin" && password === "admin") {
    req.session.isLoggedIn = true;
    res.status(200).json({ message: "Login successful" });
  } else {
    res.status(401).json({ message: "Login failed" });
  }
};

exports.postSignUp = async (req, res, next) => {
  const { username, password, confirmPassword } = req.body;
  console.log(
    "username:",
    username,
    "password:",
    password,
    "confirmPassword",
    confirmPassword
  );

  // TODO check if email exists in database
  // if user not existing, create user
  // if user existing, return error message
  // encrypt password with bcrypt e.g.
  // save user
  res.status(200).json({ message: "Signup successful" });
};
