module.exports = function ensureSuperAdmin(req, res, next) {
  const body = req.body;
  if (body.role === "superadmin") {
    next();
  } else {
    res.status(403).json({
      message: "Forbidden: You do not have the necessary permissions.",
    });
  }
};
