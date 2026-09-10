module.exports = function requireAdmin(req, res, next) {
  const key = req.header("x-admin-key");
  if (!key || key !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Admin authentication required" });
  }
  next();
};
