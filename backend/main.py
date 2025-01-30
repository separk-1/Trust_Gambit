from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from random import random
import math

app = FastAPI()

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 시스템 및 사용자 초기 상태
trust_level = 50  # 초기 Trustness
reward = 0  # 누적 리워드
attempts = 0  # 현재 시도 횟수
max_attempts = 10  # 최대 시도 횟수 (사용자가 설정 가능)
system_accuracy = 0.7  # 시스템의 신뢰도 (사용자가 조정 가능)
win_reward = 10  # 이겼을 때 리워드
lose_reward = -10  # 졌을 때 패널티

@app.post("/settings")
async def update_settings(request: Request):
    global system_accuracy, max_attempts, win_reward, lose_reward, attempts, reward, trust_level
    
    # 요청 JSON을 읽어 변수에 저장
    data = await request.json()
    print("Received settings:", data)  # 터미널에서 요청 데이터 확인

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

    attempts += 1  # 시도 횟수 증가
    ai_success = random() < system_accuracy  # AI의 성공 여부 결정
    human_success = (decision == "trust" and ai_success) or (decision == "doubt" and not ai_success)  # 인간이 성공했는지

    if human_success:
        message = f"Success! You made the right decision. +{win_reward} Reward"
        reward += win_reward  # 보상 추가
    else:
        message = f"Failed. Wrong choice... {lose_reward} Reward"
        reward += lose_reward  # 패널티 적용

    # Trustness는 로그 기반으로 업데이트
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