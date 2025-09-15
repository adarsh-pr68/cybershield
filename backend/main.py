from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict
import os

from storage import load_threats, save_threats
from data_ingest import ingest_circl_last
from model import load_or_train, predict_priority

app = FastAPI(title='CyberShield Intelligence API')
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=['*'], allow_headers=['*'])

MODEL = load_or_train()

@app.on_event('startup')
async def startup_tasks():
    # create empty file if missing
    if not os.path.exists(os.path.join(os.path.dirname(__file__), 'data')):
        os.makedirs(os.path.join(os.path.dirname(__file__), 'data'), exist_ok=True)
    if not os.path.exists(os.path.join(os.path.dirname(__file__), 'data', 'threats.json')):
        save_threats([])


@app.get('/api/threats')
async def api_get_threats() -> List[Dict]:
    threats = load_threats()
    threats = predict_priority(threats, MODEL)
    return threats


@app.get('/api/threats/stats')
async def api_get_stats() -> Dict:
    threats = load_threats()
    total = len(threats)
    critical = sum(1 for t in threats if t.get('severity') == 'Critical')
    avg_resp = '2.4h'
    return {'totalThreats': total, 'criticalThreats': critical, 'activeIncidents': 3, 'avgResponseTime': avg_resp}


@app.post('/api/threats/ingest')
async def api_ingest(source: str = 'circl'):
    if source == 'circl':
        items = ingest_circl_last(limit=50)
    else:
        items = []
    if not items:
        return {'added': 0}
    existing = load_threats()
    # naive append (in real app you'd dedupe by CVE id)
    combined = existing + items
    save_threats(combined)
    return {'added': len(items)}


@app.get('/api/patterns')
async def api_patterns():
    # Basic pattern matching: cluster by description similarity
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.cluster import KMeans
    threats = load_threats()
    docs = [t.get('description', '')[:1000] for t in threats]
    if not docs:
        return {'clusters': []}
    vect = TfidfVectorizer(stop_words='english', max_features=500)
    X = vect.fit_transform(docs)
    n_clusters = min(6, max(1, int(len(docs) / 3)))
    kmeans = KMeans(n_clusters=n_clusters, random_state=42).fit(X)
    clusters = {}
    for i, label in enumerate(kmeans.labels_):
        clusters.setdefault(str(label), []).append(threats[i])
    return {'clusters': clusters}


@app.post('/api/subscribe')
async def api_subscribe(email: str):
    # minimal persistence - append to file
    subs_file = os.path.join(os.path.dirname(__file__), 'data', 'subscribers.json')
    subs = []
    if os.path.exists(subs_file):
        import json
        with open(subs_file, 'r', encoding='utf-8') as f:
            try:
                subs = json.load(f)
            except Exception:
                subs = []
    if email in subs:
        return {'ok': True, 'message': 'already subscribed'}
    subs.append(email)
    with open(subs_file, 'w', encoding='utf-8') as f:
        import json
        json.dump(subs, f, indent=2)
    return {'ok': True}


@app.post('/api/assessments/submit')
async def api_assess_submission(payload: Dict):
    # Very simple grading: if user identifies CVE id in the 'analysis' text -> pass
    text = payload.get('analysis', '')
    if 'CVE-' in text.upper():
        return {'score': 80, 'feedback': 'Good — you identified the CVE. Expand on mitigations for higher score.'}
    return {'score': 40, 'feedback': 'Try to reference specific CVEs or indicators of compromise.'}