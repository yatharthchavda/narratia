const mongoose = require("mongoose");

const uri =
  "mongodb+srv://yatharth:passmongo@cluster0.haliddm.mongodb.net/narratia?retryWrites=true&w=majority&appName=Cluster0";

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String, // In a real app, this should be hashed
  created_at: { type: Date, default: Date.now },
});

const storySchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  prompt: String,
  generated_story: String,
  genre: String,
  created_at: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
const Story = mongoose.model("Story", storySchema);

async function seed() {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to MongoDB Atlas");

    // Clear existing data (optional)
    await User.deleteMany({});
    await Story.deleteMany({});

    // Insert user
    const user = new User({
      username: "JohnDoe",
      email: "john@example.com",
      password: "hashedpassword123", // This should be hashed in a real app
      created_at: new Date("2023-06-24T12:00:00Z"),
    });
    await user.save();

    // Insert stories
    const stories = [
      {
        user_id: user._id,
        prompt: "A thrilling tale of adventure and mystery",
        generated_story: "Once upon a time in a dark forest...",
        genre: "Adventure",
        created_at: new Date("2023-06-24T14:00:00Z"),
      },
      {
        user_id: user._id,
        prompt: "Romantic comedy set in Paris",
        generated_story: "It all started with a chance encounter at a cafe...",
        genre: "Romance",
        created_at: new Date("2023-06-25T10:00:00Z"),
      },
    ];

    await Story.insertMany(stories);

    console.log("Dummy data inserted successfully");
    await mongoose.disconnect();
  } catch (err) {
    console.error("Error seeding data:", err);
  }
}

seed();