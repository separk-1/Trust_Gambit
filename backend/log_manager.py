import json
import os
from datetime import datetime

LOG_DIR = "logs"
os.makedirs(LOG_DIR, exist_ok=True)

def save_log(data):
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    file_path = os.path.join(LOG_DIR, f"log_{timestamp}.json")

    with open(file_path, "w") as file:
        json.dump(data, file, indent=4)

    return file_path