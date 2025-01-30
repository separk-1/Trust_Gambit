import React, { useState } from "react";

function App() {
  const [trustLevel, setTrustLevel] = useState(50);
  const [result, setResult] = useState(null);

  const handleDecision = async (choice) => {
    const response = await fetch(`http://localhost:8000/game?decision=${choice}`);
    const data = await response.json();
    setResult(data);
    setTrustLevel(data.newTrustLevel);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Trust Gambit 🎭</h1>
      <p className="mb-2">Will you trust the AI's advice?</p>
      <div className="flex space-x-4 mt-4">
        <button onClick={() => handleDecision("trust")} className="px-4 py-2 bg-blue-500 text-white rounded">
          Trust
        </button>
        <button onClick={() => handleDecision("doubt")} className="px-4 py-2 bg-red-500 text-white rounded">
          Doubt
        </button>
      </div>
      {result && <p className="mt-4 text-lg">{result.message}</p>}
      <p className="mt-2">Current Trust Level: {trustLevel}%</p>
    </div>
  );
}

export default App;