import listPatients from "../../data/listPatients.json";
import listPatientPreviousVisits from "../../data/listPatientPreviousVisits.json";
import listPatientClinicalProfiles from "../../data/listPatientClinicalProfiles.json";

const enrichedListPatients = listPatients.map(patient => ({
  ...patient,
  ...listPatientClinicalProfiles[patient.id],
  appointment: {
    datetime: patient.docDate,
    priority: patient.appointmentStatus === "parked" ? "Important" : "Normal",
  },
  todaysVisit: {
    type: patient.appointmentStatus === "completed" ? "Follow-up" : "Current Visit",
    firstVisit: "01/01/2023",
    visitCount: listPatientClinicalProfiles[patient.id]?.historyCount || 3,
    corporate: "No",
    fee: "Cash",
  },
  chronicAllergy: [
    { type: "Allergy", name: "No known drug allergy", since: "—", severity: "Low" },
    { type: "Chronic", name: patient.chiefComplaint, since: "2023", severity: "Medium" },
  ],
  family: [
    { relation: "Attendant", name: "Family Attendant", age: 42, condition: "Nil" },
  ],
  attendant: { name: "Family Attendant", relationship: "Relative", phone: "9000000000" },
  address: { line1: "Madurai", line2: "Tamil Nadu", line3: "625001", line4: "India", phone: "9000000000" },
}));

const expandedListPatientPreviousVisits = Object.fromEntries(enrichedListPatients.map(patient => {
  const baseVisit = listPatientPreviousVisits[patient.id]?.[0];
  if (!baseVisit) return [patient.id, []];
  const count = listPatientClinicalProfiles[patient.id]?.historyCount || 3;
  const complaints = listPatientClinicalProfiles[patient.id]?.previousComplaints || [patient.chiefComplaint];
  const [day, month, year] = baseVisit.entryDt.split(" ")[0].split("/").map(Number);
  const baseDate = new Date(year, month - 1, day);
  return [patient.id, Array.from({ length: count }, (_, index) => {
    const visitDate = new Date(baseDate);
    visitDate.setDate(baseDate.getDate() - index * 14);
    const dateText = [visitDate.getDate(), visitDate.getMonth() + 1, visitDate.getFullYear()].map((part, partIndex) => partIndex < 2 ? String(part).padStart(2, "0") : part).join("/");
    const isIp = patient.id.startsWith("IPL-");
    return {
      ...baseVisit,
      sl: baseVisit.sl * 10 + index + 1,
      entryDt: `${dateText} ${baseVisit.entryDt.split(" ").slice(1).join(" ")}`,
      docModule: `${String(baseVisit.docModule).split(":")[0]}: ${isIp ? "IP" : "OP"}-${index % 3 === 1 ? "LP-R" : "DP"}`,
      reportDt: index % 3 === 1 ? `${dateText} 14:30` : "",
      complaint: complaints[index % complaints.length],
      observation: patient.firstObservation || "Clinical condition reviewed",
      nextVisit: index === 0 ? baseVisit.nextVisit : "",
    };
  })];
}));

const CARE_PLAN_ROWS = [
  ["10-06-2026", "Week-8",  "1st AN Visit",  "Test",       "CBC, Bl.gp, HIV, HBsAg, RBS, Urine, USG dating", "Lapsed",      "No",  "Confirm pregnancy, baseline"],
  ["10-06-2026", "Week-8",  "1st AN Visit",  "Drug",       "Start Folic Acid 5mg, TT1",                       "Late Visit",  "Yes", "Prophylaxis and nutrition"],
  ["22-07-2026", "Week-14", "2nd Visit",     "Monitoring", "BP, Weight, FHS check",                           "Complete",    "Yes", "Maternal-fetal well being"],
  ["22-07-2026", "Week-14", "2nd Visit",     "Drug",       "TT2",                                             "In Progress", "No",  "Tetanus prophylaxis"],
  ["02-09-2026", "Week-20", "Anomaly Scan",  "Test",       "Targeted USG, Hemoglobin",                        "To Do",       "Yes", "Anomaly screening"],
  ["30-09-2026", "Week-24", "GDM Screening", "Test",       "OGTT 75g, Repeat CBC",                            "To Do",       "Yes", "Screen for GDM"],
  ["11-11-2026", "Week-30", "Growth Scan",   "Test",       "USG for growth, AFI, Doppler",                    "To Do",       "Yes", "Fetal growth assessment"],
  ["23-12-2026", "Week-36", "Weekly Visit",  "Monitoring", "NST, BP, Weight, PV exam",                        "To Do",       "Yes", "Birth preparedness"],
  ["20-01-2027", "Week-40", "Delivery",      "Procedure",  "Labor monitoring with Partograph",                "To Do",       "Yes", "Safe delivery"],
];

export const CARE_PLAN_VIEW_DATA = CARE_PLAN_ROWS.map(([
  schDate, milestone, pathwayName, activityType, activityDescription,
  schStatus, linkedStatus, activityResult,
], index) => {
  const row = {
    id: `care-plan-${index + 1}`,
    name: "Normal Pregnancy",
    schDate,
    milestone,
    pathwayName,
    activityType,
    activityDescription,
    schStatus,
    linkedStatus,
    activityResult,
    messageDoctor: "Yes",
    messagePatient: "Yes",
    messageAttendant: "Yes",
  };
  return { ...row, display: { primaryLine: row.name, ...row } };
});

