import matplotlib.pyplot as plt
from analyze_logs import load_logs, analyze_trust_patterns

def plot_trust_patterns(success_cases, fail_cases):
    """ Visualize trust/doubt patterns after success and failure """
    success_counts = success_cases["next_decision"].value_counts(normalize=True) * 100
    fail_counts = fail_cases["next_decision"].value_counts(normalize=True) * 100

    labels = ["Trust", "Doubt"]
    success_values = [success_counts.get("trust", 0), success_counts.get("doubt", 0)]
    fail_values = [fail_counts.get("trust", 0), fail_counts.get("doubt", 0)]

    fig, ax = plt.subplots(1, 2, figsize=(12, 5))

    # 성공 후 신뢰/불신 변화
    ax[0].bar(labels, success_values, color=["blue", "red"])
    ax[0].set_title("📊 After Success")
    ax[0].set_ylim(0, 100)
    ax[0].set_ylabel("Percentage (%)")

    # 실패 후 신뢰/불신 변화
    ax[1].bar(labels, fail_values, color=["blue", "red"])
    ax[1].set_title("📉 After Failure")
    ax[1].set_ylim(0, 100)

    plt.suptitle("AI Trust/Doubt Patterns Based on Success/Failure")
    plt.show()

if __name__ == "__main__":
    df = load_logs()
    success_cases, fail_cases = analyze_trust_patterns(df)
    plot_trust_patterns(success_cases, fail_cases)