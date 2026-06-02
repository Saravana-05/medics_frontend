export const MOCK_PATIENTS = [
  {
    id: "PID-1042", docNo: "OP: 3902",
    name: "Smt. Vijayalakshmi", relation: "W/o. Sri.Krishnaswamy",
    age: 29, dob: "31/01/1995", gender: "F", weight: "86KG",
    height: '68"', bpSystolic: 145, bpDiastolic: 90, pulse: 95, temp: "101.2",
    bloodGroup: "O+", pregnancy: "Yes. 60 Days",
    chiefComplaint: "Allergy, Anxiety",
    firstObservation: "Rashes, Weak, No sleep",
    nextVisitDue: "05/02/2024", referral: "Dr.Sheela (From)",
    slot: "09:30", dept: "General Medicine", appt: "APT-001",
    docDate: "03/02/2024 14:02",
    photo: "https://randomuser.me/api/portraits/women/68.jpg", // Female patient photo

    /* ── Patient Information panel data ── */
    address: {
      line1: "Ram Krishna Apartments",
      line2: "12/24, Srinivasapuram 3rd St.",
      line3: "Samayanallur - 625 102",
      line4: "Madurai Dt",
      phone: "9855523456",
    },
    attendant: {
      name: "Sri.Krishnaswamy",
      relationship: "Husband",
      phone: "9300440039",
    },
    appointment: {
      datetime: "03/02/2024 14:00",
      priority: "Normal",
    },
    todaysVisit: {
      type: "Follow-up",
      firstVisit: "08/09/2012",
      visitCount: 45,
      corporate: "No",
      fee: "Cash",
    },
    insurer: {
      name: "ABCH",
      plan: "Plat.Enhanced",
      period: "Till 31/01/2025",
      claim: "OP-No|Day-No|IP-Yes",
    },
    gynacInfo: {
      lmp: "28/11/2023",
      doc: "05/12/2023",
      edd: "10/09/2024",
      pregnancies: 3,
      deliveries: 1,
      abortions: 1,
      livingChildren: 1,
    },
    ipInfo: {
      ward: "—", bed: "—", admitDate: "—", consultant: "—",
    },

    chronicAllergy: [
      { type: "Allergy", name: "Penicillin",       since: "2018", severity: "High"   },
      { type: "Chronic", name: "Hypertension",      since: "2020", severity: "Medium" },
      { type: "Allergy", name: "Dust Mites",        since: "2015", severity: "Low"    },
      { type: "Chronic", name: "Anxiety Disorder",  since: "2021", severity: "Medium" },
    ],
    family: [
      { relation: "Father",  name: "Sri.Krishnaswamy", age: 58, condition: "Diabetes"     },
      { relation: "Mother",  name: "Smt.Kamala",        age: 54, condition: "Hypertension" },
      { relation: "Husband", name: "Sri.Ramesh",         age: 34, condition: "Nil"          },
    ],
  },
  {
    id: "PID-2187", docNo: "OP: 3903",
    name: "Mr. Karthik Selvam", relation: "S/o. Sri.Selvam",
    age: 27, dob: "10/05/1997", gender: "M", weight: "72KG",
    height: '67"', bpSystolic: 120, bpDiastolic: 80, pulse: 78, temp: "98.6",
    bloodGroup: "B+", pregnancy: "N/A",
    chiefComplaint: "Fever, Headache",
    firstObservation: "High fever since 2 days, body pain",
    nextVisitDue: "10/02/2024", referral: "Self",
    slot: "10:00", dept: "General Medicine", appt: "APT-002",
    docDate: "03/02/2024 10:12",
    photo: "https://randomuser.me/api/portraits/men/32.jpg", // Male patient photo

    address: {
      line1: "45, Anna Nagar 2nd Cross",
      line2: "Bypass Road",
      line3: "Madurai - 625 020",
      line4: "Madurai Dt",
      phone: "9000112233",
    },
    attendant: {
      name: "Sri.Selvam",
      relationship: "Father",
      phone: "9500223344",
    },
    appointment: {
      datetime: "03/02/2024 10:00",
      priority: "Normal",
    },
    todaysVisit: {
      type: "First Visit",
      firstVisit: "03/02/2024",
      visitCount: 1,
      corporate: "No",
      fee: "Cash",
    },
    insurer: {
      name: "None",
      plan: "—",
      period: "—",
      claim: "—",
    },
    gynacInfo: null,
    ipInfo: { ward: "—", bed: "—", admitDate: "—", consultant: "—" },

    chronicAllergy: [
      { type: "Allergy", name: "Sulfa drugs", since: "2019", severity: "High" },
    ],
    family: [],
  },
  {
    id: "PID-3301", docNo: "OP: 3904",
    name: "Smt. Lakshmi Devi", relation: "W/o. Sri.Mohan",
    age: 52, dob: "15/03/1972", gender: "F", weight: "68KG",
    height: '62"', bpSystolic: 150, bpDiastolic: 95, pulse: 88, temp: "99.1",
    bloodGroup: "A+", pregnancy: "No",
    chiefComplaint: "Knee Pain, Swelling",
    firstObservation: "Bilateral knee pain, difficulty walking",
    nextVisitDue: "17/02/2024", referral: "Dr.Arun (From)",
    slot: "10:30", dept: "General Medicine", appt: "APT-003",
    docDate: "03/02/2024 10:35",
    photo: "https://randomuser.me/api/portraits/women/45.jpg", // Female patient photo

    address: {
      line1: "7/B, Meenakshi Nagar",
      line2: "Thirunagar Post",
      line3: "Madurai - 625 006",
      line4: "Madurai Dt",
      phone: "9876541100",
    },
    attendant: {
      name: "Sri.Mohan",
      relationship: "Husband",
      phone: "9444556677",
    },
    appointment: {
      datetime: "03/02/2024 10:30",
      priority: "Urgent",
    },
    todaysVisit: {
      type: "Follow-up",
      firstVisit: "20/01/2024",
      visitCount: 8,
      corporate: "No",
      fee: "Insurance",
    },
    insurer: {
      name: "Star Health",
      plan: "Family Health Optima",
      period: "Till 30/06/2024",
      claim: "OP-Yes|Day-Yes|IP-Yes",
    },
    gynacInfo: {
      lmp: "N/A", doc: "N/A", edd: "N/A",
      pregnancies: 2, deliveries: 2, abortions: 0, livingChildren: 2,
    },
    ipInfo: { ward: "—", bed: "—", admitDate: "—", consultant: "—" },

    chronicAllergy: [
      { type: "Chronic", name: "Osteoarthritis",  since: "2019", severity: "High" },
      { type: "Chronic", name: "Diabetes Type 2", since: "2018", severity: "High" },
    ],
    family: [],
  },
];

