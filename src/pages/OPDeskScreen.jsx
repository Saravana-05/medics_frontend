import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AppBar from "../components/AppBar/AppBar";
import PatientInfoBar from "./OPDeskScreen/PatientInfoBarSection/PatientInfoBar";
import LeftSidebar from "./OPDeskScreen/LeftSidebar";
import RightSidebar from "./OPDeskScreen/RightSidebar";
import PrescriptionTabs from "./OPDeskScreen/PrescriptionTabs";
import DrugTab from "./OPDeskScreen/DrugTab";
import LabTab from "./OPDeskScreen/LabTab";
import ServiceTab from "./OPDeskScreen/ServiceTab";
import FindingsTab from "./OPDeskScreen/FindingsTab";
import PreviousVisitsTable from "./OPDeskScreen/PreviousVisitsTable";
import { MOCK_PATIENTS, PREVIOUS_VISITS } from "./OPDeskScreen/mockData";
import IPTimeSheetTab from "./OPDeskScreen/IPTimeSheetTab";
import RepeatPrescriptionsPanel from "./OPDeskScreen/RepeatPrescriptionsPanel";
import LabReportPanel from "./OPDeskScreen/LabReportPanel";
import Divider from "@mui/material/Divider";

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
  const [labStruckIds, setLabStruckIds] = useState([]);
  const [labSelectedRowId, setLabSelectedRowId] = useState(null);
  const [services, setServices] = useState([]);
  const [findings, setFindings] = useState({
    diagnosis: "", clinicalNotes: "", advice: "",
    nextVisit: "", referTo: "", followupNote: "",
  });
  const [ipEntries, setIpEntries] = useState([]);
  const [saved, setSaved] = useState(false);

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
    setDrugs([]); setLabs([]); setServices([]);
    setLabStruckIds([]); setLabSelectedRowId(null);
    setFindings({ diagnosis: "", clinicalNotes: "", advice: "", nextVisit: "", referTo: "", followupNote: "" });
    setSaved(false);
  };

  const handleSave = () => { 
    setSaved(true); 
    setTimeout(() => setSaved(false), 4000);
  };
  
  const handleClear = () => {
    setDrugs([]); setLabs([]); setServices([]);
    setFindings({ diagnosis: "", clinicalNotes: "", advice: "", nextVisit: "", referTo: "", followupNote: "" });
  };

  const visits = selectedPatient ? (PREVIOUS_VISITS[selectedPatient.id] || []) : [];
  const tabCount = { drugs: drugs.length, lab: labs.length, services: services.length, findings: 0, iptime: ipEntries.length };

  const toggleRightPanel = () => {
    setIsRightPanelExpanded(!isRightPanelExpanded);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden " style={{ background: "var(--color-surface-alt)", fontFamily: "var(--font-body)" }}>

      {/* ── Fixed App Bar ── */}
      <div className="flex-shrink-0">
        <AppBar 
          user={user} 
          onLogout={onLogout} 
          saved={saved} 
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
            onFinalize={handleSave}
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
      <div className="flex-1 flex  min-h-0 relative ">
        <>
            {/* Left Section - Prescription Tabs + Active Tab Content */}
            <div
              className={`flex flex-col overflow-hidden min-w-0 pt-[5px] pb-[8px] transition-all duration-300 ${
                isTabletView
                  ? isRightPanelExpanded ? 'flex-[5]' : 'flex-1'
                  : 'flex-[7]'
              }`}
              style={{ background: "#ffffff" }}
            >
              <PrescriptionTabs 
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                tabCount={tabCount}
                onClear={handleClear}
                onSave={handleSave}
              />

              <div className="flex-1 overflow-y-auto min-h-0">
                {activeTab === "drugs" && <DrugTab drugs={drugs} setDrugs={setDrugs} patient={selectedPatient} />}
                {activeTab === "lab" && (
                  <LabTab
                    labs={labs}
                    setLabs={setLabs}
                    patient={selectedPatient}
                    struckIds={labStruckIds}
                    setStruckIds={setLabStruckIds}
                    selectedRowId={labSelectedRowId}
                    setSelectedRowId={setLabSelectedRowId}
                  />
                )}
                {activeTab === "services" && <ServiceTab services={services} setServices={setServices} patient={selectedPatient} />}
                {activeTab === "findings" && <FindingsTab findings={findings} setFindings={setFindings} patient={selectedPatient} />}
                {activeTab === "iptime" && <IPTimeSheetTab entries={ipEntries} setEntries={setIpEntries} patient={selectedPatient} />}
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

            {/* Repeat Prescriptions — own top-level column so its top aligns with
                Previous Information (both start right after the divider), independent
                of the Drug/Lab/Service/Findings/IP-Time tabs row height. Only shown
                while the Drug tab is active. */}
            {activeTab === "drugs" && (
              <div
                className="flex-shrink-0 overflow-y-auto pt-[8px] pb-[8px]"
                style={{ width: "27%", minWidth: "420px", marginRight: "8px", background: "#ffffff" }}
              >
                <RepeatPrescriptionsPanel />
              </div>
            )}

            {/* Lab Report — own top-level column, same pattern as Repeat Prescriptions:
                mirrors the lab tests entered on the Lab tab (shared labs/struckIds/
                selectedRowId state), starts right after the divider so its top aligns
                with Previous Information. Only shown while the Lab tab is active. */}
            {activeTab === "lab" && (
              <div
                className="flex-shrink-0 overflow-y-auto pt-[8px] pb-[8px]"
                style={{ width: "27%", minWidth: "420px", marginRight: "8px", background: "#ffffff" }}
              >
                <LabReportPanel
                  labs={labs}
                  struckIds={labStruckIds}
                  selectedRowId={labSelectedRowId}
                  onSelect={setLabSelectedRowId}
                />
              </div>
            )}

            {/* Right Section - Previous Visits Table
                Desktop width = TopBar (w-96 = 384px) + RightSidebar (78px) = 462px,
                so its left edge lines up with the TopBar section above. */}
            <div
              className={`flex-shrink-0 overflow-y-auto pt-[8px] pb-[8px] transition-all duration-300 ${
                isTabletView
                  ? isRightPanelExpanded
                    ? 'flex-[5] w-auto'
                    : 'w-0 overflow-hidden'
                  : 'w-[438px] flex-none'
              }`}
              style={{ background: "#ffffff" }}
            >
              <PreviousVisitsTable visits={visits} />
            </div>
        </>
      </div>
    </div>
  );
}