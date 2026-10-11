const mongoose = require("mongoose");

const MoodLogSchema = new mongoose.Schema({
  dominantEmotion: String,
  confidence: Number,
  breakdown: Map,
  tracks: Array,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("MoodLog", MoodLogSchema);