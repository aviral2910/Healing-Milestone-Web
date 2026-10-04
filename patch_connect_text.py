import re

with open('src/app/page.tsx', 'r') as f:
    content = f.read()

old_text = "Securely manage your patient roster and track healing milestones in one place. HM Connect is built for healthcare professionals, caregivers, and family members to stay updated on a patient's health snapshots."
new_text = "Your secure portal for managing and tracking health journeys. Whether you're tracking your own milestones, staying updated on a loved one, or managing a patient roster, HM Connect brings it all together in one place."

content = content.replace(old_text, new_text)

with open('src/app/page.tsx', 'w') as f:
    f.write(content)
