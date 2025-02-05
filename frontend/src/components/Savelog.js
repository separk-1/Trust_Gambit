import React from "react";
import { saveLog } from "../api";

const SaveLog = ({ logData, onSaveSuccess }) => {
    const handleSave = async () => {
        const result = await saveLog(logData);
        alert(result.message);  // 성공/실패 메시지 표시
        if (onSaveSuccess) onSaveSuccess(result);
    };

    return (
        <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
        >
            Save Log
        </button>
    );
};

export default SaveLog;