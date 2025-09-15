import json
import os
from typing import List, Dict

DATA_FILE = os.path.join(os.path.dirname(__file__), 'data', 'threats.json')

os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)

def load_threats() -> List[Dict]:
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        try:
            return json.load(f)
        except Exception:
            return []

def save_threats(threats: List[Dict]):
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(threats, f, indent=2)