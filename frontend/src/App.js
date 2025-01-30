import React, { useState, useEffect } from "react";

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

      if (data.gameOver) {
        setGameOver(true);
        setGameStarted(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
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
          <div className="grid grid-cols-2 gap-6 mb-6 text-center">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-lg font-semibold">🤖 System Accuracy</p>
              <p className="text-xl text-gray-700">{systemAccuracy}%</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-lg font-semibold">🔢 Max Attempts</p>
              <p className="text-xl text-gray-700">{maxAttempts}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-lg font-semibold">🏆 Win Reward</p>
              <p className="text-xl text-green-600">{winReward}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-lg font-semibold">❌ Lose Penalty</p>
              <p className="text-xl text-red-600">{loseReward}</p>
            </div>
          </div>

          <p className="mt-4 text-lg font-semibold">Attempts: {attempts} / {maxAttempts}</p>
          <p className="text-lg font-semibold">Trustness: {trustLevel}%</p>
          <p className="text-lg font-semibold">Total Reward: {reward}</p>

          <div className="flex space-x-6 mt-4">
            <button onClick={() => handleDecision("trust")} className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition">Trust</button>
            <button onClick={() => handleDecision("doubt")} className="px-6 py-3 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition">Doubt</button>
          </div>

          {gameOver && (
            <button onClick={resetGame} className="mt-6 px-4 py-2 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600 transition">
              Reset Game
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default App;