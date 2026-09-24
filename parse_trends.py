import json
import urllib.request

url = "https://healing-milestones-api.onrender.com/api/mix-views/MN1HQqobJ8/public"
req = urllib.request.Request(url, headers={'Accept': 'application/json'})
with urllib.request.urlopen(req) as response:
    data = json.loads(response.read().decode())

for trend in data.get('biomarkerTrends', []):
    if trend['name'] in ['Eosinophils', 'Lymphocytes']:
        print(f"--- {trend['name']} ---")
        for dp in trend['dataPoints']:
            print(dp)

