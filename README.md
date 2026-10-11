# 🎵 Moody Jukebox: Emotion-Adaptive Music Streamer

A decoupled full-stack **MERN + FastAPI** application that classifies facial emotional states in real time and streams contextually matched YouTube music tracks.

---

## 🏗️ System Architecture

```text
[ React Client (Vite) ]
       │ 
       │ 1. Capture webcam frame (Base64)
       ▼ 
[ Node.js / Express Gateway API (Port 5000) ]
       │ 
       ├─► 2. Computer Vision Inference ──► [ Python FastAPI (Port 8000) ]
       │                                     (DeepFace FER classification)
       │ 
       ├─► 3. Media Aggregation ─────────► [ YouTube Search Engine ]
       │                                     (Query mapping per mood state)
       │ 
       └─► 4. Persistence Layer ─────────► [ MongoDB Atlas Cluster ]
                                             (Session history & track logs)

```
---

## 🚀 Key Features

* Real-Time Facial Expression Recognition: Classifies 7 distinct emotions (happy, sad, angry, fear, surprise, neutral, disgust) using a decoupled Python microservice.

* Microservice Decoupling: Node.js/Express acts as an API gateway managing business logic and database writes, offloading heavy ML inference to FastAPI.

* Dynamic Playlist Matching: Maps dominant affective states into search queries to retrieve and stream embeddable music tracks.

* Audit Persistence: Stores every scan session, confidence metric, and track recommendation in MongoDB Atlas.

---

## 🛠️ Quickstart Guide
1. Prerequisites
Node.js (v18+)

Python (3.10+)

A MongoDB Atlas cluster connection string

2. Service 1: ML Inference Engine (ml-service)
```Bash
cd ml-service
pip install -r requirements.txt
python -m uvicorn main:app --port 8000 --reload
```
API docs available at http://127.0.0.1:8000/docs

3. Service 2: Express Gateway API (backend)
Navigate to the backend directory and install dependencies:

```Bash
cd ../backend
npm install
```
Configure environment variables in backend/.env:

```Code snippet
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/moody_jukebox?retryWrites=true&w=majority
ML_SERVICE_URL=[http://127.0.0.1:8000/predict](http://127.0.0.1:8000/predict)
```
Launch the gateway:

```Bash
node server.js
```

4. Service 3: React Client (frontend)

```Bash
cd ../frontend
npm install
npm run dev
```
Open http://localhost:5173 in your browser, allow camera permissions, and trigger a scan.