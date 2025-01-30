# Trust Gambit 🎭

## Overview
**Trust Gambit** is a web-based experimental game where players interact with an AI system, making decisions on whether to **trust** or **doubt** its advice. The game explores how trust evolves over time, how players calibrate their trust based on past experiences, and how different factors influence decision-making in uncertain environments.

## Features
- 🏆 **Trust Game Modeling**: AI provides recommendations with a probabilistic correctness, and players decide whether to trust it.
- 🔄 **Trust Calibration System**: Players either receive AI reliability information explicitly or learn it through experience.
- 📊 **Data Collection & Analysis**: Tracks user decisions, trust evolution, and AI interaction patterns for research purposes.
- 🎛️ **Dynamic Settings**: Players can customize game parameters, including AI reliability, reward values, and maximum attempts.
- 📊 **Dashboard UI**: During gameplay, real-time game settings and statistics (trust level, rewards, attempts) are displayed.
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
Ensure Python 3.10+ is installed. Then, create a virtual environment and install dependencies:
```bash
conda create -n trust_gambit python=3.10
conda activate trust_gambit

cd backend
pip install -r ../requirements.txt
```

Run the FastAPI backend:
```bash
uvicorn main:app --reload
```

Test the API:
- Open **http://127.0.0.1:8000/docs** to see the interactive API documentation.

---

### 2️⃣ **Frontend Setup (React)**
Ensure Node.js 18+ is installed. Then, install dependencies and start the frontend:
```bash
cd frontend
npm install
npm start
```

If you see security warnings, you can run:
```bash
npm audit fix
```

---

### 3️⃣ **Run the Game**
Once both backend and frontend are running, open your browser and visit:
```
http://localhost:3000
```

---

## **Gameplay & UI**
- 🎛️ **Game Settings UI**:
  - Players can configure **System Accuracy**, **Max Attempts**, **Win Reward**, and **Lose Penalty** before starting the game.
  - Once the game starts, settings are locked and displayed in the dashboard.
- 📊 **Dashboard UI**:
  - Displays **real-time game statistics**, including **Trust Level, Total Reward, Attempts Remaining**, and AI reliability.
- 🎭 **Game Decision UI**:
  - Players make a **Trust or Doubt decision** based on AI's recommendation.
  - The game provides instant feedback on the correctness of the decision.

---

## **Next Steps & Improvements**
Although **Trust Gambit** provides a fundamental trust-based decision game, additional features are required to align it more closely with research goals.

### 🔥 **Priority Improvements**
1️⃣ **Add Hidden Trust Mode**  
   - Players should have an option to **hide AI’s reliability (System Accuracy)** and learn through experience.  
   - This will allow studying **trust calibration over time.**

2️⃣ **Differentiate Trust Failure vs. Doubt Failure**  
   - Implement distinct penalties for:  
     - **"Trust but AI was wrong"** → Higher penalty  
     - **"Doubt but AI was right"** → Lower penalty  
   - This differentiation will help analyze **trust evolution dynamics.**

3️⃣ **Dynamic Reward Structure**  
   - Currently, rewards are fixed, but **gradual reward decay or adaptive rewards should be implemented** to examine trust behavior under changing incentives.

4️⃣ **User-Perceived Trust vs. Actual AI Trust Analysis**  
   - Implement a feature where users estimate **how trustworthy they think the AI is** and compare this with actual AI trustworthiness.

5️⃣ **Reinforcement Learning & Trust Strategy Modeling**  
   - Log user interactions and study how users **optimize their trust decisions over multiple trials**.  
   - This will enable **strategy modeling and potential AI-driven feedback mechanisms.**

### 🚀 **Development Roadmap**
- ✅ **Basic trust game mechanics implemented**  
- 🔄 **Currently improving settings UI & dashboard**  
- 🛠 **Next: Add Hidden Trust Mode & Trust-Doubt failure differentiation**  
- 📊 **Future: Implement Reinforcement Learning analysis**  

---

## **Troubleshooting**
### **Backend Issues**
- If FastAPI doesn’t start, make sure you're in the correct environment:
  ```bash
  conda activate trust_gambit
  ```
- Ensure required dependencies are installed:
  ```bash
  pip install -r ../requirements.txt
  ```
- If React cannot fetch data, check if FastAPI is running:
  ```bash
  ps aux | grep uvicorn
  ```

### **Frontend Issues**
- If `npm start` doesn't work, try reinstalling dependencies:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  npm start
  ```
- If the UI is blank, ensure `frontend/src/App.js` has valid content.

---

## Technologies Used
- **Frontend:** React, TailwindCSS
- **Backend:** FastAPI, SQLite
- **Deployment:** Docker, AWS/GCP

## License
MIT License.
