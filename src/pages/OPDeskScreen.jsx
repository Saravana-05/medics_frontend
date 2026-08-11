import { useState, useRef, useLayoutEffect, useEffect } from "react";
import { ChevronLeft, ChevronRight, ListFilter } from "lucide-react";
import AppBar from "../components/AppBar/AppBar";
import PatientInfoBar from "./OPDeskScreen/PatientInfoBarSection/PatientInfoBar";
import LeftSidebar from "./OPDeskScreen/LeftSidebar";
import RightSidebar from "./OPDeskScreen/RightSidebar";
import PrescriptionTabs from "./OPDeskScreen/PrescriptionTabs";
import PrescriptionEntryTab, { ModernToolbar } from "./OPDeskScreen/PrescriptionEntryTab";
import PrescriptionSidePanel from "./OPDeskScreen/PrescriptionSidePanel";
import { TAB_CONFIGS } from "../config/tabConfig";
import PreviousVisitsTable from "./OPDeskScreen/PreviousVisitsTable";
import { MOCK_PATIENTS, PREVIOUS_VISITS } from "./OPDeskScreen/mockData";
import Divider from "@mui/material/Divider";
import medicineList from "../data/medicines.json";
import labTestList from "../data/labTest.json";
import serviceList from "../data/services.json";
import ipSubjectList from "../data/ipSubjects.json";
import medConditionList from "../data/medConditions.json";
import { savePatientRecord, getPatientRecord } from "./OPDeskScreen/patientRecordStore";

// IP Time-line's Medic column: the doctor assigned to the OP Desk, shown alongside
// whoever is actually logged in when that's someone other than the doctor (e.g. a
// nurse entering notes on the doctor's behalf).
const DEFAULT_DOCTOR_NAME = "Dr. Aravind Kumar";

