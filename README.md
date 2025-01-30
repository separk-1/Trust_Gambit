# Trust Gambit 🎭

## Overview
**Trust Gambit** is a web-based experimental game where players interact with an AI system, making decisions on whether to **trust** or **doubt** its advice. The game explores how trust evolves over time, how players calibrate their trust based on past experiences, and how different factors influence decision-making in uncertain environments.

## Features
- 🏆 **Trust Game Modeling**: AI provides recommendations with a probabilistic correctness, and players decide whether to trust it.
- 🔄 **Trust Calibration System**: Players either receive AI reliability information explicitly or learn it through experience.
- 📊 **Data Collection & Analysis**: Tracks user decisions and trust evolution for research purposes.
- 🌐 **Web-Based Interface**: Built using React for frontend and FastAPI for backend.

## Folder Structure
```
trust_gambit/
│── backend/              # FastAPI backend
│── frontend/             # React frontend
│── docs/                 # Documentation
│── README.md             # Project Overview
```

## Installation & Setup

### 1️⃣ **Backend Setup (FastAPI)**
Ensure Python 3.8+ is installed. Then, install dependencies and start the backend server:
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### 2️⃣ **Frontend Setup (React)**
Ensure Node.js 16+ is installed. Then, install dependencies and start the frontend:
```bash
cd frontend
npm install
npm start
```

### 3️⃣ **Run the Game**
Once both backend and frontend are running, open your browser and visit:
```
http://localhost:3000
```

## Technologies Used
- **Frontend:** React, TailwindCSS
- **Backend:** FastAPI, SQLite
- **Deployment:** Docker, AWS/GCP

## License
MIT License.
