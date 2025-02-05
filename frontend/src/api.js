const BASE_URL = "http://127.0.0.1:8000";

export const saveLog = async (logData) => {
    try {
        const response = await fetch(`${BASE_URL}/save_log`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(logData),
        });
        return await response.json();
    } catch (error) {
        console.error("Error saving log:", error);
        return { message: "Failed to save log" };
    }
};