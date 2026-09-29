import { useMemo, useState } from "react";
import { ArrowLeft, CalendarDays, Check, GripVertical, MoreHorizontal, Pencil, Plus, RotateCcw, Save, Trash2, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TABS = ["Appointment", "Preliminary Checkup", "Slot Structure", "Fix Date to Doctor"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DOCTORS = ["Dr. Anand", "Dr. Chandrasekar", "Dr.Sharmila"];
const DOCTOR_TEMPLATES = {
  "Dr. Anand": { start: "09:00", end: "16:30", duration: 15 },
  "Dr. Chandrasekar": { start: "10:00", end: "18:00", duration: 10 },
  "Dr.Sharmila": { start: "08:30", end: "14:30", duration: 12 },
};
const PATIENTS = [
  { id: "P-1001", name: "Mrs. Sowmya Suresh", phone: "9684590444", age: "34", gender: "Female", blood: "O+", address: "12, North Street, Chennai", complaint: "Cough, cold & fever" },
  { id: "P-1002", name: "Mr. Raman Kumar", phone: "9845622110", age: "62", gender: "Male", blood: "B+", address: "Lake View Road, Coimbatore", complaint: "Follow-up review" },
  { id: "P-1003", name: "Baby Kavya", phone: "9787643678", age: "2", gender: "Female", blood: "A+", address: "West Mambalam, Chennai", complaint: "Fever" },
];
const PREVIOUS_VISITS = [
  ["21-08-2026", "OP", "Dr. Anand", "Viral fever", "Paracetamol", "Review in 3 days", "Closed"],
  ["14-07-2026", "OP", "Dr.Sharmila", "Throat infection", "Antibiotic", "Completed", "Closed"],
  ["02-04-2026", "IP", "Dr. Chandrasekar", "Dehydration", "IV fluids", "Discharged", "Closed"],
];

const toMinutes = value => {
  const [hour, minute] = String(value || "00:00").split(":").map(Number);
  return hour * 60 + minute;
};
const fromMinutes = value => {
  const hour = Math.floor(value / 60) % 24;
  const minute = value % 60;
  return `${String(hour % 12 || 12).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${hour >= 12 ? "PM" : "AM"}`;
};
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
            <div><span className={`opa-status-chip ${slot.status}`}>{slot.status}</span></div>
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

function AppointmentTab({ booking, setBooking }) {
  return (
    <div className="opa-appointment-minimal">
      <section className="opa-booking-card">
        <div className="opa-booking-head">
          <h2>Booking</h2>
          <div className="opa-booking-actions">
            <button type="button" className="active">New</button>
            <button type="button" className="active">Select</button>
            <button type="button" disabled>Modify</button>
            <button type="button" disabled>Cancel</button>
            <button type="button" disabled>Save</button>
            <button type="button" className="add" title="Add"><Plus size={15} /></button>
          </div>
        </div>
        <div className="opa-request-box">
          <div className="opa-request-title">
            <strong>Request</strong>
            <select value={booking.requestType || "<None>"} onChange={event => setBooking({ ...booking, requestType: event.target.value })}>
              <option>&lt;None&gt;</option>
              <option>Phone</option>
              <option>Walk-in</option>
              <option>WhatsApp</option>
            </select>
          </div>
          <div className="opa-request-grid">
            <label>Req. Dt-Time</label>
            <input value="29-09-2026 12:12" readOnly />
            <label>Doctor</label>
            <select value={booking.doctor || "<None>"} onChange={event => setBooking({ ...booking, doctor: event.target.value === "<None>" ? "" : event.target.value })}>
              <option>&lt;None&gt;</option>
              {DOCTORS.map(name => <option key={name}>{name}</option>)}
            </select>
            <label>Req. How</label>
            <select value={booking.requestHow || ""} onChange={event => setBooking({ ...booking, requestHow: event.target.value })}>
              <option value=""></option>
              <option>Phone</option>
              <option>Walk-in</option>
              <option>WhatsApp</option>
            </select>
            <label>Appt. Date</label>
            <input value="29-09-2026" readOnly />
          </div>
        </div>
      </section>
      <section className="opa-appointment-empty" aria-label="Appointment workspace" />
    </div>
  );
}

function PreliminaryCheckupTab({ booking, setBooking }) {
  const previousRows = [
    ["10071", "16/01/2024 10:55", "3908- OP-DP", "-"],
    ["10072", "02/01/2024 10:55", "3908- OP-LP-R", "02/01/2024 14:30"],
    ["10073", "19/12/2023 10:55", "3908- OP-DP", "-"],
  ];
  return (
    <div className="opa-prelim-layout preliminary-checkup-app">
      <section className="opa-medical-card">
        <div className="opa-medical-head"><h2>Medical Checkup</h2></div>
        <div className="opa-reported-box">
          <div className="opa-reported-head">
            <strong>Reported Info</strong>
            <div className="opa-reported-actions">
              <button type="button" disabled>New</button>
              <button type="button" disabled>Select</button>
              <button type="button" disabled>Modify</button>
              <button type="button" className="active">Cancel</button>
              <button type="button" disabled>Save</button>
            </div>
          </div>
          <div className="opa-reported-grid">
            <label>Medic Staff</label>
            <select className="opa-staff-select" value={booking.medicStaff || "<None>"} onChange={event => setBooking({ ...booking, medicStaff: event.target.value })}>
              <option>&lt;None&gt;</option>
              <option>Mrs. Stella</option>
              <option>Mr. Kumar</option>
            </select>
            <label>Doctor</label>
            <select value={booking.doctor || "<None>"} onChange={event => setBooking({ ...booking, doctor: event.target.value === "<None>" ? "" : event.target.value })}>
              <option>&lt;None&gt;</option>
              {DOCTORS.map(name => <option key={name}>{name}</option>)}
            </select>
            <span className="opa-cell-spacer" />
            <span className="opa-cell-spacer" />
            <label>Appt. Date</label>
            <input value="29-09-2026" readOnly />
            <span className="opa-cell-spacer" />
            <span className="opa-cell-spacer" />
            <label>Slot#-Time</label>
            <select className="opa-invalid-select" defaultValue="">
              <option value=""></option>
            </select>
          </div>
        </div>
      </section>
      <section className="opa-prelim-blank" aria-label="Preliminary checkup workspace" />
      <section className="opa-prev-info-exact">
        <div className="opa-prev-exact-head">
          <div><h2>Previous Information</h2><p>3 Entries Recorded</p></div>
          <div className="opa-prev-exact-actions"><button type="button">Filter</button><button type="button">Search Entries</button></div>
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
    </div>
  );
}

function SlotStructureTab({ structures, setStructures }) {
  const [form, setForm] = useState({ doctor: "Dr. Anand", days: ["Mon", "Tue", "Wed", "Thu", "Fri"], start: "09:00", end: "16:30", duration: 15 });
  const [slots, setSlots] = useState(() => makeSlots({ start: "09:00", end: "16:30", duration: 15 }));
  const [selectedId, setSelectedId] = useState("");
  const [actionMenu, setActionMenu] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [draft, setDraft] = useState({ session: 1, from: 1, to: 5 });
  const counts = useMemo(() => ({ total: slots.length, break: slots.filter(s => s.status === "break").length, buffer: slots.filter(s => s.status === "buffer").length, free: slots.filter(s => s.status === "free").length }), [slots]);
  const load = id => {
    const item = structures.find(s => s.id === id);
    if (!item) return;
    setSelectedId(id); setForm({ doctor: item.doctor, days: item.days, start: item.start, end: item.end, duration: item.duration }); setSlots(item.slots); setSessions(item.sessions || []);
  };
  const save = () => {
    const id = selectedId || `structure-${Date.now()}`;
    const item = { id, ...form, slots, sessions };
    setStructures(current => current.some(s => s.id === id) ? current.map(s => s.id === id ? item : s) : [...current, item]);
    setSelectedId(id);
  };
  return (
    <div className="opa-three-col slot-structure-app">
      <Panel title="Doctor Availability" subtitle="Create, select, modify and save structures" tone="coral">
        <Section title="Structure Controls" actions={<><button type="button" onClick={() => { setSelectedId(""); setSlots([]); }}><Plus size={13} /> New</button><button type="button" onClick={() => setStructures(current => current.filter(s => s.id !== selectedId))} disabled={!selectedId}><Trash2 size={13} /> Delete</button></>}>
          <div className="opa-form-grid one"><Field label="Doctor"><select value={form.doctor} onChange={e => setForm({ ...form, doctor: e.target.value })}>{DOCTORS.map(name => <option key={name}>{name}</option>)}</select></Field><Field label="Structure"><select value={selectedId} onChange={e => load(e.target.value)}><option value="">Select Structure</option>{structures.map((item, index) => <option key={item.id} value={item.id}>{index + 1}. {item.doctor} - {item.days.join(", ")}</option>)}</select></Field><Field label="Week Days"><div className="opa-day-list">{DAYS.map(day => <label key={day}><input type="checkbox" checked={form.days.includes(day)} onChange={() => setForm(current => ({ ...current, days: current.days.includes(day) ? current.days.filter(d => d !== day) : [...current.days, day] }))} /> {day}</label>)}</div></Field><Field label="OP Timing"><div className="opa-inline-controls"><input type="time" value={form.start} onChange={e => setForm({ ...form, start: e.target.value })} /><input type="time" value={form.end} onChange={e => setForm({ ...form, end: e.target.value })} /></div></Field><Field label="Duration"><div className="opa-inline-controls"><input type="number" min="1" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} /><button type="button" onClick={() => setSlots(makeSlots(form))}>Generate</button></div></Field></div>
        </Section>
        <Section title="Generated Variables"><div className="opa-generated-grid"><SummaryCell label="Total Slots" value={counts.total} /><SummaryCell label="Break Slots" value={counts.break} tone="#eb6367" /><SummaryCell label="Buffer Slots" value={counts.buffer} tone="#73bfb8" /><SummaryCell label="Available" value={counts.free} tone="#679cbc" /></div><div className="opa-footer-actions split"><button type="button" onClick={() => setSlots(makeSlots(form))}><RotateCcw size={14} /> Generate</button><button className="primary" type="button" onClick={save}><Save size={14} /> Save Structure</button></div></Section>
      </Panel>
      <Panel title="Appointment Slot Structure" subtitle="Token pattern, break/buffer and sessions" tone="blue">
        <div className="opa-session-row"><span>Create Session</span><select value={draft.session} onChange={e => setDraft({ ...draft, session: e.target.value })}>{[1, 2, 3, 4, 5].map(n => <option key={n}>{n}</option>)}</select><input type="number" min="1" value={draft.from} onChange={e => setDraft({ ...draft, from: e.target.value })} /><input type="number" min="1" value={draft.to} onChange={e => setDraft({ ...draft, to: e.target.value })} /><button type="button" onClick={() => { setSessions(current => [...current, draft]); setSlots(current => current.map(slot => slot.token >= Number(draft.from) && slot.token <= Number(draft.to) ? { ...slot, session: `Session ${draft.session}` } : slot)); }}>Go</button></div>
        <SlotGrid slots={slots} actionMenu={actionMenu} setActionMenu={setActionMenu} onStatus={(token, status) => { setActionMenu(null); setSlots(current => current.map(slot => slot.token === token ? { ...slot, status: slot.status === status ? "free" : status } : slot)); }} onPatient={(token, patient) => setSlots(current => current.map(slot => slot.token === token ? { ...slot, patient, status: patient ? "booked" : "free" } : slot))} />
      </Panel>
      <Panel title="Saved Structure" subtitle="Reusable doctor structures"><div className="opa-saved-list">{structures.map((item, index) => <button key={item.id} type="button" className={selectedId === item.id ? "active" : ""} onClick={() => load(item.id)}><strong>{index + 1}. {item.doctor}</strong><span>{item.days.join(", ")} | {item.start}-{item.end} | {item.duration} min</span></button>)}{!structures.length && <div className="opa-empty-inline">No saved structures yet</div>}</div></Panel>
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
  const [patient, setPatient] = useState(PATIENTS[0]);
  const [booking, setBooking] = useState({ staff: "Mrs. Stella", requestedAt: "2026-08-21T19:00", requestHow: "Phone", messageVia: "Phone", doctor: "", date: "2026-08-22", reportingTime: "08:45", token: "", time: "", status: "draft", reminders: ["On confirmation", "Appointment date - 07:00 AM", "60 min before reporting", "30 min before reporting"] });
  const [slots, setSlots] = useState([]);
  const [selectedToken, setSelectedToken] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [structures, setStructures] = useState(() => [{ id: "seed-dr-anand", doctor: "Dr. Anand", days: ["Mon", "Tue", "Wed", "Thu", "Fri"], start: "09:00", end: "16:30", duration: 15, sessions: [{ session: 1, from: 1, to: 10 }], slots: makeSlots({ start: "09:00", end: "16:30", duration: 15 }, "Mrs. Sowmya Suresh") }]);
  const confirmAppointment = () => { setBooking(current => ({ ...current, status: "booked" })); setShowConfirmation(true); };

  return (
    <main className="op-appointments-screen">
      <style>{styles}</style>
      <div className="opa-window">
        <header className="opa-titlebar"><button type="button" onClick={() => navigate("/main-menu-2")}><ArrowLeft size={16} /> Main Menu</button><div><strong>E-Medic Appointment</strong><span>Out-patient appointment, checkup and slot structure</span></div><span>Duty Staff: <strong>{booking.staff}</strong></span></header>
        <nav className="opa-tabs">{TABS.map(tab => <button key={tab} type="button" className={activeTab === tab ? "active" : ""} onClick={() => setActiveTab(tab)}>{tab}</button>)}</nav>
        <div className="opa-content">
          {activeTab === "Appointment" && <AppointmentTab booking={booking} setBooking={setBooking} patient={patient} setPatient={setPatient} slots={slots} setSlots={setSlots} selectedToken={selectedToken} setSelectedToken={setSelectedToken} structures={structures} confirmAppointment={confirmAppointment} />}
          {activeTab === "Preliminary Checkup" && <PreliminaryCheckupTab booking={booking} setBooking={setBooking} />}
          {activeTab === "Slot Structure" && <SlotStructureTab structures={structures} setStructures={setStructures} />}
          {activeTab === "Fix Date to Doctor" && <FixDateToDoctorTab structures={structures} />}
        </div>
      </div>
      {showConfirmation && <div className="opa-modal" role="dialog" aria-modal="true"><section className="opa-confirm-card"><div className="opa-confirm-head"><Check size={32} /><div><h2>Appointment confirmed successfully</h2><p>The selected token is booked and reminders are scheduled.</p></div></div><div className="opa-confirm-summary"><span>Patient</span><strong>{patient.name}</strong><span>Doctor</span><strong>{booking.doctor}</strong><span>Appointment Date</span><strong>{booking.date}</strong><span>Token</span><strong>{booking.token}</strong><span>Time Slot</span><strong>{booking.time}</strong><span>Reporting Time</span><strong>{booking.reportingTime}</strong></div><footer className="opa-confirm-actions"><button type="button" onClick={() => setShowConfirmation(false)}>View Appointment</button><button type="button" className="primary" onClick={() => { setShowConfirmation(false); setBooking(current => ({ ...current, token: "", time: "", status: "draft" })); }}>New Appointment</button></footer></section></div>}
    </main>
  );
}

const styles = `
.op-appointments-screen{height:100vh;min-width:1180px;background:#e9edf2;color:#1f2937;font:13px Inter,"Segoe UI",Arial,sans-serif;overflow:hidden}.op-appointments-screen *{box-sizing:border-box}.opa-window{height:100%;display:flex;flex-direction:column;background:#fff}.opa-titlebar{display:none}.opa-tabs{height:48px;background:#dfe4ea;border-bottom:1px solid #c7ced7;display:flex;align-items:flex-end;padding-left:10px;gap:4px}.opa-tabs button{height:38px;padding:0 24px;border:1px solid #bcc5cf;border-bottom:0;background:#cfd6de;border-radius:6px 6px 0 0;font-size:15px;cursor:pointer}.opa-tabs button.active{height:40px;background:#fff;font-weight:700}.opa-content{flex:1;min-height:0;background:#fff;padding:14px;overflow:hidden}.opa-appointment-minimal{height:100%;display:grid;grid-template-columns:545px 724px;gap:14px;align-items:start}.opa-booking-card{height:768px;border:1px solid #d2dae3;background:#fff}.opa-booking-head{height:41px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #d2dae3;background:#f7f9fb;padding:0 13px}.opa-booking-head h2{margin:0;font-size:16px}.opa-booking-actions{display:flex;align-items:center;gap:4px}.opa-booking-actions button{height:26px;border:1px solid #c8d3df;background:#eef2f6;color:#8b98a6;border-radius:2px;padding:0 9px;font-size:11px;font-weight:700}.opa-booking-actions button.active{background:#0f8587;border-color:#0f8587;color:#fff}.opa-booking-actions button.add{width:26px;padding:0;background:#e9fff0;border-color:#16a34a;color:#057a35;display:flex;align-items:center;justify-content:center}.opa-booking-actions button:disabled{opacity:.85}.opa-request-box{height:311px;margin:10px 8px;border:1px solid #d2dae3;background:#fff}.opa-request-title{height:42px;display:flex;align-items:center;justify-content:space-between;background:#f3f8fc;padding:0 10px}.opa-request-title strong{color:#102b42;font-size:12px}.opa-request-title select{width:110px}.opa-request-grid{display:grid;grid-template-columns:80px 164px 80px 164px;gap:7px 6px;padding:7px}.opa-request-grid label{height:26px;display:flex;align-items:center;background:#e5e8ec;color:#102b42;padding:0 6px;font-size:12px}.opa-request-grid input,.opa-request-grid select,.opa-request-title select{height:28px;border:1px solid #cbd5df;border-radius:4px;background:#f3f6fa;padding:0 8px;font:12px Consolas,"Segoe UI",sans-serif;color:#111827}.opa-request-grid select,.opa-request-title select{font-family:"Segoe UI",Arial,sans-serif}.opa-appointment-empty{height:768px;border:1px solid #d2dae3;background:#fff}.opa-panel{min-width:0;min-height:0;display:flex;flex-direction:column;border:1px solid #d6dee5;border-radius:8px;background:#fff;overflow:hidden;box-shadow:0 2px 6px rgba(30,42,56,.05);position:relative}.opa-panel-title{height:42px;flex:0 0 42px;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:0 12px;border-bottom:1px solid #d6dee5;background:#eef1f4}.opa-panel-title.coral{background:#eb6367;color:#fff}.opa-panel-title.blue{background:#679cbc;color:#fff}.opa-panel-title.teal{background:#73bfb8;color:#fff}.opa-panel-title h2{margin:0;font-size:16px}.opa-panel-title p{margin:1px 0 0;font-size:10px;opacity:.82}.opa-panel-actions{display:flex;gap:6px}.opa-panel-actions input{height:27px;border:1px solid #c7d0d8;border-radius:4px;padding:0 8px}.opa-panel-body{flex:1;min-height:0;overflow:auto;padding:8px}.opa-three-col{height:100%;display:grid;grid-template-columns:minmax(0,30fr) minmax(0,40fr) minmax(0,30fr);gap:12px}.opa-section{border:1px solid #dde2e7;border-radius:7px;background:#fff;margin-bottom:8px;overflow:hidden}.opa-section-head{min-height:31px;background:#f6f7f9;border-bottom:1px solid #e3e7eb;display:flex;align-items:center;justify-content:space-between;padding:5px 8px;font-size:12px;font-weight:700;color:#334b62}.opa-section-actions{display:flex;gap:4px}.opa-section-actions button,.opa-footer-actions button,.opa-inline-controls button,.opa-session-row button{height:27px;border:1px solid #2f7f80;background:#238486;color:#fff;border-radius:3px;padding:0 8px;font-size:11px;font-weight:700;display:inline-flex;align-items:center;gap:4px}.opa-section-body{padding:8px}.opa-form-grid{display:grid;gap:7px 10px}.opa-form-grid.two{grid-template-columns:repeat(2,minmax(0,1fr))}.opa-form-grid.one{grid-template-columns:1fr}.opa-field{display:grid;grid-template-columns:110px minmax(0,1fr);align-items:center;gap:6px;min-height:30px}.opa-field>span{font-weight:700;color:#26394c}.opa-field input,.opa-field select,.opa-field textarea,.opa-textarea{width:100%;height:28px;border:1px solid #cbd5de;border-radius:4px;background:#fff;padding:0 7px;font:inherit;color:#25374a}.opa-patient-card{display:grid;grid-template-columns:minmax(0,1fr) 120px;gap:8px;margin-top:8px}.opa-demographic{border:1px solid #cbd5de;background:#fbfcfd;padding:7px;font-size:11px;line-height:1.45}.opa-demographic strong,.opa-demographic span{display:block}.opa-demographic p{margin:4px 0 0}.opa-reminder-grid,.opa-vitals-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}.opa-reminder-grid div,.opa-vital-tile{border:1px solid #d6dee5;border-radius:6px;background:#fbfcfd;padding:7px}.opa-reminder-grid span,.opa-vital-tile span{display:block;color:#66727f;font-size:11px;font-weight:700}.opa-reminder-grid strong{display:block;color:#18794e;margin-top:3px}.opa-vital-tile input:not([type=checkbox]){margin-top:5px;width:100%;height:28px;border:1px solid #cbd5de;border-radius:4px;padding:0 7px}.opa-footer-actions{display:flex;justify-content:flex-end;gap:7px;padding:7px 0 0}.opa-footer-actions.split{justify-content:space-between}.opa-footer-actions button{background:#fff;color:#34424e;border-color:#c5ced8}.opa-footer-actions button.primary,.opa-section-actions button{background:#73bfb8;border-color:#42978f;color:#fff}.opa-footer-actions button:disabled,.opa-section-actions button:disabled{opacity:.45;cursor:not-allowed}.opa-summary-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));border-bottom:1px solid #d5e0e7;background:#f3f7fb}.opa-summary-grid.compact{border:1px solid #d6dee5;margin-bottom:7px}.opa-summary-cell{min-width:0;display:flex;align-items:center;gap:7px;border-right:1px solid #d5e0e7;border-bottom:1px solid #d5e0e7;padding:8px 10px}.opa-summary-cell span{min-width:78px;font-size:11px;font-weight:700;color:#142433}.opa-summary-cell strong{font-size:11px;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.opa-legend{min-height:31px;border-bottom:1px solid #b9cbd7;background:#f4f8fb;display:flex;align-items:center;gap:14px;padding:0 10px;font-size:11px;color:#52606d}.opa-legend span{display:flex;align-items:center;gap:4px}.opa-legend i{width:9px;height:9px;border:1px solid #cfd7de;border-radius:2px}.opa-legend .booked{background:#e3edf7}.opa-legend .free{background:#e6f8ed}.opa-legend .break{background:#fff1ce}.opa-legend .buffer{background:#efe4f5}.opa-legend .hold{background:#fff7d6}.opa-date-band{height:34px;display:flex;align-items:center;justify-content:center;background:linear-gradient(90deg,#126c76,#0d7475);color:#fff;font-size:12px;font-weight:750}.opa-slot-grid{height:calc(100% - 120px);min-height:260px;display:flex;flex-direction:column;border-top:1px solid #b9cbd7}.opa-slot-head,.opa-slot-row{display:grid;grid-template-columns:82px 135px 112px minmax(0,1fr) 78px;align-items:center}.opa-slot-head{height:35px;background:#70a6c4;color:#fff;font-weight:700;text-align:center}.opa-slot-head span:nth-child(4){text-align:left}.opa-slot-rows{flex:1;overflow:auto}.opa-slot-row{min-height:36px;border-bottom:1px solid #d9e3e9;font-size:12px}.opa-slot-row:nth-child(even){background:#fbfdfe}.opa-slot-row>div{padding:4px 8px;text-align:center}.opa-slot-row>div:nth-child(4){text-align:left}.opa-slot-row.break{background:#fff1ce}.opa-slot-row.buffer{background:#efe4f5}.opa-slot-row.booked{background:#e3edf7}.opa-slot-row.hold{background:#fff7d6}.opa-slot-row.selected{box-shadow:inset 0 0 0 2px #73bfb8}.opa-token{display:flex;align-items:center;justify-content:center;gap:5px}.opa-status-chip{display:inline-flex;min-width:58px;justify-content:center;border-radius:3px;padding:4px 7px;font-size:10px;font-weight:700;text-transform:capitalize}.opa-status-chip.booked{background:#e6f0ff;color:#1260d5}.opa-status-chip.free{background:#e6f8ed;color:#16854a}.opa-status-chip.break{background:#fff0d5;color:#d67500}.opa-status-chip.buffer{background:#f1e5fa;color:#8954b9}.opa-status-chip.hold{background:#fff0b8;color:#8a6200}.opa-slot-row input{width:100%;height:26px;border:0;background:transparent;padding:0 6px;font:inherit}.opa-slot-row input:focus{outline:1px solid #73bfb8;background:#fff}.opa-icon-button{height:25px;width:28px;border:1px solid #c6d3dc;background:#fff;color:#203b4c;display:inline-flex;align-items:center;justify-content:center}.opa-slot-action-cell{position:relative}.opa-popover{position:absolute;right:8px;top:30px;z-index:30;width:170px;border:1px solid #b9cbd7;border-radius:6px;background:#fff;padding:4px;box-shadow:0 8px 24px #173c5530;text-align:left}.opa-popover button{display:block;width:100%;height:28px;border:0;background:#fff;text-align:left;padding:0 8px;font-size:11px}.opa-popover .danger{color:#a33b3b}.opa-prev-head,.opa-prev-row{display:grid;grid-template-columns:82px 70px 125px 130px 130px 120px 80px}.opa-prev-head{height:34px;background:#dcebf8;color:#1f4e82;font-weight:700}.opa-prev-head span,.opa-prev-row span{display:flex;align-items:center;padding:0 8px;border-right:1px solid #d3dde7;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.opa-prev-row{height:32px;border-bottom:1px solid #d9e1e8}.opa-inline-note{border:1px solid #cce0ee;background:#f4faff;color:#355468;border-radius:6px;padding:8px 10px;margin-bottom:8px;font-size:11px}.opa-inline-note.success{display:flex;align-items:center;gap:6px;color:#18794e;background:#effbf4;border-color:#b9ddc5}.opa-textarea{height:120px;padding:8px;resize:none}.opa-day-list{display:flex;gap:4px;flex-wrap:wrap}.opa-day-list label{background:#dbeafe;border:1px solid #c4daf8;border-radius:5px;padding:3px 5px;font-size:11px}.opa-inline-controls{display:flex;gap:6px;align-items:center}.opa-generated-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));border:1px solid #d6dee5}.opa-session-row{display:flex;align-items:center;gap:6px;min-height:40px;border:1px solid #d6dee5;background:#fbfcfd;padding:6px;margin-bottom:7px}.opa-session-row span{font-weight:700;margin-right:auto}.opa-session-row select,.opa-session-row input{height:28px;border:1px solid #cbd5de;border-radius:4px;padding:0 6px;width:68px}.opa-saved-list{display:flex;flex-direction:column;gap:6px}.opa-saved-list button{border:1px solid #d6dee5;background:#fff;text-align:left;padding:8px;border-radius:5px}.opa-saved-list button.active{border-color:#73bfb8;background:#effbf8}.opa-saved-list strong,.opa-saved-list span{display:block}.opa-saved-list span{margin-top:3px;color:#66727f;font-size:11px}.opa-empty,.opa-empty-inline{display:flex;align-items:center;justify-content:center;flex-direction:column;min-height:220px;color:#66727f;text-align:center}.opa-empty h3{margin:10px 0 4px;color:#1f2937}.opa-manager-grid{border:1px solid #d6dee5;border-radius:6px;overflow:hidden}.opa-manager-head,.opa-manager-row{display:grid;grid-template-columns:42px 1fr 88px 74px;align-items:center}.opa-manager-head{height:32px;background:#dcebf8;color:#1f4e82;font-weight:700}.opa-manager-row{height:34px;border:0;border-bottom:1px solid #d9e1e8;background:#fff;text-align:left}.opa-manager-row.active{background:#eff8fd}.opa-manager-row.fixed span:nth-child(3){color:#c62828;font-weight:700}.opa-manager-row.archived span:nth-child(3){color:#a98500;font-weight:700}.opa-manager-row.free span:nth-child(3){color:#16803a}.opa-manager-head span,.opa-manager-row span{padding:0 8px}.opa-toggle{height:28px;border:1px solid #9aa1a8;border-radius:14px;background:#b7bcc2;color:#fff;padding:0 12px}.opa-toggle.active{background:#3a9d5d;border-color:#2d7f4a}.opa-watermark{position:absolute;left:50%;top:56%;transform:translate(-50%,-50%) rotate(-45deg);font-size:44px;font-weight:800;opacity:.14;pointer-events:none}.booking-status-fixed .opa-watermark{color:#dc2626}.booking-status-archived .opa-watermark{color:#c9a600}.booking-status-free-created .opa-watermark{color:#16a34a}.opa-modal{position:fixed;inset:0;z-index:200;display:grid;place-items:center;background:#102a3a73;padding:24px}.opa-confirm-card{width:min(520px,94vw);overflow:hidden;border-radius:12px;background:#fff;box-shadow:0 24px 70px #102a3a4d}.opa-confirm-head{display:flex;align-items:center;gap:12px;padding:18px 20px;background:#e5f5f0;color:#176c58}.opa-confirm-head h2,.opa-confirm-head p{margin:0}.opa-confirm-summary{display:grid;grid-template-columns:140px 1fr;gap:10px 16px;padding:20px}.opa-confirm-summary span{color:#66727f}.opa-confirm-actions{display:flex;justify-content:flex-end;gap:8px;border-top:1px solid #d6dee5;padding:12px 20px}.opa-confirm-actions button{height:32px;border:1px solid #c5ced8;background:#fff;padding:0 14px}.opa-confirm-actions .primary{background:#73bfb8;border-color:#73bfb8;color:#fff}.opa-prelim-layout{height:100%;display:grid;grid-template-columns:545px minmax(520px,1fr) 545px;gap:14px;align-items:start}.opa-medical-card,.opa-prelim-blank,.opa-prev-info-exact{height:768px;border:1px solid #d2dae3;background:#fff;min-width:0}.opa-medical-head,.opa-prev-exact-head{height:41px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #d2dae3;background:#f7f9fb;padding:0 13px}.opa-medical-head h2,.opa-prev-exact-head h2{margin:0;color:#102b42;font-size:16px;font-weight:800}.opa-prev-exact-head p{margin:1px 0 0;color:#718094;font-size:8px;font-weight:500}.opa-reported-box{height:152px;margin:10px 8px;border:1px solid #d2dae3;background:#fff}.opa-reported-head{height:40px;display:flex;align-items:center;justify-content:space-between;background:#f3f8fc;padding:0 8px}.opa-reported-head strong{color:#102b42;font-size:12px}.opa-reported-actions,.opa-prev-exact-actions{display:flex;align-items:center;gap:4px}.opa-reported-actions button{height:26px;border:1px solid #c8d3df;background:#eef2f6;color:#8b98a6;border-radius:2px;padding:0 9px;font-size:11px}.opa-reported-actions button.active{background:#0f8587;border-color:#0f8587;color:#fff}.opa-reported-actions button:disabled{opacity:.82}.opa-reported-grid{display:grid;grid-template-columns:80px 164px 80px 164px;gap:7px 6px;padding:7px}.opa-reported-grid label{height:26px;display:flex;align-items:center;background:#e5e8ec;color:#102b42;padding:0 6px;font-size:12px;white-space:nowrap}.opa-reported-grid input,.opa-reported-grid select{height:28px;border:1px solid #cbd5df;border-radius:4px;background:#f3f6fa;padding:0 8px;font:12px "Segoe UI",Arial,sans-serif;color:#111827}.opa-reported-grid input{font-family:Consolas,"Segoe UI",sans-serif}.opa-reported-grid .opa-staff-select{border-color:#111;box-shadow:0 0 0 1px #111;background:#fff}.opa-reported-grid .opa-invalid-select{border-color:#ef7171;background:#fde8e8;color:#dc2626}.opa-cell-spacer{height:26px}.opa-prev-exact-actions button{height:25px;border:1px solid #c8d3df;background:#fff;border-radius:3px;color:#40536a;font-size:11px;padding:0 9px}.opa-prev-patient{height:31px;display:flex;align-items:center;border-bottom:1px solid #d2dae3;background:#f6fbff;padding:0 13px;color:#102b42;font-size:12px;font-weight:700}.opa-prev-patient span{font-weight:500;margin-left:4px}.opa-prev-exact-scroll{height:696px;overflow:auto}.opa-prev-exact-grid{min-width:540px}.opa-prev-exact-table-head,.opa-prev-exact-row{display:grid;grid-template-columns:78px 150px 150px 160px}.opa-prev-exact-table-head{height:34px;background:#dcebf8;color:#00467a;font-size:10px;font-weight:800;text-align:center}.opa-prev-exact-table-head span,.opa-prev-exact-row span{display:flex;align-items:center;border-right:1px solid #d3dde7;padding:0 9px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.opa-prev-exact-table-head span{justify-content:center}.opa-prev-exact-row{height:32px;border-bottom:1px solid #d9e1e8;color:#1f4e82;font-size:11px}.opa-prev-exact-row.blank span{color:transparent}@media(max-width:1400px){.opa-three-col{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}.opa-previous{grid-column:1/-1}.opa-summary-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.opa-prelim-layout{grid-template-columns:545px minmax(360px,1fr);overflow:auto}.opa-prev-info-exact{grid-column:1/-1;width:545px}}`;
