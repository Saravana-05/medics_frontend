import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
import { savePatientRecord, getPatientRecord } from "./OPDeskScreen/patientRecordStore";

export default function OPDeskScreen({ user, onLogout }) {
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
  const [saveMessage, setSaveMessage] = useState(null); // { text, key } — key forces the toast to re-fire even on repeat text

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
    setLabShowReport(false);
  };

  const handleSave = (text = "Prescription saved successfully!") => {
    setSaveMessage({ text, key: Date.now() });
  };

  // Persists the active tab's current items against the selected patient (in
  // memory for this session — no backend yet) and shows the "Saved" snackbar.
  const handleSaveActiveTab = () => {
    if (!selectedPatient) { alert("Please select a patient first."); return; }
    const field = { drugs: "drugs", lab: "labs", services: "services", iptime: "ipEntries" }[activeTab];
    savePatientRecord(selectedPatient.id, { [field]: activeItems });
    handleSave(`${activeConfig?.label || "Prescription"} saved successfully!`);
  };

  // Loads a Drug/Lab Group's items straight into that tab's grid, replacing
  // whatever's currently there — same computeRowDisplay/enrichItem logic the
  // add-row itself uses, just applied to every item in the group at once.
  const applyGroup = (entry) => {
    const config = TAB_CONFIGS[activeTab];
    const setItems = { drugs: setDrugs, lab: setLabs }[activeTab];
    if (!config || !setItems) return;
    const draftBase = activeTab === "drugs"
      ? { days: String(entry.days || 1), intake: "1", period: "OD", when: "AF", detail: "—" }
      : { detail: "—" };
    const newItems = (entry.medicines || []).map(name => {
      const draft = { name, ...draftBase };
      const extra = config.enrichItem ? config.enrichItem(draft) : {};
      return { id: Date.now() + Math.random(), ...draft, ...extra, display: config.computeRowDisplay(draft) };
    });
    setItems(newItems);
  };

  const visits = selectedPatient ? (PREVIOUS_VISITS[selectedPatient.id] || []) : [];
  const tabCount = { drugs: drugs.length, lab: labs.length, services: services.length, iptime: ipEntries.length };

  const toggleRightPanel = () => {
    setIsRightPanelExpanded(!isRightPanelExpanded);
  };

  const updateLabReportField = (id, field, value) => {
    setLabs(prev => prev.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const activeConfig = TAB_CONFIGS[activeTab];
  const activeEntryTabRef = useRef(null);
  const activeItems = { drugs, lab: labs, services, iptime: ipEntries }[activeTab];

  return (
    <div className="h-screen flex flex-col overflow-hidden " style={{ background: "var(--color-surface-alt)", fontFamily: "var(--font-body)" }}>

      {/* ── Fixed App Bar ── */}
      <div className="flex-shrink-0">
        <AppBar
          user={user}
          onLogout={onLogout}
          savedMessage={saveMessage}
          onOPListClick={selectPatient}
          patients={MOCK_PATIENTS}
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
            patients={MOCK_PATIENTS}
            selectedPatient={selectedPatient}
            onSelectPatient={selectPatient}
            onOPList={() => {}}
            onIPList={() => {}}
            onPark={() => {}}
            onFinalize={() => handleSave()}
            highlightedTab={highlightedTab}
            leftHighlightedTab={leftHighlightedTab}
          />
        </div>

        <div className="flex-shrink-0 flex mb-[8px]">
          <RightSidebar activePanel={rightPanel} onPanelChange={setRightPanel} onHoverChange={setHighlightedTab}/>
        </div>
      </div>
      <Divider sx={{ backgroundColor: "#0a4a6e", height: 2 }} />
      {/* ── Main workspace with responsive split ── */}
      <div className="flex-1 flex gap-2 min-h-0 relative px-2" style={{ background: "var(--color-surface-alt)" }}>
        <>
            {/* Left Section - Prescription Tabs + Active Tab Content */}
            <div
              className={`flex flex-col overflow-hidden min-w-0 mt-[8px] mb-[8px] rounded-md shadow-md transition-all duration-300 ${
                isTabletView
                  ? isRightPanelExpanded ? 'flex-[5]' : 'flex-1'
                  : 'flex-[7]'
              }`}
              style={{ background: "#ffffff", border: "1px solid var(--color-border)" }}
            >
              {/* Tabs + toolbar share one row — tab buttons on the left, action
                  buttons (Clear/Paste/Preview/Save/Print) right-aligned on the right,
                  matching the reference ribbon-tab layout. */}
              <div className="flex-shrink-0 flex items-stretch justify-between px-2"
                style={{ background: "var(--color-surface-alt)", borderBottom: "1px solid var(--color-border)" }}>
                <PrescriptionTabs activeTab={activeTab} setActiveTab={setActiveTab} tabCount={tabCount} />
                <div className="flex items-center flex-shrink-0 pl-3">
                  <ModernToolbar
                    onClear={() => activeEntryTabRef.current?.clearAll()}
                    onSave={handleSaveActiveTab}
                    onPreview={activeTab === "lab" ? () => setLabShowReport(v => !v) : undefined}
                    accentColor={activeConfig?.color}
                    accentLight={activeConfig?.colorLight}
                    accentText={activeConfig?.colorText}
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto min-h-0">
                {activeTab === "drugs" && (
                  <PrescriptionEntryTab ref={activeEntryTabRef} config={TAB_CONFIGS.drugs} items={drugs} setItems={setDrugs} searchList={medicineList} />
                )}
                {activeTab === "lab" && (
                  <PrescriptionEntryTab ref={activeEntryTabRef} config={TAB_CONFIGS.lab} items={labs} setItems={setLabs} searchList={labTestList} />
                )}
                {activeTab === "services" && (
                  <PrescriptionEntryTab ref={activeEntryTabRef} config={TAB_CONFIGS.services} items={services} setItems={setServices} searchList={serviceList} />
                )}
                {activeTab === "iptime" && (
                  <PrescriptionEntryTab ref={activeEntryTabRef} config={TAB_CONFIGS.iptime} items={ipEntries} setItems={setIpEntries} searchList={ipSubjectList} />
                )}
              </div>
            </div>

            {/* Toggle Button for Tablet View */}
            {isTabletView && (
              <button
                onClick={toggleRightPanel}
                className="absolute z-20 flex items-center justify-center w-6 h-12 rounded-r-lg shadow-md transition-all duration-300 hover:scale-105"
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
                className="flex-shrink-0 overflow-hidden mt-[8px] mb-[8px] rounded-md shadow-md"
                style={{ width: "27%", minWidth: "420px", background: "#ffffff", border: "1px solid var(--color-border)" }}
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
                />
              </div>
            )}

            {/* Right Section - Previous Visits Table
                Desktop width = TopBar (w-96 = 384px) + RightSidebar (78px) = 462px,
                so its left edge lines up with the TopBar section above. */}
            <div
              className={`flex-shrink-0 overflow-hidden mt-[8px] mb-[8px] rounded-md shadow-md transition-all duration-300 ${
                isTabletView
                  ? isRightPanelExpanded
                    ? 'flex-[5] w-auto'
                    : 'w-0 overflow-hidden border-none shadow-none'
                  : 'w-[438px] flex-none'
              }`}
              style={{ background: "#ffffff", border: isTabletView && !isRightPanelExpanded ? "none" : "1px solid var(--color-border)" }}
            >
              <PreviousVisitsTable visits={visits} />
            </div>
        </>
      </div>
    </div>
  );
}
