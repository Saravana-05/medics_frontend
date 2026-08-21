import { useState } from "react";
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

// Keys must match RightSidebar's RIGHT_TABS keys, in the same top-to-bottom order.
const RIGHT_ACCENT_SEGMENTS = [
  { key: "parked",    color: "#eb6367" },
  { key: "emergency", color: "#73bfb8" },
  { key: "reports",   color: "#679cbc" },
  { key: "schedule",  color: "#0c324a" },
];

export default function PatientInfoBar({
  patients,
  selectedPatient,
  onSelectPatient,
  onAddPatient,
  onIPList,
  onPark,
  onFinalize,
  highlightedTab, // comes from OPDeskScreen (via RightSidebar's onHoverChange)
  leftHighlightedTab, // comes from OPDeskScreen (via LeftSidebar's onHoverChange)
  firstObservationCardRef, // ref OPDeskScreen uses to measure First Observation's right edge
  activeTab, // which prescription tab is active — swaps Vital Signs for IP Admission Info on "iptime"
  tabsRowRef, // ref to the Prescription Tabs row — Appointments dropdown caps its open height there
}) {
  const [open, setOpen] = useState(false);
  const [opList, setOpList] = useState(false);
  const [appointmentTitle, setAppointmentTitle] = useState("By Appointments");
  const p = selectedPatient || {};

  const selectFromPatientDropdown = patient => {
    setAppointmentTitle("By Appointments");
    onSelectPatient(patient);
  };

  const selectFromList = row => {
    const title = row?.listType === "op"
      ? "By Appointment of OP List"
      : row?.listType === "ip"
        ? "By Appointment of IP List"
        : "By Appointments";
    setAppointmentTitle(title);
    onSelectPatient(row);
  };

  return (
    <>
      <div className="select-none w-full h-full flex flex-col" style={{ background: "var(--color-surface)", fontFamily: "var(--font-body)" }}>

        {/* ── Main Content Area ── */}
        {/* Stacks vertically on tablet/mobile, side-by-side from lg up.
            Height is driven by flex stretch (matches the sidebars) — no hardcoded height. */}
        <div className="flex-1 flex flex-col lg:flex-row lg:relative lg:items-stretch lg:gap-[5px]">

          {/* Left accent bar — mirrors the right one; a segment shows only while
              its matching LeftSidebar tab is hovered. Desktop only.
              Absolutely positioned so its fixed height never forces the row taller
              than the Vital Signs + Clinical Information content. */}
          <div className="hidden lg:flex flex-col flex-shrink-0 lg:absolute lg:left-0 lg:top-0 lg:bottom-[8px]" style={{ width: "2px" }}>
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
            onSelectPatient={selectFromPatientDropdown}
            onAddPatient={onAddPatient}
            open={open}
            setOpen={setOpen}
            tabsRowRef={tabsRowRef}
            appointmentTitle={appointmentTitle}
          />

          {/* ── Right Panel ── */}
          <div className="flex-1 flex flex-col lg:flex-row min-w-0 lg:gap-[5px]" style={{ height: "100%" }}>
            
            {/* Left side - Vital Signs + Clinical Information (one bordered section) */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden box-border border mb-[8px]" style={{ borderColor: "var(--color-border)", boxShadow: "0 5px 4px -2px rgba(0,0,0,0.35)", background: "var(--color-surface-alt)" }}>
              {/* Vital Signs Section - At the TOP (swapped for IP Admission Info while the IP Time-line tab is active) */}
              <VitalSignsSection patient={p} activeTab={activeTab} />

              {/* Clinical Information Section - Single Row (Below Vital Signs) */}
              <ClinicalInformationSection patient={p} isInline={true} firstObservationCardRef={firstObservationCardRef} />
            </div>

            {/* Right side - TopBar Section (full width on tablet, vertical sidebar on desktop) */}
            <div
              className="w-full lg:w-96 flex-shrink-0 box-border border mb-[8px]"
              style={{ borderColor: "var(--color-border)", boxShadow: "0 5px 4px -2px rgba(0,0,0,0.35)" }}
            >
              <TopBarSection
                patient={p}
                onPark={onPark}
                onFinalize={onFinalize}
                onOPList={() => {}}
                onIPList={onIPList}
                onSelectPatient={selectFromList}
              />
            </div>

            {/* Right accent bar — sits OUTSIDE the OP/IP List box's border (mirrors
                the left accent bar's positioning), a segment lights up only while
                its matching RightSidebar tab is hovered. Desktop only. */}
            <div className="hidden lg:flex flex-col flex-shrink-0 mb-[8px]" style={{ width: "2px" }}>
              {RIGHT_ACCENT_SEGMENTS.map((seg) => (
                <div
                  key={seg.key}
                  style={{
                    flex: 1,
                    background: seg.color,
                    opacity: highlightedTab === seg.key ? 1 : 0,
                    transition: "opacity 150ms ease",
                  }}
                />
              ))}
            </div>
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
