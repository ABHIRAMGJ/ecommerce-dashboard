const express = require("express");
const router = express.Router();

// POST /api/auth/login  { password }
// There's no session/user model here on purpose — this is a single shared
// admin password. The password itself doubles as the key the frontend
// sends back on every admin request (see x-admin-key / requireAdmin).
router.post("/login", (req, res) => {
  const { password } = req.body;
  if (!process.env.ADMIN_PASSWORD) {
    return res.status(500).json({ error: "ADMIN_PASSWORD is not set on the server" });
  }
  if (password && password === process.env.ADMIN_PASSWORD) {
    return res.json({ ok: true });
  }
  res.status(401).json({ error: "Incorrect password" });
});

module.exports = router;
