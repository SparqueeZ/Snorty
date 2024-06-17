const mongoose = require("mongoose");
const initAdmin = require("./initAdmin");
const Counter = require("../models/Counter");

const getURI = () => {
  let name = process.env.MONGO_INTERNAL_NAME;
  let port = process.env.MONGO_INTERNAL_PORT;
  if (process.env.PRODUCTION_MODE !== "true") {
    name = process.env.MONGO_EXTERNAL_NAME;
    port = process.env.MONGO_EXTERNAL_PORT;
  }
  return `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${name}:${port}/selks?authSource=selks`;
};

const connectDB = async () => {
  try {
    await mongoose.connect(getURI(), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
    initAdmin();

    const counter = await Counter.findById("new_sid");
    if (!counter) {
      const newCounter = new Counter({ _id: "new_sid", seq: 97400 });
      await newCounter.save();
      console.log("Counter initialized at 49000");
    }
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    console.error("WARNING : Please check if production mode is set to 'true'");
    process.exit(1);
  }
};

module.exports = connectDB;
