# backend/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from random import random

app = FastAPI()

# Allow frontend requests (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

trust_level = 50  # Initial trust level

@app.get("/game")
def play_game(decision: str):
    global trust_level

    ai_correct = random() < 0.7  # AI is correct 70% of the time
    if decision == "trust":
        if ai_correct:
            message = "AI gave correct advice! +10 trust"
            trust_level += 10
        else:
            message = "AI was wrong... -20 trust"
            trust_level -= 20
    else:  # decision == "doubt"
        if ai_correct:
            message = "AI was correct, but you doubted it. -10 trust"
            trust_level -= 10
        else:
            message = "AI was wrong, and you were right! +5 trust"
            trust_level += 5

    trust_level = max(0, min(100, trust_level))  # Keep trust level between 0-100
    return {"message": message, "newTrustLevel": trust_level}

# Run using: uvicorn main:app --reload
