const mongoose = require("mongoose");

const storySchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  prompt: String,
  generated_story: String,
  genre: String,
  created_at: { type: Date, default: Date.now },
});

const Story = mongoose.model("Story", storySchema);

module.exports = Story;
