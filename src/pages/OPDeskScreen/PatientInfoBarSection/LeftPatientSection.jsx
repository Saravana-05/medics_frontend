import { useState, useRef, useLayoutEffect } from "react";
import {
  Users, ChevronDown, X
} from "lucide-react";

/* ── Attendant Card — same layout as ClinicalCard (icon + title + data) ── */
function CompactRelationCard({ attendant }) {
  const a = attendant || {};
  const value = [a.name, a.relationship, a.phone].filter(Boolean).join(" · ") || "—";
  return (
    <div
      className="flex-1 min-w-[130px] lg:min-w-0 p-2 lg:p-3 rounded-none transition-all shadow-sm hover:shadow-md md:p-1 md:min-w-[110px] h-full"
      style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
    >
      <div className="flex items-center gap-1 mb-4 md:mb-0">
        <Users size={12} className="md:w-2.5 md:h-2.5" style={{ color: "var(--color-primary)" }} />
        <span
          className="text-[0.9rem] font-bold tracking-wide truncate md:text-[0.7rem]"
          style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-inter)" }}
        >
          Attendant
        </span>
      </div>
      <div
        className="lg:text-[0.9rem]  break-words md:text-[0.6rem]"
        style={{ color: "var(--color-primary)", fontFamily: "var(--font-inter)" }}
      >
        {value}
      </div>
    </div>
  );
}

