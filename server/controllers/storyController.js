const mongoose = require("mongoose");
const Story = require("../models/Story");

// Get stories of a user with pagination
const getUserStories = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const page = Math.max(1, parseInt(req.query.page)) || 1;
    const limit = Math.max(1, parseInt(req.query.limit)) || 4;
    const skip = (page - 1) * limit;

    const filter = { user_id: userId };
    const totalStories = await Story.countDocuments(filter);
    const stories = await Story.find(filter)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({ stories, totalStories });
  } catch (err) {
    console.error("Error fetching user stories:", err);
    res.status(500).json({ error: "Server error fetching user stories" });
  }
};

// Create a new story
const createStory = async (req, res) => {
  try {
    const { user_id, prompt, generated_story, genre } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(user_id) ||
      typeof prompt !== "string" ||
      typeof generated_story !== "string" ||
      !prompt.trim() ||
      !generated_story.trim()
    ) {
      return res.status(400).json({ error: "Invalid or missing data" });
    }

    const story = new Story({
      user_id,
      prompt: prompt.trim(),
      generated_story: generated_story.trim(),
      genre: genre?.trim() || "Unknown",
    });

    await story.save();
    res.status(201).json({ message: "Story published successfully", story });
  } catch (err) {
    console.error("Error publishing story:", err);
    res.status(500).json({ error: "Failed to publish story" });
  }
};

// Update a story by its ID
const updateStory = async (req, res) => {
  try {
    const { storyId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(storyId)) {
      return res.status(400).json({ error: "Invalid story ID" });
    }

    const { prompt, genre, generated_story } = req.body;

    if (
      typeof prompt !== "string" ||
      prompt.trim() === "" ||
      typeof generated_story !== "string" ||
      generated_story.trim() === ""
    ) {
      return res.status(400).json({
        error: "Prompt and generated_story are required and cannot be empty",
      });
    }

    const updateFields = {
      prompt: prompt.trim(),
      generated_story: generated_story.trim(),
    };
    if (typeof genre === "string" && genre.trim()) {
      updateFields.genre = genre.trim();
    }

    const updatedStory = await Story.findByIdAndUpdate(
      storyId,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedStory) {
      return res.status(404).json({ error: "Story not found" });
    }

    res.json(updatedStory);
  } catch (err) {
    console.error("Error updating story:", err);
    res.status(500).json({ error: "Failed to update story" });
  }
};

// Delete a story by its ID
const deleteStory = async (req, res) => {
  try {
    const { storyId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(storyId)) {
      return res.status(400).json({ error: "Invalid story ID" });
    }

    const deletedStory = await Story.findByIdAndDelete(storyId).lean();

    if (!deletedStory) {
      return res.status(404).json({ error: "Story not found" });
    }

    res.json({ message: "Story deleted successfully" });
  } catch (err) {
    console.error("Error deleting story:", err);
    res.status(500).json({ error: "Failed to delete story" });
  }
};

// Get all stories with pagination (for homepage or others)
const getAllStories = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page)) || 1;
    const limit = Math.max(1, parseInt(req.query.limit)) || 4;
    const skip = (page - 1) * limit;

    const totalStories = await Story.countDocuments({});
    const stories = await Story.find({})
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({ stories, totalStories });
  } catch (err) {
    console.error("Error fetching stories:", err);
    res.status(500).json({ error: "Server error fetching stories" });
  }
};

module.exports = {
  getUserStories,
  createStory,
  updateStory,
  deleteStory,
  getAllStories,
};
