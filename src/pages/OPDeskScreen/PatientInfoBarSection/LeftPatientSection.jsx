import { useState } from "react";
import {
  ClipboardList, User, Calendar, Users, ChevronDown, Search, Edit2
} from "lucide-react";

/* ── Compact Info Card Component (Reduced Height) ── */
function CompactInfoCard({ icon: Icon, label, value, variant, onClick }) {
  const variants = {
    blue: { bg: "var(--color-primary-muted)", color: "var(--color-primary)", border: "var(--color-primary)" },
    green: { bg: "var(--color-drugs-light)", color: "var(--color-drugs)", border: "var(--color-drugs)" },
    amber: { bg: "var(--color-lab-light)", color: "var(--color-lab)", border: "var(--color-lab)" },
    purple: { bg: "#f3e8ff", color: "#9333ea", border: "#9333ea" },
    red: { bg: "#fee2e2", color: "#dc2626", border: "#dc2626" },
    teal: { bg: "#ccfbf1", color: "#0d9488", border: "#0d9488" },
  };

  const style = variant
    ? variants[variant]
    : { bg: "var(--color-surface-alt)", color: "var(--color-text-base)", border: "var(--color-border)" };

  return (
    <div
      onClick={onClick}
      className="group relative overflow-hidden rounded-lg transition-all duration-200 cursor-pointer hover:shadow-sm"
      style={{ background: style.bg, border: `1px solid ${style.border}20` }}
    >
      <div className="p-2">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="text-[0.55rem] font-bold uppercase tracking-wide mb-0.5" style={{ color: "var(--color-text-muted)" }}>
              {label}
            </div>
            <div className="text-xs font-semibold" style={{ color: style.color }}>
              {value || "—"}
            </div>
          </div>
          <div className="p-1 rounded-md transition-all group-hover:scale-110 flex-shrink-0" style={{ background: `${style.color}15` }}>
            <Icon size={12} style={{ color: style.color }} />
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-0.5 transition-all group-hover:h-1" style={{ background: style.color }} />
    </div>
  );
}

/* ── Compact Relation Card ── */
function CompactRelationCard({ value }) {
  return (
    <div className="rounded-lg p-2" style={{ background: "var(--color-drugs-light)", border: "1px solid var(--color-drugs)20" }}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="text-[0.55rem] font-bold uppercase tracking-wide mb-0.5" style={{ color: "var(--color-text-muted)" }}>
            Relation
          </div>
          <div className="text-xs font-semibold" style={{ color: "var(--color-drugs)" }}>
            {value || "W/o: Sri Krishnaswamy"}
          </div>
        </div>
        <div className="p-1 rounded-md" style={{ background: "var(--color-drugs)15" }}>
          <Users size={12} style={{ color: "var(--color-drugs)" }} />
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
        className="w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-left transition-all"
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
          style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
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
          <div className="max-h-64 overflow-y-auto">
            {filteredPatients.map((pt, i) => (
              <div
                key={pt.id}
                onClick={() => { onSelectPatient(pt); setOpen(false); setSearchTerm(""); }}
                className="px-3 py-2 cursor-pointer transition-all hover:pl-4"
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

  const age = calculateAge(p?.dob);

  return (
    <div className="w-72 shrink-0 border-r" style={{ borderColor: "var(--color-border)", background: "var(--color-surface-alt)" }}>

      {/* Patient Selection */}
      <div className="p-3 border-b" style={{ borderColor: "var(--color-border)" }}>
        <div className="flex items-center justify-between mb-2">
          <div className="text-[0.65rem] font-bold uppercase tracking-wide flex items-center gap-1" style={{ color: "var(--color-text-muted)" }}>
            <User size={12} /> Patient Info
          </div>
          {/* OP Number */}
          {p && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md" style={{ background: "var(--color-primary-muted)" }}>
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
        <div className="p-3 space-y-2">

          {/* Sex / Age / DOB — three aligned columns */}
          <div
            className="rounded-lg p-2"
            style={{
              background: "var(--color-surface-alt)",
              border: "1px solid var(--color-border)",
            }}
          >
            <div className="grid grid-cols-3 gap-2">

              {/* Sex */}
              <div>
                <div
                  className="text-[0.55rem] font-bold uppercase tracking-wide mb-0.5"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  Sex
                </div>
                <div className="text-xs font-semibold" style={{ color: "var(--color-primary)" }}>
                  {p.gender || "—"}
                </div>
              </div>

              {/* Age */}
              <div>
                <div
                  className="text-[0.55rem] font-bold uppercase tracking-wide mb-0.5"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  Age
                </div>
                <div className="text-xs font-semibold" style={{ color: "var(--color-primary)" }}>
                  {age.years !== null
                    ? `${age.years}y ${age.months}m ${age.days}d`
                    : "—"}
                </div>
              </div>

              {/* DOB */}
              <div>
                <div
                  className="text-[0.55rem] font-bold uppercase tracking-wide mb-0.5"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  DOB
                </div>
                <div className="text-xs font-semibold" style={{ color: "var(--color-primary)" }}>
                  {p.dob || "—"}
                </div>
              </div>

            </div>
          </div>

          {/* Relation */}
          <CompactRelationCard value={p.relation} />

        </div>
      )}
    </div>
  );
}