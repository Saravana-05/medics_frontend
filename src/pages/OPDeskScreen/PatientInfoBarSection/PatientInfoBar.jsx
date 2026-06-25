import { useState } from "react";
import { User } from "lucide-react";
import OPListModal from "../../../modal/Oplistmodal";
import LeftPatientSection from "./LeftPatientSection";
import VitalSignsSection from "./VitalSignsSection";
import TopBarSection from "./TopBarSection";
import ClinicalInformationSection from "./ClinicalInformationSection";

export default function PatientInfoBar({
  patients,
  selectedPatient,
  onSelectPatient,
  onIPList,
  onPark,
  onFinalize,
}) {
  const [open, setOpen] = useState(false);
  const [opList, setOpList] = useState(false);
  const p = selectedPatient;

  return (
    <>
      <div className="select-none" style={{ background: "var(--color-surface)", fontFamily: "var(--font-body)" }}>
        
        {/* ── Main Content Area ── */}
        {/* Stacks vertically on tablet/mobile, side-by-side from lg up */}
        <div className="flex flex-col lg:flex-row">
          
          {/* ── Left Patient Section Component ── */}
          <LeftPatientSection
            patients={patients}
            selectedPatient={selectedPatient}
            onSelectPatient={onSelectPatient}
            open={open}
            setOpen={setOpen}
          />

          {/* ── Right Panel ── */}
          <div className="flex-1 flex flex-col lg:flex-row min-w-0">
            
            {/* Left side - Vital Signs + Clinical Information (stacked vertically) */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Vital Signs Section - At the TOP */}
              {p && <VitalSignsSection patient={p} />}
              
              {/* Clinical Information Section - Single Row (Below Vital Signs) */}
              {p && <ClinicalInformationSection patient={p} isInline={true} />}
            </div>
            
            {/* Right side - TopBar Section (full width on tablet, vertical sidebar on desktop) */}
            {p && (
              <div
                className="w-full lg:w-80 flex-shrink-0 border-t lg:border-t-0 lg:border-l"
                style={{ borderColor: "var(--color-border)" }}
              >
                <TopBarSection patient={p} onPark={onPark} onFinalize={onFinalize}  onOPList={() => {}}  onIPList={onIPList}/>
              </div>
            )}
            
            {!p && (
              /* Empty State */
              <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8">
                <div className="p-4 rounded-full" style={{ background: "var(--color-surface-alt)" }}>
                  <User size={48} style={{ color: "var(--color-text-subtle)" }} strokeWidth={1.5} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold" style={{ color: "var(--color-text-base)" }}>No Patient Selected</p>
                  <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>Select a patient from the dropdown to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* OP List Modal */}
      {opList && (
        <OPListModal
          onClose={() => setOpList(false)}
          onSelectPatient={(row) => {
            const match = patients.find(pt => pt.name === row.name);
            if (match) onSelectPatient(match);
          }}
          doctor="Dr. Aravind Kumar"
          date={p?.docDate?.slice(0, 10) ?? "03/02/2024"}
          time="10:00"
        />
      )}
    </>
  );
}