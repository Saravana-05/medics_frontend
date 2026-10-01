import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CalendarDays, Check, GripVertical, MoreHorizontal, Pencil, Plus, RotateCcw, Save, Trash2, UserRound, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import appointmentMock from "../../data/opAppointmentMock.json";
import patientAvatar from "../../assets/avatar.jpg";

const TABS = appointmentMock.tabs;
const DAYS = appointmentMock.days;
const DOCTORS = appointmentMock.doctors;
const DOCTOR_TEMPLATES = appointmentMock.doctorTemplates;
const PATIENTS = appointmentMock.patientMasterRecords.map(record => ({
  id: record.patientId,
  name: record.patient,
  phone: record.patientPhone,
  messageType: record.patientMsgType,
  age: record.age,
  dob: record.dob,
  gender: record.gender,
  lifeStage: record.lifeStage,
  blood: record.blood,
  attendant: record.attendant,
  relationship: record.relationship,
  attendantPhone: record.attendantPhone,
  attendantMsgType: record.attendantMsgType,
  address: [record.address1, record.address2, record.address3].filter(Boolean).join("\n"),
}));
const HTML_APPOINTMENT_SLOTS = appointmentMock.appointmentSlots;
const PREVIOUS_VISITS = appointmentMock.previousVisits;
const REPORTED_TIME_BY_TOKEN = {
  1: ["08:55 AM", "09:00 AM"],
  2: ["09:10 AM", "09:15 AM"],
  3: ["09:22 AM", "09:24 AM"],
  4: ["09:39 AM", "09:44 AM"],
  5: ["09:51 AM", "09:53 AM"],
  6: ["10:05 AM", "10:08 AM"],
  7: ["11:57 AM", "10:25 AM"],
  8: ["10:37 AM", "10:41 AM"],
  9: ["10:51 AM", "10:56 AM"],
  10: ["11:10 AM", "11:15 AM"],
  11: ["11:25 AM", "11:30 AM"],
  13: ["11:50 AM", "11:53 AM"],
};
const dateForDisplay = value => {
  const [year, month, day] = String(value || "").split("-");
  return year && month && day ? `${day}-${month}-${year}` : "";
};
const dateForInput = value => String(value || "").slice(0, 10);
const timeForInput = value => String(value || "").slice(11, 16);
const makePatientPhoto = patient => (patient?.name || "Patient")
  .split(/\s+/)
  .filter(Boolean)
  .slice(0, 2)
  .map(part => part[0])
  .join("")
  .toUpperCase();

const toMinutes = value => {
  const [hour, minute] = String(value || "00:00").split(":").map(Number);
  return hour * 60 + minute;
};
const fromMinutes = value => {
  const hour = Math.floor(value / 60) % 24;
  const minute = value % 60;
  return `${String(hour % 12 || 12).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${hour >= 12 ? "PM" : "AM"}`;
};
const compactTime = value => String(value || "").replace(" AM", "AM").replace(" PM", "PM");
const dateLabel = value => {
  if (!value) return "Select Date";
  const date = new Date(`${value}T12:00:00`);
  return date.toLocaleDateString(undefined, { weekday: "long", day: "2-digit", month: "short", year: "numeric" });
};
const makeSlots = ({ start, end, duration }, patientName = "") => {
  const startMins = toMinutes(start), endMins = toMinutes(end), step = Math.max(1, Number(duration) || 15);
  return Array.from({ length: Math.max(0, Math.floor((endMins - startMins) / step)) }, (_, index) => ({
    token: index + 1,
    time: fromMinutes(startMins + index * step),
    status: index === 4 ? "break" : index === 8 ? "buffer" : index === 1 && patientName ? "booked" : "free",
    patient: index === 1 ? patientName : "",
    session: "",
  }));
};

function Panel({ title, subtitle, tone = "light", actions, children, className = "" }) {
  return (
    <section className={`opa-panel ${className}`}>
      <div className={`opa-panel-title ${tone}`}>
        <div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>
        {actions && <div className="opa-panel-actions">{actions}</div>}
      </div>
      <div className="opa-panel-body">{children}</div>
    </section>
  );
}
function Section({ title, actions, children }) {
  return <article className="opa-section"><div className="opa-section-head"><span>{title}</span>{actions && <div className="opa-section-actions">{actions}</div>}</div><div className="opa-section-body">{children}</div></article>;
}
function Field({ label, children }) {
  return <label className="opa-field"><span>{label}</span>{children}</label>;
}
function SummaryCell({ label, value, tone }) {
  return <div className="opa-summary-cell"><span>{label}</span><strong style={tone ? { color: tone } : undefined}>{value || "-"}</strong></div>;
}
function IconButton({ title, children, onClick, danger = false, disabled = false }) {
  return <button type="button" title={title} aria-label={title} disabled={disabled} onClick={onClick} className="opa-icon-button" data-danger={danger || undefined}>{children}</button>;
}