export const MOCK_PATIENTS = [
  {
    id: "1042", docNo: "OP: 3902",
    name: "Smt. Vijayalakshmi", relation: "W/o. Sri.Krishnaswamy",
    age: 29, dob: "31/01/1995", gender: "Female", weight: "86KG",
    height: '168"', bpSystolic: 145, bpDiastolic: 90, pulse: 95, temp: "101.2",
    bloodGroup: "O+", pregnancy: "Yes. 60 Days",
    chiefComplaint: "Allergy, Anxiety , rashes, disturbed sleep, high pressure, giddiness, vomitting, ",
    firstObservation: "Rashes, Weak, No sleep",
    nextVisitDue: "05/02/2024", referral: "Dr.Sheela (From)",
    slot: "09:30", dept: "General Medicine", appt: "APT-001", appointmentStatus: "completed",
    docDate: "03/02/2024 14:02",
    photo: "https://randomuser.me/api/portraits/women/68.jpg",

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
      claim: "OP-Yes|Day-Yes",
    },
    gynacInfo: {
      lmp: "28/11/2023",
      doc: "Sarath",
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
      { type: "Allergy", name: "Penicillin", since: "2018", severity: "High" },
      { type: "Chronic", name: "Hypertension", since: "2020", severity: "Medium" },
      { type: "Allergy", name: "Dust Mites", since: "2015", severity: "Low" },
      { type: "Chronic", name: "Anxiety Disorder", since: "2021", severity: "Medium" },
    ],
    family: [
      { relation: "Father", name: "Sri.Krishnaswamy", age: 58, condition: "Diabetes" },
      { relation: "Mother", name: "Smt.Kamala", age: 54, condition: "Hypertension" },
      { relation: "Husband", name: "Sri.Ramesh", age: 34, condition: "Nil" },
    ],
  },
  {
    id: "2187", docNo: "OP: 3903",
    name: "Mr. Karthik Selvam", relation: "S/o. Sri.Selvam",
    age: 27, dob: "10/05/1997", gender: "Male", weight: "72KG",
    height: '167"', bpSystolic: 120, bpDiastolic: 80, pulse: 78, temp: "98.6",
    bloodGroup: "B+", pregnancy: "N/A",
    chiefComplaint: "Fever, Headache",
    firstObservation: "High fever since 2 days, body pain",
    nextVisitDue: "10/02/2024", referral: "Self",
    slot: "10:00", dept: "General Medicine", appt: "APT-002", appointmentStatus: "completed",
    docDate: "03/02/2024 10:12",
    photo: "https://randomuser.me/api/portraits/men/32.jpg",

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
    id: "3301", docNo: "OP: 3904",
    name: "Smt. Lakshmi Devi", relation: "W/o. Sri.Mohan",
    age: 52, dob: "15/03/1972", gender: "Female", weight: "68KG",
    height: '162"', bpSystolic: 150, bpDiastolic: 95, pulse: 88, temp: "99.1",
    bloodGroup: "A+", pregnancy: "No",
    chiefComplaint: "Knee Pain, Swelling",
    firstObservation: "Bilateral knee pain, difficulty walking",
    nextVisitDue: "17/02/2024", referral: "Dr.Arun (From)",
    slot: "10:30", dept: "General Medicine", appt: "APT-003", appointmentStatus: "completed",
    docDate: "03/02/2024 10:35",
    photo: "https://randomuser.me/api/portraits/women/45.jpg",

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
      claim: "OP-Yes|Day-Yes",
    },
    gynacInfo: {
      lmp: "N/A", doc: "N/A", edd: "N/A",
      pregnancies: 2, deliveries: 2, abortions: 0, livingChildren: 2,
    },
    ipInfo: {
      admitDate: "05/08/2026", admitTime: "02:15 PM",
      treatment: "Total Knee Replacement - Bilateral",
      attenderName: "Sri.Mohan", attenderPhone: "9444556677", attenderRelation: "Husband",
      ward: "Ortho", room: "12", bed: "2/1",
      currentWard: "Ortho Ward", currentRoom: "12", currentBed: "2/1",
      consultant: "Dr.Elango 9884512367", consultant2: "Dr.Meenakshi 9994412378",
      nurse1: "C.Nurse: Kalaivani 9843321156",
      nurse2: "C.Nurse: Revathi 9788112245",
      dischargeDate: "12/08/2026",
    },
    chronicAllergy: [
      { type: "Chronic", name: "Osteoarthritis", since: "2019", severity: "High" },
      { type: "Chronic", name: "Diabetes Type 2", since: "2018", severity: "High" },
    ],
    family: [],
  },
  {
    id: "4456", docNo: "OP: 3905",
    name: "Mr. Rajesh Kumar", relation: "S/o. Sri.Ramesh",
    age: 45, dob: "12/08/1979", gender: "Male", weight: "65.5[144.4]",
    height: `181 [5'-11"]`, bpSystolic: 135, bpDiastolic: 85, pulse: 72, temp: "98°/37°  ",
    bloodGroup: "AB+", pregnancy: "N/A", oxygenLevel: "97",
    chiefComplaint: "Chest Pain, Shortness of breath",
    firstObservation: "Sharp chest pain radiating to left arm",
    nextVisitDue: "10/02/2024", referral: "Dr.Priya (From)",
    slot: "11:00", dept: "Cardiology", appt: "APT-004",
    docDate: "03/02/2024 11:05",
    photo: "https://randomuser.me/api/portraits/men/45.jpg",

    address: {
      line1: "23, Gandhi Nagar 1st Street",
      line2: "Villapuram",
      line3: "Madurai - 625 012",
      line4: "Madurai Dt",
      phone: "9789456123",
    },
    attendant: {
      name: "Smt. Kavitha",
      relationship: "Wife",
      phone: "9789456124",
    },
    appointment: {
      datetime: "03/02/2024 11:00",
      priority: "Emergency",
    },
    todaysVisit: {
      type: "Follow-up",
      firstVisit: "15/01/2024",
      visitCount: 3,
      corporate: "Yes",
      fee: "Insurance",
    },
    insurer: {
      name: "ICICI Lombard",
      plan: "Health Insurance Plus",
      period: "Till 31/12/2024",
      claim: "OP-Yes|Day-Yes",
    },
    gynacInfo: null,
    ipInfo: {
      admitDate: "23/06/2026", admitTime: "08:00 AM",
      treatment: "Multiple Fracture / Surgery",
      attenderName: "K.Ragunath", attenderPhone: "9457598435", attenderRelation: "Father",
      ward: "Ortho", room: "47", bed: "1/3",
      currentWard: "ICU - A1", currentRoom: "202", currentBed: "A3",
      consultant: "Dr.Sudha 9784609854", consultant2: "Dr.Srinivas 8965734625",
      nurse1: "C.Nurse: Prathiba 9566709435",
      nurse2: "C.Nurse: Sumathi 9744309874",
      dischargeDate: "27/06/2026",
    },
    chronicAllergy: [
      { type: "Chronic", name: "CAD", since: "2020", severity: "High" },
      { type: "Chronic", name: "Hyperlipidemia", since: "2019", severity: "Medium" },
    ],
    family: [
      { relation: "Father", name: "Sri.Ramesh", age: 70, condition: "Heart Disease" },
      { relation: "Mother", name: "Smt.Saroja", age: 65, condition: "Diabetes" },
    ],
  },
  {
    id: "5567", docNo: "OP: 3906",
    name: "Ms. Priya Sharma", relation: "D/o. Sri.Sharma",
    age: 24, dob: "22/03/2000", gender: "Female", weight: "55KG",
    height: '160"', bpSystolic: 110, bpDiastolic: 70, pulse: 82, temp: "98.8",
    bloodGroup: "O-", pregnancy: "No",
    chiefComplaint: "Severe Abdominal Pain",
    firstObservation: "Right lower quadrant pain, nausea",
    nextVisitDue: "05/02/2024", referral: "Self",
    slot: "11:30", dept: "General Surgery", appt: "APT-005",
    docDate: "03/02/2024 11:25",
    photo: "https://randomuser.me/api/portraits/women/22.jpg",

    address: {
      line1: "8, Sivagami Nagar",
      line2: "Near Railway Station",
      line3: "Dindigul - 624 001",
      line4: "Dindigul Dt",
      phone: "9876543322",
    },
    attendant: {
      name: "Sri.Sharma",
      relationship: "Father",
      phone: "9876543323",
    },
    appointment: {
      datetime: "03/02/2024 11:30",
      priority: "Urgent",
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
    gynacInfo: {
      lmp: "15/01/2024",
      doc: "N/A",
      edd: "N/A",
      pregnancies: 0,
      deliveries: 0,
      abortions: 0,
      livingChildren: 0,
    },
    ipInfo: { ward: "—", bed: "—", admitDate: "—", consultant: "—" },
    chronicAllergy: [
      { type: "Allergy", name: "Latex", since: "2015", severity: "Medium" },
      { type: "Allergy", name: "Morphine", since: "2018", severity: "High" },
    ],
    family: [],
  },
  {
    id: "6678", docNo: "OP: 3907",
    name: "Sri. Senthil Murugan", relation: "S/o. Sri.Murugan",
    age: 38, dob: "05/07/1986", gender: "Male", weight: "85KG",
    height: '175"', bpSystolic: 160, bpDiastolic: 100, pulse: 95, temp: "99.5",
    bloodGroup: "B-", pregnancy: "N/A",
    chiefComplaint: "Dizziness, Blurred Vision",
    firstObservation: "Sudden onset of dizziness, unable to stand",
    nextVisitDue: "10/02/2024", referral: "Dr.Karthik (From)",
    slot: "12:00", dept: "Neurology", appt: "APT-006",
    docDate: "03/02/2024 12:10",
    photo: "https://randomuser.me/api/portraits/men/52.jpg",

    address: {
      line1: "56, South Street",
      line2: "Thirumangalam",
      line3: "Madurai - 625 706",
      line4: "Madurai Dt",
      phone: "9944455566",
    },
    attendant: {
      name: "Smt. Meena",
      relationship: "Wife",
      phone: "9944455567",
    },
    appointment: {
      datetime: "03/02/2024 12:00",
      priority: "Emergency",
    },
    todaysVisit: {
      type: "Follow-up",
      firstVisit: "25/01/2024",
      visitCount: 2,
      corporate: "No",
      fee: "Cash",
    },
    insurer: {
      name: "Bajaj Allianz",
      plan: "Health Guard",
      period: "Till 30/11/2024",
      claim: "OP-Yes|Day-No|IP-Yes",
    },
    gynacInfo: null,
    ipInfo: { ward: "ICU", bed: "B-08", admitDate: "03/02/2024", consultant: "Dr.Prabhu" },
    chronicAllergy: [
      { type: "Chronic", name: "Migraine", since: "2015", severity: "High" },
      { type: "Chronic", name: "Hypertension", since: "2018", severity: "High" },
    ],
    family: [
      { relation: "Father", name: "Sri.Murugan", age: 65, condition: "Stroke" },
      { relation: "Mother", name: "Smt.Valli", age: 60, condition: "Diabetes" },
    ],
  },
  {
    id: "7789", docNo: "OP: 3908",
    name: "Smt. Anitha Raman", relation: "W/o. Sri.Raman",
    age: 35, dob: "18/11/1989", gender: "Female", weight: "62KG",
    height: '164"', bpSystolic: 130, bpDiastolic: 82, pulse: 76, temp: "98.6",
    bloodGroup: "AB-", pregnancy: "Yes. 30 Weeks",
    chiefComplaint: "Swelling in feet, Headache",
    firstObservation: "Pitting edema in both feet, elevated BP",
    nextVisitDue: "15/02/2024", referral: "Dr.Meera (From)",
    slot: "12:30", dept: "Obstetrics", appt: "APT-007",
    docDate: "03/02/2024 12:35",
    photo: "https://randomuser.me/api/portraits/women/33.jpg",

    address: {
      line1: "12, North Masi Street",
      line2: "K.K. Nagar",
      line3: "Madurai - 625 020",
      line4: "Madurai Dt",
      phone: "9988776655",
    },
    attendant: {
      name: "Sri.Raman",
      relationship: "Husband",
      phone: "9988776656",
    },
    appointment: {
      datetime: "03/02/2024 12:30",
      priority: "Urgent",
    },
    todaysVisit: {
      type: "Follow-up",
      firstVisit: "10/07/2023",
      visitCount: 12,
      corporate: "Yes",
      fee: "Insurance",
    },
    insurer: {
      name: "HDFC Ergo",
      plan: "Maternity Cover",
      period: "Till 31/03/2024",
      claim: "OP-Yes|Day-Yes",
    },
    gynacInfo: {
      lmp: "15/07/2023",
      doc: "Suresh",
      edd: "22/04/2024",
      pregnancies: 2,
      deliveries: 1,
      abortions: 0,
      livingChildren: 1,
    },
    ipInfo: { ward: "—", bed: "—", admitDate: "—", consultant: "—" },
    chronicAllergy: [
      { type: "Allergy", name: "Shellfish", since: "2010", severity: "High" },
      { type: "Chronic", name: "Anemia", since: "2023", severity: "Low" },
    ],
    family: [],
  },
  {
    id: "8890", docNo: "OP: 3909",
    name: "Mr. Arun Prakash", relation: "S/o. Sri.Prakash",
    age: 60, dob: "03/01/1964", gender: "Male", weight: "70KG",
    height: '168"', bpSystolic: 140, bpDiastolic: 88, pulse: 82, temp: "98.2",
    bloodGroup: "A-", pregnancy: "N/A",
    chiefComplaint: "Frequent Urination, Fatigue",
    firstObservation: "Polyuria, polydipsia, weight loss",
    nextVisitDue: "17/02/2024", referral: "Dr.Raj (From)",
    slot: "01:00", dept: "Endocrinology", appt: "APT-008",
    docDate: "03/02/2024 13:05",
    photo: "https://randomuser.me/api/portraits/men/65.jpg",

    address: {
      line1: "3, Temple View",
      line2: "Avaniyapuram",
      line3: "Madurai - 625 012",
      line4: "Madurai Dt",
      phone: "9876543322",
    },
    attendant: {
      name: "Smt. Latha",
      relationship: "Wife",
      phone: "9876543323",
    },
    appointment: {
      datetime: "03/02/2024 01:00",
      priority: "Normal",
    },
    todaysVisit: {
      type: "Follow-up",
      firstVisit: "05/12/2023",
      visitCount: 6,
      corporate: "No",
      fee: "Cash",
    },
    insurer: {
      name: "United India",
      plan: "Senior Citizen",
      period: "Till 30/06/2024",
      claim: "OP-Yes|Day-Yes",
    },
    gynacInfo: null,
    ipInfo: { ward: "—", bed: "—", admitDate: "—", consultant: "—" },
    chronicAllergy: [
      { type: "Chronic", name: "Diabetes Type 2", since: "2015", severity: "High" },
      { type: "Chronic", name: "Neuropathy", since: "2018", severity: "Medium" },
    ],
    family: [
      { relation: "Brother", name: "Sri.Ravi", age: 55, condition: "Diabetes" },
    ],
  },
  {
    id: "9901", docNo: "OP: 3910",
    name: "Smt. Parvathy Devi", relation: "W/o. Sri.Devarajan",
    age: 68, dob: "12/09/1956", gender: "Female", weight: "58KG",
    height: '155"', bpSystolic: 155, bpDiastolic: 92, pulse: 90, temp: "98.8",
    bloodGroup: "B+", pregnancy: "No",
    chiefComplaint: "Joint Pain, Morning Stiffness",
    firstObservation: "Symmetrical joint pain in hands and feet",
    nextVisitDue: "20/02/2024", referral: "Dr.Anjali (From)",
    slot: "01:30", dept: "Rheumatology", appt: "APT-009",
    docDate: "03/02/2024 13:35",
    photo: "https://randomuser.me/api/portraits/women/75.jpg",

    address: {
      line1: "45, Old Natham Road",
      line2: "T.V.S. Nagar",
      line3: "Madurai - 625 003",
      line4: "Madurai Dt",
      phone: "9944556677",
    },
    attendant: {
      name: "Sri.Devarajan",
      relationship: "Husband",
      phone: "9944556678",
    },
    appointment: {
      datetime: "03/02/2024 01:30",
      priority: "Normal",
    },
    todaysVisit: {
      type: "Follow-up",
      firstVisit: "10/10/2023",
      visitCount: 9,
      corporate: "No",
      fee: "Insurance",
    },
    insurer: {
      name: "New India",
      plan: "Senior Citizen Health",
      period: "Till 31/12/2024",
      claim: "OP-Yes|Day-Yes",
    },
    gynacInfo: {
      lmp: "N/A", doc: "N/A", edd: "N/A",
      pregnancies: 3,
      deliveries: 3,
      abortions: 0,
      livingChildren: 3,
    },
    ipInfo: { ward: "—", bed: "—", admitDate: "—", consultant: "—" },
    chronicAllergy: [
      { type: "Chronic", name: "Rheumatoid Arthritis", since: "2018", severity: "High" },
      { type: "Chronic", name: "Osteoporosis", since: "2019", severity: "Medium" },
    ],
    family: [
      { relation: "Sister", name: "Smt.Vijaya", age: 62, condition: "Osteoarthritis" },
    ],
  },
  {
    id: "1012", docNo: "OP: 3911",
    name: "Mr. Dinesh Kumar", relation: "S/o. Sri.Kumar",
    age: 22, dob: "08/04/2002", gender: "Male", weight: "65KG",
    height: '170"', bpSystolic: 115, bpDiastolic: 75, pulse: 72, temp: "98.6",
    bloodGroup: "O+", pregnancy: "N/A",
    chiefComplaint: "Sore Throat, Cough",
    firstObservation: "Pharyngeal erythema, tonsillar enlargement",
    nextVisitDue: "10/02/2024", referral: "Self",
    slot: "02:00", dept: "ENT", appt: "APT-010",
    docDate: "03/02/2024 14:05",
    photo: "https://randomuser.me/api/portraits/men/22.jpg",

    address: {
      line1: "7, Rajaji Nagar",
      line2: "K.Pudur",
      line3: "Madurai - 625 007",
      line4: "Madurai Dt",
      phone: "9865432190",
    },
    attendant: {
      name: "Sri.Kumar",
      relationship: "Father",
      phone: "9865432191",
    },
    appointment: {
      datetime: "03/02/2024 02:00",
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
      { type: "Allergy", name: "Pollen", since: "2010", severity: "Medium" },
    ],
    family: [],
  },
  {
    id: "1123", docNo: "OP: 3912",
    name: "Smt. Vasanthi Ravi", relation: "W/o. Sri.Ravi",
    age: 42, dob: "19/06/1982", gender: "Female", weight: "75KG",
    height: '163"', bpSystolic: 145, bpDiastolic: 90, pulse: 88, temp: "99.2",
    bloodGroup: "A+", pregnancy: "No",
    chiefComplaint: "Palpitations, Sweating",
    firstObservation: "Irregular heartbeat, excessive sweating",
    nextVisitDue: "15/02/2024", referral: "Dr.Geetha (From)",
    slot: "02:30", dept: "Cardiology", appt: "APT-011",
    docDate: "03/02/2024 14:35",
    photo: "https://randomuser.me/api/portraits/women/55.jpg",

    address: {
      line1: "19, Ram Nagar",
      line2: "Sundararajapuram",
      line3: "Madurai - 625 002",
      line4: "Madurai Dt",
      phone: "9988774411",
    },
    attendant: {
      name: "Sri.Ravi",
      relationship: "Husband",
      phone: "9988774412",
    },
    appointment: {
      datetime: "03/02/2024 02:30",
      priority: "Urgent",
    },
    todaysVisit: {
      type: "Follow-up",
      firstVisit: "20/12/2023",
      visitCount: 5,
      corporate: "Yes",
      fee: "Insurance",
    },
    insurer: {
      name: "Royal Sundaram",
      plan: "Health Shield",
      period: "Till 30/09/2024",
      claim: "OP-Yes|Day-Yes",
    },
    gynacInfo: {
      lmp: "05/01/2024",
      doc: "N/A",
      edd: "N/A",
      pregnancies: 2,
      deliveries: 2,
      abortions: 0,
      livingChildren: 2,
    },
    ipInfo: { ward: "—", bed: "—", admitDate: "—", consultant: "—" },
    chronicAllergy: [
      { type: "Chronic", name: "Hyperthyroidism", since: "2020", severity: "High" },
      { type: "Chronic", name: "Hypertension", since: "2019", severity: "Medium" },
    ],
    family: [
      { relation: "Mother", name: "Smt.Saraswathi", age: 65, condition: "Thyroid" },
    ],
  },
  {
    id: "1234", docNo: "OP: 3913",
    name: "Mr. Ganesh Babu", relation: "S/o. Sri.Babu",
    age: 55, dob: "25/12/1969", gender: "Male", weight: "82KG",
    height: '174"', bpSystolic: 130, bpDiastolic: 84, pulse: 76, temp: "98.4",
    bloodGroup: "AB+", pregnancy: "N/A",
    chiefComplaint: "Back Pain, Sciatica",
    firstObservation: "Lower back pain radiating to left leg",
    nextVisitDue: "18/02/2024", referral: "Dr.Shankar (From)",
    slot: "03:00", dept: "Orthopedics", appt: "APT-012",
    docDate: "03/02/2024 15:05",
    photo: "https://randomuser.me/api/portraits/men/58.jpg",

    address: {
      line1: "32, Lake View Road",
      line2: "Kochadai",
      line3: "Madurai - 625 016",
      line4: "Madurai Dt",
      phone: "9944332211",
    },
    attendant: {
      name: "Smt. Lalitha",
      relationship: "Wife",
      phone: "9944332212",
    },
    appointment: {
      datetime: "03/02/2024 03:00",
      priority: "Normal",
    },
    todaysVisit: {
      type: "Follow-up",
      firstVisit: "10/01/2024",
      visitCount: 4,
      corporate: "No",
      fee: "Cash",
    },
    insurer: {
      name: "Tata AIG",
      plan: "Individual Health",
      period: "Till 31/12/2024",
      claim: "OP-Yes|Day-Yes",
    },
    gynacInfo: null,
    ipInfo: { ward: "—", bed: "—", admitDate: "—", consultant: "—" },
    chronicAllergy: [
      { type: "Chronic", name: "Lumbar Spondylosis", since: "2018", severity: "Medium" },
      { type: "Chronic", name: "Sciatica", since: "2020", severity: "High" },
    ],
    family: [
      { relation: "Father", name: "Sri.Babu", age: 78, condition: "Osteoporosis" },
    ],
  },
  ...enrichedListPatients,
];

