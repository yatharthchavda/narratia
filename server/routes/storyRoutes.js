const express = require("express");
const {
  getUserStories,
  createStory,
  updateStory,
  deleteStory,
  getAllStories,
} = require("../controllers/storyController");

const router = express.Router();

// GET /api/stories - Get all stories with pagination
router.get("/stories", getAllStories);

// POST /api/stories - Create a new story
router.post("/stories", createStory);

// GET /api/mystories/:userId - Get stories of a user with pagination
router.get("/mystories/:userId", getUserStories);

// PUT /api/mystories/:storyId - Update a story by its ID
router.put("/mystories/:storyId", updateStory);

// DELETE /api/mystories/:storyId - Delete a story by its ID
router.delete("/mystories/:storyId", deleteStory);

module.exports = router;
