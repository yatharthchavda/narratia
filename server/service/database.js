const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    require("dotenv").config();
    const mongo_uri = process.env.MONGO_URI;
    
    await mongoose.connect(mongo_uri, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });
    console.log("MongoDB Atlas connected");
  } catch (err) {
    console.error("Failed to connect to MongoDB Atlas:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
