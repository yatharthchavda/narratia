// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

// Initialize app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Define Mongoose Schemas and Models
const { Schema, model, Types } = mongoose;

const storySchema = new Schema(
  {
    user_id: { type: Types.ObjectId, ref: "User", required: false },
    prompt: { type: String, required: false },
    generated_story: { type: String, required: false },
    created_at: { type: Date, default: Date.now },
  },
  { collection: "stories" }
);

const userSchema = new Schema(
  {
    username: { type: String, required: false },
    email: { type: String, required: false },
    created_at: { type: Date, default: Date.now },
  },
  { collection: "users" }
);

const Story = model("Story", storySchema);
const User = model("User", userSchema);

// Routes

// GET /api/stories?page=1&limit=4
// Paginated fetching of stories, sorted by created_at descending
app.get("/api/stories", async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page)) || 1;
    const limit = Math.max(1, parseInt(req.query.limit)) || 4;

    const skip = (page - 1) * limit;

    // Get total count
    const totalStories = await Story.countDocuments();

    // Fetch paginated stories sorted newest first
    const stories = await Story.find()
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

app.get("/api/mystories/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const page = Math.max(1, parseInt(req.query.page)) || 1;
    const limit = Math.max(1, parseInt(req.query.limit)) || 4;
    const skip = (page - 1) * limit;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    const filter = { user_id: userId };
    const totalStories = await Story.countDocuments(filter);
    const stories = await Story.find(filter)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({ stories, totalStories });
  } catch (err) {
    console.error("Error fetching my stories:", err);
    res.status(500).json({ error: "Server error fetching your stories" });
  }
});
// GET /api/users/:userId
// Fetch user info by userId
app.get("/api/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    if (!Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await User.findById(userId).lean();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Server error fetching user" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});