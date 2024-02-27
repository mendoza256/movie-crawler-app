exports.ensureSuperAdmin = (req, res, next) => {
  const user = req.user;
  console.log("user", user);
  if (user.role === "superadmin") {
    next();
  } else {
    res.status(403).json({
      message: "Forbidden: You do not have the necessary permissions.",
    });
  }
};
