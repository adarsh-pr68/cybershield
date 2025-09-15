import requests
from typing import List, Dict

CIRCL_LAST_URL = 'https://cve.circl.lu/api/last'


def ingest_circl_last(limit: int = 50) -> List[Dict]:
    """Fetch 'last' CVEs from circl.lu (if reachable).

    Returns a list of normalized threat dicts. If network fails, returns empty list.
    """
    out: List[Dict] = []
    try:
        r = requests.get(CIRCL_LAST_URL, timeout=10)
        r.raise_for_status()
        items = r.json()
        for item in items[:limit]:
            cvss = item.get('cvss') or 0
            if cvss is None:
                cvss = 0
            if cvss >= 9.0:
                severity = 'Critical'
            elif cvss >= 7.0:
                severity = 'High'
            elif cvss >= 4.0:
                severity = 'Medium'
            else:
                severity = 'Low'

            normalized = {
                'id': item.get('id') or item.get('Modified') or item.get('Published'),
                'title': f"{item.get('id')}",
                'description': item.get('summary') or '',
                'severity': severity,
                'priorityScore': int(min(100, max(0, (cvss or 0) * 10))),
                'category': 'CVE',
                'date': item.get('Published') or item.get('Modified') or '',
                'status': 'New',
                'affectedSystems': 1000,
                'threatActor': 'Unknown',
                'mitigation': 'Refer to vendor advisory / apply patch'
            }
            out.append(normalized)
    except Exception:
        # network error -> return empty list so the app can run offline
        return []

    return out