import os
import json
import pandas as pd
import matplotlib.pyplot as plt

LOG_DIR = "backend/logs"

def load_logs():
    """ Load all logs from the logs folder """
    all_logs = []
    for file in os.listdir(LOG_DIR):
        if file.endswith(".json"):
            with open(os.path.join(LOG_DIR, file), "r") as f:
                data = json.load(f)
                all_logs.extend(data["log"])  # 로그 리스트 합치기
    return pd.DataFrame(all_logs)

def analyze_trust_patterns(df):
    """ Analyze trust patterns based on success/failure """
    if df.empty:
        print("No log data found.")
        return

    # 성공 / 실패 여부에 따른 인간의 다음 선택 분석
    df["next_decision"] = df["decision"].shift(-1)  # 다음 시도에서 인간이 내린 선택

    # 보상을 얻은 경우 vs 보상을 얻지 못한 경우
    success_cases = df[df["humanSuccess"] == True]
    fail_cases = df[df["humanSuccess"] == False]

    print("\n🔍 Trust Patterns Analysis 🔍")
    print(f"Total Attempts: {len(df)}")
    print(f"Successful Decisions: {len(success_cases)} ({len(success_cases) / len(df) * 100:.2f}%)")
    print(f"Failed Decisions: {len(fail_cases)} ({len(fail_cases) / len(df) * 100:.2f}%)\n")

    # 성공했을 때 vs 실패했을 때 다음 선택 패턴
    print("📊 After Success:")
    print(success_cases["next_decision"].value_counts(normalize=True) * 100)

    print("\n📉 After Failure:")
    print(fail_cases["next_decision"].value_counts(normalize=True) * 100)

    return success_cases, fail_cases

if __name__ == "__main__":
    df = load_logs()
    analyze_trust_patterns(df)