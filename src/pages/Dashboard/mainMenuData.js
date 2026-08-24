export const mainMenuItems = [
  {
    label: "Open",
    items: [
      { label: "Open Books" }, { label: "Create a New Book", action: "create-book" }, { separator: true },
      { label: "Define User" }, { label: "Define User Rights" }, { separator: true },
      { label: "Back-Up All Books" }, { label: "Restore Data by Creating Books" }, { separator: true },
      { label: "Show Profile" }, { label: "Check & Update Data" }, { separator: true },
      { label: "Exit", action: "logout" },
    ],
  },
  {
    label: "Settings",
    items: [
      { label: "Primary Settings", children: ["Business Credentials", "Software Options List", "Output Design Formats", "Hospital Rooms List", "Hospital Wards & Departments"].map(label => ({ label })) },
      { separator: true },
      { label: "Set Personnel List", children: ["Patient List", "Staff List", "Insurer List", "Supplier List"].map(label => ({ label })) },
      { label: "Set Product-Service List", children: ["Drug List", "Lab-Test List", "Service List", "Room Inventory List"].map(label => ({ label })) },
      { separator: true }, { label: "Set Staff Shift & Schedule" }, { label: "Set Equipment Configuration" },
    ],
  },
  {
    label: "Daily Functionality",
    items: [
      { label: "Out-Patient Appointment", action: "op-appointments" }, { label: "Doctor's Desk", action: "op-desk" }, { separator: true },
      { label: "In-Patient Management" }, { label: "IP-Nurse's Desk" }, { separator: true },
      { label: "Lab-Test Service", children: ["Test Prescription Entry", "Test Specimen Collection", "Test Result Entry", "Test Result Authorization", "Test Report Delivery"].map(label => ({ label })) },
      { label: "Medical Service", children: ["Service Prescription Entry", "Service Result Entry", "Service Result Authorization", "Service Report Delivery"].map(label => ({ label })) },
      { separator: true }, { label: "Fix Daily Duty & Schedule" }, { label: "House-Keeping" }, { label: "Referral Documents" },
    ],
  },
  { label: "Reports", items: ["Daily Reports", "Periodical Reports", "Analysis Reports", "Management Reports", "Listing Reports"].map(label => ({ label })) },
  {
    label: "Tools",
    items: [
      { label: "Report File Manager" }, { label: "Show Current Book Profile" }, { separator: true },
      { label: "Backup Current Book" }, { label: "Restore Current Backup" }, { separator: true },
      { label: "Shift Closure" }, { label: "Day Closure" }, { label: "Year Closure" }, { separator: true },
      { label: "Wipe All Transaction Data" }, { label: "Wipe Inessential Data" }, { label: "Export Data Settings" },
    ],
  },
  {
    label: "Assist",
    items: [
      { label: "Help & About" }, { separator: true }, { label: "Connect to Trident" }, { label: "Software Keys" },
      { separator: true }, { label: "Close Current Book", action: "logout" },
    ],
  },
];