/* ── Patient Dropdown Component ── */
function PatientDropdown({ patients, selectedPatient, onSelectPatient, open, setOpen, tabsRowRef }) {
  const wrapRef = useRef(null);
  // Caps the open popup's height so it ends exactly at the top of the
  // Prescription Tabs row below, instead of a fixed value that could
  // overlap it (or leave a gap short of it).
  const [maxHeight, setMaxHeight] = useState(480);

  useLayoutEffect(() => {
    if (!open) return;
    const computeMaxHeight = () => {
      const wrapEl = wrapRef.current;
      const tabsEl = tabsRowRef?.current;
      if (!wrapEl || !tabsEl) return;
      const wrapBottom = wrapEl.getBoundingClientRect().bottom;
      const tabsTop = tabsEl.getBoundingClientRect().top;
      // Account for the popup's 6px top margin and 2px border while allowing
      // the list to shrink and scroll instead of overlapping the next section.
      setMaxHeight(Math.max(80, tabsTop - wrapBottom - 8));
    };
    computeMaxHeight();
    window.addEventListener("resize", computeMaxHeight);
    return () => window.removeEventListener("resize", computeMaxHeight);
  }, [open, tabsRowRef]);

  return (
    <div className="relative" ref={wrapRef}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between rounded-none px-3 mb-1 py-1 md:px-2 md:py-1.5 lg:px-3 lg:py-2.5 text-left transition-all shadow-sm"
        style={{
          background: "var(--color-surface)",
          border: `1px solid ${open ? "var(--color-primary)" : "var(--color-border)"}`,
          boxShadow: open ? "0 0 0 3px rgba(15,108,189,.12)" : "none",
        }}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-sm font-semibold truncate" style={{ color: selectedPatient ? "var(--color-primary-dark)" : "var(--color-text-subtle)" }}>
            {selectedPatient ? selectedPatient.name : "None"}
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
          className="absolute top-full left-0 right-0 mt-[6px] z-50 rounded-none overflow-hidden shadow-xl animate-fade-in flex flex-col"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            maxHeight: `${maxHeight}px`,
          }}
        >
          <div className="flex-1 min-h-0 overflow-y-auto" style={{ overscrollBehavior: "contain" }}>
            <div
              onClick={() => { onSelectPatient(null); setOpen(false); }}
              className="h-[30px] px-3 flex items-center cursor-pointer transition-all hover:pl-4"
              style={{
                background: !selectedPatient ? "var(--color-primary-muted)" : "var(--color-surface)",
                borderLeft: !selectedPatient ? "3px solid var(--color-primary)" : "3px solid transparent",
              }}
              onMouseEnter={e => { if (selectedPatient) e.currentTarget.style.background = "var(--color-primary-muted)"; }}
              onMouseLeave={e => { if (selectedPatient) e.currentTarget.style.background = "var(--color-surface)"; }}
            >
              <span className="text-sm font-semibold" style={{ color: !selectedPatient ? "var(--color-primary-dark)" : "var(--color-text-subtle)" }}>
                None
              </span>
            </div>
            {patients.map((pt, i) => (
              <div
                key={pt.id}
                onClick={() => { onSelectPatient(pt); setOpen(false); }}
                className="px-3 py-1.5 cursor-pointer transition-all hover:pl-4"
                style={{
                  background: selectedPatient?.id === pt.id ? "var(--color-primary-muted)" : i % 2 === 0 ? "var(--color-surface)" : "var(--color-surface-alt)",
                  borderLeft: selectedPatient?.id === pt.id ? `3px solid var(--color-primary)` : "3px solid transparent",
                }}
                onMouseEnter={e => { if (selectedPatient?.id !== pt.id) e.currentTarget.style.background = "var(--color-primary-muted)"; }}
                onMouseLeave={e => { if (selectedPatient?.id !== pt.id) e.currentTarget.style.background = i % 2 === 0 ? "var(--color-surface)" : "var(--color-surface-alt)"; }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold truncate flex-1 min-w-0" style={{ color: selectedPatient?.id === pt.id ? "var(--color-primary-dark)" : "var(--color-text-base)" }}>
                    {pt.name}
                  </span>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[0.6rem] font-bold px-1.5 py-0.5 rounded-none flex-shrink-0" style={{ background: "var(--color-primary-muted)", color: "var(--color-primary)" }}>
                      {pt.appt}
                    </span>
                    <span className="text-[0.6rem] whitespace-nowrap" style={{ color: "var(--color-text-muted)" }}>{pt.slot}</span>
                    <ChevronDown size={12} style={{ color: "var(--color-text-muted)" }} className="flex-shrink-0" />
                  </div>
                </div>
              </div>
            ))}
            {patients.length === 0 && (
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

/* ── Add Patient modal — Name/Age/Sex/DOB/Attendant/APT-ID, the minimum fields
   the rest of the app (vitals bar, dropdown row, attendant card) reads. ── */
function AddPatientModal({ onCancel, onSave }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [dob, setDob] = useState("");
  const [attendant, setAttendant] = useState("");
  const [appt, setAppt] = useState("");

  const canSave = name.trim() && appt.trim();

  const handleSave = () => {
    if (!canSave) return;
    // <input type="date"> gives YYYY-MM-DD; the rest of the app (calculateAge)
    // expects DD/MM/YYYY, same as the mock patient data.
    const dobFormatted = dob ? dob.split("-").reverse().join("/") : "";
    onSave({
      id: `PID-${Date.now()}`,
      name: name.trim(),
      age: age ? parseInt(age, 10) : null,
      gender,
      dob: dobFormatted,
      appt: appt.trim(),
      docNo: appt.trim(),
      slot: "—",
      attendant: { name: attendant.trim(), relationship: "", phone: "" },
    });
  };

  const field = (label, input) => (
    <div>
      <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--color-text-muted)" }}>{label}</label>
      {input}
    </div>
  );
  const inputClass = "w-full px-3 py-2 rounded text-sm outline-none";
  const inputStyle = { border: "1px solid var(--color-border)", background: "var(--color-surface)" };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ background: "rgba(0,0,0,0.35)" }} onClick={onCancel}>
      <div className="rounded-lg shadow-xl w-full max-w-sm" style={{ background: "var(--color-surface)", border: "1px solid var(--color-primary)" }} onClick={e => e.stopPropagation()}>
        <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: "var(--color-border)", background: "var(--color-primary-muted)" }}>
          <span className="text-sm font-bold" style={{ color: "var(--color-primary-dark)" }}>Add New Patient</span>
          <button onClick={onCancel} className="flex items-center justify-center rounded-full" style={{ width: 20, height: 20 }} title="Close"><X size={13} /></button>
        </div>

        <div className="p-4 flex flex-col gap-3">
          {field("Patient Name", <input autoFocus type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Enter patient name..." className={inputClass} style={inputStyle} />)}

          <div className="flex gap-3">
            <div className="flex-1 min-w-0">{field("Age", <input type="number" min="0" value={age} onChange={e => setAge(e.target.value)} placeholder="Years" className={inputClass} style={inputStyle} />)}</div>
            <div className="flex-1 min-w-0">
              <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--color-text-muted)" }}>Sex</label>
              <select value={gender} onChange={e => setGender(e.target.value)} className={inputClass} style={inputStyle}>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          {field("Date of Birth", <input type="date" value={dob} onChange={e => setDob(e.target.value)} className={inputClass} style={inputStyle} />)}
          {field("Attendant", <input type="text" value={attendant} onChange={e => setAttendant(e.target.value)} placeholder="Attendant name..." className={inputClass} style={inputStyle} />)}
          {field("APT-ID", <input type="text" value={appt} onChange={e => setAppt(e.target.value)} placeholder="e.g. APT-001" className={inputClass} style={inputStyle} />)}
        </div>

        <div className="flex items-center justify-end gap-2 px-4 py-3 border-t" style={{ borderColor: "var(--color-border)" }}>
          <button onClick={onCancel} className="px-3 py-1.5 rounded-md text-xs font-semibold" style={{ background: "var(--color-danger)", color: "white" }}>Cancel</button>
          <button onClick={handleSave} disabled={!canSave}
            className="px-3 py-1.5 rounded-md text-xs font-semibold" style={{ background: "var(--color-success)", color: "white", opacity: canSave ? 1 : 0.5 }}>Save</button>
        </div>
      </div>
    </div>
  );
}

