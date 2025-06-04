const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB (Replace with your connection string)
const uri = "mongodb://localhost:27017/narratia"; // Adjust as needed

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

// User schema & model
const userSchema = new mongoose.Schema({
  username: { type: String },
  email: { type: String },
  created_at: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

// Story schema & model (with genre)
const storySchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  prompt: { type: String },
  generated_story: { type: String },
  genre: { type: String }, // NEW genre field
  created_at: { type: Date, default: Date.now },
});

const Story = mongoose.model("Story", storySchema);

// Routes

// Get user by ID
app.get("/api/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }
    const user = await User.findById(userId).lean();
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Server error fetching user" });
  }
});

// Create story
app.post("/api/stories", async (req, res) => {
  try {
    const { user_id, prompt, generated_story, genre } = req.body;

    // Optional: Validate fields here

    const newStory = new Story({
      user_id,
      prompt,
      generated_story,
      genre,
      created_at: new Date(),
    });

    const savedStory = await newStory.save();
    res.status(201).json(savedStory);
  } catch (err) {
    console.error("Error creating story:", err);
    res.status(500).json({ error: "Failed to create story" });
  }
});

// Get stories (all users) with pagination
app.get("/api/stories", async (req, res) => {
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
});

// Get stories for a specific user with pagination
app.get("/api/mystories/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
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
    console.error("Error fetching user's stories:", err);
    res.status(500).json({ error: "Server error fetching your stories" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});