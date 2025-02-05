import os
import json
import pandas as pd
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from random import random
from log_manager import save_log
import math

app = FastAPI()
LOG_DIR = "logs"

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 시스템 및 사용자 초기 상태
trust_level = 50
reward = 0
attempts = 0
max_attempts = 10
system_accuracy = 0.7
win_reward = 10
lose_reward = -10

def load_latest_log():
    """logs 폴더에서 가장 최근 실험 데이터를 불러옴"""
    if not os.path.exists(LOG_DIR):
        os.makedirs(LOG_DIR)

    log_files = sorted(os.listdir(LOG_DIR), reverse=True)
    if not log_files:
        return []

    latest_log_file = log_files[0]
    log_path = os.path.join(LOG_DIR, latest_log_file)

    try:
        with open(log_path, "r") as f:
            log_data = json.load(f)
            return log_data.get("log", [])  # 최근 실험 데이터 반환
    except Exception as e:
        print(f"Error loading log file: {e}")
        return []

def load_all_logs():
    """logs 폴더의 모든 실험 데이터를 합쳐서 반환"""
    if not os.path.exists(LOG_DIR):
        os.makedirs(LOG_DIR)

    all_logs = []
    log_files = sorted(os.listdir(LOG_DIR))

    for log_file in log_files:
        log_path = os.path.join(LOG_DIR, log_file)
        try:
            with open(log_path, "r") as f:
                log_data = json.load(f)
                all_logs.extend(log_data.get("log", []))  # 모든 실험 데이터를 리스트로 합침
        except Exception as e:
            print(f"Error loading log file {log_file}: {e}")

    return all_logs

@app.get("/recent_analysis")
async def get_recent_analysis():
    """방금 저장된 실험 데이터를 분석"""
    game_logs = load_latest_log()

    if not game_logs:
        return {"message": "No recent game data available."}

    df = pd.DataFrame(game_logs)

    # 실패 후 신뢰도 변화 분석
    failed_attempts = df[df["humanSuccess"] == False]
    trust_after_fail = failed_attempts["decision"].value_counts(normalize=True).to_dict()

    # 신뢰도 변화 패턴 분석
    trust_trend = df[["attempt", "trustLevel"]].to_dict(orient="records")

    return {
        "trust_after_fail": trust_after_fail,
        "trust_trend": trust_trend
    }

@app.get("/full_analysis")
async def get_full_analysis():
    """전체 실험 데이터를 합쳐서 분석"""
    all_logs = load_all_logs()

    if not all_logs:
        return {"message": "No game data available."}

    df = pd.DataFrame(all_logs)

    # 실패 후 신뢰도 변화 분석
    failed_attempts = df[df["humanSuccess"] == False]
    trust_after_fail = failed_attempts["decision"].value_counts(normalize=True).to_dict()

    # 신뢰도 변화 패턴 분석
    trust_trend = df[["attempt", "trustLevel"]].to_dict(orient="records")

    return {
        "trust_after_fail": trust_after_fail,
        "trust_trend": trust_trend
    }

@app.post("/save_log")
async def save_log_endpoint(request: Request):
    data = await request.json()
    file_path = save_log(data)
    return {"message": "Log saved successfully", "file": file_path}

@app.post("/settings")
async def update_settings(request: Request):
    global system_accuracy, max_attempts, win_reward, lose_reward, attempts, reward, trust_level
    
    data = await request.json()
    print("Received settings:", data)

    system_accuracy = data.get("accuracy", 0.7)
    max_attempts = data.get("max_attempts_input", 10)
    win_reward = data.get("win_reward_input", 10)
    lose_reward = data.get("lose_reward_input", -10)
    
    # 게임 초기화
    attempts = 0
    reward = 0
    trust_level = 50

    return {
        "message": "Settings updated successfully",
        "systemAccuracy": system_accuracy,
        "maxAttempts": max_attempts,
        "winReward": win_reward,
        "loseReward": lose_reward
    }

@app.get("/game")
def play_game(decision: str):
    global trust_level, reward, attempts

    if attempts >= max_attempts:
        return {"message": "Game Over! Restart to play again.", "gameOver": True}

    attempts += 1
    ai_success = random() < system_accuracy
    human_success = (decision == "trust" and ai_success) or (decision == "doubt" and not ai_success)

    if human_success:
        message = f"Success! You made the right decision. +{win_reward} Reward"
        reward += win_reward
    else:
        message = f"Failed. Wrong choice... {lose_reward} Reward"
        reward += lose_reward

    trust_level = min(100, max(0, int(50 + 50 * math.log1p(attempts) * (reward / max(1, attempts)))))

    return {
        "message": message,
        "newTrustLevel": trust_level,
        "reward": reward,
        "attempts": attempts,
        "maxAttempts": max_attempts,
        "systemAccuracy": system_accuracy,
        "aiSuccess": ai_success,
        "humanSuccess": human_success,
        "gameOver": attempts >= max_attempts
    }