export default function LeftPatientSection({
  patients,
  selectedPatient,
  onSelectPatient,
  onAddPatient,
  open,
  setOpen,
  tabsRowRef
}) {
  const p = selectedPatient || {};
  const [showAddModal, setShowAddModal] = useState(false);
  const completedAppointmentCount = patients.filter(patient => patient.appointmentStatus === "completed").length;

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
  className="w-full lg:shrink-0 box-border border"
  style={{
    borderColor: "var(--color-border)",
    background: "var(--color-surface-alt)",
    width: "calc(20% - 40px)",
    marginLeft: "0",
    marginRight: "0",
    marginBottom: "8px",
    boxShadow: "0 5px 4px -2px rgba(0,0,0,0.35)",
  }}
>
      {/*
        Layout behaviour:
        - Mobile (<md):     everything stacked, full "Female"/"Male", normal padding
        - Tablet (md-lg):   single row, "F"/"M", reduced padding/gaps for a shorter row
        - Desktop (lg+):    original stacked sidebar layout, full "Female"/"Male"
      */}
      <div className="flex flex-col md:flex-row lg:flex-col gap-1 md:gap-1 lg:gap-0 p-3 md:p-1 lg:p-0">

        {/* Patient Selection */}
        <div className="md:w-[30%] md:flex-shrink-0 lg:w-auto lg:flex-none lg:p-1">
          <div className="text-[0.7rem] font-bold tracking-wide mb-1 flex items-center justify-between md:hidden lg:flex" style={{ color: "var(--color-text-muted)" }}>
            <span>Appointments ({completedAppointmentCount}/{patients.length})</span>
          </div>
          <PatientDropdown
            patients={patients}
            selectedPatient={selectedPatient}
            onSelectPatient={onSelectPatient}
            open={open}
            setOpen={setOpen}
            tabsRowRef={tabsRowRef}
          />
        </div>

        {/* Patient Details */}
        <div className="flex flex-col sm:flex-row md:flex-1 lg:flex-none lg:flex-col gap-2 md:gap-1 lg:p-1 lg:gap-2">

            {/* Sex / Age / DOB — same card styling as CompactRelationCard */}
            <div
              className="md:w-[58%] flex-1 lg:w-auto rounded-none px-3 py-2.5 md:px-1.5 md:py-1 lg:px-3 lg:py-2.5 h-full shadow-sm"
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
              }}
            >
              <div className="grid grid-cols-3 gap-2 md:gap-1">

                {/* Sex */}
                <div>
                  <div
                    className="text-[0.7rem] font-bold tracking-wide mb-0.5 md:mb-0"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    Sex
                  </div>
                  {/* Full word on mobile + desktop */}
                  <div className="hidden md:hidden lg:block  text-[0.9rem]  whitespace-nowrap" style={{ color: "var(--color-primary)" }}>
                    {p.gender || "—"}
                  </div>
                  <div className="block md:hidden  text-[0.9rem]  whitespace-nowrap" style={{ color: "var(--color-primary)" }}>
                    {p.gender || "—"}
                  </div>
                  {/* Abbreviation on tablet only - smaller text */}
                  <div className="hidden md:block lg:hidden text-[0.9rem]  whitespace-nowrap" style={{ color: "var(--color-primary)" }}>
                    {getGenderShort(p.gender)}
                  </div>
                </div>

                {/* Age */}
                <div>
                  <div
                    className="text-[0.7rem] font-bold  tracking-wide mb-0.5 md:mb-0"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    Age
                  </div>
                  <div className="text-xs md:text-[0.9rem]  whitespace-nowrap" style={{ color: "var(--color-primary)" }}>
                    {age.years !== null
                      ? `${age.years}y ${age.months}m ${age.days}d`
                      : "—"}
                  </div>
                </div>

                {/* DOB */}
                <div>
                  <div
                    className="text-[0.7rem] font-bold uppercase tracking-wide mb-0.5 md:mb-0"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    DOB
                  </div>
                  <div className="text-xs md:text-[0.9rem]  whitespace-nowrap" style={{ color: "var(--color-primary)" }}>
                    {p.dob || "—"}
                  </div>
                </div>

              </div>
            </div>

            {/* Attendant — ClinicalCard-style card (icon + title + data) */}
            <div className="md:w-[28%] flex-1 lg:w-auto">
              <CompactRelationCard attendant={p.attendant} />
            </div>

          </div>
      </div>

      {showAddModal && (
        <AddPatientModal
          onCancel={() => setShowAddModal(false)}
          onSave={(newPatient) => {
            onAddPatient?.(newPatient);
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
}