export const PREVIOUS_VISITS = {
  ...expandedListPatientPreviousVisits,
  "1042": [
    { sl: 45, entryDt: "02/02/2024 16:02", docModule: "3902: OP-DP", reportDt: "", complaint: "Allergy, Anxiety", vitals: "86/25.7/140:90:96/98.6", by: "Dr.Chandra Sekar", nextVisit: "03/02/2024" },
    { sl: 44, entryDt: "02/02/2024 12:30", docModule: "3902: OP-LP-R", reportDt: "02/02/2024 16.00", complaint: "Allergy, Anxiety", vitals: "86/25.7/145:90:95/101.", by: "Dr.Chandra Sekar", nextVisit: "03/02/2024" },
    { sl: 43, entryDt: "21/01/2024 12:15", docModule: "2911: IP-F", reportDt: "", complaint: "Bowel Irritation", vitals: "85/25/120:80:96/98.6", by: "Dr.Sheela", nextVisit: "" },
    { sl: 42, entryDt: "21/01/2024 12:10", docModule: "2911: IP-DP", reportDt: "", complaint: "Bowel Irritation", vitals: "85/25/120:80:96/98.6", by: "Dr.Sheela", nextVisit: "" },
    { sl: 41, entryDt: "21/01/2024 10:22", docModule: "2911: IP-SP-R", reportDt: "21/01/2024 12.07", complaint: "Bowel Irritation", vitals: "85/25/130:80:96/98.6", by: "Dr.Sheela", nextVisit: "" },
    { sl: 40, entryDt: "21/01/2024 10:20", docModule: "2911: IP-LP-R", reportDt: "21/01/2024 12.05", complaint: "Bowel Irritation", vitals: "85/25/120:80:96/98.6", by: "Dr.Sheela", nextVisit: "" },
    { sl: 39, entryDt: "13/06/2023 10:30", docModule: "1211: OP-DP", reportDt: "", complaint: "Stomach Pain", vitals: "86/25.7/130:85:95/98.6", by: "Nr.Sridevi", nextVisit: "" },
    { sl: 38, entryDt: "12/06/2023 09:10", docModule: "1211: OP-SP-R", reportDt: "13/06/2023 10.30", complaint: "Stomach Pain", vitals: "86/25.7/130:85:95/98.6", by: "Dr.Arun", nextVisit: "13/06/2023" },
  ],
  "2187": [
    { sl: 12, entryDt: "28/01/2024 09:00", docModule: "3850: OP-DP", reportDt: "", complaint: "Fever, Headache", vitals: "72/--/120:80:78/98.6", by: "Dr.Chandra Sekar", nextVisit: "03/02/2024" },
  ],
  "3301": [
    { sl: 8, entryDt: "20/01/2024 11:00", docModule: "3810: OP-DP", reportDt: "", complaint: "Knee Pain", vitals: "68/--/150:95:88/99.1", by: "Dr.Arun", nextVisit: "03/02/2024" },
  ],
  "4456": [
    { sl: 23, entryDt: "26/06/2026 09:15", docModule: "3905: IP-DP", reportDt: "", complaint: "Post-op review, Multiple Fracture", vitals: "78/--/128:82:74/98.6", by: "Dr.Sudha", nextVisit: "27/06/2026" },
    // { sl: 22, entryDt: "25/06/2026 18:40", docModule: "3905: IP-SP-R", reportDt: "25/06/2026 19.10", complaint: "Post-surgery pain management", vitals: "78/--/132:84:76/99.0", by: "Dr.Srinivas", nextVisit: "" },
    { sl: 21, entryDt: "25/06/2026 08:05", docModule: "3905: IP-LP-R", reportDt: "25/06/2026 11.30", complaint: "Pre-op bloodwork review", vitals: "78/--/130:85:72/98.8", by: "Dr.Sudha", nextVisit: "" },
    { sl: 20, entryDt: "24/06/2026 21:00", docModule: "3905: IP-F", reportDt: "", complaint: "Night observation, stable", vitals: "78/--/126:80:73/98.4", by: "Nr.Priya", nextVisit: "" },
    { sl: 19, entryDt: "24/06/2026 14:20", docModule: "3905: IP-DP", reportDt: "", complaint: "Surgery - Ortho fixation", vitals: "78/--/140:90:78/99.2", by: "Dr.Sudha", nextVisit: "" },
    { sl: 18, entryDt: "24/06/2026 08:00", docModule: "3905: IP-DP", reportDt: "", complaint: "Multiple Fracture / Surgery - Admission", vitals: "78/--/135:85:75/98.6", by: "Dr.Sudha", nextVisit: "" },
    // { sl: 17, entryDt: "23/06/2026 08:00", docModule: "3905: IP-DP", reportDt: "", complaint: "Multiple Fracture, Road Traffic Accident", vitals: "78/--/138:88:80/99.4", by: "Dr.Srinivas", nextVisit: "" },
    { sl: 16, entryDt: "20/02/2024 11:00", docModule: "3905: OP-DP", reportDt: "", complaint: "Follow-up: Chest Pain", vitals: "78/--/132:84:74/98.4", by: "Dr.Priya", nextVisit: "05/03/2024" },
    { sl: 15, entryDt: "15/02/2024 10:30", docModule: "3905: OP-SP-R", reportDt: "15/02/2024 15.00", complaint: "Cardiology consult, ECG review", vitals: "78/--/136:86:76/98.6", by: "Dr.Priya", nextVisit: "20/02/2024" },
    { sl: 14, entryDt: "10/02/2024 09:45", docModule: "3905: OP-LP-R", reportDt: "10/02/2024 13.15", complaint: "Chest Pain, Lipid Profile results", vitals: "78/--/134:85:75/98.5", by: "Dr.Priya", nextVisit: "15/02/2024" },
    { sl: 13, entryDt: "02/02/2024 09:30", docModule: "3905: OP-DP", reportDt: "", complaint: "Chest Pain", vitals: "78/--/135:85:72/98.4", by: "Dr.Priya", nextVisit: "10/02/2024" },
    { sl: 12, entryDt: "28/01/2024 10:00", docModule: "3905: OP-SP-R", reportDt: "28/01/2024 14.00", complaint: "Shortness of breath", vitals: "78/--/140:88:76/98.6", by: "Dr.Priya", nextVisit: "03/02/2024" },
    { sl: 11, entryDt: "20/01/2024 09:00", docModule: "3905: OP-DP", reportDt: "", complaint: "Chest tightness on exertion", vitals: "78/--/138:87:77/98.6", by: "Dr.Priya", nextVisit: "28/01/2024" },
    { sl: 10, entryDt: "12/01/2024 11:15", docModule: "3905: OP-LP-R", reportDt: "12/01/2024 16.00", complaint: "Routine cardiac screening", vitals: "78/--/130:82:74/98.4", by: "Dr.Priya", nextVisit: "20/01/2024" },
    { sl: 9, entryDt: "05/01/2024 10:00", docModule: "3905: OP-DP", reportDt: "", complaint: "Mild chest discomfort", vitals: "78/--/128:80:73/98.2", by: "Dr.Priya", nextVisit: "12/01/2024" },
    { sl: 8, entryDt: "22/12/2023 14:30", docModule: "3905: OP-SP-R", reportDt: "22/12/2023 17.00", complaint: "Annual health checkup", vitals: "78/--/126:78:72/98.4", by: "Dr.Chandra Sekar", nextVisit: "05/01/2024" },
    { sl: 7, entryDt: "10/11/2023 09:30", docModule: "3905: OP-DP", reportDt: "", complaint: "Seasonal flu, fever", vitals: "78/--/122:78:80/100.8", by: "Dr.Arun", nextVisit: "17/11/2023" },
    { sl: 6, entryDt: "03/11/2023 10:00", docModule: "3905: OP-LP-R", reportDt: "03/11/2023 14.30", complaint: "Fever, Body Ache — CBC results", vitals: "78/--/124:80:82/101.2", by: "Dr.Arun", nextVisit: "10/11/2023" },
    { sl: 5, entryDt: "28/10/2023 11:45", docModule: "3905: OP-DP", reportDt: "", complaint: "Fever, Body Ache", vitals: "78/--/125:80:84/101.6", by: "Dr.Arun", nextVisit: "03/11/2023" },
    { sl: 4, entryDt: "15/09/2023 09:00", docModule: "3905: OP-DP", reportDt: "", complaint: "Lower back pain", vitals: "78/--/128:82:74/98.4", by: "Dr.Chandra Sekar", nextVisit: "22/09/2023" },
    { sl: 3, entryDt: "02/08/2023 09:30", docModule: "3905: OP-DP", reportDt: "", complaint: "Chest Pain", vitals: "78/--/135:85:72/98.4", by: "Dr.Priya", nextVisit: "10/08/2023" },
    { sl: 2, entryDt: "28/07/2023 10:00", docModule: "3905: OP-SP-R", reportDt: "28/07/2023 14.00", complaint: "Shortness of breath", vitals: "78/--/140:88:76/98.6", by: "Dr.Priya", nextVisit: "02/08/2023" },
    { sl: 1, entryDt: "20/07/2023 09:15", docModule: "3905: OP-DP", reportDt: "", complaint: "First consultation, general checkup", vitals: "78/--/120:80:72/98.6", by: "Dr.Chandra Sekar", nextVisit: "28/07/2023" },
  ],
  "5567": [
    { sl: 1, entryDt: "03/02/2024 11:30", docModule: "3906: OP-DP", reportDt: "", complaint: "Abdominal Pain", vitals: "55/--/110:70:82/98.8", by: "Dr.Sharma", nextVisit: "05/02/2024" },
  ],
  "6678": [
    { sl: 2, entryDt: "02/02/2024 14:00", docModule: "3907: OP-DP", reportDt: "", complaint: "Dizziness", vitals: "85/--/160:100:95/99.5", by: "Dr.Karthik", nextVisit: "10/02/2024" },
  ],
  "7789": [
    { sl: 12, entryDt: "02/02/2024 09:00", docModule: "3908: OP-DP", reportDt: "", complaint: "Swelling, Headache", vitals: "62/--/130:82:76/98.6", by: "Dr.Meera", nextVisit: "15/02/2024" },
    { sl: 11, entryDt: "25/01/2024 10:00", docModule: "3908: OP-SP-R", reportDt: "25/01/2024 15.00", complaint: "Pregnancy Check", vitals: "60/--/125:80:72/98.4", by: "Dr.Meera", nextVisit: "03/02/2024" },
  ],
  "8890": [
    { sl: 6, entryDt: "01/02/2024 11:00", docModule: "3909: OP-DP", reportDt: "", complaint: "Frequent Urination", vitals: "70/--/140:88:82/98.2", by: "Dr.Raj", nextVisit: "17/02/2024" },
  ],
  "9901": [
    { sl: 9, entryDt: "02/02/2026 13:30", docModule: "3910: OP-DP", reportDt: "", complaint: "Joint Pain", vitals: "58/--/155:92:90/98.8", by: "Dr.Anjali", nextVisit: "20/02/2024" },
  ],
  "1012": [
    { sl: 1, entryDt: "03/02/2025 14:00", docModule: "3911: OP-DP", reportDt: "", complaint: "Sore Throat", vitals: "65/--/115:75:72/98.6", by: "Dr.Suresh", nextVisit: "10/02/2024" },
  ],
  "1123": [
    { sl: 5, entryDt: "02/02/2024 15:00", docModule: "3912: OP-DP", reportDt: "", complaint: "Palpitations", vitals: "75/--/145:90:88/99.2", by: "Dr.Geetha", nextVisit: "15/02/2024" },
  ],
  "1234": [
    { sl: 4, entryDt: "02/02/2024 15:30", docModule: "3913: OP-DP", reportDt: "", complaint: "Back Pain", vitals: "82/--/130:84:76/98.4", by: "Dr.Shankar", nextVisit: "18/02/2024" },
  ],
};

