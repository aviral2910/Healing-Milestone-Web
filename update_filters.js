const fs = require('fs');
const file = 'src/app/snapshot/[id]/SnapshotTimeline.tsx';
let code = fs.readFileSync(file, 'utf8');

const oldFilters = `            {[
              { id: 'all', label: \`All Records (\${timeline.length})\`, icon: <><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></> },
              { id: 'medical_records', label: \`Medical Records (\${countMedicalRecords})\`, icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></> },
              { id: 'reports', label: \`Lab Reports (\${countReports})\`, icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></> },
              { id: 'prescriptions', label: \`Prescriptions (\${countPrescriptions})\`, icon: <><circle cx="7" cy="7" r="5"></circle><circle cx="17" cy="17" r="5"></circle><line x1="12" y1="17" x2="12" y2="17"></line></> },
              { id: 'biomarkers', label: 'Has Biomarkers', icon: <><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></> },
              { id: 'milestones', label: \`Clinical Notes (\${countMilestones})\`, icon: <><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></> },
            ]`;

const newFilters = `            {[
              { id: 'all', label: \`All Records (\${timeline.length})\`, icon: <><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></> },
              { id: 'reports', label: \`Lab Reports (\${countReports})\`, icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></> },
              { id: 'prescriptions', label: \`Prescriptions (\${countPrescriptions})\`, icon: <><circle cx="7" cy="7" r="5"></circle><circle cx="17" cy="17" r="5"></circle><line x1="12" y1="17" x2="12" y2="17"></line></> },
              { id: 'milestones', label: \`Journey (\${countMilestones})\`, icon: <><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></> },
            ]`;

if (code.includes(oldFilters)) {
  code = code.replace(oldFilters, newFilters);
  fs.writeFileSync(file, code);
  console.log("Filters updated.");
} else {
  console.log("Could not find filters array.");
}
