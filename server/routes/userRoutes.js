const express = require("express");
const { getUserById } = require("../controllers/userController");

const router = express.Router();

// GET /api/users/:userId
router.get("/users/:userId", getUserById);

module.exports = router;
