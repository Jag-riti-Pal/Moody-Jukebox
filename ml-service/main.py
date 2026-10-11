import base64
import cv2
import numpy as np
from deepface import DeepFace
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI(title="Emotion Analysis Microservice")

class FramePayload(BaseModel):
    image_base64: str

@app.post("/predict")
def predict_emotion(payload: FramePayload):
    try:
        # 1. Clean base64 header and decode to numpy array
        raw_b64 = payload.image_base64.split(",")[-1]
        img_bytes = base64.b64decode(raw_b64)
        np_arr = np.frombuffer(img_bytes, np.uint8)
        frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        if frame is None:
            raise HTTPException(status_code=400, detail="Invalid frame format")

        # 2. Run off-the-shelf facial emotion inference
        results = DeepFace.analyze(
            img_path=frame,
            actions=['emotion'],
            enforce_detection=False,
            silent=True
        )

        analysis = results[0]
        dominant_emotion = analysis["dominant_emotion"]
        emotion_scores = analysis["emotion"]  # {angry, disgust, fear, happy, sad, surprise, neutral}

        return {
            "dominant_emotion": dominant_emotion,
            "confidence": float(emotion_scores[dominant_emotion]),
            "breakdown": {k: float(v) for k, v in emotion_scores.items()}
        }

    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)