// Sits where Clear/Paste/Preview/Save/Print normally do — Care-Plan has too many
// columns to show all at once, so this replaces the toolbar with a Show/Hide
// Columns control instead, same pattern Previous Information uses.
function ColumnFilterButton({ columns, visible, onToggle, color }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen(v => !v)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all"
        style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", color: "var(--color-text-base)" }} title="Show/Hide Columns">
        <ListFilter size={13} /> Columns
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-44 rounded-lg shadow-xl z-50 animate-fade-in"
          style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
          onMouseLeave={() => setOpen(false)}>
          <div className="p-2 border-b" style={{ borderColor: "var(--color-border)" }}>
            <span className="text-xs font-semibold">Show/Hide Columns</span>
          </div>
          <div className="p-2 space-y-1">
            {columns.map(col => (
              <label key={col.key} className="flex items-center gap-2 cursor-pointer text-[0.7rem] py-0.5 hover:bg-surface-alt px-1 rounded transition-all">
                <input type="checkbox" checked={visible[col.key] !== false}
                  onChange={() => onToggle(col.key)} className="w-3.5 h-3.5 rounded" style={{ accentColor: color }} />
                <span style={{ color: "var(--color-text-base)" }}>{col.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function OPDeskScreen({ user, onLogout }) {
  const [patients, setPatients] = useState(MOCK_PATIENTS);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activeTab, setActiveTab] = useState("drugs");
  const [leftPanel, setLeftPanel] = useState(null);
  const [rightPanel, setRightPanel] = useState(null);
  const [highlightedTab, setHighlightedTab] = useState(null);
  const [leftHighlightedTab, setLeftHighlightedTab] = useState(null);
  const [isRightPanelExpanded, setIsRightPanelExpanded] = useState(false);
  const [isTabletView, setIsTabletView] = useState(window.innerWidth < 1024);
  const [drugs, setDrugs] = useState([]);
  const [labs, setLabs] = useState([]);
  const [labShowReport, setLabShowReport] = useState(false);
  const [services, setServices] = useState([]);
  const [ipEntries, setIpEntries] = useState([]);
  const [carePlanItems, setCarePlanItems] = useState([]);
  // Care-Plan's Show/Hide Columns state — lives here (not inside PrescriptionEntryTab)
  // since its toggle button sits in this toolbar row, not inside the grid itself.
  const [carePlanVisibleCols, setCarePlanVisibleCols] = useState(() => {
    try {
      const saved = localStorage.getItem("carePlanTableColumns");
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });
  useEffect(() => {
    localStorage.setItem("carePlanTableColumns", JSON.stringify(carePlanVisibleCols));
  }, [carePlanVisibleCols]);
  const [saveMessage, setSaveMessage] = useState(null); // { text, key } — key forces the toast to re-fire even on repeat text

  // Building a new Drug/Lab Group reuses the main grid's own add-row instead of
  // a separate widget: starting a draft swaps that tab's grid to a blank capture
  // list (groupDraftItems) so items added while drafting never mix with the
  // patient's real prescription; Save/Cancel hands back to the real drugs/labs.
  const [groupDraft, setGroupDraft] = useState(null); // null | { tabKey, title }
  const [groupDraftItems, setGroupDraftItems] = useState([]);

  // Check window resize for tablet view
  useState(() => {
    const handleResize = () => {
      setIsTabletView(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const selectPatient = (p) => {
    setSelectedPatient(p);
    const record = p ? getPatientRecord(p.id) : null;
    setDrugs(record?.drugs || []);
    setLabs(record?.labs || []);
    setServices(record?.services || []);
    setIpEntries(record?.ipEntries || []);
    setCarePlanItems(record?.carePlanItems || []);
    setLabShowReport(false);
  };

  // Adds a freshly-registered patient to the in-session patient list and
  // selects them immediately, same as picking an existing one from the dropdown.
  const addPatient = (newPatient) => {
    setPatients(prev => [newPatient, ...prev]);
    selectPatient(newPatient);
  };

  const handleSave = (text = "Prescription saved successfully!") => {
    setSaveMessage({ text, key: Date.now() });
  };

  // Persists the active tab's current items against the selected patient (in
  // memory for this session — no backend yet) and shows the "Saved" snackbar.
  const handleSaveActiveTab = () => {
    if (!selectedPatient) { alert("Please select a patient first."); return; }
    const field = { drugs: "drugs", lab: "labs", services: "services", iptime: "ipEntries", carePlan: "carePlanItems" }[activeTab];
    savePatientRecord(selectedPatient.id, { [field]: activeItems });
    handleSave(`${activeConfig?.label || "Prescription"} saved successfully!`);
  };

  // Loads a Drug/Lab Group's items into that tab's grid, adding to whatever's
  // already there — same computeRowDisplay/enrichItem logic the add-row itself
  // uses, just applied to every item in the group at once. Appending (not
  // replacing) is what lets several groups be applied one after another and
  // have all of their items listed together instead of only the last one.
  // Clicking an already-applied group again (revert=true) removes exactly the
  // items that group added, tracked via each item's groupId.
  const applyGroup = (entry, revert = false) => {
    const config = TAB_CONFIGS[activeTab];
    const setItems = { drugs: setDrugs, lab: setLabs }[activeTab];
    if (!config || !setItems) return;
    if (revert) {
      setItems(prev => prev.filter(it => it.groupId !== entry.id));
      return;
    }
    const draftBase = activeTab === "drugs"
      ? { days: String(entry.days || 1), intake: "1", period: "OD", when: "AF", detail: "—" }
      : { detail: "—" };
    const newItems = (entry.medicines || []).map(name => {
      const draft = { name, ...draftBase };
      const extra = config.enrichItem ? config.enrichItem(draft) : {};
      return { id: Date.now() + Math.random(), groupId: entry.id, ...draft, ...extra, display: config.computeRowDisplay(draft) };
    });
    setItems(prev => [...prev, ...newItems]);
  };

  // New Drug/Lab Group, step 2 (title already confirmed in the side panel):
  // swap the active tab's grid to a blank capture list so items added via the
  // normal add-row go into the group draft, not the patient's real prescription.
  const startGroupDraft = title => { setGroupDraft({ tabKey: activeTab, title }); setGroupDraftItems([]); };
  // Discards whatever was captured — the real drugs/labs items underneath were
  // never touched, so this just switches the grid back to showing them.
  const cancelGroupDraft = () => { setGroupDraft(null); setGroupDraftItems([]); };
  // The side panel has already saved the group entry itself by this point —
  // this just clears the capture state so the grid reverts to real items.
  const finishGroupDraft = () => { setGroupDraft(null); setGroupDraftItems([]); };

  const visits = selectedPatient ? (PREVIOUS_VISITS[selectedPatient.id] || []) : [];
  const tabCount = { drugs: drugs.length, lab: labs.length, services: services.length, iptime: ipEntries.length, carePlan: carePlanItems.length };

  const toggleRightPanel = () => {
    setIsRightPanelExpanded(!isRightPanelExpanded);
  };

  const updateLabReportField = (id, field, value) => {
    setLabs(prev => prev.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const activeConfig = TAB_CONFIGS[activeTab];
  const activeEntryTabRef = useRef(null);
  const activeItems = { drugs, lab: labs, services, iptime: ipEntries, carePlan: carePlanItems }[activeTab];

  // IP Time-line's Medic auto-populates from the session, not manual entry:
  // the logged-in doctor shows alone, but a non-doctor (e.g. a nurse covering
  // for the doctor) shows combined with the assigned doctor's name.
  const currentMedicName = user?.role === "doctor"
    ? (user?.name || DEFAULT_DOCTOR_NAME)
    : `${DEFAULT_DOCTOR_NAME}, ${user?.name || "Unknown"}`;

  // Pixel-locks the left panel's RIGHT edge to the First Observation card's
  // right edge, measured at runtime (a hand-computed CSS formula can't track
  // a flex-based, remainder-sized layout across viewports). Middle/right
  // panels stay on their static widths — only the left panel is dynamic here.
  const firstObservationCardRef = useRef(null);
  const leftPanelRef = useRef(null);

  useLayoutEffect(() => {
    const syncLeftPanelAlignment = () => {
      const leftPanel = leftPanelRef.current;
      const cardEl = firstObservationCardRef.current;
      if (!leftPanel || !cardEl) return;
      const leftX = leftPanel.getBoundingClientRect().left;
      const targetRight = cardEl.getBoundingClientRect().right;
      leftPanel.style.width = `${targetRight - leftX}px`;
    };

    syncLeftPanelAlignment();
    window.addEventListener("resize", syncLeftPanelAlignment);
    const t = setTimeout(syncLeftPanelAlignment, 100);

    return () => {
      window.removeEventListener("resize", syncLeftPanelAlignment);
      clearTimeout(t);
    };
  }, [activeTab, activeConfig?.sidePanel, isTabletView, selectedPatient, isRightPanelExpanded]);

  return (
    <div className="h-screen flex flex-col overflow-hidden " style={{ background: "var(--color-surface-alt)", fontFamily: "var(--font-body)" }}>

      {/* ── Fixed App Bar ── */}
      <div className="flex-shrink-0">
        <AppBar
          user={user}
          onLogout={onLogout}
          savedMessage={saveMessage}
          onOPListClick={selectPatient}
          patients={patients}
          screenType="opdesk"
        />
      </div>

      {/* ── Second Row: LeftSidebar + PatientInfoBar + RightSidebar ── */}
      {/* On tablet/mobile this row is capped at 50% of viewport height and scrolls
          internally, so the main workspace below always keeps usable space. */}
      <div className="flex-shrink-0 flex items-stretch max-h-screen overflow-y-auto md:max-h-none lg:overflow-visible">
        <div className="flex-shrink-0 flex mb-[8px]">
          <LeftSidebar activePanel={leftPanel} onPanelChange={setLeftPanel} patient={selectedPatient} onHoverChange={setLeftHighlightedTab} />
        </div>

        <div className="flex-1 flex">
          <PatientInfoBar
            patients={patients}
            selectedPatient={selectedPatient}
            onSelectPatient={selectPatient}
            onAddPatient={addPatient}
            onOPList={() => {}}
            onIPList={() => {}}
            onPark={() => {}}
            onFinalize={() => handleSave()}
            highlightedTab={highlightedTab}
            leftHighlightedTab={leftHighlightedTab}
            firstObservationCardRef={firstObservationCardRef}
            activeTab={activeTab}
          />
        </div>

        <div className="flex-shrink-0 flex mb-[8px] ml-0.5">
          <RightSidebar activePanel={rightPanel} onPanelChange={setRightPanel} onHoverChange={setHighlightedTab}/>
        </div>
      </div>
      <Divider sx={{ backgroundColor: "#0a4a6e", height: 2 }} />
      {/* ── Main workspace with responsive split ── */}
      <div className="flex-1 flex gap-2 min-h-0 relative pl-1 pr-2" style={{ background: "var(--color-surface-alt)" }}>
        <>
            {/* Left Section - Prescription Tabs + Active Tab Content */}
            <div
              ref={leftPanelRef}
              className={`flex flex-col overflow-hidden min-w-0 mt-[8px] mb-[8px] shadow-sm transition-all duration-300 ${
                isTabletView
                  ? isRightPanelExpanded ? 'flex-[5]' : 'flex-1'
                  : 'flex-none'
              }`}
              style={{
                background: "#ffffff", border: "1px solid var(--color-border)",
                // Desktop: flex-[7]'s flex-basis:0% would silently ignore the
                // width the alignment effect sets below, so it's swapped for
                // flex-none — a plain px width — once !isTabletView.
                ...(isTabletView ? {} : { width: "58%" }),
              }}
            >
              {/* Tabs + toolbar share one row — tab buttons on the left, action
                  buttons (Clear/Paste/Preview/Save/Print) right-aligned on the right,
                  matching the reference ribbon-tab layout. */}
              <div className="flex-shrink-0 flex items-stretch justify-between px-2"
                style={{ background: "var(--color-surface-alt)", borderBottom: "1px solid var(--color-border)" }}>
                <PrescriptionTabs activeTab={activeTab} setActiveTab={setActiveTab} tabCount={tabCount} />
                <div className="flex items-center flex-shrink-0 pl-3">
                  {activeTab === "carePlan" ? (
                    <ColumnFilterButton
                      columns={TAB_CONFIGS.carePlan.tableColumns.filter(c => c.key !== "no" && c.key !== "actions")}
                      visible={carePlanVisibleCols}
                      onToggle={key => setCarePlanVisibleCols(prev => ({ ...prev, [key]: prev[key] === false ? true : false }))}
                      color={TAB_CONFIGS.carePlan.color}
                    />
                  ) : activeTab !== "iptime" && (
                    <ModernToolbar
                      onClear={() => activeEntryTabRef.current?.clearAll()}
                      onSave={handleSaveActiveTab}
                      onPreview={activeTab === "lab" ? () => setLabShowReport(v => !v) : undefined}
                      accentColor={activeConfig?.color}
                      accentLight={activeConfig?.colorLight}
                      accentText={activeConfig?.colorText}
                    />
                  )}
                </div>
              </div>

              {/* Building a new Drug/Lab Group: the grid below is a blank capture
                  list, not the patient's real prescription — Save/Cancel live in
                  the Group panel on the right. */}
              {groupDraft?.tabKey === activeTab && (
                <div className="flex-shrink-0 px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5"
                  style={{ background: activeConfig?.colorLight, color: activeConfig?.textAccent || activeConfig?.color, borderBottom: `1px solid ${activeConfig?.color}` }}>
                  Building group "{groupDraft.title}" — items added here go into the group, not the patient's prescription.
                </div>
              )}

              <div className="flex-1 overflow-y-auto min-h-0">
                {activeTab === "drugs" && (
                  <PrescriptionEntryTab ref={activeEntryTabRef} config={TAB_CONFIGS.drugs} searchList={medicineList}
                    items={groupDraft?.tabKey === "drugs" ? groupDraftItems : drugs}
                    setItems={groupDraft?.tabKey === "drugs" ? setGroupDraftItems : setDrugs} />
                )}
                {activeTab === "lab" && (
                  <PrescriptionEntryTab ref={activeEntryTabRef} config={TAB_CONFIGS.lab} searchList={labTestList}
                    items={groupDraft?.tabKey === "lab" ? groupDraftItems : labs}
                    setItems={groupDraft?.tabKey === "lab" ? setGroupDraftItems : setLabs} />
                )}
                {activeTab === "services" && (
                  <PrescriptionEntryTab ref={activeEntryTabRef} config={TAB_CONFIGS.services} items={services} setItems={setServices} searchList={serviceList} />
                )}
                {activeTab === "iptime" && (
                  <PrescriptionEntryTab ref={activeEntryTabRef} config={TAB_CONFIGS.iptime} items={ipEntries} setItems={setIpEntries} searchList={ipSubjectList} currentMedicName={currentMedicName} />
                )}
                {activeTab === "carePlan" && (
                  <PrescriptionEntryTab ref={activeEntryTabRef} config={TAB_CONFIGS.carePlan} items={carePlanItems} setItems={setCarePlanItems} searchList={medConditionList} visibleColOverrides={carePlanVisibleCols} />
                )}
              </div>
            </div>

            {/* Toggle Button for Tablet View */}
            {isTabletView && (
              <button
                onClick={toggleRightPanel}
                className="absolute z-20 flex items-center justify-center w-6 h-12 rounded-r-lg shadow-sm transition-all duration-300 hover:scale-105"
                style={{
                  background: "var(--color-primary)",
                  color: "white",
                  right: isRightPanelExpanded ? 'calc(50% - 3px)' : '0',
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
                title={isRightPanelExpanded ? "Collapse History" : "View History"}
              >
                {isRightPanelExpanded ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
              </button>
            )}

            {/* Middle "report/group" panel — one generic column driven by the active tab's
                config.sidePanel, own top-level column so its top aligns with Previous
                Information (both start right after the divider), independent of the
                Drug/Lab/Service/IP-Time tabs row height. Hidden on tablet per the
                "small screen: hide, don't restructure" requirement. */}
            {activeConfig?.sidePanel && !isTabletView && (
              <div
                className="flex-shrink-0 overflow-hidden mt-[8px] mb-[8px] shadow-sm"
                style={{ width: "27%", minWidth: "420px", marginRight: "2px", background: "#ffffff", border: "1px solid var(--color-border)" }}
              >
                <PrescriptionSidePanel
                  config={activeConfig}
                  showReport={activeTab === "lab" && labShowReport}
                  reportItems={labs}
                  onUpdateReportItem={updateLabReportField}
                  onTogglePreview={() => setLabShowReport(v => !v)}
                  mirrorItems={activeItems}
                  hasPatient={!!selectedPatient}
                  onApplyGroup={["drugs", "lab"].includes(activeTab) ? applyGroup : undefined}
                  onGroupSaved={handleSave}
                  draftActive={groupDraft?.tabKey === activeTab}
                  draftTitle={groupDraft?.title || ""}
                  draftItems={groupDraft?.tabKey === activeTab ? groupDraftItems.map(it => it.name) : []}
                  onStartDraft={startGroupDraft}
                  onSaveDraft={finishGroupDraft}
                  onCancelDraft={cancelGroupDraft}
                />
              </div>
            )}

            {/* Right Section - Previous Visits Table
                Desktop width = TopBar (w-96 = 384px) + RightSidebar (78px) = 462px,
                so its left edge lines up with the TopBar section above. */}
            <div
              className={`flex-shrink-0 overflow-hidden mt-[8px] mb-[8px] shadow-sm transition-all duration-300 ${
                isTabletView
                  ? isRightPanelExpanded
                    ? 'flex-[5] w-auto'
                    : 'w-0 overflow-hidden border-none shadow-none'
                  : 'w-[438px] flex-none'
              }`}
              style={{
                background: "#ffffff",
                border: isTabletView && !isRightPanelExpanded ? "none" : "1px solid var(--color-border)",
              }}
            >
              <PreviousVisitsTable visits={visits} />
            </div>
        </>
      </div>
    </div>
  );
}
