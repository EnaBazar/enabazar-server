// routes/user.js
const express = require("express");
const userrouter = express.Router();
const usermodel = require("../models/usermodel");

// GET /auth/search-user?q=...&page=1&limit=10&verify=all
userrouter.get("/search-user", async (req, res) => {
  try {
    const { q = "", page = 1, limit = 10, verify = "all" } = req.query;

    const filter = {
      $or: [
        { name: { $regex: q, $options: "i" } }, // বাংলা + English support
        { mobile: { $regex: q, $options: "i" } }
      ]
    };

    if (verify === "verified") filter.verify_mobile = true;
    else if (verify === "unverified") filter.verify_mobile = false;

    const users = await usermodel
      .find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await usermodel.countDocuments(filter);

    res.json({ success: true, users, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = userrouter;