export const PREVIOUS_VISITS = {
  "PID-1042": [
    { sl: 45, entryDt: "02/02/2024 16:02", docModule: "3902: OP-DP",  reportDt: "",              complaint: "Allergy, Anxiety",  vitals: "86/25.7/140:90:96/98.6", by: "Dr.Chandra Sekar", nextVisit: "03/02/2024" },
    { sl: 44, entryDt: "02/02/2024 12:30", docModule: "3902: OP-LP-R",reportDt: "02/02/2024 16.00", complaint: "Allergy, Anxiety",  vitals: "86/25.7/145:90:95/101.", by: "Dr.Chandra Sekar", nextVisit: "03/02/2024" },
    { sl: 43, entryDt: "21/01/2024 12:15", docModule: "2911: IP-F",   reportDt: "",              complaint: "Bowel Irritation",  vitals: "85/25/120:80:96/98.6",  by: "Dr.Sheela",       nextVisit: "" },
    { sl: 42, entryDt: "21/01/2024 12:10", docModule: "2911: IP-DP",  reportDt: "",              complaint: "Bowel Irritation",  vitals: "85/25/120:80:96/98.6",  by: "Dr.Sheela",       nextVisit: "" },
    { sl: 41, entryDt: "21/01/2024 10:22", docModule: "2911: IP-SP-R",reportDt: "21/01/2024 12.07", complaint: "Bowel Irritation",  vitals: "85/25/130:80:96/98.6",  by: "Dr.Sheela",       nextVisit: "" },
    { sl: 40, entryDt: "21/01/2024 10:20", docModule: "2911: IP-LP-R",reportDt: "21/01/2024 12.05", complaint: "Bowel Irritation",  vitals: "85/25/120:80:96/98.6",  by: "Dr.Sheela",       nextVisit: "" },
    { sl: 39, entryDt: "13/06/2023 10:30", docModule: "1211: OP-DP",  reportDt: "",              complaint: "Stomach Pain",      vitals: "86/25.7/130:85:95/98.6",by: "Nr.Sridevi",      nextVisit: "" },
    { sl: 38, entryDt: "12/06/2023 09:10", docModule: "1211: OP-SP-R",reportDt: "13/06/2023 10.30", complaint: "Stomach Pain",      vitals: "86/25.7/130:85:95/98.6",by: "Dr.Arun",         nextVisit: "13/06/2023" },
  ],
  "PID-2187": [
    { sl: 12, entryDt: "28/01/2024 09:00", docModule: "3850: OP-DP",  reportDt: "",              complaint: "Fever, Headache",   vitals: "72/--/120:80:78/98.6",  by: "Dr.Chandra Sekar", nextVisit: "03/02/2024" },
  ],
  "PID-3301": [
    { sl: 8,  entryDt: "20/01/2024 11:00", docModule: "3810: OP-DP",  reportDt: "",              complaint: "Knee Pain",         vitals: "68/--/150:95:88/99.1",  by: "Dr.Arun",         nextVisit: "03/02/2024" },
  ],
};

