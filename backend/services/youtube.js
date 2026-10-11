const ytSearch = require("yt-search");

async function getTracksByEmotion(emotion) {
  const queryMap = {
    happy: "upbeat feel good pop hits",
    sad: "sad acoustic songs",
    angry: "energetic rock high energy",
    fear: "calm lo-fi chill meditation",
    surprise: "party electronic dance hits",
    neutral: "chill lofi study beats",
    disgust: "peaceful ambient piano"
  };

  const query = queryMap[emotion] || "lofi chill beats";

  try {
    const searchResults = await ytSearch(query);
    const videos = searchResults.videos.slice(0, 6);

    return videos.map((video) => ({
      id: video.videoId,
      title: video.title,
      artist: video.author ? video.author.name : "YouTube Music",
      artwork: video.thumbnail,
      url: video.url
    }));
  } catch (err) {
    console.error("Music search error:", err.message);
    return [];
  }
}

module.exports = { getTracksByEmotion };