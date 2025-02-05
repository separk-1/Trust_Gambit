import React, { useState, useEffect } from "react";
import Analysis from "./components/Analysis"; // 🔹 추가된 분석 컴포넌트

function App() {
  const [trustLevel, setTrustLevel] = useState(50);
  const [reward, setReward] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [maxAttempts, setMaxAttempts] = useState(10);
  const [systemAccuracy, setSystemAccuracy] = useState(70);
  const [winReward, setWinReward] = useState(10);
  const [loseReward, setLoseReward] = useState(-10);
  const [result, setResult] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [logData, setLogData] = useState([]); // 🔹 로그 데이터 저장
  const [logSaved, setLogSaved] = useState(false); // 🔹 로그 저장 성공 여부
  const [showAnalysis, setShowAnalysis] = useState(false);


  useEffect(() => {
    document.body.style.fontFamily = "'Montserrat', sans-serif";
  }, []);

  const startGame = async () => {
    const settings = {
      accuracy: systemAccuracy / 100,
      max_attempts_input: parseInt(maxAttempts),
      win_reward_input: parseInt(winReward),
      lose_reward_input: parseInt(loseReward),
    };

    console.log("Sending settings:", settings);

    try {
      const response = await fetch(`http://127.0.0.1:8000/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!response.ok) throw new Error("Failed to update settings");

      console.log("Game started successfully!");

      setGameStarted(true);
      setGameOver(false);
      setAttempts(0);
      setReward(0);
      setTrustLevel(50);
      setResult(null);
      setLogData([]); // 🔹 게임 시작 시 로그 초기화
      setLogSaved(false);
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setAttempts(0);
    setReward(0);
    setTrustLevel(50);
    setResult(null);
    setLogData([]); // 🔹 로그 초기화
    setLogSaved(false);
  };

  const handleDecision = async (choice) => {
    if (!gameStarted || gameOver) return;
    try {
      const response = await fetch(`http://127.0.0.1:8000/game?decision=${choice}`);
      if (!response.ok) throw new Error("API request failed");

      const data = await response.json();
      setResult(data);
      setTrustLevel(data.newTrustLevel);
      setReward(data.reward);
      setAttempts(data.attempts);
      setSystemAccuracy(data.systemAccuracy * 100);

      // 🔹 로그 데이터 저장
      setLogData((prevLogs) => [
        ...prevLogs,
        {
          attempt: data.attempts,
          decision: choice,
          aiSuccess: data.aiSuccess,
          humanSuccess: data.humanSuccess,
          trustLevel: data.newTrustLevel,
          reward: data.reward,
        },
      ]);

      if (data.gameOver) {
        setGameOver(true);
        setGameStarted(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const saveLog = async () => {
    if (logData.length === 0) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/save_log`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ log: logData }),
      });

      if (!response.ok) throw new Error("Failed to save log");

      const result = await response.json();
      console.log("Log saved:", result);
      setLogSaved(true); // 🔹 로그 저장 성공 표시
    } catch (error) {
      console.error("Error saving log:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-900">
      <h1 className="text-4xl font-bold mb-6">Trust Gambit</h1>

      {!gameStarted && !gameOver ? (
        <div className="p-6 bg-white rounded-lg shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-semibold mb-4">Game Settings</h2>
          <div className="grid grid-cols-2 gap-4 mb-4 text-left">
            <label className="flex flex-col">🤖 System Accuracy (%) 
              <input type="number" disabled={gameStarted} value={systemAccuracy} onChange={(e) => setSystemAccuracy(e.target.value)} className="border rounded px-2 py-1 mt-1" />
            </label>
            <label className="flex flex-col">🔢 Max Attempts 
              <input type="number" disabled={gameStarted} value={maxAttempts} onChange={(e) => setMaxAttempts(e.target.value)} className="border rounded px-2 py-1 mt-1" />
            </label>
            <label className="flex flex-col">🏆 Win Reward 
              <input type="number" disabled={gameStarted} value={winReward} onChange={(e) => setWinReward(e.target.value)} className="border rounded px-2 py-1 mt-1" />
            </label>
            <label className="flex flex-col">❌ Lose Penalty 
              <input type="number" disabled={gameStarted} value={loseReward} onChange={(e) => setLoseReward(e.target.value)} className="border rounded px-2 py-1 mt-1" />
            </label>
          </div>
          <button onClick={startGame} className="px-6 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition">
            Start Game
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center w-full">
          <p className="mt-4 text-lg font-semibold">Attempts: {attempts} / {maxAttempts}</p>
          <p className="text-lg font-semibold">Trustness: {trustLevel}%</p>
          <p className="text-lg font-semibold">Total Reward: {reward}</p>

          {gameStarted && (
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg text-center mb-6">
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">📊 Game Dashboard</h3>
              <div className="grid grid-cols-2 gap-4 text-left">
                <div className="bg-gray-100 p-4 rounded-md">
                  <p className="text-sm text-gray-600">🤖 System Accuracy</p>
                  <p className="text-lg font-semibold text-gray-800">{systemAccuracy}%</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-md">
                  <p className="text-sm text-gray-600">🔢 Max Attempts</p>
                  <p className="text-lg font-semibold text-gray-800">{maxAttempts}</p>
                </div>
                <div className="bg-green-100 p-4 rounded-md">
                  <p className="text-sm text-green-600">🏆 Win Reward</p>
                  <p className="text-lg font-semibold text-green-800">+{winReward}</p>
                </div>
                <div className="bg-red-100 p-4 rounded-md">
                  <p className="text-sm text-red-600">❌ Lose Penalty</p>
                  <p className="text-lg font-semibold text-red-800">{loseReward}</p>
                </div>
              </div>
            </div>
          )}

          {/* 게임 진행 중 선택 버튼 */}
          <div className="flex space-x-4 mt-4">
            <button
              onClick={() => handleDecision("trust")}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition w-32"
            >
              Trust
            </button>
            <button
              onClick={() => handleDecision("doubt")}
              className="px-6 py-3 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition w-32"
            >
              Doubt
            </button>
          </div>

          {/* 게임 종료 후 로그 저장 및 분석 버튼 */}
          {gameOver && (
            <div className="mt-6 flex flex-col items-center">
              <button
                onClick={resetGame}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600 transition w-40"
              >
                Reset Game
              </button>

              {!logSaved ? (
                <button
                  onClick={saveLog}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition w-40"
                >
                  Save Log
                </button>
              ) : (
                <p className="mt-2 text-green-600 font-semibold">✅ Log saved successfully!</p>
              )}

              <button
                onClick={() => setShowAnalysis(true)}
                className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg shadow-md hover:bg-purple-600 transition w-40"
              >
                View Analysis
              </button>

              {showAnalysis && <Analysis />}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;