function SlotGrid({ slots, selectedToken, onSelect, onStatus, onPatient, actionMenu, setActionMenu, onMovePatient, allowEdit = true }) {
  const [dragToken, setDragToken] = useState(null);
  const drop = token => {
    if (!dragToken || dragToken === token) return;
    onMovePatient?.(dragToken, token);
    setDragToken(null);
  };
  return (
    <div className="opa-slot-grid">
      <div className="opa-slot-head"><span>Token</span><span>Time</span><span>Status</span><span>Patient / Info</span><span>Action</span></div>
      <div className="opa-slot-rows">
        {slots.map(slot => (
          <div key={slot.token} className={`opa-slot-row ${slot.status} ${selectedToken === slot.token ? "selected" : ""}`} draggable={Boolean(slot.patient)} onDragStart={() => setDragToken(slot.token)} onDragOver={event => event.preventDefault()} onDrop={() => drop(slot.token)} onClick={() => onSelect?.(slot)}>
            <div className="opa-token"><GripVertical size={13} />{slot.token}</div>
            <div>{slot.time}</div>
            <div><span className={`opa-status-chip ${slot.status}`}>{slot.statusLabel || slot.status}</span></div>
            <div><input value={slot.patient} disabled={!allowEdit || ["break", "buffer"].includes(slot.status)} placeholder={slot.status === "break" ? "Tea Break" : slot.status === "buffer" ? "Buffer time" : slot.status === "hold" ? "On hold" : "--"} onClick={event => event.stopPropagation()} onChange={event => onPatient?.(slot.token, event.target.value)} /></div>
            <div className="opa-slot-action-cell">
              <IconButton title={`Actions for token ${slot.token}`} onClick={event => { event.stopPropagation(); setActionMenu?.(actionMenu === slot.token ? null : slot.token); }}><MoreHorizontal size={16} /></IconButton>
              {actionMenu === slot.token && (
                <div className="opa-popover" onClick={event => event.stopPropagation()}>
                  <button type="button" onClick={() => onStatus?.(slot.token, "booked")}>Book / Change Patient</button>
                  <button type="button" onClick={() => onStatus?.(slot.token, "hold")}>{slot.status === "hold" ? "Release Hold" : "Place on Hold"}</button>
                  <hr />
                  <button type="button" onClick={() => onStatus?.(slot.token, "break")}>{slot.status === "break" ? "Remove Break" : "Add Break"}</button>
                  <button type="button" onClick={() => onStatus?.(slot.token, "buffer")}>{slot.status === "buffer" ? "Remove Buffer" : "Add Buffer"}</button>
                  <button type="button" className="danger" onClick={() => onStatus?.(slot.token, "free")}>Clear Slot</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PreviousInformationPanel({ compact = false }) {
  const [query, setQuery] = useState("");
  const filtered = PREVIOUS_VISITS.filter(row => row.join(" ").toLowerCase().includes(query.toLowerCase()));
  return (
    <Panel title="Previous Information" subtitle={`${filtered.length} record(s)`} className={compact ? "opa-previous compact" : "opa-previous"} actions={<input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search" />}>
      <div className="opa-prev-grid">
        <div className="opa-prev-head">{["Date", "Type", "Doctor", "Diagnosis", "Medicine", "Advice", "Status"].map(label => <span key={label}>{label}</span>)}</div>
        {filtered.map((row, index) => <div className="opa-prev-row" key={index}>{row.map((cell, cellIndex) => <span key={cellIndex}>{cell}</span>)}</div>)}
      </div>
    </Panel>
  );
}

function PatientMasterInfo({ patient }) {
  if (!patient) return null;
  return (
    <div className="opa-patient-master-card">
      <div className="opa-patient-master-title">
        <strong>{patient.name}</strong>
        <span>{patient.id}</span>
      </div>
      <div className="opa-patient-master-grid">
        <span>Gender</span><strong>{patient.gender}</strong>
        <span>DOB / Age</span><strong>{patient.dob} / {patient.age}</strong>
        <span>Stage</span><strong>{patient.lifeStage}</strong>
        <span>Blood</span><strong>{patient.blood}</strong>
        <span>Phone</span><strong>{patient.phone} ({patient.messageType})</strong>
        <span>Attendant</span><strong>{patient.attendant}</strong>
        <span>Relation</span><strong>{patient.relationship}</strong>
        <span>Att. Phone</span><strong>{patient.attendantPhone} ({patient.attendantMsgType})</strong>
      </div>
      <div className="opa-patient-master-address">{patient.address}</div>
    </div>
  );
}

function PatientConfirmationBlock({ patient, slotOptions, selectedToken, onPatientChange, onSlotChange, disabled }) {
  if (!patient) return (
    <>
      <label>Patient</label>
      <select className="opa-danger-select opa-patient-select" value="" onChange={onPatientChange} disabled={disabled}>
        <option value="">Select Patient from Patient Master</option>
        {PATIENTS.map(item => <option key={item.id} value={item.id}>{item.name} ({item.id})</option>)}
      </select>
      <div className="opa-patient-demo-inline"></div>
      <label>Slot#-Time</label>
      <select className="opa-danger-select opa-slot-select" value={selectedToken || ""} onChange={onSlotChange} disabled={!slotOptions.length || disabled}>
        {slotOptions.map(slot => <option key={slot.token} value={slot.token}>{slot.token} - {slot.time}</option>)}
      </select>
    </>
  );
  return (
    <>
      <label>Patient</label>
      <select className="opa-danger-select opa-patient-select" value={patient.id} onChange={onPatientChange} disabled={disabled}>
        <option value="">Select Patient from Patient Master</option>
        {PATIENTS.map(item => <option key={item.id} value={item.id}>{item.name} ({item.id})</option>)}
      </select>
      <div className="opa-patient-demo-inline">
        {patient.gender} <span>|</span> {patient.lifeStage} <span>|</span> {patient.blood}<br />
        DOB: {patient.dob} <span>|</span> {patient.age}
      </div>
      <label>Slot#-Time</label>
      <select className="opa-danger-select opa-slot-select" value={selectedToken || ""} onChange={onSlotChange} disabled={!slotOptions.length || disabled}>
        {slotOptions.map(slot => <option key={slot.token} value={slot.token}>{slot.token} - {slot.time}</option>)}
      </select>
      <label className="opa-phone-msg-label">Phone-Msg</label>
      <div className="opa-inline-pair opa-phone-msg-pair">
        <input value={patient.phone} readOnly />
        <select value={patient.messageType} readOnly><option>Phone</option><option>WApp</option></select>
      </div>
      <div className="opa-patient-photo-card">
        <img className="opa-patient-avatar" src={patientAvatar} alt="" />
        <strong>{patient.name}</strong>
      </div>
      <textarea className="opa-master-address" value={patient.address} readOnly />
    </>
  );
}

function AppointmentSlotsPanel({ doctor, date, slots, selectedToken, onSelect, onAction }) {
  const dateText = `${dateForDisplay(date).replaceAll("-", "/")} - Wednesday 12:20:28 PM`;
  return (
    <section className="opa-flow-panel opa-slots-panel">
      <div className="opa-flow-title"><h2>Appointment Slots</h2></div>
      <div className="opa-slots-meta">
        <strong>Doctor:</strong><span>{doctor}</span>
        <strong>Date:</strong><span>{dateText}</span>
        <strong>Session#:</strong><select value="All" readOnly><option value="All">&lt;All Sessions&gt;</option></select>
      </div>
      <div className="opa-appointment-grid-wrap">
        <div className="opa-appointment-grid">
          <div className="opa-appointment-grid-head">
            <span>Slot#</span><span>Time</span><span>Status</span><span>Patient Name</span><span>Reported<br />Time</span><span>Checkup<br />Time</span><span>Previous<br />Time</span><span>Actions</span>
          </div>
          {slots.map(slot => {
            const reported = REPORTED_TIME_BY_TOKEN[slot.token]?.[0] || "";
            const checkup = REPORTED_TIME_BY_TOKEN[slot.token]?.[1] || "";
            const selected = Number(selectedToken) === slot.token;
            return (
              <div key={slot.token} role="button" tabIndex={0} className={`opa-appointment-grid-row ${slot.status} ${selected ? "selected" : ""}`} onClick={() => onSelect(slot)} onKeyDown={event => event.key === "Enter" && onSelect(slot)}>
                <span className="slot-no">{slot.token}<i /></span>
                <span className="slot-time">{slot.time}</span>
                <span className="slot-status">{slot.statusLabel || slot.status}</span>
                <span className="slot-patient">{slot.patient}</span>
                <span>{reported}</span>
                <span>{checkup}</span>
                <span></span>
                <span className="slot-actions">
                  <button type="button" title="Cancelled" onClick={event => { event.stopPropagation(); onAction(slot, "cancelled"); }}>C</button>
                  <button type="button" title="Absent" onClick={event => { event.stopPropagation(); onAction(slot, "absent"); }}>A</button>
                  <button type="button" title={slot.status === "unavailable" ? "Release unavailable time" : "Insert unavailable slot time"} onClick={event => { event.stopPropagation(); onAction(slot, "unavailable"); }}>⊘</button>
                  <button type="button" title="Edit slot" onClick={event => { event.stopPropagation(); onAction(slot, "edit"); }}>✎</button>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PreviousInformationExact({ patient }) {
  if (!patient) return null;
  const rows = [
    ["10071", "16/01/2024 10:55", "3908- OP-DP", "—"],
    ["10072", "02/01/2024 10:55", "3908- OP-LP-R", "02/01/2024 14:30"],
    ["10073", "19/12/2023 10:55", "3908- OP-DP", "—"],
  ];
  return (
    <section className="opa-flow-panel opa-previous-panel">
      <div className="opa-flow-title">
        <div><h2>Previous Information</h2><p>3 Entries Recorded</p></div>
        <div className="opa-prev-buttons"><button type="button">☷ Filter</button><button type="button">⌕ Search Entries</button></div>
      </div>
      <div className="opa-prev-patient-line"><strong>Patient:</strong> {patient.name}</div>
      <div className="opa-prev-grid-exact">
        <div className="opa-prev-grid-head"><span>No. ↕</span><span>Entry ↕</span><span>Module ↕</span><span>Report ↕</span></div>
        {rows.map(row => <div className="opa-prev-grid-row" key={row[0]}>{row.map(cell => <span key={cell}>{cell}</span>)}</div>)}
        {Array.from({ length: 12 }).map((_, index) => <div className="opa-prev-grid-row blank" key={index}><span></span><span></span><span></span><span></span></div>)}
      </div>
      <div className="opa-prev-footer"><span><i /> OP Visit</span><span><i /> IP Visit</span><em>Showing 3/3</em></div>
    </section>
  );
}

function AppointmentTab({ booking, setBooking, patient, setPatient, slots, setSlots, selectedToken, setSelectedToken, structures, confirmAppointment }) {
  const [mode, setMode] = useState("idle");
  const [additionalOpen, setAdditionalOpen] = useState(false);
  const canEdit = mode === "new" || mode === "modify";
  const selectedSlot = slots.find(slot => slot.token === Number(selectedToken));
  const bookedSlots = slots.filter(slot => slot.status === "booked" && slot.patient);
  const requestDate = booking.requestedAt ? booking.requestedAt.replace("T", " ") : "29-09-2026 12:12";
  const slotOptions = slots.filter(slot => ["free", "buffer"].includes(slot.status));
  const showSlots = Boolean(booking.doctor && slots.length);
  const showPatientFlow = Boolean(showSlots && patient?.id);

  const updateBooking = patch => {
    setBooking(current => ({ ...current, ...patch }));
  };
  const buildSlotsForDoctor = doctor => {
    if (!doctor) return [];
    if (doctor === "Dr. Anand") return HTML_APPOINTMENT_SLOTS.map(slot => ({ ...slot }));
    const template = structures.find(item => item.doctor === doctor) || { doctor, ...DOCTOR_TEMPLATES[doctor], slots: makeSlots(DOCTOR_TEMPLATES[doctor]) };
    return (template.slots?.length ? template.slots : makeSlots(template)).map(slot => ({
      ...slot,
      time: compactTime(slot.time),
      status: String(slot.status || "free").toLowerCase(),
      statusLabel: String(slot.status || "free").replace(/^\w/, char => char.toUpperCase()),
    }));
  };
  const loadSlotsIfReady = ({ doctor = booking.doctor, date = booking.date } = {}) => {
    if (!doctor || !date) {
      setSlots([]);
      setSelectedToken("");
      return;
    }
    const nextSlots = buildSlotsForDoctor(doctor);
    setSlots(nextSlots);
    const firstFree = nextSlots.find(slot => slot.status === "free") || nextSlots.find(slot => !["break", "buffer", "block", "hold"].includes(slot.status));
    setSelectedToken(firstFree?.token || "");
    setBooking(current => ({ ...current, doctor, date, token: firstFree?.token || "", time: firstFree?.time || "" }));
  };
  const startNew = () => {
    setMode("new");
    setSelectedToken("");
    setSlots([]);
    setPatient(null);
    setAdditionalOpen(false);
    setBooking(current => ({
      ...current,
      requestedAt: "2026-09-30T12:19",
      requestType: "<None>",
      requestHow: "Direct",
      date: "",
      doctor: "",
      token: "",
      time: "",
      status: "draft",
    }));
  };
  const startSelect = () => {
    if (!bookedSlots.length) {
      return;
    }
    const firstBooked = bookedSlots[0];
    setMode("select");
    setSelectedToken(firstBooked.token);
    setBooking(current => ({ ...current, token: firstBooked.token, time: firstBooked.time, status: "booked" }));
  };
  const startModify = () => {
    if (!selectedSlot) {
      return;
    }
    setMode("modify");
  };
  const cancel = () => {
    setMode("idle");
    setSlots([]);
    setSelectedToken("");
    setPatient(null);
    setAdditionalOpen(false);
    setBooking(current => ({ ...current, doctor: "", date: "", token: "", time: "", status: "draft" }));
  };
  const addSlots = () => {
    loadSlotsIfReady();
  };
  const selectSlot = slot => {
    if (!slot || ["break", "block", "hold", "unavailable", "cancelled", "absent"].includes(slot.status)) return;
    setSelectedToken(slot.token);
    setBooking(current => ({ ...current, token: slot.token, time: slot.time }));
  };
  const updateSlotAction = (slot, action) => {
    if (!slot) return;
    if (action === "edit") {
      if (!["break", "block", "hold", "unavailable", "cancelled", "absent"].includes(slot.status)) {
        selectSlot(slot);
        setMode("modify");
      }
      return;
    }
    const next = action === "unavailable"
      ? (slot.status === "unavailable" ? { status: "free", statusLabel: "Free", patient: "" } : { status: "unavailable", statusLabel: "Unavailable", patient: "" })
      : action === "cancelled"
        ? { status: "cancelled", statusLabel: "Cancelled", patient: slot.patient }
        : { status: "absent", statusLabel: "Absent", patient: slot.patient };
    setSlots(current => current.map(item => item.token === slot.token ? { ...item, ...next } : item));
    if (selectedToken === slot.token || ["unavailable", "cancelled", "absent"].includes(next.status)) {
      setSelectedToken("");
      setBooking(current => ({ ...current, token: "", time: "" }));
    }
  };
  const selectPatient = patientId => {
    const selectedPatient = PATIENTS.find(item => item.id === patientId) || null;
    setPatient(selectedPatient);
    if (!selectedPatient) return;
    setSlots(current => current.map(slot => slot.token === 7 ? { ...slot, status: "reported", statusLabel: "Reported", patient: selectedPatient.name } : slot));
    const preferredSlot = slots.find(slot => slot.token === 12) || slots.find(slot => !["block", "buffer", "break", "hold"].includes(slot.status));
    if (preferredSlot) {
      setSelectedToken(preferredSlot.token);
      setBooking(current => ({ ...current, token: preferredSlot.token, time: preferredSlot.time }));
    }
  };
  const save = () => {
    if (!booking.doctor || !booking.date || !selectedSlot) {
      return;
    }
    const patientName = patient?.name || "New Patient";
    setSlots(current => current.map(slot => slot.token === selectedSlot.token ? { ...slot, status: "booked", patient: patientName } : slot));
    setBooking(current => ({ ...current, token: selectedSlot.token, time: selectedSlot.time, status: "booked" }));
    setMode("select");
    confirmAppointment?.({ token: selectedSlot.token, time: selectedSlot.time, status: "booked" });
  };
  return (
    <div className={`opa-appointment-flow ${showPatientFlow ? "with-previous" : ""}`}>
      <section className="opa-booking-card">
        <div className="opa-booking-head">
          <h2>Booking</h2>
          <div className="opa-booking-actions">
            <button type="button" className={mode === "idle" ? "active" : ""} onClick={startNew} disabled={mode === "new"}>New</button>
            <button type="button" className={mode === "idle" ? "active" : ""} onClick={startSelect} disabled={mode !== "idle"}>Select</button>
            <button type="button" onClick={startModify} disabled={!selectedSlot || mode === "modify"}>Modify</button>
            <button type="button" onClick={cancel} disabled={mode === "idle"}>Cancel</button>
            <button type="button" onClick={save} disabled={mode === "idle"}>Save</button>
            <button type="button" className="add" title="Add" aria-label="Add appointment slots" onClick={addSlots}><Plus size={15} /></button>
          </div>
        </div>
        <div className="opa-request-box">
          <div className="opa-request-title">
            <strong>Request</strong>
            <select value={booking.requestType || "<None>"} onChange={event => updateBooking({ requestType: event.target.value })} disabled={!canEdit}>
              <option>&lt;None&gt;</option>
              <option>Phone</option>
              <option>Walk-in</option>
              <option>WhatsApp</option>
            </select>
          </div>
          <div className="opa-request-grid">
            <label>Req. Dt-Time</label>
            <input type={canEdit ? "datetime-local" : "text"} value={canEdit ? booking.requestedAt : requestDate} onChange={event => updateBooking({ requestedAt: event.target.value })} readOnly={!canEdit} />
            <label>Doctor</label>
            <select value={booking.doctor || "<None>"} onChange={event => {
              const doctor = event.target.value === "<None>" ? "" : event.target.value;
              updateBooking({ doctor, date: "", token: "", time: "" });
              setSlots([]);
              setSelectedToken("");
              setPatient(null);
            }} disabled={!canEdit}>
              <option>&lt;None&gt;</option>
              {DOCTORS.map(name => <option key={name}>{name}</option>)}
            </select>
            <label>Req. How</label>
            <select value={booking.requestHow || ""} onChange={event => updateBooking({ requestHow: event.target.value })} disabled={!canEdit}>
              <option>Direct</option>
              <option>By Phone</option>
              <option>By Doctor</option>
            </select>
            <label>Appt. Date</label>
            <input type={canEdit ? "date" : "text"} value={canEdit ? dateForInput(booking.date) : dateForDisplay(booking.date)} onChange={event => {
              const date = event.target.value;
              updateBooking({ date, token: "", time: "" });
              loadSlotsIfReady({ date });
            }} readOnly={!canEdit} />
            {showSlots && (
              <PatientConfirmationBlock
                patient={patient}
                slotOptions={slotOptions}
                selectedToken={selectedToken}
                disabled={!canEdit}
                onPatientChange={event => selectPatient(event.target.value)}
                onSlotChange={event => selectSlot(slots.find(slot => slot.token === Number(event.target.value)))}
              />
            )}
          </div>
        </div>
        {showPatientFlow && (
          <>
            <div className="opa-reporting-box">
              <div className="opa-reporting-head"><strong>Reporting</strong><select disabled><option></option></select></div>
              <div className="opa-reporting-row">
                <label>Reported Time</label><input type="time" step="1" defaultValue="11:48:02" onClick={event => event.currentTarget.showPicker?.()} /><button type="button">&lt;None&gt;</button>
                <label>Report How</label><select defaultValue="<None>"><option>&lt;None&gt;</option><option>In Time</option><option>Early</option><option>Late</option></select>
              </div>
            </div>
            <div className="opa-additional-box">
              <label><input type="checkbox" checked={additionalOpen} onChange={event => setAdditionalOpen(event.target.checked)} /> Additional Information</label>
              {additionalOpen && (
                <div className="opa-additional-body">
                  <label>Attendant</label><input />
                  <label>Relationship</label><input />
                  <label>Phone-Msg</label><div className="opa-inline-pair"><input /><select><option></option><option>Phone</option><option>WApp</option></select></div>
                  <div className="opa-notes-tabs"><button type="button">Notes</button><button type="button">Previous Notes</button><textarea readOnly /></div>
                </div>
              )}
            </div>
          </>
        )}
      </section>
      {showSlots ? <AppointmentSlotsPanel doctor={booking.doctor} date={booking.date || "2026-09-30"} slots={slots} selectedToken={selectedToken} onSelect={selectSlot} onAction={updateSlotAction} /> : <section className="opa-blank-panel" aria-label="Appointment workspace" />}
      {showPatientFlow && <PreviousInformationExact patient={patient} />}
    </div>
  );
}

function PreliminaryCheckupTab({ booking, setBooking }) {
  const seedPatients = [
    { token: 1, time: "09:00 AM", status: "Treated", patient: "Arjun Menon", reportedTime: "08:55 AM", checkupTime: "09:00 AM", reportedHow: "Late" },
    { token: 2, time: "09:15 AM", status: "Treated", patient: "Priya Nair", reportedTime: "09:10 AM", checkupTime: "09:15 AM", reportedHow: "Late" },
    { token: 3, time: "09:30 AM", status: "Treated", patient: "Karthik Raman", reportedTime: "09:22 AM", checkupTime: "09:24 AM", reportedHow: "Late" },
    { token: 4, time: "09:45 AM", status: "Parked", patient: "Meera Iyer", reportedTime: "09:39 AM", checkupTime: "09:44 AM", reportedHow: "Late" },
    { token: 5, time: "10:00 AM", status: "Treated", patient: "Rahul Shah", reportedTime: "09:51 AM", checkupTime: "09:53 AM", reportedHow: "Late" },
    { token: 6, time: "10:15 AM", status: "Parked", patient: "Ananya Rao", reportedTime: "10:05 AM", checkupTime: "10:08 AM", reportedHow: "Late" },
    { token: 7, time: "10:30 AM", status: "Ready", patient: "Vikram Kumar", reportedTime: "10:21 AM", checkupTime: "10:25 AM", reportedHow: "Late" },
    { token: 8, time: "10:45 AM", status: "Ready", patient: "Lakshmi Menon", reportedTime: "10:37 AM", checkupTime: "10:41 AM", reportedHow: "Late" },
    { token: 9, time: "11:00 AM", status: "Ready", patient: "Suresh Babu", reportedTime: "10:51 AM", checkupTime: "10:56 AM", reportedHow: "Late" },
    { token: 10, time: "11:15 AM", status: "Ready", patient: "Divya Krishnan", reportedTime: "11:10 AM", checkupTime: "11:15 AM", reportedHow: "Late" },
    { token: 11, time: "11:30 AM", status: "Reported", patient: "Aditya Verma", reportedTime: "11:25 AM", checkupTime: "11:30 AM", reportedHow: "Late" },
    { token: 12, time: "11:45 AM", status: "Buffer", patient: "", reportedTime: "", checkupTime: "", reportedHow: "" },
    { token: 13, time: "12:00 PM", status: "Ready", patient: "Rohit Nair", reportedTime: "11:50 AM", checkupTime: "05:09 PM", reportedHow: "Late" },
    { token: 14, time: "12:15 PM", status: "Booked", patient: "Kavya Reddy", reportedTime: "", checkupTime: "", reportedHow: "" },
    { token: 15, time: "12:30 PM", status: "Booked", patient: "Manoj Kumar", reportedTime: "", checkupTime: "", reportedHow: "" },
    { token: 16, time: "12:45 PM", status: "Booked", patient: "Sneha Iyer", reportedTime: "", checkupTime: "", reportedHow: "" },
    { token: 17, time: "01:00 PM", status: "Block", patient: "", reportedTime: "", checkupTime: "", reportedHow: "" },
    { token: 18, time: "01:15 PM", status: "Block", patient: "", reportedTime: "", checkupTime: "", reportedHow: "" },
    { token: 19, time: "01:30 PM", status: "Block", patient: "", reportedTime: "", checkupTime: "", reportedHow: "" },
    { token: 20, time: "01:45 PM", status: "Block", patient: "", reportedTime: "", checkupTime: "", reportedHow: "" },
    { token: 21, time: "02:00 PM", status: "Booked", patient: "Rakesh Krishnan", reportedTime: "", checkupTime: "", reportedHow: "" },
    { token: 22, time: "02:15 PM", status: "Booked", patient: "Neha Verma", reportedTime: "", checkupTime: "", reportedHow: "" },
    { token: 23, time: "02:30 PM", status: "Booked", patient: "Sanjay Patel", reportedTime: "", checkupTime: "", reportedHow: "" },
    { token: 24, time: "02:45 PM", status: "Buffer", patient: "", reportedTime: "", checkupTime: "", reportedHow: "" },
    { token: 25, time: "03:00 PM", status: "Free", patient: "", reportedTime: "", checkupTime: "", reportedHow: "" },
    { token: 26, time: "03:15 PM", status: "Free", patient: "", reportedTime: "", checkupTime: "", reportedHow: "" },
  ];
  const patientProfiles = {
    "Rohit Nair": { gender: "Male", stage: "Infant", blood: "O-", dob: "22/03/2026", age: "5m 19d", phone: "9001793233", attendant: "Karthikeyan Nair", relationship: "Father", attendantPhone: "9102519621", address: "12, Valluvar Street\nAnna Nagar, Madurai, Madurai - 625020", initials: "RN" },
    "Arjun Menon": { gender: "Male", stage: "Adult", blood: "O+", dob: "13/08/1992", age: "34y", phone: "9001793201", attendant: "Kavitha Menon", relationship: "Wife", attendantPhone: "9102519601", address: "12, Valluvar Street\nAnna Nagar, Madurai, Madurai - 625020", initials: "AM" },
    "Priya Nair": { gender: "Female", stage: "Adult", blood: "A+", dob: "31/01/1995", age: "31y", phone: "9001793202", attendant: "Suresh Nair", relationship: "Husband", attendantPhone: "9102519602", address: "44/2, Salai Road\nWoraiyur, Tiruchirappalli - 620003", initials: "PN" },
    "Aditya Verma": { gender: "Male", stage: "Adult", blood: "B+", dob: "18/02/1994", age: "32y", phone: "9001793211", attendant: "Anitha Verma", relationship: "Wife", attendantPhone: "9102519611", address: "21, Gandhi Road\nAnna Nagar, Chennai - 600040", initials: "AV" },
  };
  const makeInitialPrelim = name => ({
    whatFor: "New Instance", priority: "Normal", billing: "Self", referral: "<None>", pregnancy: false,
    pregnancyStatus: "", notes: name ? `${name} reported for preliminary checkup.` : "",
    complaint: "Fever with body pain", observation: "Vitals stable on reporting",
    vitals: {
      bp: { checked: true, value: "120/80" },
      temp: { checked: true, value: "98.6" },
      pulse: { checked: true, value: "78" },
      spo2: { checked: true, value: "98" },
      blood: { checked: true, value: "O+" },
      height: { checked: false, value: "N.A." },
      weight: { checked: false, value: "N.A." },
    },
  });
  const [mode, setMode] = useState("idle");
  const [rows, setRows] = useState(() => seedPatients.map(row => ({ ...row, prelim: makeInitialPrelim(row.patient) })));
  const [selectedToken, setSelectedToken] = useState("");
  const [draft, setDraft] = useState(() => makeInitialPrelim("Vijayalakshmi"));
  const [savedMessage, setSavedMessage] = useState("");
  const [previousOpen, setPreviousOpen] = useState(false);

  const [doctor, setDoctor] = useState("");
  const showReportedForm = mode !== "idle" || Boolean(doctor);
  const changeDoctor = value => {
    const next = value === "<None>" ? "" : value;
    setDoctor(next);
    setBooking({ ...booking, doctor: next });
    if (next) {
      setSelectedToken("");
      setBooking({ ...booking, doctor: next, slotTime: "", reportHow: "" });
    } else {
      setSelectedToken("");
      setMode("idle");
      setSavedMessage("");
      setPreviousOpen(false);
    }
  };

  const selectedRow = rows.find(row => row.token === Number(selectedToken));
  const showDetails = Boolean(doctor && booking.medicStaff && selectedRow);
  const selectedProfile = patientProfiles[selectedRow?.patient] || patientProfiles["Rohit Nair"];
  const canEdit = mode === "new" || mode === "editing";
  const reportedRows = rows.filter(row => row.patient && row.reportedTime && row.status === "Reported");
  const setVital = (key, patch) => setDraft(current => ({ ...current, vitals: { ...current.vitals, [key]: { ...current.vitals[key], ...patch } } }));
  const loadRow = (row, doctorOverride = doctor) => {
    if (!row) return;
    setSelectedToken(row.token);
    setDraft(row.prelim || makeInitialPrelim(row.patient));
    setBooking({ ...booking, doctor: doctorOverride, reportHow: row.reportedHow, slotTime: `${row.token} - ${row.time}` });
  };
  const startNew = () => {
    setMode("new");
    setSelectedToken("");
    setBooking({ ...booking, medicStaff: "", slotTime: "", reportHow: "" });
    setSavedMessage("");
  };
  const startSelect = () => {
    if (!doctor) return;
    const firstReported = reportedRows[0];
    setMode("selecting");
    loadRow(firstReported);
    setSavedMessage("");
  };
  const startModify = () => {
    if (!selectedRow?.patient) return;
    setMode("editing");
    setSavedMessage("");
  };
  const cancel = () => {
    setMode("idle");
    if (selectedRow) setDraft(selectedRow.prelim || makeInitialPrelim(selectedRow.patient));
    setSavedMessage("");
  };
  const save = () => {
    if (!selectedRow?.patient) return;
    const normalizedVitals = Object.fromEntries(Object.entries(draft.vitals).map(([key, vital]) => [key, vital.checked && vital.value ? vital : { checked: false, value: "N.A." }]));
    const savedDraft = { ...draft, vitals: normalizedVitals };
    const now = new Date();
    const checkupTime = `${String(now.getHours() % 12 || 12).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")} ${now.getHours() >= 12 ? "PM" : "AM"}`;
    setRows(current => current.map(row => row.token === selectedRow.token ? { ...row, status: row.status === "Reported" ? "Ready" : row.status, checkupTime, reportedHow: booking.reportHow || row.reportedHow, prelim: savedDraft } : row));
    setDraft(savedDraft);
    setMode("selecting");
    setSavedMessage(`${selectedRow.patient} preliminary checkup saved. Status moved to Ready.`);
  };
  const previousRows = [
    ["10071", "16/01/2024 10:55", "3908- OP-DP", "-"],
    ["10072", "02/01/2024 10:55", "3908- OP-LP-R", "02/01/2024 14:30"],
    ["10073", "19/12/2023 10:55", "3908- OP-DP", "-"],
  ];
  return (
    <div className={`opa-prelim-layout preliminary-checkup-app ${showDetails ? "" : "no-doctor"}`}>
      <section className="opa-medical-card">
        <div className="opa-medical-head"><h2>Medical Checkup</h2></div>
        <div className="opa-reported-box">
          <div className="opa-reported-head">
            <strong>Reported Info</strong>
            <div className="opa-reported-actions">
              <button type="button" className="active" onClick={startNew} disabled={mode === "new"}>New</button>
              <button type="button" className="active" onClick={startSelect} disabled={!doctor || mode === "selecting"}>Select</button>
              <button type="button" onClick={startModify} disabled={!showDetails || !selectedRow?.patient || mode === "editing"}>Modify</button>
              <button type="button" onClick={cancel} disabled={mode === "idle"}>Cancel</button>
              <button type="button" onClick={save} disabled={!showDetails || !canEdit || !selectedRow?.patient}>Save</button>
            </div>
          </div>

          {mode === "idle" && !doctor ? (
            <div className="opa-reported-grid minimal">
              <label>Doctor</label>
              <select value="<None>" onChange={event => changeDoctor(event.target.value)}>
                <option>&lt;None&gt;</option>
                {DOCTORS.map(name => <option key={name}>{name}</option>)}
              </select>
              <label>Appt. Date</label>
              <input value="01-10-2026" readOnly />
              <label>Slot#-Time</label>
              <select className="opa-invalid-select" value="" disabled><option value=""></option></select>
            </div>
          ) : (
            <div className="opa-reported-grid">
              {mode !== "idle" && (
                <>
                  <label>Medic Staff</label>
                  <select className="opa-staff-select" value={booking.medicStaff || "<None>"} onChange={event => setBooking({ ...booking, medicStaff: event.target.value === "<None>" ? "" : event.target.value })}>
                    <option>&lt;None&gt;</option>
                    <option>Sr. Usha</option>
                    <option>Sr. Angeline</option>
                    <option>Mrs. Stella</option>
                    <option>Mr. Kumar</option>
                  </select>
                </>
              )}
              <label>Doctor</label>
              <select value={doctor} onChange={event => changeDoctor(event.target.value)}>
                <option>&lt;None&gt;</option>
                {DOCTORS.map(name => <option key={name}>{name}</option>)}
              </select>
              <label>Appt. Date</label>
              <input value="01-10-2026" readOnly />
              <label>Slot#-Time</label>
              <select className={selectedRow?.patient ? "" : "opa-invalid-select"} value={selectedToken} disabled={!doctor || !booking.medicStaff} onChange={event => loadRow(reportedRows.find(row => row.token === Number(event.target.value)))}>
                <option value="">Select Reported Slot#-Time</option>
                {reportedRows.map(row => <option key={row.token} value={row.token}>{row.token} - {row.time}</option>)}
              </select>
            </div>
          )}

          {showDetails && selectedRow && (
            <div className="opa-patient-detail-grid">
              <label>Patient</label>
              <select className="danger" value={selectedRow?.patient || ""} onChange={event => loadRow(reportedRows.find(row => row.patient === event.target.value) || selectedRow)}>
                <option value="">Select Reported Patient</option>
                {reportedRows.map(row => <option key={row.token}>{row.patient}</option>)}
              </select>
              <div className="opa-demo-line">{selectedProfile.gender} <span>|</span> {selectedProfile.stage} <span>|</span> {selectedProfile.blood}<br />DOB: {selectedProfile.dob} <span>|</span> {selectedProfile.age}</div>
              <label>Phone-Msg</label><input value={selectedProfile.phone} readOnly /><select value="Phone" readOnly><option>Phone</option><option>WApp</option></select>
              <label>Attendant</label><input className="span2" value={selectedProfile.attendant} readOnly />
              <label>Relationship</label><input className="span2" value={selectedProfile.relationship} readOnly />
              <label>Phone-Msg</label><input value={selectedProfile.attendantPhone} readOnly /><select value="WApp" readOnly><option>Phone</option><option>WApp</option></select>
              <textarea className="opa-address-box" value={selectedProfile.address} readOnly />
              <div className="opa-photo-card"><div className="opa-face"><span>{selectedProfile.initials}</span></div><strong>{selectedRow?.patient}</strong></div>
            </div>
          )}
        </div>

        {showDetails && selectedRow && (
          <div className="opa-prelim-patient-box">
            <div className="opa-prelim-patient-head"><strong>Vitals</strong></div>
            <div className="opa-prelim-form">
              <label>What For<select value={draft.whatFor} disabled={!canEdit} onChange={event => setDraft({ ...draft, whatFor: event.target.value })}><option>New Instance</option><option>Follow-Up</option><option>First Visit</option></select></label>
              <label>Priority<select value={draft.priority} disabled={!canEdit} onChange={event => setDraft({ ...draft, priority: event.target.value })}><option>Normal</option><option>Urgent</option></select></label>
              <label>Billing<select value={draft.billing} disabled={!canEdit} onChange={event => setDraft({ ...draft, billing: event.target.value })}><option>Self</option><option>Company</option><option>Insurance</option></select></label>
              <label>Referral<select value={draft.referral} disabled={!canEdit} onChange={event => setDraft({ ...draft, referral: event.target.value })}><option>&lt;None&gt;</option><option>Dr. Sushila</option><option>Dr. Robert</option></select></label>
              <label>Pregnancy<input value={draft.pregnancyStatus} disabled={!canEdit} onChange={event => setDraft({ ...draft, pregnancyStatus: event.target.value })} /></label>
              <div className="opa-note-tabs"><button type="button">Notes</button><button type="button">Previous Notes</button><textarea value="Appointment confirmed: 29/09/2026 12:00 PM" readOnly /></div>
            </div>
            <div className="opa-vitals-strip">
              {Object.entries({ bp: "BP", temp: "Temp", pulse: "Pulse", spo2: "SpO2", blood: "Blood", height: "Height", weight: "Weight" }).map(([key, label]) => (
                <label key={key}><span><input type="checkbox" checked={draft.vitals[key].checked} disabled={!canEdit} onChange={event => setVital(key, { checked: event.target.checked, value: event.target.checked ? "" : "N.A." })} />{label}</span><input value={draft.vitals[key].value} disabled={!canEdit || !draft.vitals[key].checked} onChange={event => setVital(key, { value: event.target.value })} /></label>
              ))}
            </div>
            <div className="opa-prelim-textareas">
              <label>Complaint<textarea value={draft.complaint} disabled={!canEdit} maxLength={150} onChange={event => setDraft({ ...draft, complaint: event.target.value })} /></label>
              <label>Observation<textarea value={draft.observation} disabled={!canEdit} maxLength={150} onChange={event => setDraft({ ...draft, observation: event.target.value })} /></label>
            </div>
            {savedMessage && <div className="opa-inline-note success"><Check size={14} /> {savedMessage}</div>}
          </div>
        )}
      </section>

      {showDetails && (
        <>
          <section className="opa-prelim-blank" aria-label="Preliminary checkup workspace">
            <div className="opa-slots-head">
              <h2>Appointment Slots</h2>
              <div className="opa-slot-meta">
                <strong>Doctor:</strong><span>{doctor}</span>
                <strong>Date:</strong><span>29/09/2026 - Tuesday 05:14:52 PM</span>
                <strong>Session#:</strong><select defaultValue="All"><option value="All">&lt;All Sessions&gt;</option></select>
              </div>
            </div>
            <div className="opa-prelim-slot-grid">
              <div className="opa-prelim-slot-head"><span>Slot#</span><span>Time</span><span>Status</span><span>Patient Name</span><span>Reported Time</span><span>Checkup Time</span><span>Previous Time</span><span>Actions</span></div>
              {rows.map(row => (
                <button key={row.token} type="button" className={`opa-prelim-slot-row ${selectedToken === row.token ? "active" : ""} ${row.status.toLowerCase()}`} onClick={() => loadRow(row)} disabled={!row.patient}>
                  <span>{row.token}<i></i></span><span>{row.time}</span><span>{row.status}</span><span>{row.patient || ""}</span><span>{row.reportedTime || ""}</span><span>{row.checkupTime || ""}</span><span></span><span>⊘</span>
                </button>
              ))}
            </div>
          </section>

          <button type="button" className="opa-prev-float" onClick={() => setPreviousOpen(true)} title="Previous Information" aria-label="Open Previous Information">
            <MoreHorizontal size={18} />
          </button>
          {previousOpen && <div className="opa-prev-drawer-backdrop" onClick={() => setPreviousOpen(false)} />}
          <section className={`opa-prev-info-exact opa-prev-drawer ${previousOpen ? "open" : ""}`}>
            <div className="opa-prev-exact-head">
              <div><h2>Previous Information</h2><p>3 Entries Recorded</p></div>
              <div className="opa-prev-exact-actions"><button type="button">Filter</button><button type="button">Search Entries</button><button type="button" onClick={() => setPreviousOpen(false)}>Close</button></div>
            </div>
            <div className="opa-prev-patient">Patient: <span>Vijayalakshmi</span></div>
            <div className="opa-prev-exact-scroll">
              <div className="opa-prev-exact-grid">
                <div className="opa-prev-exact-table-head">{["No. ↕", "Entry ↕", "Module ↕", "Report ↕"].map(label => <span key={label}>{label}</span>)}</div>
                {previousRows.map(row => <div className="opa-prev-exact-row" key={row[0]}>{row.map(cell => <span key={cell}>{cell}</span>)}</div>)}
                {Array.from({ length: 17 }).map((_, index) => <div className="opa-prev-exact-row blank" key={`blank-${index}`}><span></span><span></span><span></span><span></span></div>)}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function SlotStructureTab({ structures, setStructures }) {
  const [form, setForm] = useState({ doctor: "<ALL>", days: ["Mon"], start: "09:00", end: "19:00", duration: 10 });
  const [slots, setSlots] = useState(() => makeSlots({ start: "09:00", end: "19:00", duration: 10 }));
  const [selectedId, setSelectedId] = useState("");
  const [sessions, setSessions] = useState([]);
  const [draft, setDraft] = useState({ session: 1, from: 1, to: 5 });
  const [mode, setMode] = useState("select");
  const [slotPickMode, setSlotPickMode] = useState("");
  const [breakConfirmed, setBreakConfirmed] = useState(false);
  const [bufferConfirmed, setBufferConfirmed] = useState(false);
  const [reportedDuration, setReportedDuration] = useState("00:15:00");
  const [reminders, setReminders] = useState(["00:00:01", "07:00:00", "00:01:00", "00:30:00", "00:00:01"]);
  const [patientAppEnabled, setPatientAppEnabled] = useState(true);
  const counts = useMemo(() => ({ total: slots.length, break: slots.filter(s => s.status === "break").length, buffer: slots.filter(s => s.status === "buffer").length, free: slots.filter(s => s.status === "free").length }), [slots]);
  const slotColumns = useMemo(() => {
    const columns = [];
    for (let index = 0; index < slots.length; index += 30) columns.push(slots.slice(index, index + 30));
    return columns;
  }, [slots]);
  const load = id => {
    const item = structures.find(s => s.id === id);
    if (!item) return;
    setSelectedId(id); setForm({ doctor: item.doctor, days: item.days, start: item.start, end: item.end, duration: item.duration }); setSlots(item.slots); setSessions(item.sessions || []);
    setBreakConfirmed(item.slots.some(slot => slot.status === "break"));
    setBufferConfirmed(item.slots.some(slot => slot.status === "buffer"));
  };
  const resetDraft = () => {
    setSelectedId("");
    setMode("new");
    setSlotPickMode("");
    setBreakConfirmed(false);
    setBufferConfirmed(false);
    setSessions([]);
    setForm({ doctor: "<ALL>", days: ["Mon"], start: "09:00", end: "19:00", duration: 10 });
    setSlots(makeSlots({ start: "09:00", end: "19:00", duration: 10 }));
  };
  const cancel = () => {
    setMode("select");
    setSlotPickMode("");
    if (selectedId) load(selectedId);
  };
  const removeSelected = () => {
    if (!selectedId) return;
    setStructures(current => current.filter(item => item.id !== selectedId));
    resetDraft();
  };
  const generate = () => {
    setSlots(makeSlots(form));
    setBreakConfirmed(false);
    setBufferConfirmed(false);
    setSlotPickMode("");
  };
  const toggleSlot = token => {
    if (!slotPickMode) return;
    setSlots(current => current.map(slot => {
      if (slot.token !== token) return slot;
      if (slot.status === slotPickMode) return { ...slot, status: "free", patient: "" };
      if (slot.status !== "free") return slot;
      return { ...slot, status: slotPickMode, patient: slotPickMode === "break" ? "Tea Break" : "Buffer time" };
    }));
  };
  const createSession = () => {
    const from = Number(draft.from);
    const to = Number(draft.to);
    if (!from || !to || from > to) return;
    setSessions(current => [...current.filter(item => Number(item.session) !== Number(draft.session)), draft]);
    setSlots(current => current.map(slot => slot.token >= from && slot.token <= to ? { ...slot, session: `Session ${draft.session}` } : slot));
  };
  const deleteSession = () => {
    setSessions(current => current.filter(item => Number(item.session) !== Number(draft.session)));
    setSlots(current => current.map(slot => slot.session === `Session ${draft.session}` ? { ...slot, session: "" } : slot));
  };
  const save = () => {
    const id = selectedId || `structure-${Date.now()}`;
    const item = { id, ...form, slots, sessions };
    setStructures(current => {
      const next = current.some(s => s.id === id) ? current.map(s => s.id === id ? item : s) : [item, ...current];
      return next.slice(0, 10);
    });
    setSelectedId(id);
    setMode("select");
  };
  return (
    <div className="slot-options-app">
      <section className="slot-options-panel">
        <header className="slot-options-head"><h2>Slot Options</h2><div><button type="button" onClick={resetDraft}>New</button><button type="button" onClick={() => setMode("select")}>Select</button><button type="button" disabled={!selectedId} onClick={() => setMode("modify")}>Modify</button><button type="button" disabled={!selectedId} onClick={removeSelected}>Delete</button><button type="button" disabled={mode === "select" && !slotPickMode} onClick={cancel}>Cancel</button></div></header>
        <div className="slot-options-body">
          <section className="slot-options-section"><h3>Doctor & Slot Structure</h3><div className="slot-options-grid">
            <label>Doctor Name</label><select value={form.doctor} onChange={e => setForm({ ...form, doctor: e.target.value })}><option>&lt;ALL&gt;</option>{DOCTORS.map(name => <option key={name}>{name}</option>)}</select>
            <label>Structure Name</label><div className="slot-structure-row"><select value={selectedId} onChange={e => e.target.value ? load(e.target.value) : setSelectedId("")}><option value="">Select Structure</option>{structures.map((item, index) => <option key={item.id} value={item.id}>{index + 1}. {item.doctor}: ({item.days.join("-")})</option>)}</select><button type="button" disabled={!selectedId} onClick={() => load(selectedId)}>Show</button></div>
            <label>Week-Days</label><div className="slot-day-grid">{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => <label key={day} className="slot-day"><input type="checkbox" checked={form.days.includes(day)} onChange={() => setForm(current => ({ ...current, days: current.days.includes(day) ? current.days.filter(item => item !== day) : [...current.days, day] }))} />{day}</label>)}</div>
          </div></section>
          <section className="slot-options-section"><h3>OP Timing</h3><div className="slot-timing-grid">
            <label>OP Start Time</label><input type="time" value={form.start} onChange={e => setForm({ ...form, start: e.target.value })} />
            <label>OP End Time</label><input type="time" value={form.end} onChange={e => setForm({ ...form, end: e.target.value })} />
            <div className="slot-working-period"><span>OP Working Period</span><strong>10 Hrs. 00 Mts.</strong></div>
            <label>Single OP Duration</label><div><input type="number" min="1" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} /> Mts.<button type="button" onClick={generate}>Generate</button></div>
          </div></section>
          <section className="slot-options-section"><h3>Generated Structure</h3><div className="slot-generated-grid">
            <span>Total Slots</span><strong>{counts.total}</strong>
            <span>Break Slots</span><div><button type="button" className="break" disabled={slotPickMode === "buffer"} onClick={() => { setBreakConfirmed(false); setSlotPickMode("break"); }}>Start</button><button type="button" className="break" disabled={slotPickMode !== "break"} onClick={() => { setBreakConfirmed(true); setSlotPickMode(""); }}>Confirm</button><b>{breakConfirmed ? "Confirmed" : counts.break}</b></div>
            <span>Buffer Slots</span><div><button type="button" className="buffer" disabled={slotPickMode === "break"} onClick={() => { setBufferConfirmed(false); setSlotPickMode("buffer"); }}>Start</button><button type="button" className="buffer" disabled={slotPickMode !== "buffer"} onClick={() => { setBufferConfirmed(true); setSlotPickMode(""); }}>Confirm</button><b>{bufferConfirmed ? "Confirmed" : counts.buffer}</b></div>
            <span>Available Slots</span><strong className="available">{counts.free}</strong>
            <span>Create Session</span><div className="slot-session-controls"><select value={draft.session} onChange={e => setDraft({ ...draft, session: e.target.value })}>{[1, 2, 3, 4, 5].map(n => <option key={n}>{n}</option>)}</select><select value={draft.from} onChange={e => setDraft(current => ({ ...current, from: Number(e.target.value), to: Math.max(Number(e.target.value), Number(current.to)) }))}>{slots.map(slot => <option key={slot.token} value={slot.token}>{compactTime(slot.time)}</option>)}</select><select value={draft.to} onChange={e => setDraft({ ...draft, to: Number(e.target.value) })}>{slots.filter(slot => slot.token >= Number(draft.from)).map(slot => <option key={slot.token} value={slot.token}>{slot.token}. {compactTime(slot.time)}</option>)}</select><button type="button" onClick={createSession}>Go</button><button type="button" onClick={deleteSession}>x</button></div>
          </div><footer><button type="button" onClick={save}>Save Structure</button></footer></section>
          <section className="slot-options-section saved"><h3>Saved Structures</h3><div><span>Structure Saved As</span><input value={selectedId ? structures.find(item => item.id === selectedId)?.doctor || "" : ""} readOnly /></div></section>
        </div>
      </section>
      <section className="time-slots-panel"><header><h2>Time Slots</h2><span>{slotPickMode ? `Select ${slotPickMode} slots` : "Select slots after choosing Fix"}</span></header><div className="time-slot-columns">{slotColumns.map((column, columnIndex) => <div className="time-slot-column" key={columnIndex}><div className="time-slot-head"><span>Slot#</span><span>Time</span></div>{column.map(slot => <label key={slot.token} className={`time-slot-row ${slot.status}`} title={slot.session || ""}><input type="checkbox" checked={["break", "buffer"].includes(slot.status)} disabled={!slotPickMode && !["break", "buffer"].includes(slot.status)} onChange={() => slotPickMode ? toggleSlot(slot.token) : setSlots(current => current.map(item => item.token === slot.token ? { ...item, status: "free", patient: "" } : item))} /><span>{slot.token}</span><strong>{compactTime(slot.time)}</strong></label>)}</div>)}</div></section>
      <section className="slot-operations-panel-react"><header><h2>Slot Operations</h2></header><div className="slot-operations-body-react">
        <section><h3>Reported Time <button type="button">Set</button></h3><div className="reported-duration"><span>Reported Time Duration<small>(Minutes before Appointment Time)</small></span><input value={reportedDuration} onChange={event => setReportedDuration(event.target.value)} /></div></section>
        <section><h3>Reminders to Patient <button type="button">Save</button></h3><div className="reminder-grid">{["Immediately on Confirmation", "On the Appointment Day morning", "Before Reported Time", "Before Reported Time", "Immediately after Reporting"].map((label, index) => <div className="reminder-row" key={label + index}><span>Reminder-{index + 1}</span><input value={reminders[index]} onChange={event => setReminders(current => current.map((item, itemIndex) => itemIndex === index ? event.target.value : item))} /><b>{label}</b><em><button type="button">+</button><button type="button">◎</button><button type="button">⌁</button><button type="button">x</button></em></div>)}</div><div className="message-box">Select Create, View, Modify or Delete above</div><p>0 / 250 Characters</p></section>
        <section><h3>Patient App Interaction</h3><div className="patient-app-row-react"><span>Include Patient Interaction in <u>MedicForMe</u> App</span><button type="button" className={patientAppEnabled ? "enabled" : "disabled"} onClick={() => setPatientAppEnabled(value => !value)}>{patientAppEnabled ? "Enabled" : "Disabled"}</button></div></section>
      </div></section>
    </div>
  );
}

function FixDateToDoctorTab({ structures }) {
  const today = new Date().toISOString().slice(0, 10);
  const [doctor, setDoctor] = useState("Dr. Anand");
  const [autoCreate, setAutoCreate] = useState(true);
  const [rows, setRows] = useState([{ date: "2026-08-21", status: "archived", created: true }, { date: today, status: "free", created: false }, { date: "2026-09-30", status: "free", created: false }, { date: "2026-10-01", status: "fixed", created: true }]);
  const [selectedDate, setSelectedDate] = useState(today);
  const structure = structures.find(item => item.doctor === doctor) || { doctor, ...DOCTOR_TEMPLATES[doctor], slots: makeSlots(DOCTOR_TEMPLATES[doctor]) };
  const row = rows.find(item => item.date === selectedDate) || rows[0];
  const statusClass = row?.status === "fixed" ? "fixed" : row?.status === "archived" ? "archived" : row?.created ? "free-created" : "free-uncreated";
  return (
    <div className="opa-three-col tab4-fix-date-app">
      <Panel title="Doctor Slot Date Manager" subtitle="One dated structure per doctor and date" tone="coral">
        <Section title="Doctor / Date"><div className="opa-form-grid one"><Field label="Doctor"><select value={doctor} onChange={e => setDoctor(e.target.value)}>{DOCTORS.map(name => <option key={name}>{name}</option>)}</select></Field><Field label="Current Date"><input value={today} readOnly /></Field><Field label="Auto Create"><button type="button" className={`opa-toggle ${autoCreate ? "active" : ""}`} onClick={() => setAutoCreate(v => !v)}>{autoCreate ? "Enabled" : "Disabled"}</button></Field></div></Section>
        <div className="opa-manager-grid"><div className="opa-manager-head"><span></span><span>Date</span><span>Booking</span><span>Created</span></div>{rows.map(item => <button key={item.date} type="button" className={`opa-manager-row ${selectedDate === item.date ? "active" : ""} ${item.status}`} onClick={() => setSelectedDate(item.date)}><span><input type="checkbox" checked={item.created} readOnly /></span><span>{item.date}</span><span>{item.created ? item.status : "free"}</span><span>{item.created ? "Yes" : "No"}</span></button>)}</div>
        <div className="opa-footer-actions"><button type="button" disabled={autoCreate || row?.created} onClick={() => setRows(current => current.map(item => item.date === selectedDate ? { ...item, created: true, status: "free" } : item))}>Create Structure</button></div>
      </Panel>
      <Panel title="Time Slots by Date" subtitle="Layer-2 dated slot selection" tone="teal" className={`booking-status-${statusClass}`}><div className="opa-date-band">{dateLabel(selectedDate).toUpperCase()}</div>{!row?.created ? <div className="opa-empty"><CalendarDays size={34} /><h3>Free</h3><p>Dated structure is not created yet.</p></div> : <SlotGrid slots={structure.slots || []} allowEdit={row.status !== "archived"} />}</Panel>
      <Panel title="Appointment Slots" subtitle="Dated booking state" tone="blue" className={`booking-status-${statusClass}`}><div className="opa-watermark">{row?.status === "archived" ? "Archived" : row?.status === "fixed" ? "Fixed" : row?.created ? "Free" : ""}</div><div className="opa-summary-grid compact"><SummaryCell label="Doctor" value={doctor} /><SummaryCell label="Date" value={selectedDate} /><SummaryCell label="Booking" value={row?.status || "free"} /><SummaryCell label="Structure" value={row?.created ? "Created" : "Not Created"} /></div><div className="opa-inline-note">Free means no booking yet, Fixed means a patient booking exists, Archived means earlier than the current hospital date.</div></Panel>
    </div>
  );
}

export default function OPAppointmentsScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Appointment");
  const [patient, setPatient] = useState(null);
  const [booking, setBooking] = useState(appointmentMock.defaultBooking);
  const [slots, setSlots] = useState([]);
  const [selectedToken, setSelectedToken] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [structures, setStructures] = useState(() => [{ id: "seed-dr-anand", doctor: "Dr. Anand", days: ["Mon", "Tue", "Wed", "Thu", "Fri"], start: "09:00", end: "16:30", duration: 15, sessions: [{ session: 1, from: 1, to: 10 }], slots: makeSlots({ start: "09:00", end: "16:30", duration: 15 }, "Mrs. Sowmya Suresh") }]);
  const confirmAppointment = patch => { setBooking(current => ({ ...current, ...patch, status: "booked" })); setShowConfirmation(true); };
  useEffect(() => {
    if (!showConfirmation) return undefined;
    const timer = window.setTimeout(() => setShowConfirmation(false), 5000);
    return () => window.clearTimeout(timer);
  }, [showConfirmation]);

  return (
    <main className="op-appointments-screen">
      <style>{styles}</style>
      <style>{appointmentFlowStyles}</style>
      <style>{preliminaryFlowStyles}</style>
      <div className="opa-window">
        <header className="opa-titlebar">
          <button type="button" onClick={() => navigate("/main-menu-2")}><ArrowLeft size={16} /> Main Menu</button>
          <div className="opa-brand">Trident Skiode - E Medic</div>
          <span>Duty Staff: <strong>{booking.staff}</strong></span>
        </header>
        <nav className="opa-tabs">{TABS.map(tab => <button key={tab} type="button" className={activeTab === tab ? "active" : ""} onClick={() => setActiveTab(tab)}>{tab}</button>)}</nav>
        <div className="opa-content">
          {activeTab === "Appointment" && <AppointmentTab booking={booking} setBooking={setBooking} patient={patient} setPatient={setPatient} slots={slots} setSlots={setSlots} selectedToken={selectedToken} setSelectedToken={setSelectedToken} structures={structures} confirmAppointment={confirmAppointment} />}
          {activeTab === "Preliminary Checkup" && <PreliminaryCheckupTab booking={booking} setBooking={setBooking} />}
          {activeTab === "Slot Structure" && <SlotStructureTab structures={structures} setStructures={setStructures} />}
          {activeTab === "Fix Date to Doctor" && <FixDateToDoctorTab structures={structures} />}
        </div>
      </div>
      {showConfirmation && <div className="opa-modal" role="dialog" aria-modal="true"><section className="opa-confirm-card"><button type="button" className="opa-confirm-close" aria-label="Close confirmation" onClick={() => setShowConfirmation(false)}><X size={16} /></button><div className="opa-confirm-head"><Check size={32} /><div><h2>Appointment confirmed successfully</h2><p>The selected token is booked and reminders are scheduled.</p></div></div><div className="opa-confirm-summary"><span>Patient</span><strong>{patient?.name}</strong><span>Doctor</span><strong>{booking.doctor}</strong><span>Appointment Date</span><strong>{booking.date}</strong><span>Token</span><strong>{booking.token}</strong><span>Time Slot</span><strong>{booking.time}</strong><span>Reporting Time</span><strong>{booking.reportingTime}</strong></div><footer className="opa-confirm-actions"><button type="button" onClick={() => setShowConfirmation(false)}>View Appointment</button><button type="button" className="primary" onClick={() => { setShowConfirmation(false); setPatient(null); setSlots([]); setSelectedToken(""); setBooking(appointmentMock.defaultBooking); }}>New Appointment</button></footer></section></div>}
    </main>
  );
}

const styles = `
.opa-confirm-card{position:relative}.opa-confirm-close{position:absolute;right:10px;top:10px;z-index:1;width:28px;height:28px;border:1px solid #b8d7c8;border-radius:4px;background:#fff;color:#176c58;display:grid;place-items:center;padding:0;cursor:pointer}.opa-confirm-close:hover{background:#f0faf5}.opa-confirm-card .opa-confirm-head{padding-right:56px}
.slot-options-app{height:100%;display:grid;grid-template-columns:545px minmax(520px,1.35fr) 545px;gap:14px;align-items:start}.slot-options-panel,.time-slots-panel,.slot-operations-panel-react{height:768px;border:1px solid #cfd8e3;border-radius:7px;background:#fff;overflow:hidden}.slot-options-head,.time-slots-panel>header,.slot-operations-panel-react>header{height:43px;display:flex;align-items:center;justify-content:space-between;background:#eef1f4;border-bottom:1px solid #cfd8e3;padding:0 13px}.slot-options-head h2,.time-slots-panel h2,.slot-operations-panel-react h2{margin:0;color:#102b42;font-size:18px;font-weight:800}.slot-options-head div{display:flex;gap:6px}.slot-options-head button,.slot-options-section button,.slot-operations-body-react button{height:26px;border:1px solid #23864d;border-radius:4px;background:#2f9b57;color:#fff;padding:0 10px;font-size:11px;font-weight:700}.slot-options-head button:disabled,.slot-options-section button:disabled{background:#c7d2cc;border-color:#c7d2cc;color:#fff}.slot-options-body{height:calc(100% - 43px);padding:10px 12px;overflow:auto}.slot-options-section{border:1px solid #d2dae3;border-radius:6px;background:#fff;margin-bottom:10px;overflow:hidden}.slot-options-section h3{height:30px;margin:0;display:flex;align-items:center;background:#f5f6f8;border-bottom:1px solid #d2dae3;padding:0 10px;color:#445163;font-size:12px;font-weight:800}.slot-options-grid,.slot-timing-grid,.slot-generated-grid{display:grid;grid-template-columns:165px minmax(0,1fr);align-items:center}.slot-options-grid>label,.slot-timing-grid>label,.slot-generated-grid>span,.slot-options-section.saved span{min-height:38px;display:flex;align-items:center;background:#e6e7e9;border-bottom:1px solid #fff;padding:0 10px;color:#1f2937;font-size:12px}.slot-options-grid select,.slot-timing-grid input,.slot-generated-grid select,.slot-generated-grid input,.slot-options-section.saved input{height:29px;border:1px solid #cbd5df;border-radius:4px;background:#fff;padding:0 8px;font:12px Inter;color:#111827}.slot-options-grid>select,.slot-options-grid>.slot-structure-row,.slot-day-grid,.slot-timing-grid>input,.slot-timing-grid>div:not(.slot-working-period),.slot-generated-grid>div,.slot-generated-grid>strong,.slot-options-section.saved div{min-height:38px;display:flex;align-items:center;gap:7px;border-bottom:1px solid #eef1f3;padding:4px 8px}.slot-structure-row select{flex:1}.slot-structure-row button{background:#f6dddd;border-color:#e9c2c2;color:#b85858}.slot-day-grid{flex-wrap:wrap}.slot-day{height:25px;display:inline-flex;align-items:center;gap:4px;background:#dbeafe;border:1px solid #bed7f8;border-radius:5px;padding:0 7px;font-size:11px}.slot-timing-grid{position:relative;grid-template-columns:165px 118px 1fr}.slot-working-period{grid-column:3;grid-row:1 / span 2;align-self:stretch;display:grid;grid-template-rows:1fr 1fr;border-left:1px solid #cfd8e3}.slot-working-period span{display:grid;place-items:center;background:#e6e7e9;font-size:12px}.slot-working-period strong{display:grid;place-items:center;font-size:12px;font-weight:500}.slot-timing-grid label:nth-of-type(3){grid-column:1}.slot-timing-grid label:nth-of-type(3)+div{grid-column:2 / span 2}.slot-timing-grid input[type=number]{width:64px}.slot-timing-grid button{margin-left:auto;background:#b99bd0;border-color:#a883c4;color:#291c36}.slot-generated-grid strong{justify-content:flex-end;font-size:18px}.slot-generated-grid button.break{background:#e58f8f;border-color:#df8181}.slot-generated-grid button.buffer{background:#78b88f;border-color:#68ad81}.slot-generated-grid b{margin-left:auto;color:#d93636}.slot-generated-grid .available{color:#245ec2}.slot-session-controls{width:100%;display:flex}.slot-session-controls select{width:78px}.slot-session-controls button:last-child{background:#fff;border-color:#e4c0c0;color:#b93636}.slot-options-section footer{display:flex;justify-content:flex-end;padding:8px}.slot-options-section footer button{background:#b99bd0;border-color:#a883c4;color:#291c36}.slot-options-section.saved div{display:grid;grid-template-columns:165px 1fr;padding:0}.slot-options-section.saved input{margin:5px 8px}.time-slots-panel>header span{font-size:11px;color:#667085}.time-slot-columns{height:calc(100% - 43px);display:flex;align-items:flex-start;gap:0;padding:8px;overflow:auto}.time-slot-column{width:180px;border-right:1px solid #cfd8e3}.time-slot-head,.time-slot-row{display:grid;grid-template-columns:30px 52px 1fr;align-items:center}.time-slot-head{height:30px;background:#d7e6f5;color:#083b64;font-size:12px;font-weight:800}.time-slot-head span:first-child{grid-column:1 / span 2;text-align:center}.time-slot-row{height:24px;border-bottom:1px solid #edf0f3;color:#004b8d;font-size:12px}.time-slot-row input{margin-left:7px}.time-slot-row strong{font-weight:500;color:#004b8d}.time-slot-row.break{background:#fbe5e5}.time-slot-row.break strong{color:#e51b2b;font-weight:800}.time-slot-row.buffer{background:#e4f3df}.time-slot-row.buffer strong{color:#0a9d31;font-weight:800}.slot-operations-body-react{height:calc(100% - 43px);padding:10px 12px;overflow:auto}.slot-operations-body-react section{border:1px solid #cfd8e3;background:#fff;margin-bottom:14px}.slot-operations-body-react h3{height:32px;margin:0;display:flex;align-items:center;justify-content:space-between;background:#e6e7e9;border-bottom:1px solid #cfd8e3;padding:0 10px;font-size:13px}.slot-operations-body-react h3 button{background:#dff2e3;border-color:#9dd6ad;color:#176c3a}.reported-duration{display:grid;grid-template-columns:210px 1fr;min-height:50px}.reported-duration span{display:flex;flex-direction:column;justify-content:center;background:#e6e7e9;padding:0 10px;font-size:12px}.reported-duration small{font-size:9px;color:#667085}.reported-duration input{width:72px;height:29px;margin:10px;border:1px solid #cbd5df;border-radius:4px;text-align:center}.reminder-grid{display:grid}.reminder-row{display:grid;grid-template-columns:90px 86px minmax(0,1fr) 118px;align-items:center;min-height:34px;border-bottom:1px solid #dbe3eb;font-size:12px}.reminder-row span{padding-left:10px}.reminder-row input{width:70px;height:26px;border:1px solid #cbd5df;border-radius:4px;text-align:center}.reminder-row b{font-weight:500}.reminder-row em{display:flex;gap:5px;justify-content:center;font-style:normal;color:#102b42}.reminder-row em button{width:22px;height:22px;padding:0;background:#fff;border-color:#cbd5df;color:#102b42}.message-box{height:148px;margin:10px;border:1px solid #cbd5df;border-radius:4px;background:#f8fafc;color:#667085;padding:10px;font-size:11px}.slot-operations-body-react p{text-align:right;margin:0 10px 8px;color:#4b5563;font-size:11px}.patient-app-row-react{display:grid;grid-template-columns:1fr 120px;align-items:center;min-height:50px}.patient-app-row-react span{padding:0 10px}.patient-app-row-react button{justify-self:center;border-radius:999px;padding:6px 14px}.patient-app-row-react button.enabled{background:#2f9b57;border-color:#2f9b57;color:#fff}.patient-app-row-react button.disabled{background:#e5e7eb;border-color:#cbd5df;color:#475569}
.op-appointments-screen{height:100vh;min-width:1180px;background:#e9edf2;color:#1f2937;font:13px Inter;overflow:hidden}.op-appointments-screen *{box-sizing:border-box}.opa-window{height:100%;display:flex;flex-direction:column;background:#fff}.opa-titlebar{height:47px;flex:0 0 47px;display:flex;align-items:center;justify-content:space-between;background:linear-gradient(135deg,var(--color-sidebar-bg,#0d5d7b) 0%,#0a4a6e 100%);color:#fff;padding:0 16px}.opa-titlebar button{height:30px;border:1px solid rgba(255,255,255,.25);background:rgba(255,255,255,.08);color:#fff;border-radius:6px;padding:0 10px;display:inline-flex;align-items:center;gap:6px;font:12px Inter;cursor:pointer}.opa-titlebar button:hover{background:rgba(255,255,255,.15)}.opa-titlebar .opa-brand{font-size:20px;font-weight:500;letter-spacing:.5px}.opa-titlebar>span{font-size:13px;color:rgba(255,255,255,.9)}.opa-titlebar>span strong{color:#fff}.opa-tabs{height:52px;background:#fff;border-bottom:1px solid #d7dde5;display:flex;align-items:flex-end;padding:0 18px;gap:22px;box-shadow:0 1px 2px rgba(15,23,42,.04)}.opa-tabs button{position:relative;height:52px;padding:0 2px;border:0;background:transparent;color:#64748b;font-size:14px;font-weight:650;cursor:pointer;transition:color .2s ease,transform .2s ease}.opa-tabs button::after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:3px;border-radius:999px 999px 0 0;background:#0f8587;transform:scaleX(0);transform-origin:center;transition:transform .24s ease}.opa-tabs button:hover{color:#0f5f6f;transform:translateY(-1px)}.opa-tabs button.active{color:#0f3443;font-weight:800}.opa-tabs button.active::after{transform:scaleX(1)}.opa-content{flex:1;min-height:0;background:#fff;padding:14px;overflow:auto}.opa-appointment-minimal{height:100%;display:grid;grid-template-columns:545px 724px;gap:14px;align-items:start}.opa-booking-card{height:768px;border:1px solid #d2dae3;background:#fff}.opa-booking-head{height:41px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #d2dae3;background:#f7f9fb;padding:0 13px}.opa-booking-head h2{margin:0;font-size:16px}.opa-booking-actions{display:flex;align-items:center;gap:4px}.opa-booking-actions button{height:26px;border:1px solid #c8d3df;background:#eef2f6;color:#8b98a6;border-radius:2px;padding:0 9px;font-size:11px;font-weight:700}.opa-booking-actions button.active{background:#0f8587;border-color:#0f8587;color:#fff}.opa-booking-actions button.add{width:26px;padding:0;background:#e9fff0;border-color:#16a34a;color:#057a35;display:flex;align-items:center;justify-content:center}.opa-booking-actions button:disabled{opacity:.85}.opa-request-box{height:auto;min-height:311px;margin:10px 8px;border:1px solid #d2dae3;background:#fff}.opa-request-title{height:42px;display:flex;align-items:center;justify-content:space-between;background:#f3f8fc;padding:0 10px}.opa-request-title strong{color:#102b42;font-size:12px}.opa-request-title select{width:110px}.opa-request-grid{display:grid;grid-template-columns:80px 164px 80px 164px;gap:7px 6px;padding:7px}.opa-request-grid label{height:26px;display:flex;align-items:center;background:#e5e8ec;color:#102b42;padding:0 6px;font-size:12px}.opa-request-grid input,.opa-request-grid select,.opa-request-title select{height:28px;border:1px solid #cbd5df;border-radius:4px;background:#f3f6fa;padding:0 8px;font:12px Inter;color:#111827}.opa-request-grid select,.opa-request-title select{font-family:Inter}.opa-appointment-empty{height:768px;border:1px solid #d2dae3;background:#fff;overflow:hidden}.opa-appointment-workspace-head{height:41px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #d2dae3;background:#f7f9fb;padding:0 13px}.opa-appointment-workspace-head h2{margin:0;color:#102b42;font-size:16px}.opa-appointment-workspace-head span{color:#52606d;font-size:11px}.opa-patient-master-card{margin:8px;border:1px solid #ccd7e2;background:#fbfdff}.opa-patient-master-title{height:31px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #d8e2ea;background:#f3f8fc;padding:0 9px}.opa-patient-master-title strong{color:#102b42}.opa-patient-master-title span{color:#0f8587;font-weight:700}.opa-patient-master-grid{display:grid;grid-template-columns:76px minmax(0,1fr) 78px minmax(0,1fr);gap:0;border-bottom:1px solid #d8e2ea}.opa-patient-master-grid span,.opa-patient-master-grid strong{min-height:27px;display:flex;align-items:center;padding:0 7px;border-right:1px solid #e3e9ef;border-bottom:1px solid #e3e9ef;min-width:0}.opa-patient-master-grid span{background:#e8edf2;color:#40536a;font-size:11px}.opa-patient-master-grid strong{font-size:11px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.opa-patient-master-address{white-space:pre-line;padding:7px 9px;color:#304154;font-size:11px;line-height:1.35}.opa-panel{min-width:0;min-height:0;display:flex;flex-direction:column;border:1px solid #d6dee5;border-radius:8px;background:#fff;overflow:hidden;box-shadow:0 2px 6px rgba(30,42,56,.05);position:relative}.opa-panel-title{height:42px;flex:0 0 42px;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:0 12px;border-bottom:1px solid #d6dee5;background:#eef1f4}.opa-panel-title.coral{background:#eb6367;color:#fff}.opa-panel-title.blue{background:#679cbc;color:#fff}.opa-panel-title.teal{background:#73bfb8;color:#fff}.opa-panel-title h2{margin:0;font-size:16px}.opa-panel-title p{margin:1px 0 0;font-size:10px;opacity:.82}.opa-panel-actions{display:flex;gap:6px}.opa-panel-actions input{height:27px;border:1px solid #c7d0d8;border-radius:4px;padding:0 8px}.opa-panel-body{flex:1;min-height:0;overflow:auto;padding:8px}.opa-three-col{height:100%;display:grid;grid-template-columns:minmax(0,30fr) minmax(0,40fr) minmax(0,30fr);gap:12px}.opa-section{border:1px solid #dde2e7;border-radius:7px;background:#fff;margin-bottom:8px;overflow:hidden}.opa-section-head{min-height:31px;background:#f6f7f9;border-bottom:1px solid #e3e7eb;display:flex;align-items:center;justify-content:space-between;padding:5px 8px;font-size:12px;font-weight:700;color:#334b62}.opa-section-actions{display:flex;gap:4px}.opa-section-actions button,.opa-footer-actions button,.opa-inline-controls button,.opa-session-row button{height:27px;border:1px solid #2f7f80;background:#238486;color:#fff;border-radius:3px;padding:0 8px;font-size:11px;font-weight:700;display:inline-flex;align-items:center;gap:4px}.opa-section-body{padding:8px}.opa-form-grid{display:grid;gap:7px 10px}.opa-form-grid.two{grid-template-columns:repeat(2,minmax(0,1fr))}.opa-form-grid.one{grid-template-columns:1fr}.opa-field{display:grid;grid-template-columns:110px minmax(0,1fr);align-items:center;gap:6px;min-height:30px}.opa-field>span{font-weight:700;color:#26394c}.opa-field input,.opa-field select,.opa-field textarea,.opa-textarea{width:100%;height:28px;border:1px solid #cbd5de;border-radius:4px;background:#fff;padding:0 7px;font:inherit;color:#25374a}.opa-patient-card{display:grid;grid-template-columns:minmax(0,1fr) 120px;gap:8px;margin-top:8px}.opa-demographic{border:1px solid #cbd5de;background:#fbfcfd;padding:7px;font-size:11px;line-height:1.45}.opa-demographic strong,.opa-demographic span{display:block}.opa-demographic p{margin:4px 0 0}.opa-reminder-grid,.opa-vitals-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}.opa-reminder-grid div,.opa-vital-tile{border:1px solid #d6dee5;border-radius:6px;background:#fbfcfd;padding:7px}.opa-reminder-grid span,.opa-vital-tile span{display:block;color:#66727f;font-size:11px;font-weight:700}.opa-reminder-grid strong{display:block;color:#18794e;margin-top:3px}.opa-vital-tile input:not([type=checkbox]){margin-top:5px;width:100%;height:28px;border:1px solid #cbd5de;border-radius:4px;padding:0 7px}.opa-footer-actions{display:flex;justify-content:flex-end;gap:7px;padding:7px 0 0}.opa-footer-actions.split{justify-content:space-between}.opa-footer-actions button{background:#fff;color:#34424e;border-color:#c5ced8}.opa-footer-actions button.primary,.opa-section-actions button{background:#73bfb8;border-color:#42978f;color:#fff}.opa-footer-actions button:disabled,.opa-section-actions button:disabled{opacity:.45;cursor:not-allowed}.opa-summary-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));border-bottom:1px solid #d5e0e7;background:#f3f7fb}.opa-summary-grid.compact{border:1px solid #d6dee5;margin:0 8px 7px}.opa-summary-cell{min-width:0;display:flex;align-items:center;gap:7px;border-right:1px solid #d5e0e7;border-bottom:1px solid #d5e0e7;padding:8px 10px}.opa-summary-cell span{min-width:78px;font-size:11px;font-weight:700;color:#142433}.opa-summary-cell strong{font-size:11px;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.opa-legend{min-height:31px;border-bottom:1px solid #b9cbd7;background:#f4f8fb;display:flex;align-items:center;gap:14px;padding:0 10px;font-size:11px;color:#52606d}.opa-legend span{display:flex;align-items:center;gap:4px}.opa-legend i{width:9px;height:9px;border:1px solid #cfd7de;border-radius:2px}.opa-legend .booked{background:#e3edf7}.opa-legend .free{background:#e6f8ed}.opa-legend .break{background:#fff1ce}.opa-legend .buffer{background:#efe4f5}.opa-legend .hold{background:#fff7d6}.opa-date-band{height:34px;display:flex;align-items:center;justify-content:center;background:linear-gradient(90deg,#126c76,#0d7475);color:#fff;font-size:12px;font-weight:750}.opa-slot-grid{height:calc(100% - 196px);min-height:260px;display:flex;flex-direction:column;border-top:1px solid #b9cbd7}.opa-slot-head,.opa-slot-row{display:grid;grid-template-columns:82px 135px 112px minmax(0,1fr) 78px;align-items:center}.opa-slot-head{height:35px;background:#70a6c4;color:#fff;font-weight:700;text-align:center}.opa-slot-head span:nth-child(4){text-align:left}.opa-slot-rows{flex:1;overflow:auto}.opa-slot-row{min-height:36px;border-bottom:1px solid #d9e3e9;font-size:12px}.opa-slot-row:nth-child(even){background:#fbfdfe}.opa-slot-row>div{padding:4px 8px;text-align:center}.opa-slot-row>div:nth-child(4){text-align:left}.opa-slot-row.break{background:#fff1ce}.opa-slot-row.buffer{background:#efe4f5}.opa-slot-row.booked{background:#e3edf7}.opa-slot-row.hold,.opa-slot-row.block{background:#fff7d6}.opa-slot-row.selected{box-shadow:inset 0 0 0 2px #73bfb8}.opa-token{display:flex;align-items:center;justify-content:center;gap:5px}.opa-status-chip{display:inline-flex;min-width:58px;justify-content:center;border-radius:3px;padding:4px 7px;font-size:10px;font-weight:700;text-transform:capitalize}.opa-status-chip.booked{background:#e6f0ff;color:#1260d5}.opa-status-chip.free{background:#e6f8ed;color:#16854a}.opa-status-chip.break{background:#fff0d5;color:#d67500}.opa-status-chip.buffer{background:#f1e5fa;color:#8954b9}.opa-status-chip.hold,.opa-status-chip.block{background:#fff0b8;color:#8a6200}.opa-status-chip.treated,.opa-status-chip.parked,.opa-status-chip.ready,.opa-status-chip.reported{background:#e5e7eb;color:#374151}.opa-slot-row input{width:100%;height:26px;border:0;background:transparent;padding:0 6px;font:inherit}.opa-slot-row input:focus{outline:1px solid #73bfb8;background:#fff}.opa-icon-button{height:25px;width:28px;border:1px solid #c6d3dc;background:#fff;color:#203b4c;display:inline-flex;align-items:center;justify-content:center}.opa-slot-action-cell{position:relative}.opa-popover{position:absolute;right:8px;top:30px;z-index:30;width:170px;border:1px solid #b9cbd7;border-radius:6px;background:#fff;padding:4px;box-shadow:0 8px 24px #173c5530;text-align:left}.opa-popover button{display:block;width:100%;height:28px;border:0;background:#fff;text-align:left;padding:0 8px;font-size:11px}.opa-popover .danger{color:#a33b3b}.opa-prev-head,.opa-prev-row{display:grid;grid-template-columns:82px 70px 125px 130px 130px 120px 80px}.opa-prev-head{height:34px;background:#dcebf8;color:#1f4e82;font-weight:700}.opa-prev-head span,.opa-prev-row span{display:flex;align-items:center;padding:0 8px;border-right:1px solid #d3dde7;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.opa-prev-row{height:32px;border-bottom:1px solid #d9e1e8}.opa-inline-note{border:1px solid #cce0ee;background:#f4faff;color:#355468;border-radius:6px;padding:8px 10px;margin:8px 7px;font-size:11px}.opa-inline-note.success{display:flex;align-items:center;gap:6px;color:#18794e;background:#effbf4;border-color:#b9ddc5}.opa-textarea{height:120px;padding:8px;resize:none}.opa-day-list{display:flex;gap:4px;flex-wrap:wrap}.opa-day-list label{background:#dbeafe;border:1px solid #c4daf8;border-radius:5px;padding:3px 5px;font-size:11px}.opa-inline-controls{display:flex;gap:6px;align-items:center}.opa-generated-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));border:1px solid #d6dee5}.opa-session-row{display:flex;align-items:center;gap:6px;min-height:40px;border:1px solid #d6dee5;background:#fbfcfd;padding:6px;margin-bottom:7px}.opa-session-row span{font-weight:700;margin-right:auto}.opa-session-row select,.opa-session-row input{height:28px;border:1px solid #cbd5de;border-radius:4px;padding:0 6px;width:68px}.opa-saved-list{display:flex;flex-direction:column;gap:6px}.opa-saved-list button{border:1px solid #d6dee5;background:#fff;text-align:left;padding:8px;border-radius:5px}.opa-saved-list button.active{border-color:#73bfb8;background:#effbf8}.opa-saved-list strong,.opa-saved-list span{display:block}.opa-saved-list span{margin-top:3px;color:#66727f;font-size:11px}.opa-empty,.opa-empty-inline{display:flex;align-items:center;justify-content:center;flex-direction:column;min-height:220px;color:#66727f;text-align:center}.opa-empty h3{margin:10px 0 4px;color:#1f2937}.opa-manager-grid{border:1px solid #d6dee5;border-radius:6px;overflow:hidden}.opa-manager-head,.opa-manager-row{display:grid;grid-template-columns:42px 1fr 88px 74px;align-items:center}.opa-manager-head{height:32px;background:#dcebf8;color:#1f4e82;font-weight:700}.opa-manager-row{height:34px;border:0;border-bottom:1px solid #d9e1e8;background:#fff;text-align:left}.opa-manager-row.active{background:#eff8fd}.opa-manager-row.fixed span:nth-child(3){color:#c62828;font-weight:700}.opa-manager-row.archived span:nth-child(3){color:#a98500;font-weight:700}.opa-manager-row.free span:nth-child(3){color:#16803a}.opa-manager-head span,.opa-manager-row span{padding:0 8px}.opa-toggle{height:28px;border:1px solid #9aa1a8;border-radius:14px;background:#b7bcc2;color:#fff;padding:0 12px}.opa-toggle.active{background:#3a9d5d;border-color:#2d7f4a}.opa-watermark{position:absolute;left:50%;top:56%;transform:translate(-50%,-50%) rotate(-45deg);font-size:44px;font-weight:800;opacity:.14;pointer-events:none}.booking-status-fixed .opa-watermark{color:#dc2626}.booking-status-archived .opa-watermark{color:#c9a600}.booking-status-free-created .opa-watermark{color:#16a34a}.opa-modal{position:fixed;inset:0;z-index:200;display:grid;place-items:center;background:#102a3a73;padding:24px}.opa-confirm-card{width:min(520px,94vw);overflow:hidden;border-radius:12px;background:#fff;box-shadow:0 24px 70px #102a3a4d}.opa-confirm-head{display:flex;align-items:center;gap:12px;padding:18px 20px;background:#e5f5f0;color:#176c58}.opa-confirm-head h2,.opa-confirm-head p{margin:0}.opa-confirm-summary{display:grid;grid-template-columns:140px 1fr;gap:10px 16px;padding:20px}.opa-confirm-summary span{color:#66727f}.opa-confirm-actions{display:flex;justify-content:flex-end;gap:8px;border-top:1px solid #d6dee5;padding:12px 20px}.opa-confirm-actions button{height:32px;border:1px solid #c5ced8;background:#fff;padding:0 14px}.opa-confirm-actions .primary{background:#73bfb8;border-color:#73bfb8;color:#fff}.opa-prelim-layout{height:100%;display:grid;grid-template-columns:545px minmax(520px,1fr) 545px;gap:14px;align-items:start}.opa-medical-card,.opa-prelim-blank,.opa-prev-info-exact{height:768px;border:1px solid #d2dae3;background:#fff;min-width:0}.opa-medical-head,.opa-prev-exact-head{height:41px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #d2dae3;background:#f7f9fb;padding:0 13px}.opa-medical-head h2,.opa-prev-exact-head h2{margin:0;color:#102b42;font-size:16px;font-weight:800}.opa-prev-exact-head p{margin:1px 0 0;color:#718094;font-size:8px;font-weight:500}.opa-reported-box{height:152px;margin:10px 8px;border:1px solid #d2dae3;background:#fff}.opa-reported-head{height:40px;display:flex;align-items:center;justify-content:space-between;background:#f3f8fc;padding:0 8px}.opa-reported-head strong{color:#102b42;font-size:12px}.opa-reported-actions,.opa-prev-exact-actions{display:flex;align-items:center;gap:4px}.opa-reported-actions button{height:26px;border:1px solid #c8d3df;background:#eef2f6;color:#8b98a6;border-radius:2px;padding:0 9px;font-size:11px}.opa-reported-actions button.active{background:#0f8587;border-color:#0f8587;color:#fff}.opa-reported-actions button:disabled{opacity:.82}.opa-reported-grid{display:grid;grid-template-columns:80px 164px 80px 164px;gap:7px 6px;padding:7px}.opa-reported-grid label{height:26px;display:flex;align-items:center;background:#e5e8ec;color:#102b42;padding:0 6px;font-size:12px;white-space:nowrap}.opa-reported-grid input,.opa-reported-grid select{height:28px;border:1px solid #cbd5df;border-radius:4px;background:#f3f6fa;padding:0 8px;font:12px Inter;color:#111827}.opa-reported-grid input{font-family:Inter}.opa-reported-grid .opa-staff-select{border-color:#111;box-shadow:0 0 0 1px #111;background:#fff}.opa-reported-grid .opa-invalid-select{border-color:#ef7171;background:#fde8e8;color:#dc2626}.opa-cell-spacer{height:26px}.opa-prev-exact-actions button{height:25px;border:1px solid #c8d3df;background:#fff;border-radius:3px;color:#40536a;font-size:11px;padding:0 9px}.opa-prev-patient{height:31px;display:flex;align-items:center;border-bottom:1px solid #d2dae3;background:#f6fbff;padding:0 13px;color:#102b42;font-size:12px;font-weight:700}.opa-prev-patient span{font-weight:500;margin-left:4px}.opa-prev-exact-scroll{height:696px;overflow:auto}.opa-prev-exact-grid{min-width:540px}.opa-prev-exact-table-head,.opa-prev-exact-row{display:grid;grid-template-columns:78px 150px 150px 160px}.opa-prev-exact-table-head{height:34px;background:#dcebf8;color:#00467a;font-size:10px;font-weight:800;text-align:center}.opa-prev-exact-table-head span,.opa-prev-exact-row span{display:flex;align-items:center;border-right:1px solid #d3dde7;padding:0 9px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.opa-prev-exact-table-head span{justify-content:center}.opa-prev-exact-row{height:32px;border-bottom:1px solid #d9e1e8;color:#1f4e82;font-size:11px}.opa-prev-exact-row.blank span{color:transparent}@media(max-width:1400px){.opa-three-col{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}.opa-previous{grid-column:1/-1}.opa-summary-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.opa-prelim-layout{grid-template-columns:545px minmax(360px,1fr);overflow:auto}.opa-prev-info-exact{grid-column:1/-1;width:545px}}`; 

const appointmentFlowStyles = `
.opa-appointment-flow{height:100%;display:grid;grid-template-columns:545px 724px;gap:14px;align-items:start;justify-content:start;min-width:0}
.opa-appointment-flow.with-previous{grid-template-columns:545px 724px 545px}
.opa-appointment-flow .opa-booking-card,.opa-appointment-flow .opa-blank-panel,.opa-flow-panel{height:768px;border:1px solid #cfd8e3;background:#fff;min-width:0}
.opa-appointment-flow .opa-booking-card{overflow:hidden}
.opa-appointment-flow .opa-booking-head,.opa-flow-title{height:41px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #cfd8e3;background:#f2f5f8;padding:0 12px}
.opa-flow-title h2,.opa-appointment-flow .opa-booking-head h2{margin:0;color:#102b42;font-size:18px;font-weight:800}
.opa-flow-title p{margin:1px 0 0;color:#426075;font-size:10px}
.opa-appointment-flow .opa-booking-actions button{height:25px;border-radius:2px;background:#f3f6f8;color:#9aa6b2;border:1px solid #cbd5df;padding:0 9px;font-size:12px}
.opa-appointment-flow .opa-booking-actions button.active,.opa-appointment-flow .opa-booking-actions button:not(:disabled):nth-child(n+4):not(.add){background:#07858a;border-color:#07858a;color:#fff}
.opa-appointment-flow .opa-booking-actions button.add{width:25px;padding:0;background:#e7fff0;border-color:#008c4a;color:#008c4a;font-size:16px}
.opa-appointment-flow .opa-request-box{height:312px;min-height:312px;margin:8px;border:1px solid #d2dce6;background:#fff}
.opa-appointment-flow .opa-request-title{height:42px;background:#f4f8fb}
.opa-appointment-flow .opa-request-grid{position:relative;grid-template-columns:80px 164px 80px 164px;gap:7px 6px;padding:7px;align-items:start}
.opa-appointment-flow .opa-request-grid label,.opa-reporting-row label,.opa-additional-body label{height:26px;display:flex;align-items:center;background:#e6e8eb;color:#102b42;padding:0 7px;font-size:12px;white-space:nowrap}
.opa-appointment-flow .opa-request-grid input,.opa-appointment-flow .opa-request-grid select,.opa-appointment-flow .opa-request-title select,.opa-reporting-row input,.opa-reporting-row select,.opa-reporting-row button,.opa-additional-body input,.opa-additional-body select{height:28px;border:1px solid #cbd5df;border-radius:4px;background:#f6f8fb;padding:0 8px;font:12px Inter;color:#111827;min-width:0}
.opa-appointment-flow .opa-danger-select{background:#fdeaea!important;border-color:#ef9f9f!important;color:#dc2626!important}
.opa-appointment-flow .opa-request-grid::before{content:"";position:absolute;left:7px;right:7px;top:74px;height:1px;background:#c8d3df}
.opa-appointment-flow .opa-request-grid>label:nth-of-type(5){grid-column:1;grid-row:3}
.opa-appointment-flow .opa-request-grid>.opa-patient-select{grid-column:2;grid-row:3;width:206px}
.opa-appointment-flow .opa-request-grid>label:nth-of-type(6){grid-column:1;grid-row:4}
.opa-appointment-flow .opa-request-grid>.opa-slot-select{grid-column:2;grid-row:4;width:206px}
.opa-patient-demo-inline{position:absolute;right:18px;top:86px;width:190px;min-height:34px;color:#0f2437;font-size:12px;line-height:1.25;padding:0 4px;text-align:center}
.opa-patient-demo-inline span{padding:0 6px}
.opa-inline-pair{display:grid;grid-template-columns:minmax(0,1fr) 90px;gap:7px}
.opa-phone-msg-label{grid-column:1;grid-row:5}.opa-phone-msg-pair{grid-column:2;grid-row:5;grid-template-columns:110px 90px;justify-self:start;width:207px}
.opa-patient-photo-card{position:absolute;right:56px;top:132px;width:102px;text-align:center;color:#dc2626;font-size:11px;border:1px solid #d6dbe2;border-radius:3px;background:#fff;overflow:hidden}
.opa-patient-avatar{width:100px;height:106px;border:0;display:block;object-fit:cover;background:#f7dce8}
.opa-patient-photo-card strong{display:flex;align-items:center;justify-content:center;min-height:20px;padding:2px 3px;font-size:11px;line-height:1.15;color:#d60000;font-weight:500;text-align:center}
.opa-master-address{grid-column:1 / span 3;grid-row:6;width:335px;height:50px;border:1px solid #111!important;background:#fff!important;resize:none;white-space:pre-line;padding:5px 7px!important;overflow:hidden;font-size:11px;line-height:1.25}
.opa-reporting-box{margin:16px 8px 0;border:1px solid #d2dce6;background:#fff}
.opa-reporting-head{height:42px;display:flex;align-items:center;justify-content:space-between;background:#f4f8fb;border-bottom:1px solid #d2dce6;padding:0 8px}
.opa-reporting-head strong{font-size:13px;color:#102b42}.opa-reporting-head select{width:112px;height:28px}
.opa-reporting-row{display:grid;grid-template-columns:92px 104px 62px 80px 96px;gap:7px;padding:10px 8px}
.opa-additional-box{margin:36px 8px 0;border:1px solid #d2dce6;background:#fff}
.opa-additional-box>label{height:35px;display:flex;align-items:center;gap:8px;background:#f4f8fb;border-bottom:1px solid #d2dce6;padding:0 10px;font-weight:800}
.opa-additional-body{display:grid;grid-template-columns:80px 206px;gap:10px 6px;padding:14px 10px}
.opa-additional-body .opa-inline-pair{grid-template-columns:116px 86px}
.opa-notes-tabs{grid-column:1 / -1;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:31px 78px;margin-top:7px;border:1px solid #cfd8e3}
.opa-notes-tabs button{border:0;border-right:1px solid #cfd8e3;background:#dcebf8;color:#003f72;font:12px Inter}
.opa-notes-tabs button+button{background:#f7f9fb;border-right:0}.opa-notes-tabs textarea{grid-column:1/-1;border:0;resize:none}
.opa-slots-panel{overflow:hidden}.opa-slots-meta{height:52px;display:grid;grid-template-columns:50px minmax(120px,1fr) 45px minmax(260px,1.2fr) 66px 140px;align-items:center;gap:4px;border-bottom:1px solid #d2dce6;background:#fff;padding:0 10px;font-size:12px;white-space:nowrap}
.opa-slots-meta strong{color:#102b42}.opa-slots-meta select{height:28px;border:1px solid #cbd5df;border-radius:3px;background:#fff;font:12px Inter;color:#244058}
.opa-appointment-grid-wrap{height:calc(100% - 93px);overflow-y:auto;overflow-x:hidden;padding:8px}.opa-appointment-grid{width:100%;border:1px solid #cfd8e3}
.opa-appointment-grid-head,.opa-appointment-grid-row{display:grid;grid-template-columns:42px 72px 72px minmax(150px,220px) 66px 66px 66px minmax(78px,1fr);align-items:center}
.opa-appointment-grid-head{height:54px;background:#d7e6f5;color:#003f72;font-size:11px;font-weight:800;text-align:center}
.opa-appointment-grid-head span,.opa-appointment-grid-row span{height:100%;display:flex;align-items:center;border-right:1px solid #dfe5eb;padding:0 6px;min-width:0}
.opa-appointment-grid-head span{justify-content:center;line-height:1.1}.opa-appointment-grid-row{width:100%;height:28px;border:0;border-top:1px solid #ebedf0;background:#fff;text-align:left;color:#004b8d;font:12px Inter}
.opa-appointment-grid-row span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.05}.opa-appointment-grid-row .slot-no,.opa-appointment-grid-row .slot-time,.opa-appointment-grid-row .slot-status,.opa-appointment-grid-row .slot-actions{justify-content:center}.opa-appointment-grid-row .slot-patient{color:#111;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.opa-appointment-grid-row .slot-status{font-weight:700;color:#111}
.opa-appointment-grid-row.free .slot-status{background:transparent;color:inherit}
.opa-appointment-grid-row.booked .slot-status{background:#f0f0f0;color:#202020}
.opa-appointment-grid-row.reported .slot-status{background:#dddddd;color:#202020}
.opa-appointment-grid-row.ready .slot-status{background:#c7c7c7;color:#202020}
.opa-appointment-grid-row.parked .slot-status{background:#858585;color:#fff}
.opa-appointment-grid-row.treated .slot-status{background:#5f5f5f;color:#fff}
.opa-appointment-grid-row.buffer{background:#e9f5e2;color:#0b9f4d}.opa-appointment-grid-row.buffer .slot-time,.opa-appointment-grid-row.buffer .slot-status,.opa-appointment-grid-row.buffer .slot-patient{color:#0b9f4d;font-weight:650}
.opa-appointment-grid-row.block,.opa-appointment-grid-row.unavailable,.opa-appointment-grid-row.cancelled,.opa-appointment-grid-row.absent{background:#fae6e6;color:#d93636}
.opa-appointment-grid-row.block .slot-time,.opa-appointment-grid-row.block .slot-status,.opa-appointment-grid-row.unavailable .slot-status,.opa-appointment-grid-row.cancelled .slot-status,.opa-appointment-grid-row.absent .slot-status{color:#d93636;background:transparent;font-weight:650}
.opa-appointment-grid-row.free .slot-status{color:#111}
.opa-appointment-grid-row.unavailable .slot-time{text-decoration:line-through;text-decoration-thickness:2px}.opa-appointment-grid-row.selected{outline:1px dashed #9ca3af;background:#eef1f5}
.slot-no i{display:inline-block;width:8px;height:8px;border-radius:50%;background:#0aa85d;margin-left:2px}.opa-appointment-grid-row.block .slot-no i,.opa-appointment-grid-row.unavailable .slot-no i,.opa-appointment-grid-row.cancelled .slot-no i,.opa-appointment-grid-row.absent .slot-no i,.opa-appointment-grid-row.booked .slot-no i{background:#dc2626}.slot-actions{gap:5px;color:#9aa7b4}.slot-actions button{width:17px;height:17px;display:inline-grid;place-items:center;border:1px solid #c8d2dc;border-radius:4px;background:#f8fafc;color:#8fa0ad;font:11px Inter;padding:0;cursor:pointer}.slot-actions button:hover{border-color:#0f8587;color:#0f8587;background:#eefafa}.slot-actions button:nth-child(-n+2){color:#ff4d4d;border-color:#ffc6c6}.slot-actions button:nth-child(3){color:#8fa0ad}.slot-actions button:nth-child(4){color:#0f8587;border-color:#9bd8d8}
.opa-previous-panel{overflow:hidden}.opa-prev-buttons{display:flex;gap:5px}.opa-prev-buttons button{height:26px;border:1px solid #cbd5df;background:#fff;border-radius:3px;color:#34495e;font-size:11px;padding:0 9px}
.opa-prev-patient-line{height:31px;display:flex;align-items:center;gap:4px;border-bottom:1px solid #d2dce6;padding:0 10px;color:#102b42;font-size:12px}
.opa-prev-grid-exact{height:650px;overflow:auto}.opa-prev-grid-head,.opa-prev-grid-row{display:grid;grid-template-columns:78px 150px 150px 160px}.opa-prev-grid-head{height:34px;background:#d7e6f5;color:#003f72;font-size:11px;font-weight:800;text-align:center}.opa-prev-grid-head span,.opa-prev-grid-row span{display:flex;align-items:center;border-right:1px solid #d3dce7;padding:0 9px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.opa-prev-grid-head span{justify-content:center}.opa-prev-grid-row{height:32px;border-bottom:1px solid #d9e1e8;color:#1f4e82;font-size:11px}.opa-prev-grid-row.blank span{color:transparent}
.opa-prev-footer{height:32px;display:flex;align-items:center;gap:15px;background:#eaf6ff;border-top:1px solid #d2dce6;padding:0 10px;color:#35709f;font-size:11px}.opa-prev-footer i{display:inline-block;width:7px;height:7px;border-radius:50%;background:#168bd2;margin-right:4px}.opa-prev-footer span:nth-child(2) i{background:#62c7b8}.opa-prev-footer em{margin-left:auto;font-style:normal}
`;

const preliminaryFlowStyles = `
.preliminary-checkup-app.opa-prelim-layout{position:relative;grid-template-columns:minmax(360px,30fr) minmax(480px,40fr) minmax(360px,30fr);gap:12px}
.preliminary-checkup-app .opa-medical-card{overflow:auto}
.preliminary-checkup-app .opa-reported-box{height:auto;min-height:374px;margin:8px;border-color:#ccd7e2}
.preliminary-checkup-app .opa-reported-actions button:not(:disabled){background:#fff;color:#26394c}
.preliminary-checkup-app .opa-reported-actions button.active:not(:disabled){background:#0f8587;color:#fff}
.preliminary-checkup-app .opa-patient-detail-grid{position:relative;display:grid;grid-template-columns:78px minmax(130px,1fr) 90px 118px;gap:6px;padding:6px 7px 8px;align-items:start}
.preliminary-checkup-app .opa-patient-detail-grid label{height:26px;display:flex;align-items:center;background:#e5e8ec;color:#102b42;padding:0 6px;font-size:12px}
.preliminary-checkup-app .opa-patient-detail-grid input,.preliminary-checkup-app .opa-patient-detail-grid select{height:28px;border:1px solid #cbd5df;border-radius:4px;background:#f3f6fa;padding:0 8px;font:12px Inter;color:#111827;min-width:0}
.preliminary-checkup-app .opa-patient-detail-grid select.danger{color:#dc2626;background:#fde8e8;border-color:#efb7b7}
.preliminary-checkup-app .opa-patient-detail-grid>label:nth-of-type(1){grid-column:1}
.preliminary-checkup-app .opa-patient-detail-grid>select.danger{grid-column:2}
.preliminary-checkup-app .opa-demo-line{grid-column:3 / span 2;grid-row:1;color:#0f2437;font-size:12px;line-height:1.35;padding:1px 0 0 4px;min-height:32px}
.preliminary-checkup-app .opa-demo-line span{padding:0 6px}
.preliminary-checkup-app .opa-patient-detail-grid>label:nth-of-type(n+2){grid-column:1}
.preliminary-checkup-app .opa-patient-detail-grid>label:nth-of-type(2)+input,.preliminary-checkup-app .opa-patient-detail-grid>label:nth-of-type(5)+input{grid-column:2}
.preliminary-checkup-app .opa-patient-detail-grid>label:nth-of-type(2)+input+select,.preliminary-checkup-app .opa-patient-detail-grid>label:nth-of-type(5)+input+select{grid-column:3}
.preliminary-checkup-app .opa-patient-detail-grid .span2{grid-column:2 / span 2;width:100%}
.preliminary-checkup-app .opa-patient-detail-grid>label:nth-of-type(3),.preliminary-checkup-app .opa-patient-detail-grid>label:nth-of-type(4),.preliminary-checkup-app .opa-patient-detail-grid>label:nth-of-type(5){grid-column:1}
.preliminary-checkup-app .opa-address-box{grid-column:1 / span 4;height:35px;border:1px solid #111;background:#fff;font:12px Inter;line-height:1.1;padding:4px 6px;white-space:pre-line;resize:none;margin-top:2px}
.preliminary-checkup-app .opa-photo-card{position:relative;grid-column:4;grid-row:2 / span 4;width:102px;justify-self:center;text-align:center;color:#dc2626;font-size:10px;margin-top:0}
.preliminary-checkup-app .opa-face{height:112px;background:#dbeafe;border:1px solid #cbd5df;border-radius:3px;display:grid;place-items:end center;overflow:hidden}
.preliminary-checkup-app .opa-face::before{content:"";position:absolute;width:54px;height:54px;border-radius:50%;background:#c98755;top:18px;left:24px;box-shadow:0 -11px 0 4px #2f241f}
.preliminary-checkup-app .opa-face span{position:relative;z-index:1;display:grid;place-items:center;width:62px;height:42px;background:#2f73c9;color:#fff;border-radius:30px 30px 0 0;font-weight:800;margin-bottom:0}
.preliminary-checkup-app .opa-photo-card strong{display:block;margin-top:8px;font-size:10px;color:#dc2626}
.preliminary-checkup-app .opa-prelim-patient-box{margin:8px;border:1px solid #ccd7e2;background:#fff}
.preliminary-checkup-app .opa-prelim-patient-head{height:30px;display:flex;align-items:center;justify-content:space-between;background:#f3f8fc;border-bottom:1px solid #d2dae3;padding:0 8px;color:#102b42;font-size:12px}
.preliminary-checkup-app .opa-prelim-patient-head span{color:#c62828;font-weight:700}
.preliminary-checkup-app .opa-prelim-form{display:grid;grid-template-columns:245px minmax(0,1fr);gap:7px 9px;padding:8px}
.preliminary-checkup-app .opa-prelim-form label,.preliminary-checkup-app .opa-prelim-textareas label{display:flex;flex-direction:column;gap:3px;font-size:11px;font-weight:700;color:#26394c}
.preliminary-checkup-app .opa-prelim-form label.wide{grid-column:1/-1}
.preliminary-checkup-app .opa-prelim-form select,.preliminary-checkup-app .opa-prelim-form input,.preliminary-checkup-app .opa-prelim-form textarea,.preliminary-checkup-app .opa-prelim-textareas textarea,.preliminary-checkup-app .opa-vitals-strip input{border:1px solid #cbd5df;border-radius:4px;background:#fff;font:12px Inter;color:#111827}
.preliminary-checkup-app .opa-prelim-form select{height:27px;padding:0 7px}
.preliminary-checkup-app .opa-prelim-form input{height:27px;padding:0 7px}
.preliminary-checkup-app textarea{resize:none;padding:6px 7px}
.preliminary-checkup-app .opa-prelim-form textarea{height:58px}
.preliminary-checkup-app .opa-note-tabs{grid-column:2;grid-row:1 / span 4;border:1px solid #cbd5df;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:28px 1fr;background:#fff}
.preliminary-checkup-app .opa-note-tabs button{border:0;border-right:1px solid #cbd5df;background:#dcebf8;color:#003f72;font:12px Inter}
.preliminary-checkup-app .opa-note-tabs button+button{background:#fff;border-right:0}
.preliminary-checkup-app .opa-note-tabs textarea{grid-column:1/-1;border:0;height:126px}
.preliminary-checkup-app .opa-vitals-strip{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:7px;padding:0 8px 8px}
.preliminary-checkup-app .opa-vitals-strip label{min-width:0}
.preliminary-checkup-app .opa-vitals-strip span{height:20px;display:flex;align-items:center;gap:3px;font-size:10px;color:#4b5563;white-space:nowrap}
.preliminary-checkup-app .opa-vitals-strip input[type="text"],.preliminary-checkup-app .opa-vitals-strip input:not([type]){height:25px;width:100%;padding:0 6px}
.preliminary-checkup-app .opa-vitals-strip input:disabled,.preliminary-checkup-app textarea:disabled,.preliminary-checkup-app select:disabled{background:#eeeeee;color:#777;opacity:1}
.preliminary-checkup-app .opa-prelim-textareas{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:0 8px 8px}
.preliminary-checkup-app .opa-prelim-textareas textarea{height:58px}
.preliminary-checkup-app .opa-slots-head{height:94px;display:grid;grid-template-rows:42px 51px;align-items:stretch;border-bottom:1px solid #d2dae3;background:#f7f9fb;padding:0}
.preliminary-checkup-app .opa-slots-head h2{height:42px;margin:0;display:flex;align-items:center;border-bottom:1px solid #d2dae3;padding:0 14px;color:#102b42;font-size:18px;font-weight:800}
.preliminary-checkup-app .opa-slot-meta{height:51px;display:grid;grid-template-columns:66px minmax(150px,1fr) 52px minmax(230px,1.35fr) 72px minmax(150px,210px);grid-template-rows:1fr 1fr;align-items:center;column-gap:0;row-gap:0;padding:0 8px;font-size:12px;color:#0f2437;white-space:nowrap;min-width:0}
.preliminary-checkup-app .opa-slot-meta strong{font-weight:800;color:#102b42}
.preliminary-checkup-app .opa-slot-meta strong:nth-of-type(1){grid-column:1;grid-row:1}
.preliminary-checkup-app .opa-slot-meta span:nth-of-type(1){grid-column:2;grid-row:1}
.preliminary-checkup-app .opa-slot-meta strong:nth-of-type(2){grid-column:4;grid-row:1}
.preliminary-checkup-app .opa-slot-meta span:nth-of-type(2){grid-column:1 / span 3;grid-row:2}
.preliminary-checkup-app .opa-slot-meta strong:nth-of-type(3){grid-column:4;grid-row:2}
.preliminary-checkup-app .opa-slot-meta select{grid-column:5 / span 2;grid-row:2;width:100%;height:28px;border:1px solid #111;border-radius:4px;background:#fff;font:12px Inter}
.preliminary-checkup-app .opa-prelim-slot-grid{height:calc(100% - 94px);overflow:auto;padding:8px 8px 0}
.preliminary-checkup-app .opa-prelim-slot-head,.preliminary-checkup-app .opa-prelim-slot-row{display:grid;grid-template-columns:36px 62px 64px minmax(220px,1fr) 62px 62px 62px 112px;align-items:center;min-width:682px}
.preliminary-checkup-app .opa-prelim-slot-head{height:54px;background:#dcebf8;color:#00467a;font-size:11px;font-weight:800;text-align:center}
.preliminary-checkup-app .opa-prelim-slot-head span,.preliminary-checkup-app .opa-prelim-slot-row span{height:100%;border-right:1px solid #d3dde7;padding:0 7px;display:flex;align-items:center;min-width:0}
.preliminary-checkup-app .opa-prelim-slot-head span{justify-content:center;white-space:normal;line-height:1.15;text-align:center;overflow:visible;text-overflow:clip}
.preliminary-checkup-app .opa-prelim-slot-row span{overflow:visible;text-overflow:clip;white-space:nowrap}
.preliminary-checkup-app .opa-prelim-slot-row{width:100%;min-width:682px;height:24px;border:0;border-bottom:1px solid #d9e1e8;background:#fff;color:#004b8d;text-align:left;font:12px Inter}
.preliminary-checkup-app .opa-prelim-slot-row:disabled{color:#94a3b8;cursor:not-allowed}
.preliminary-checkup-app .opa-prelim-slot-row.active{box-shadow:none;background:#fff}
.preliminary-checkup-app .opa-prelim-slot-row span:nth-child(1),.preliminary-checkup-app .opa-prelim-slot-row span:nth-child(2),.preliminary-checkup-app .opa-prelim-slot-row span:nth-child(5),.preliminary-checkup-app .opa-prelim-slot-row span:nth-child(6),.preliminary-checkup-app .opa-prelim-slot-row span:nth-child(7),.preliminary-checkup-app .opa-prelim-slot-row span:nth-child(8){justify-content:center}
.preliminary-checkup-app .opa-prelim-slot-row span:nth-child(3){justify-content:center;font-weight:700;color:#111}
.preliminary-checkup-app .opa-prelim-slot-row.treated span:nth-child(3),.preliminary-checkup-app .opa-prelim-slot-row.parked span:nth-child(3){background:#5d5d5d;color:#fff;align-self:stretch;display:flex;align-items:center;justify-content:center}
.preliminary-checkup-app .opa-prelim-slot-row.ready span:nth-child(3),.preliminary-checkup-app .opa-prelim-slot-row.reported span:nth-child(3),.preliminary-checkup-app .opa-prelim-slot-row.booked span:nth-child(3){color:#111}
.preliminary-checkup-app .opa-prelim-slot-row.buffer{background:#e8f5df}
.preliminary-checkup-app .opa-prelim-slot-row.block{background:#fdeaea;color:#e11d48}
.preliminary-checkup-app .opa-prelim-slot-row.free span:nth-child(3){color:#111}
.preliminary-checkup-app .opa-prelim-slot-row i{display:inline-block;width:8px;height:8px;border-radius:50%;background:#16a34a;margin-left:2px}
.preliminary-checkup-app .opa-prelim-slot-row.block i,.preliminary-checkup-app .opa-prelim-slot-row.booked i{background:#dc2626}
.preliminary-checkup-app .opa-prelim-slot-row span:last-child{text-align:center;color:#9ca3af}
.preliminary-checkup-app .opa-prev-float{display:none}
.preliminary-checkup-app .opa-prev-float:hover{background:#0b6f72}
.preliminary-checkup-app .opa-prev-drawer-backdrop{display:none}
.preliminary-checkup-app .opa-prev-drawer{position:static;z-index:auto;width:auto;height:768px;transform:none;transition:none;box-shadow:none;border:1px solid #d2dae3;background:#fff}
.preliminary-checkup-app .opa-prev-drawer.open{transform:none}
.preliminary-checkup-app .opa-prev-drawer .opa-prev-exact-scroll{height:696px}

/* ---- Before a doctor is chosen: show only the compact Reported Info box ---- */
.preliminary-checkup-app.no-doctor.opa-prelim-layout{grid-template-columns:545px}
.preliminary-checkup-app.no-doctor .opa-medical-card{height:auto;overflow:visible}
.preliminary-checkup-app.no-doctor .opa-reported-box{min-height:0}
.preliminary-checkup-app.no-doctor .opa-reported-grid{grid-template-columns:80px 164px 80px 164px}
.preliminary-checkup-app.no-doctor .opa-reported-grid label:nth-of-type(1){grid-column:3}
.preliminary-checkup-app.no-doctor .opa-reported-grid label:nth-of-type(1)+select{grid-column:4}
.preliminary-checkup-app.no-doctor .opa-reported-grid label:nth-of-type(2){grid-column:3}
.preliminary-checkup-app.no-doctor .opa-reported-grid label:nth-of-type(2)+input{grid-column:4}
.preliminary-checkup-app.no-doctor .opa-reported-grid label:nth-of-type(3){grid-column:3}
.preliminary-checkup-app.no-doctor .opa-reported-grid label:nth-of-type(3)+select{grid-column:4}
.preliminary-checkup-app.no-doctor .opa-reported-grid:not(.minimal) label:first-child{grid-column:1}
.preliminary-checkup-app.no-doctor .opa-reported-grid:not(.minimal) label:first-child+select{grid-column:2}
`;
