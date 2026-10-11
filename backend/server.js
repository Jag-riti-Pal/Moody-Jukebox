require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");
const MoodLog = require("./models/MoodLog");
const { getTracksByEmotion } = require("./services/youtube");

const app = express();
app.use(cors());
app.use(express.json({ limit: "15mb" }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection failed:", err.message));

app.post("/api/scan", async (req, res) => {
  try {
    const { imageBase64 } = req.body;
    if (!imageBase64) return res.status(400).json({ error: "No image provided" });

    // 1. Get emotion inference from Python service
    const mlResponse = await axios.post(process.env.ML_SERVICE_URL, {
      image_base64: imageBase64
    });

    const { dominant_emotion, confidence, breakdown } = mlResponse.data;

    // 2. Fetch tracks based on dominant emotion
    const tracks = await getTracksByEmotion(dominant_emotion);

    // 3. Save session log to database
    const savedLog = await MoodLog.create({
      dominantEmotion: dominant_emotion,
      confidence,
      breakdown,
      tracks
    });

    res.json({ success: true, data: savedLog });
  } catch (error) {
    const status = error.response?.status || 500;
    const msg = error.response?.data?.detail || error.message;
    res.status(status).json({ error: msg });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Gateway running on http://127.0.0.1:${PORT}`));