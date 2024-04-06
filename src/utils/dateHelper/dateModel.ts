import mongoose from "mongoose";

// Define the schema for the lastUpdated collection
export const lastUpdatedSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
});

// Define the model for the lastUpdated collection
export const LastUpdated = mongoose.model("lastUpdated", lastUpdatedSchema);
