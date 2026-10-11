import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

export default function App() {
  const webcamRef = useRef(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const captureMood = async () => {
    const frame = webcamRef.current?.getScreenshot();
    if (!frame) return;

    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:5000/api/scan", {
        imageBase64: frame
      });
      setData(response.data.data);
    } catch (err) {
      alert("Scan failed: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 960, margin: "30px auto", fontFamily: "sans-serif", padding: 20 }}>
      <h2>Mood-Adaptive Music Streamer</h2>

      <div style={{ display: "flex", gap: 30, alignItems: "flex-start" }}>
        <div>
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            width={380}
            style={{ borderRadius: 8 }}
          />
          <button
            onClick={captureMood}
            disabled={loading}
            style={{ display: "block", width: "100%", marginTop: 10, padding: 12, cursor: "pointer" }}
          >
            {loading ? "Analyzing Mood..." : "Scan Emotion & Match Music"}
          </button>
        </div>

        {data && (
          <div style={{ flex: 1 }}>
            <h3 style={{ textTransform: "capitalize", margin: "0 0 10px 0" }}>
              Emotion: {data.dominantEmotion} ({(data.confidence).toFixed(1)}%)
            </h3>
            <div style={{ height: 220 }}>
              <Bar
                data={{
                  labels: Object.keys(data.breakdown),
                  datasets: [{
                    label: "Emotion Breakdown",
                    data: Object.values(data.breakdown),
                    backgroundColor: "rgba(59, 130, 246, 0.7)"
                  }]
                }}
                options={{ maintainAspectRatio: false }}
              />
            </div>
          </div>
        )}
      </div>

      {data?.tracks && (
        <div style={{ marginTop: 40 }}>
          <h3>Curated Mood Tracks</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            {data.tracks.map((track) => (
              <div key={track.id} style={{ border: "1px solid #334155", borderRadius: 8, padding: 12, backgroundColor: "#1e293b" }}>
                <iframe
                  width="100%"
                  height="180"
                  src={`https://www.youtube-nocookie.com/embed/${track.id}`}
                  title={track.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ borderRadius: 6, display: "block" }}
                />
                <h4 style={{ margin: "10px 0 4px", fontSize: "0.95rem", color: "#f8fafc" }}>{track.title}</h4>
                <p style={{ margin: 0, color: "#94a3b8", fontSize: "0.85rem" }}>{track.artist}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}