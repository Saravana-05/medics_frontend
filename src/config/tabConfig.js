import { Pill, FlaskConical, Settings as ServicesIcon, Clock } from "lucide-react";
import labTestDetails from "../data/labTestDetails.json";
import ipSubjects from "../data/ipSubjects.json";
import ipAdvice from "../data/ipAdvice.json";
import ipNurses from "../data/ipNurses.json";
import ipTreatments from "../data/ipTreatments.json";

/* ── shared dropdown option sets that Lab/Service reuse verbatim ── */
const SIMPLE_SEARCH_ONLY = {
  // Lab & Service don't have Days/Dosage/Period/When — just a search field + remarks.
  addRowFields: ["name", "detail", "commit"],
  fieldOptions: {
    detail: ["—","Fasting Required","Urgent","Routine","Follow-up Required","Report Awaited","Repeat After Treatment","Visit lab in the morning, before taking any food."],
  },
  tableColumns: [
    { key: "no",      label: "No.",     width: "w-12",   type: "index" },
    { key: "name",    label: "Name",    width: "w-80",   type: "text" },
    { key: "detail",  label: "Remarks", width: "flex-1", type: "text" },
    { key: "actions", label: "Actions", width: "w-24",   type: "actions" },
  ],
  computeRowDisplay: (draft) => ({
    // No dosage math needed — Lab/Service just echo back what was entered.
    // Remarks has its own table column, so it isn't duplicated as a secondaryLine under Name.
    primaryLine: draft.name,
    detail: draft.detail === "—" ? "" : draft.detail,
  }),
};

