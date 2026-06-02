import { useState } from "react";
import { Users } from "lucide-react";

import AppBar from "./OPDeskScreen/AppBar";
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

  const [drugs, setDrugs] = useState([]);
  const [labs, setLabs] = useState([]);
  const [services, setServices] = useState([]);
  const [findings, setFindings] = useState({
    diagnosis: "", clinicalNotes: "", advice: "",
    nextVisit: "", referTo: "", followupNote: "",
  });
  const [saved, setSaved] = useState(false);

  const selectPatient = (p) => {
    setSelectedPatient(p);
    setDrugs([]); setLabs([]); setServices([]);
    setFindings({ diagnosis: "", clinicalNotes: "", advice: "", nextVisit: "", referTo: "", followupNote: "" });
    setSaved(false);
  };

  const handleSave = () => { 
    // Save current prescription to history (will be handled by PreviousVisitsTable)
    setSaved(true); 
    setTimeout(() => setSaved(false), 4000);
  };
  
  const handleClear = () => {
    setDrugs([]); setLabs([]); setServices([]);
    setFindings({ diagnosis: "", clinicalNotes: "", advice: "", nextVisit: "", referTo: "", followupNote: "" });
  };

  const visits = selectedPatient ? (PREVIOUS_VISITS[selectedPatient.id] || []) : [];
  const tabCount = { drugs: drugs.length, lab: labs.length, services: services.length, findings: 0 };

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
        />
      </div>

      {/* ── Second Row: LeftSidebar + PatientInfoBar + RightSidebar ── */}
      <div className="flex-shrink-0 flex">
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

      {/* ── Main workspace with split left and right sections - Equal width ── */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        
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
            <div className="flex-1 flex flex-col overflow-hidden min-w-0">
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

            {/* Right Section - Previous Visits Table (self-contained) */}
            <div className="flex-1 flex-shrink-0 border-l overflow-y-auto" style={{ borderColor: "var(--color-border)" }}>
              <PreviousVisitsTable visits={visits} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}