export const DRUG_SUGGESTIONS = [
  "Paracetamol 500mg Tab","Amoxicillin 250mg Cap","Ibuprofen 400mg Tab",
  "Metformin 500mg Tab","Atorvastatin 10mg Tab","Omeprazole 20mg Cap",
  "Azithromycin 500mg Tab","Cetirizine 10mg Tab","Pantoprazole 40mg Tab",
  "Ranitidine 150mg Tab","Dolo 650mg Tab","Crocin 500mg Tab",
  "Combiflam Tab","Allegra 120mg Tab","Montair LC Tab",
];

export const LAB_SUGGESTIONS = [
  "Complete Blood Count (CBC)","Blood Sugar Fasting","Blood Sugar PP",
  "HbA1c","Lipid Profile","Thyroid Profile (T3,T4,TSH)",
  "Liver Function Test (LFT)","Kidney Function Test (KFT)","Urine Routine",
  "ESR","CRP","Dengue NS1 Antigen","Malaria Antigen Test",
  "Widal Test","HIV Screening",
];

export const SERVICE_SUGGESTIONS = [
  "X-Ray Chest PA","X-Ray Right Knee AP/Lat","X-Ray Left Knee AP/Lat",
  "USG Abdomen","USG Pelvis","USG Whole Abdomen",
  "CT Brain Plain","CT Chest","MRI Lumbar Spine","MRI Brain",
  "ECG 12 Lead","2D Echo","Pulmonary Function Test (PFT)",
  "Bone Density Scan (DEXA)","Mammography",
];

export const FREQUENCY_OPTIONS = ["Once daily (OD)","Twice daily (BD)","Three times (TID)","Four times (QID)","Every 6 hrs","Every 8 hrs","As needed (SOS)","At bedtime (HS)","Before food","After food"];
export const DURATION_OPTIONS   = ["1 day","3 days","5 days","7 days","10 days","14 days","1 month","2 months","3 months","Continuous"];
export const ROUTE_OPTIONS      = ["Oral","IV Injection","IM Injection","Topical","Inhaler","Sublingual","Ear drops","Eye drops","Nasal drops"];
export const TIMING_OPTIONS     = ["Before food","After food","With food","Empty stomach","Bedtime only"];