export const TAB_CONFIGS = {

  /* ══════════════════ DRUG ══════════════════ */
  drugs: {
    key: "drugs",
    label: "Drug",
    icon: Pill,
    color: "var(--color-drugs)",
    colorLight: "var(--color-drugs-light)",

    labels: {
      addButton: "Add Medicine",
      searchPlaceholder: "Search or select medicine (A–Z)...",
      searchListLabel: "Medicines",
      newEntityButton: "New Drug",
      footerFilterLabel: "Drug Type",
    },

    filters: { typeOptions: ["Currently Live", "All", "Discontinued"] },

    fieldOptions: {
      intake: ["¼","½","¾","1","1½","2","3","4","1Ts","2Ts","3Ts","4Ts","5ml","10ml"],
      period: ["OD","BD","TDS","QID","HS","SOS","Stat","Weekly","Monthly"],
      when:   ["AF","BF","BF&AF","Any Time","Empty Stomach","With Milk","Before Sleep"],
      detail: ["—","On Time","Only If Required","Discontinue Any Time","Continue","Reduce Dose","Increase Dose","Take with Water"],
    },

    addRowFields: ["name", "days", "intake", "period", "when", "detail", "commit"],

    tableColumns: [
      { key: "no",      label: "No.",    width: "w-12",   type: "index" },
      { key: "name",    label: "Name",   width: "w-80",   type: "text" },
      { key: "buy",     label: "Buy",    width: "w-12",   type: "computed" },
      { key: "mor",     label: "M",      width: "w-7",    type: "computed" },
      { key: "noon",    label: "A",      width: "w-7",    type: "computed" },
      { key: "eve",     label: "E",      width: "w-7",    type: "computed" },
      { key: "night",   label: "N",      width: "w-7",    type: "computed" },
      { key: "when",    label: "When",   width: "w-20",   type: "text" },
      { key: "detail",  label: "Remarks",width: "flex-1", type: "text" },
      { key: "actions", label: "Actions",width: "w-24",   type: "actions" },
    ],

    // The one truly tab-specific piece of business logic — dosage schedule + Buy calculation.
    computeRowDisplay: (draft) => {
      const schedules = {
        OD:{mor:"",noon:"",eve:"",night:draft.intake}, BD:{mor:draft.intake,noon:"",eve:"",night:draft.intake},
        TDS:{mor:draft.intake,noon:draft.intake,eve:"",night:draft.intake}, QID:{mor:draft.intake,noon:draft.intake,eve:draft.intake,night:draft.intake},
        HS:{mor:"",noon:"",eve:"",night:draft.intake}, SOS:{mor:"",noon:"",eve:"",night:"As needed"},
        Stat:{mor:"",noon:"",eve:"",night:"Stat"}, Weekly:{mor:"",noon:"",eve:"",night:"Weekly"}, Monthly:{mor:"",noon:"",eve:"",night:"Monthly"},
      };
      const schedule = schedules[draft.period] || schedules.OD;
      const dosageCount = { OD:1,BD:2,TDS:3,QID:4,HS:1,SOS:1,Stat:1,Weekly:1,Monthly:1 };
      let intakeNum = parseFloat(draft.intake) || 1;
      if (draft.intake.includes("1½")) intakeNum = 1.5;
      else if (draft.intake.includes("¼")) intakeNum = 0.25;
      else if (draft.intake.includes("½")) intakeNum = 0.5;
      else if (draft.intake.includes("¾")) intakeNum = 0.75;
      const buy = Math.ceil((parseInt(draft.days) || 1) * (dosageCount[draft.period] || 1) * intakeNum);
      return { ...schedule, buy, when: draft.when, detail: draft.detail === "—" ? "" : draft.detail };
    },

    sidePanel: {
      type: "group-list", // Drug Group Prescription
      title: "Drug Group Prescription",
      itemLabel: "Prescriptions Recorded",
      columns: ["Prescription Title", "Days", "Drugs"],
      newButtonLabel: "New Group",
      listSourceLabel: "Drug Group List",
      dataFile: "drugGroups",
    },

    searchSource: "medicines", // API endpoint key
  },

  /* ══════════════════ LAB ══════════════════ */
  lab: {
    key: "lab",
    label: "Lab",
    icon: FlaskConical,
    color: "var(--color-lab)",
    colorLight: "var(--color-lab-light)",

    labels: {
      addButton: "Add Test",
      searchPlaceholder: "Search or select Lab Test",
      searchListLabel: "Lab Tests",
      newEntityButton: "New Test",
      footerFilterLabel: "Test Type",
    },

    filters: { typeOptions: ["Currently Live", "All", "Discontinued"] },

    ...SIMPLE_SEARCH_ONLY,

    // Auto-populate the report-view's Unit/Bio-Ref/Specimen from the test catalog
    // the moment a test is added; Observed Value stays blank for the user to fill in.
    enrichItem: (draft) => {
      const details = labTestDetails[draft.name] || {};
      return {
        unit: details.unit || "",
        bioRef: details.bioRef || "",
        specimen: details.specimen || "",
        observedValue: "",
      };
    },

    sidePanel: {
      // Lab's panel has two states — a prescription list, and a results/report view.
      // The report view is toggled by the tab's own "Preview" toolbar button (see OPDeskScreen.jsx).
      type: "group-list",
      title: "Test Group Prescription",
      itemLabel: "Prescriptions Recorded",
      columns: ["Prescription Title", "Tests"],
      newButtonLabel: "New Group",
      listSourceLabel: "Test Group List",
      dataFile: "labGroups",
      reportView: {
        type: "report-view",
        title: "Test Report",
        actions: ["Preview", "Print"],
        columns: ["Observed Value", "Unit", "Biological Reference - Interval", "Specimen"],
      },
    },

    searchSource: "lab_tests",
  },

  /* ══════════════════ SERVICE ══════════════════ */
  services: {
    key: "services",
    label: "Service",
    icon: ServicesIcon,
    color: "var(--color-services)",
    colorLight: "var(--color-services-light)",

    labels: {
      addButton: "Add Service",
      searchPlaceholder: "Search or select Service",
      searchListLabel: "Services",
      newEntityButton: "New Service",
      footerFilterLabel: "Service Type",
    },

    filters: { typeOptions: ["Currently Live", "All", "Discontinued"] },

    ...SIMPLE_SEARCH_ONLY,

    sidePanel: {
      // Not a prescription list — a file manager for reports/findings uploads.
      type: "file-manager",
      title: "Service Reports & Findings",
      columns: ["File Name", "Type", "Size", "Dt-Time"],
      newButtonLabel: "New File",
      dataFile: "serviceFiles",
    },

    searchSource: "services",
  },

  /* ══════════════════ IP TIME ══════════════════ */
  iptime: {
    key: "iptime",
    label: "IP Time",
    icon: Clock,
    color: "var(--color-iptime)",
    colorLight: "var(--color-iptime-light)",

    labels: {
      addButton: "Add Entry",
      footerFilterLabel: "Entry Type",
    },

    filters: { typeOptions: ["Currently Live", "All"] },

    // No catalog-search field — 4 independent typable-or-select fields instead.
    hasSearchField: false,
    requiredField: "subject",

    fieldOptions: {
      subject: ipSubjects,
      advice: ipAdvice,
      nurse: ipNurses,
      treatment: ipTreatments,
    },

    addRowFields: ["subject", "advice", "nurse", "treatment", "commit"],

    tableColumns: [
      { key: "no",        label: "No.",         width: "w-12",   type: "index" },
      { key: "dateTime",  label: "Date-Time",    width: "w-32",   type: "text" },
      { key: "subject",   label: "IP Subject",   width: "flex-1", type: "text" },
      { key: "advice",    label: "IP Advice",    width: "flex-1", type: "text" },
      { key: "nurse",     label: "Nurse",        width: "flex-1", type: "text" },
      { key: "treatment", label: "IP Treatment", width: "flex-1", type: "text" },
      { key: "actions",   label: "Actions",      width: "w-24",   type: "actions" },
    ],

    computeRowDisplay: (draft) => {
      const now = new Date();
      const pad = n => String(n).padStart(2, "0");
      const dateTime = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(now.getHours())}.${pad(now.getMinutes())}`;
      return {
        dateTime,
        subject: draft.subject,
        advice: draft.advice,
        nurse: draft.nurse,
        treatment: draft.treatment,
      };
    },

    sidePanel: {
      type: "group-list",
      title: "IP Time Group",
      itemLabel: "Entries Recorded",
      columns: ["Entry Title", "Days", "Items"],
      newButtonLabel: "New Group",
      listSourceLabel: "IP Time Group List",
      dataFile: "ipTimeGroups",
    },

    searchSource: null,
  },
};
