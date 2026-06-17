import { useState } from "react";
import { Users, ChevronLeft, ChevronRight } from "lucide-react";

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

export default function OPDeskScreen({ user, onLogout }) {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activeTab, setActiveTab] = useState("drugs");
  const [leftPanel, setLeftPanel] = useState(null);
  const [rightPanel, setRightPanel] = useState(null);
  const [isRightPanelExpanded, setIsRightPanelExpanded] = useState(false);
  const [isTabletView, setIsTabletView] = useState(window.innerWidth < 1024);

  const [drugs, setDrugs] = useState([]);
  const [labs, setLabs] = useState([]);
  const [services, setServices] = useState([]);
  const [findings, setFindings] = useState({
    diagnosis: "", clinicalNotes: "", advice: "",
    nextVisit: "", referTo: "", followupNote: "",
  });
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
  const tabCount = { drugs: drugs.length, lab: labs.length, services: services.length, findings: 0 };

  const toggleRightPanel = () => {
    setIsRightPanelExpanded(!isRightPanelExpanded);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: "var(--color-surface-alt)", fontFamily: "var(--font-body)" }}>

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
      <div className="flex-shrink-0 flex max-h-[50vh] overflow-y-auto lg:max-h-none lg:overflow-visible">
        <div className="flex-shrink-0">
          <LeftSidebar activePanel={leftPanel} onPanelChange={setLeftPanel} patient={selectedPatient} />
        </div>

        <div className="flex-1">
          <PatientInfoBar
            patients={MOCK_PATIENTS}
            selectedPatient={selectedPatient}
            onSelectPatient={selectPatient}
            onOPList={() => {}}
            onIPList={() => {}}
            onPark={() => {}}
            onFinalize={handleSave}
          />
        </div>

        <div className="flex-shrink-0">
          <RightSidebar activePanel={rightPanel} onPanelChange={setRightPanel} />
        </div>
      </div>

      {/* ── Main workspace with responsive split ── */}
      <div className="flex-1 flex overflow-hidden min-h-0 relative">
        
        {!selectedPatient ? (
          <div className="flex-1 overflow-y-auto flex items-center justify-center">
            <div className="flex flex-col items-center justify-center gap-3" style={{ color: "var(--color-text-subtle)" }}>
              <div className="p-4 rounded-full" style={{ background: "var(--color-surface-alt)" }}>
                <Users size={48} strokeWidth={1} />
              </div>
              <p className="font-semibold text-base">Select a patient from the queue</p>
              <p className="text-sm">Use the dropdown above to load patient records</p>
            </div>
          </div>
        ) : (
          <>
            {/* Left Section - Prescription Tabs + Active Tab Content */}
            <div 
              className={`flex flex-col overflow-hidden min-w-0 transition-all duration-300 ${
                isTabletView 
                  ? isRightPanelExpanded ? 'flex-[5]' : 'flex-1'
                  : 'flex-[7]'
              }`}
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
                {activeTab === "lab" && <LabTab labs={labs} setLabs={setLabs} patient={selectedPatient} />}
                {activeTab === "services" && <ServiceTab services={services} setServices={setServices} patient={selectedPatient} />}
                {activeTab === "findings" && <FindingsTab findings={findings} setFindings={setFindings} patient={selectedPatient} />}
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

            {/* Right Section - Previous Visits Table */}
            <div 
              className={`flex-shrink-0 border-l overflow-y-auto transition-all duration-300 ${
                isTabletView 
                  ? isRightPanelExpanded 
                    ? 'flex-[5] w-auto' 
                    : 'w-0 overflow-hidden border-l-0'
                  : 'flex-[3] w-auto'
              }`} 
              style={{ borderColor: "var(--color-border)" }}
            >
              <PreviousVisitsTable visits={visits} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}