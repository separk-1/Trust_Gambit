import React, { useState, useEffect } from "react";

function Analysis() {
  const [recentData, setRecentData] = useState(null);
  const [fullData, setFullData] = useState(null);

  useEffect(() => {
    fetchRecentAnalysis();
    fetchFullAnalysis();
  }, []);

  const fetchRecentAnalysis = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/recent_analysis");
      const data = await response.json();
      setRecentData(data);
    } catch (error) {
      console.error("Error fetching recent analysis:", error);
    }
  };

  const fetchFullAnalysis = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/full_analysis");
      const data = await response.json();
      setFullData(data);
    } catch (error) {
      console.error("Error fetching full analysis:", error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg w-full max-w-2xl">
      <h2 className="text-2xl font-semibold text-center mb-4">Analysis</h2>

      {/* 방금 한 실험 분석 */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-700">📊 Recent Experiment</h3>
        {recentData ? (
          <div>
            <p><strong>Trust after fail:</strong> {JSON.stringify(recentData.trust_after_fail)}</p>
            <p><strong>Trust trend:</strong></p>
            <ul>
              {recentData.trust_trend.map((entry, index) => (
                <li key={index}>Attempt {entry.attempt}: {entry.trustLevel}%</li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-gray-500">No recent data available.</p>
        )}
      </div>

      <hr className="my-4" />

      {/* 전체 실험 분석 */}
      <div>
        <h3 className="text-xl font-semibold text-gray-700">🌍 All Experiments</h3>
        {fullData ? (
          <div>
            <p><strong>Trust after fail:</strong> {JSON.stringify(fullData.trust_after_fail)}</p>
            <p><strong>Trust trend:</strong></p>
            <ul>
              {fullData.trust_trend.map((entry, index) => (
                <li key={index}>Attempt {entry.attempt}: {entry.trustLevel}%</li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-gray-500">No full experiment data available.</p>
        )}
      </div>
    </div>
  );
}

export default Analysis;