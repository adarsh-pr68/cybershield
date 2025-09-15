import os
import joblib
import numpy as np
from typing import List, Dict
from sklearn.ensemble import RandomForestRegressor

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model.joblib')


def _featurize_item(item: Dict):
    affected = float(item.get('affectedSystems') or 0)
    severity_map = {'Low': 0, 'Medium': 1, 'High': 2, 'Critical': 3}
    sev = float(severity_map.get(item.get('severity', 'Low'), 0))
    # recency: days since published (if date provided, else 0)
    from datetime import datetime
    date_str = item.get('date')
    age_days = 0
    if date_str:
        try:
            # try ISO format
            dt = datetime.fromisoformat(date_str)
            age_days = (datetime.utcnow() - dt).days
        except Exception:
            age_days = 0

    # small transforms to keep values reasonable
    if affected <= 0:
        log_affected = 0.0
    else:
        log_affected = np.log10(affected + 1)

    return [log_affected, sev, age_days]


def train_synthetic_model(save: bool = True):
    """Create and train a small RandomForestRegressor on synthetic data.

    This helps show a simple ML prioritizer that can be improved later with real labeled data.
    """
    import random

    X = []
    y = []
    for i in range(1000):
        affected = 10 ** random.uniform(0, 6)  # 1 .. 1e6
        sev = random.choices([0, 1, 2, 3], weights=[50, 30, 15, 5])[0]
        age = random.randint(0, 365)
        base = 20 * sev + (np.log10(affected + 1) / 6.0) * 50 - age * 0.05 + random.uniform(-5, 5)
        score = max(0, min(100, base))
        X.append([np.log10(affected + 1), sev, age])
        y.append(score)

    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X, y)
    if save:
        joblib.dump(model, MODEL_PATH)
    return model


def load_or_train():
    if os.path.exists(MODEL_PATH):
        try:
            return joblib.load(MODEL_PATH)
        except Exception:
            return train_synthetic_model(save=True)
    else:
        return train_synthetic_model(save=True)


def predict_priority(threats: List[Dict], model=None) -> List[Dict]:
    if model is None:
        model = load_or_train()
    X = [_featurize_item(t) for t in threats]
    if not X:
        return threats
    preds = model.predict(X)
    for t, p in zip(threats, preds):
        t['priorityScore'] = int(max(0, min(100, round(float(p)))))
    return threats