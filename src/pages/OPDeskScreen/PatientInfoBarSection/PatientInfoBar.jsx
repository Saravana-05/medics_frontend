import { useState } from "react";
import { User } from "lucide-react";
import OPListModal from "../../../modal/Oplistmodal";
import LeftPatientSection from "./LeftPatientSection";
import VitalSignsSection from "./VitalSignsSection";
import TopBarSection from "./TopBarSection";
import ClinicalInformationSection from "./ClinicalInformationSection";

// Keys must match LeftSidebar's LEFT_TABS keys, in the same top-to-bottom order.
const LEFT_ACCENT_SEGMENTS = [
  { key: "patientInfo",    color: "#eb6367" },
  { key: "chronicAllergy", color: "#73bfb8" },
  { key: "patientFamily",  color: "#679cbc" },
  { key: "period",         color: "#0c324a" },
];

export default function PatientInfoBar({
  patients,
  selectedPatient,
  onSelectPatient,
  onIPList,
  onPark,
  onFinalize,
  highlightedTab, // comes from OPDeskScreen (via RightSidebar's onHoverChange)
  leftHighlightedTab, // comes from OPDeskScreen (via LeftSidebar's onHoverChange)
}) {
  const [open, setOpen] = useState(false);
  const [opList, setOpList] = useState(false);
  const p = selectedPatient;

  return (
    <>
      <div className="select-none w-full h-full flex flex-col" style={{ background: "var(--color-surface)", fontFamily: "var(--font-body)" }}>

        {/* ── Main Content Area ── */}
        {/* Stacks vertically on tablet/mobile, side-by-side from lg up.
            Height is driven by flex stretch (matches the sidebars) — no hardcoded height. */}
        <div className="flex-1 flex flex-col lg:flex-row lg:relative lg:items-stretch">

          {/* Left accent bar — mirrors the right one; a segment shows only while
              its matching LeftSidebar tab is hovered. Desktop only.
              Absolutely positioned so its fixed height never forces the row taller
              than the Vital Signs + Clinical Information content. */}
          <div className="hidden lg:flex flex-col flex-shrink-0 lg:absolute lg:left-[2.5px] lg:top-0 lg:bottom-0" style={{ width: "2.5px" }}>
            {LEFT_ACCENT_SEGMENTS.map((seg) => (
              <div
                key={seg.key}
                style={{
                  flex: 1,
                  background: seg.color,
                  opacity: leftHighlightedTab === seg.key ? 1 : 0,
                  transition: "opacity 150ms ease",
                }}
              />
            ))}
          </div>

          {/* ── Left Patient Section Component ── */}
          <LeftPatientSection
            patients={patients}
            selectedPatient={selectedPatient}
            onSelectPatient={onSelectPatient}
            open={open}
            setOpen={setOpen}
          />

          {/* ── Right Panel ── */}
          <div className="flex-1 flex flex-col lg:flex-row min-w-0 lg:gap-2" style={{ height: "100%" }}>
            
            {/* Left side - Vital Signs + Clinical Information (one bordered section) */}
            <div className="flex-1 flex flex-col min-w-0 box-border border mb-[2px]" style={{ borderColor: "var(--color-border)" }}>
              {/* Vital Signs Section - At the TOP */}
              {p && <VitalSignsSection patient={p} />}

              {/* Clinical Information Section - Single Row (Below Vital Signs) */}
              {p && <ClinicalInformationSection patient={p} isInline={true} />}
            </div>
            
            {/* Right side - TopBar Section (full width on tablet, vertical sidebar on desktop) */}
            {p && (
              <div
                className="w-full lg:w-80 flex-shrink-0 box-border border mb-[2px]"
                style={{ borderColor: "var(--color-border)" }}
              >
                <TopBarSection
                  patient={p}
                  onPark={onPark}
                  onFinalize={onFinalize}
                  onOPList={() => {}}
                  onIPList={onIPList}
                  onSelectPatient={onSelectPatient}
                  highlightedTab={highlightedTab}
                />
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