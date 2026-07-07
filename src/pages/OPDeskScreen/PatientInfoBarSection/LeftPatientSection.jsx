import { useState } from "react";
import {
  ClipboardList, User, Users, ChevronDown, Search
} from "lucide-react";

/* ── Compact Relation Card (Extra short for tablet) ── */
function CompactRelationCard({ value }) {
  return (
    <div
      className="rounded-xl px-3 py-2.5 md:px-1.5 md:py-1 lg:px-3 lg:py-2.5 h-full"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
      }}
    >
      <div className="flex items-center justify-between h-full">
        <div className="flex items-center gap-2 md:gap-1 flex-1 min-w-0">
          <div className="p-1 rounded-lg flex-shrink-0 md:p-0.5" style={{ background: "var(--color-primary-muted)" }}>
            <Users size={14} className="md:w-3 md:h-3" style={{ color: "var(--color-primary)" }} />
          </div>
          <span className="text-sm md:text-xs font-semibold truncate" style={{ color: "var(--color-primary-dark)" }}>
            {value || "—"}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Patient Dropdown Component ── */
function PatientDropdown({ patients, selectedPatient, onSelectPatient, open, setOpen }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPatients = patients.filter(pt =>
    pt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pt.appt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between rounded-xl px-3 py-2.5 md:px-2 md:py-1.5 lg:px-3 lg:py-2.5 text-left transition-all"
        style={{
          background: "var(--color-surface)",
          border: `1px solid ${open ? "var(--color-primary)" : "var(--color-border)"}`,
          boxShadow: open ? "0 0 0 3px rgba(15,108,189,.12)" : "none",
        }}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="p-1 rounded-lg flex-shrink-0" style={{ background: "var(--color-primary-muted)" }}>
            <User size={14} style={{ color: "var(--color-primary)" }} />
          </div>
          <span className="text-sm font-semibold truncate" style={{ color: selectedPatient ? "var(--color-primary-dark)" : "var(--color-text-subtle)" }}>
            {selectedPatient ? selectedPatient.name : "Select patient..."}
          </span>
        </div>
        <ChevronDown
          size={14}
          style={{ color: "var(--color-text-muted)" }}
          className={`transition-transform flex-shrink-0 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="absolute top-full left-0 right-0 mt-2 z-50 rounded-xl overflow-hidden shadow-xl animate-fade-in"
          style={{ 
            background: "var(--color-surface)", 
            border: "1px solid var(--color-border)",
            maxHeight: "480px",
          }}
        >
          <div className="p-2 border-b" style={{ borderColor: "var(--color-border)", background: "var(--color-primary-muted)" }}>
            <div className="flex items-center gap-2 px-2">
              <Search size={12} style={{ color: "var(--color-primary)" }} />
              <input
                type="text"
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent text-xs outline-none"
                style={{ color: "var(--color-text-base)" }}
                autoFocus
              />
            </div>
          </div>
          <div className="max-h-120 overflow-y-auto">
            {filteredPatients.map((pt, i) => (
              <div
                key={pt.id}
                onClick={() => { onSelectPatient(pt); setOpen(false); setSearchTerm(""); }}
                className="px-3 py-2.5 cursor-pointer transition-all hover:pl-4"
                style={{
                  background: selectedPatient?.id === pt.id ? "var(--color-primary-muted)" : i % 2 === 0 ? "var(--color-surface)" : "var(--color-surface-alt)",
                  borderLeft: selectedPatient?.id === pt.id ? `3px solid var(--color-primary)` : "3px solid transparent",
                }}
                onMouseEnter={e => { if (selectedPatient?.id !== pt.id) e.currentTarget.style.background = "var(--color-primary-muted)"; }}
                onMouseLeave={e => { if (selectedPatient?.id !== pt.id) e.currentTarget.style.background = i % 2 === 0 ? "var(--color-surface)" : "var(--color-surface-alt)"; }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate" style={{ color: selectedPatient?.id === pt.id ? "var(--color-primary-dark)" : "var(--color-text-base)" }}>
                      {pt.name}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[0.6rem] font-bold px-1.5 py-0.5 rounded flex-shrink-0" style={{ background: "var(--color-primary-muted)", color: "var(--color-primary)" }}>
                        {pt.appt}
                      </span>
                      <span className="text-[0.6rem] truncate" style={{ color: "var(--color-text-muted)" }}>{pt.slot}</span>
                    </div>
                  </div>
                  <ChevronDown size={12} style={{ color: "var(--color-text-muted)" }} className="flex-shrink-0" />
                </div>
              </div>
            ))}
            {filteredPatients.length === 0 && (
              <div className="px-3 py-4 text-center text-xs" style={{ color: "var(--color-text-muted)" }}>
                No patients found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function LeftPatientSection({
  patients,
  selectedPatient,
  onSelectPatient,
  open,
  setOpen
}) {
  const p = selectedPatient;

  // Calculate age in years, months, days from DOB
  const calculateAge = (dob) => {
    if (!dob) return { years: null, months: null, days: null };
    const birthDate = new Date(dob.split("/").reverse().join("-"));
    const today = new Date();
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += lastMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    return { years, months, days };
  };

  // Short label for Sex: "Female" -> "F", "Male" -> "M", anything else -> first letter
  const getGenderShort = (gender) => {
    if (!gender) return "—";
    const g = gender.trim().toLowerCase();
    if (g.startsWith("f")) return "F";
    if (g.startsWith("m")) return "M";
    return gender.charAt(0).toUpperCase();
  };

  const age = calculateAge(p?.dob);

  return (
    <div
  className="w-full lg:shrink-0 border-b lg:border-b-0 lg:border-r"
  style={{ 
    borderColor: "var(--color-border)", 
    background: "var(--color-surface-alt)",
    width: "calc(20% - 40px)",
    marginLeft: "10px",
    marginRight: "10px",
  }}
>
      {/*
        Layout behaviour:
        - Mobile (<md):     everything stacked, full "Female"/"Male", normal padding
        - Tablet (md-lg):   single row, "F"/"M", reduced padding/gaps for a shorter row
        - Desktop (lg+):    original stacked sidebar layout, full "Female"/"Male"
      */}
      <div className="flex flex-col md:flex-row lg:flex-col gap-2 md:gap-1 lg:gap-0 p-3 md:p-1 lg:p-0">

        {/* Patient Selection — narrower on tablet */}
        <div className="md:w-[30%] md:flex-shrink-0 lg:w-auto lg:flex-none lg:p-3 lg:border-b" style={{ borderColor: "var(--color-border)" }}>
          {/* Patient Info header: visible on mobile and desktop, hidden on tablet */}
          <div className="flex items-center justify-between mb-1 md:hidden lg:flex lg:mb-2">
            <div className="text-[0.65rem] font-bold uppercase tracking-wide flex items-center gap-1" style={{ color: "var(--color-text-muted)" }}>
              <User size={12} /> Patient Info
            </div>
            {/* OP Number */}
            {p && (
              <div className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 rounded-md" style={{ background: "var(--color-primary-muted)" }}>
                <ClipboardList size={10} style={{ color: "var(--color-primary)" }} />
                <span className="text-[0.6rem] font-bold" style={{ color: "var(--color-primary)" }}>
                  OP: {p.appt || "—"}
                </span>
              </div>
            )}
          </div>
          <PatientDropdown
            patients={patients}
            selectedPatient={selectedPatient}
            onSelectPatient={onSelectPatient}
            open={open}
            setOpen={setOpen}
          />
        </div>

        {/* Patient Details */}
        {p && (
          <div className="flex flex-col sm:flex-row md:flex-1 lg:flex-none lg:flex-col gap-2 md:gap-1 lg:p-3 lg:pt-2">

            {/* Sex / Age / DOB — extra compact on tablet */}
            <div
              className="md:w-[58%] flex-1 lg:w-auto rounded-lg p-2 md:px-4 md:py-0.5 lg:p-2"
              style={{
                background: "var(--color-surface-alt)",
                border: "1px solid var(--color-border)",
              }}
            >
              <div className="grid grid-cols-3 gap-2 md:gap-1">

                {/* Sex */}
                <div>
                  <div
                    className="text-[0.55rem] font-bold uppercase tracking-wide mb-0.5 md:mb-0"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    Sex
                  </div>
                  {/* Full word on mobile + desktop */}
                  <div className="hidden md:hidden lg:block text-xs font-semibold whitespace-nowrap" style={{ color: "var(--color-primary)" }}>
                    {p.gender || "—"}
                  </div>
                  <div className="block md:hidden text-xs font-semibold whitespace-nowrap" style={{ color: "var(--color-primary)" }}>
                    {p.gender || "—"}
                  </div>
                  {/* Abbreviation on tablet only - smaller text */}
                  <div className="hidden md:block lg:hidden text-[0.7rem] font-semibold whitespace-nowrap" style={{ color: "var(--color-primary)" }}>
                    {getGenderShort(p.gender)}
                  </div>
                </div>

                {/* Age */}
                <div>
                  <div
                    className="text-[0.55rem] font-bold uppercase tracking-wide mb-0.5 md:mb-0"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    Age
                  </div>
                  <div className="text-xs md:text-[0.65rem] font-semibold whitespace-nowrap" style={{ color: "var(--color-primary)" }}>
                    {age.years !== null
                      ? `${age.years}y ${age.months}m ${age.days}d`
                      : "—"}
                  </div>
                </div>

                {/* DOB */}
                <div>
                  <div
                    className="text-[0.55rem] font-bold uppercase tracking-wide mb-0.5 md:mb-0"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    DOB
                  </div>
                  <div className="text-xs md:text-[0.65rem] font-semibold whitespace-nowrap" style={{ color: "var(--color-primary)" }}>
                    {p.dob || "—"}
                  </div>
                </div>

              </div>
            </div>

            {/* Relation — narrower on tablet with reduced height */}
            <div className="md:w-[28%] flex-1 lg:w-auto">
              <CompactRelationCard value={p.relation} />
            </div>

          </div>
        )}
      </div>
    </div>
  );
}