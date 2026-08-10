import { Pill, FlaskConical, Settings as ServicesIcon, Clock, ClipboardList } from "lucide-react";
import labTestDetails from "../data/labTestDetails.json";
import ipAdvice from "../data/ipAdvice.json";

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
    colorText: "white",
    // Used wherever the accent is rendered as TEXT/icon color on a white or
    // near-white background (not as a solid background needing colorText on
    // top of it). For the 3 saturated tabs this is just `color` itself; IP
    // Time-line's pale cream isn't legible as text, so it uses colorText (navy) instead.
    textAccent: "var(--color-drugs)",

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
      { key: "name",    label: "Name",   width: "w-80",   type: "text", align: "center" },
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
      // Each group holds a real list of medicines (not just a count) — the New/Modify
      // modal lets you search and add multiple, and clicking "Use" loads them into
      // the Drug grid in one go.
      medicinePicker: true,
      pickerLabel: "Medicines",
      applyLabel: "Use",
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
    colorText: "white",
    textAccent: "var(--color-lab)",

    labels: {
      addButton: "Add Test",
      searchPlaceholder: "Search or select Lab Test",
      searchListLabel: "Lab Tests",
      newEntityButton: "New Test",
      footerFilterLabel: "Test Type",
    },

    filters: { typeOptions: ["Currently Live", "All", "Discontinued"] },

    ...SIMPLE_SEARCH_ONLY,
    // Lab's Name column is centered; Service (which reuses the same shared
    // tableColumns) stays left-aligned, so override just this one column here.
    tableColumns: SIMPLE_SEARCH_ONLY.tableColumns.map(col => col.key === "name" ? { ...col, align: "center" } : col),

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
      // Same as Drug — each group holds a real list of tests, searchable/addable
      // in the New/Modify modal, with "Use" loading them into the Lab grid.
      medicinePicker: true,
      pickerLabel: "Tests",
      applyLabel: "Use",
      remarksField: true,
      reportView: {
        type: "report-view",
        title: "Test Report",
        actions: ["Preview", "Print"],
        // "Test Name" first so each row is identifiable — critical once a group
        // applies several tests at once, otherwise every row looks the same.
        columns: ["Test Name", "Observed Value", "Unit", "Biological Reference - Interval", "Specimen"],
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
    colorText: "white",
    textAccent: "var(--color-services)",

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
    label: "IP Time-line",
    icon: Clock,
    color: "var(--color-iptime)",
    colorLight: "var(--color-iptime-light)",
    colorText: "var(--color-iptime-text)", // pale cream accent needs dark text to stay legible
    textAccent: "var(--color-iptime-text)", // cream itself is unreadable as text — use the dark navy instead

    labels: {
      addButton: "Add Entry",
      searchPlaceholder: "Search or select Subject",
      searchListLabel: "IP Subjects",
      searchColumnLabel: "Subject", // AddRow's search field is labeled "Subject" here, not "Name"
      newEntityButton: "New Entry",
      footerFilterLabel: "Entry Type",
    },

    filters: { typeOptions: ["Currently Live", "All"] },

    fieldOptions: {
      notes: ipAdvice,
      entryType: ["Support", "Instruction"],
    },

    // Medic isn't typed — it's derived from who's logged in (see computeRowDisplay's
    // context arg), so it has no addRowFields entry. Time is now a picked field
    // instead of an auto-stamp, so it must be chosen before an entry can be added.
    addRowFields: ["time", "name", "notes", "entryType", "commit"],
    // Subject stays required (primary identifying field, like every other tab);
    // Time must also be chosen before an entry can be added.
    requiredFields: ["name", "time"],

    tableColumns: [
      { key: "no",        label: "No.",         width: "w-12",   type: "index" },
      { key: "medic",      label: "Medic",       width: "w-28",   type: "text" },
      { key: "time",       label: "Time",        width: "w-24",   type: "text" },
      { key: "name",       label: "Subject",     width: "flex-1", type: "text", align: "center" },
      { key: "notes",      label: "Notes",       width: "flex-1", type: "text" },
      { key: "entryType",  label: "Entry Type",  width: "w-24",   type: "text" },
      { key: "actions",    label: "Actions",     width: "w-24",   type: "actions" },
    ],

    // `context.currentMedicName` is threaded in from OPDeskScreen (derived from the
    // logged-in user) — Medic is never typed by hand, it just reflects who's logged in.
    computeRowDisplay: (draft, context = {}) => {
      const [h, m] = (draft.time || "").split(":").map(Number);
      const pad = n => String(n).padStart(2, "0");
      const time = Number.isFinite(h) && Number.isFinite(m)
        ? `${pad(h % 12 || 12)}:${pad(m)} ${h >= 12 ? "PM" : "AM"}`
        : "";
      return {
        primaryLine: draft.name,
        time,
        medic: context.currentMedicName || "",
        notes: draft.notes,
        entryType: draft.entryType,
      };
    },

    sidePanel: {
      // Not an aggregated group list — a live read-only mirror of this tab's own
      // entries, shown as Entry Type / Subject / Notes rows (see EntryMirrorPanel).
      type: "entry-mirror",
      title: "Patient Group Service",
      itemLabel: "Entries Recorded",
      columns: ["Entry Type", "Subject", "Notes"],
    },

    searchSource: "ip_subjects",

    searchSource: null,
  },

  /* ══════════════════ CARE-PLAN ══════════════════ */
  carePlan: {
    key: "carePlan",
    label: "Care-Plan",
    icon: ClipboardList,
    color: "var(--color-careplan)",
    colorLight: "var(--color-careplan-light)",
    colorText: "white",
    textAccent: "var(--color-careplan)",

    labels: {
      addButton: "Add Activity",
      searchPlaceholder: "Search or select Med. Condition",
      searchListLabel: "Med. Conditions",
      searchColumnLabel: "Med. Condition", // AddRow's search field is labeled "Med. Condition" here, not "Name"
      newEntityButton: "New Activity",
      footerFilterLabel: "Sch. Status",
    },

    filters: { typeOptions: ["Currently Live", "All"] },

    fieldOptions: {
      milestone: ["Week-8", "Week-14", "Week-20", "Week-28", "Week-36", "Cycle-1", "Cycle-2", "Cycle-3", "Month-1", "Month-3"],
      pathwayName: ["1st AN Visit", "2nd Visit", "3rd Visit", "Induction Visit", "Follow-up Visit", "Review Visit"],
      activityType: ["Test", "Drug", "Monitoring", "Counseling", "Follow-up"],
      activityDescription: ["CBC, Bl.Group,HIV,HBsAg,...", "Start Folic Acid 5mg, TT1", "BP, Weight, FHS check"],
      schStatus: ["Scheduled", "Completed", "Late Visit", "Lapsed", "Cancelled"],
    },

    // Med. Condition (searchable) → Schedule → Sch. Date (picked, like IP Time's
    // Time field) → Milestone → Pathway Name → Activity Type → Activity
    // Description → Sch. Status — same order the view table shows them in.
    addRowFields: ["name", "schedule", "schDate", "milestone", "pathwayName", "activityType", "activityDescription", "schStatus", "commit"],

    tableColumns: [
      { key: "no",                  label: "No.",                 width: "w-12",   type: "index" },
      { key: "name",                label: "Med. Condition",      width: "w-36",   type: "text" },
      { key: "schedule",            label: "Schedule",            width: "w-16",   type: "text" },
      { key: "schDate",             label: "Sch. Date",           width: "w-24",   type: "text" },
      { key: "milestone",           label: "Milestone",           width: "w-20",   type: "text" },
      { key: "pathwayName",         label: "Pathway Name",        width: "w-28",   type: "text" },
      { key: "activityType",        label: "Activity Type",       width: "w-24",   type: "text" },
      { key: "activityDescription", label: "Activity Description",width: "flex-1", type: "text" },
      { key: "schStatus",           label: "Sch. Status",         width: "w-24",   type: "text" },
      { key: "actions",             label: "Actions",             width: "w-24",   type: "actions" },
    ],

    computeRowDisplay: (draft) => ({
      primaryLine: draft.name,
      schedule: draft.schedule,
      schDate: draft.schDate,
      milestone: draft.milestone,
      pathwayName: draft.pathwayName,
      activityType: draft.activityType,
      activityDescription: draft.activityDescription,
      schStatus: draft.schStatus,
    }),

    sidePanel: {
      // A browsable library of care-plan templates (Speciality / Med. Condition /
      // Milestones / Period) — not a group-list of items, so it gets its own
      // panel type rather than reusing Drug/Lab's medicine-picker shape.
      type: "care-plan-list",
      title: "Care-Plan Template",
      itemLabel: "Templates Recorded",
      columns: ["Speciality", "Med. Condition", "Milestones", "Period"],
      newButtonLabel: "New Template",
      listSourceLabel: "Speciality",
      dataFile: "carePlanTemplates",
    },

    searchSource: "med_conditions",
  },
};
