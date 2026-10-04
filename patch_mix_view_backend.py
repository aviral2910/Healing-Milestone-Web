import re

with open('/Users/aviraldixit/self/healing_milestones_backend/app/api/endpoints/mix_views.py', 'r') as f:
    content = f.read()

old_journeys = """        "journeys": [
            {
                "id": str(j.id),
                "heading": j.title,
                "authorName": j.user.display_name if j.user else "Anonymous Patient"
            } for j in journeys
        ],"""

new_journeys = """        "journeys": [
            {
                "id": str(j.id),
                "heading": j.title,
                "authorName": j.user.display_name if j.user else "Anonymous Patient",
                "authorId": str(j.user.id) if j.user else None
            } for j in journeys
        ],"""

content = content.replace(old_journeys, new_journeys)

with open('/Users/aviraldixit/self/healing_milestones_backend/app/api/endpoints/mix_views.py', 'w') as f:
    f.write(content)
