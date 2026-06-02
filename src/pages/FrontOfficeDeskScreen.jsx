import { useState } from "react";

const MOCK_DOCTORS = [
  { id: 1, name: "Dr. Aravind Kumar",   dept: "General OPD",   slots: ["09:00","09:30","10:00","10:30","11:00"] },
  { id: 2, name: "Dr. Meena Rajesh",    dept: "Cardiology",    slots: ["10:00","10:30","11:30","14:00"] },
  { id: 3, name: "Dr. Suresh Babu",     dept: "Orthopaedics",  slots: ["09:00","11:00","14:30","15:00"] },
];

const initialForm = {
  firstName: "", lastName: "", dob: "", gender: "", phone: "",
  address: "", bloodGroup: "", doctorId: "", date: "", slot: "",
};

function Field({ label, children }) {
  return (
    <div>
      <label style={{
        display: "block", fontSize: ".75rem", fontWeight: "700",
        color: "var(--color-text-muted)", marginBottom: "var(--space-1)",
        textTransform: "uppercase", letterSpacing: ".06em",
      }}>{label}</label>
      {children}
    </div>
  );
}

export default function FrontOfficeDeskScreen({ user, onLogout }) {
  const [tab, setTab]           = useState("register"); // register | appointments
  const [form, setForm]         = useState(initialForm);
  const [appointments, setApps] = useState([
    { id: "APT-001", patient: "Ramesh Murugan",  doctor: "Dr. Aravind Kumar", dept: "General OPD",  date: "2025-08-10", slot: "09:30", status: "confirmed" },
    { id: "APT-002", patient: "Lakshmi Devi",    doctor: "Dr. Meena Rajesh",  dept: "Cardiology",   date: "2025-08-10", slot: "10:00", status: "waiting" },
    { id: "APT-003", patient: "Karthik Selvam",  doctor: "Dr. Suresh Babu",   dept: "Orthopaedics", date: "2025-08-11", slot: "09:00", status: "confirmed" },
  ]);
  const [success, setSuccess]   = useState("");

  const selectedDoctor = MOCK_DOCTORS.find(d => d.id === Number(form.doctorId));
  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleRegister = (e) => {
    e.preventDefault();
    const pid = `PID-${Math.floor(1000 + Math.random() * 9000)}`;
    const apptId = `APT-${String(appointments.length + 1).padStart(3, "0")}`;
    const doc = selectedDoctor;
    setApps(prev => [...prev, {
      id: apptId,
      patient: `${form.firstName} ${form.lastName}`,
      doctor: doc?.name || "—",
      dept: doc?.dept || "—",
      date: form.date,
      slot: form.slot,
      status: "confirmed",
    }]);
    setSuccess(`Patient registered! Patient ID: ${pid} · Appointment: ${apptId}`);
    setForm(initialForm);
    setTimeout(() => setSuccess(""), 6000);
  };

  const statusColor = { confirmed: "#17a765", waiting: "#f59e0b", cancelled: "#dc2626" };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--color-surface-alt)" }}>
      {/* Top bar */}
      <header style={{
        background: "var(--color-sidebar-bg)", color: "#fff",
        padding: "0 var(--space-6)", height: "56px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        boxShadow: "0 2px 8px rgba(0,0,0,.2)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2v20M9 5c0-1.657 1.343-3 3-3s3 1.343 3 3c0 3-6 3-6 6s6 3 6 6c0 1.657-1.343 3-3 3s-3-1.343-3-3"
              stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          <span style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: "800", letterSpacing: "-.02em" }}>Medix</span>
          <span style={{
            background: "rgba(109,40,217,.7)", color: "#fff", borderRadius: "var(--radius-pill)",
            padding: "2px 10px", fontSize: ".7rem", fontWeight: "700", letterSpacing: ".06em",
          }}>FRONT OFFICE</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: ".82rem", fontWeight: "600" }}>{user.name}</p>
            <p style={{ fontSize: ".7rem", color: "rgba(255,255,255,.55)" }}>{user.dept}</p>
          </div>
          <button onClick={onLogout} style={{
            background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.2)",
            color: "#fff", borderRadius: "var(--radius-md)", padding: "6px 14px",
            cursor: "pointer", fontSize: ".78rem", fontWeight: "600",
          }}>Logout</button>
        </div>
      </header>

      <div style={{ flex: 1, padding: "var(--space-6)", maxWidth: "1100px", width: "100%", margin: "0 auto" }}>
        {/* Tab switcher */}
        <div style={{
          display: "flex", gap: "var(--space-2)", marginBottom: "var(--space-6)",
          background: "var(--color-surface)", borderRadius: "var(--radius-lg)",
          padding: "var(--space-1)", boxShadow: "var(--shadow-sm)", width: "fit-content",
          border: "1px solid var(--color-border)",
        }}>
          {[
            { key: "register",     label: "Register Patient", icon: "👤" },
            { key: "appointments", label: "Appointments",      icon: "📅" },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              background: tab === t.key ? "var(--color-primary)" : "transparent",
              color: tab === t.key ? "#fff" : "var(--color-text-muted)",
              border: "none", borderRadius: "var(--radius-md)", padding: "var(--space-2) var(--space-5)",
              fontWeight: "700", cursor: "pointer", fontSize: ".88rem", transition: "all var(--transition-fast)",
            }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Success banner */}
        {success && (
          <div style={{
            background: "#ecfdf5", border: "1px solid #6ee7b7",
            borderRadius: "var(--radius-md)", padding: "var(--space-3) var(--space-4)",
            marginBottom: "var(--space-5)", color: "#065f46", fontWeight: "600", fontSize: ".88rem",
            display: "flex", alignItems: "center", gap: "var(--space-2)",
          }}>
            ✅ {success}
          </div>
        )}

        {/* ── Register Tab ── */}
        {tab === "register" && (
          <div className="card animate-fade-up" style={{ padding: "var(--space-8)" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", fontWeight: "700", marginBottom: "var(--space-6)", color: "var(--color-text-base)" }}>
              New Patient Registration
            </h2>
            <form onSubmit={handleRegister}>
              {/* Patient info */}
              <p style={{ fontSize: ".75rem", fontWeight: "800", letterSpacing: ".08em", color: "var(--color-primary)", marginBottom: "var(--space-3)", textTransform: "uppercase" }}>Patient Details</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)", marginBottom: "var(--space-5)" }}>
                <Field label="First Name"><input className="input-base" required value={form.firstName} onChange={set("firstName")} placeholder="e.g. Ramesh" /></Field>
                <Field label="Last Name"><input className="input-base" required value={form.lastName} onChange={set("lastName")} placeholder="e.g. Murugan" /></Field>
                <Field label="Date of Birth"><input className="input-base" type="date" required value={form.dob} onChange={set("dob")} /></Field>
                <Field label="Gender">
                  <select className="input-base" required value={form.gender} onChange={set("gender")}>
                    <option value="">Select gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </Field>
                <Field label="Phone Number"><input className="input-base" type="tel" required value={form.phone} onChange={set("phone")} placeholder="9XXXXXXXXX" /></Field>
                <Field label="Blood Group">
                  <select className="input-base" value={form.bloodGroup} onChange={set("bloodGroup")}>
                    <option value="">Unknown / Not sure</option>
                    {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(b=><option key={b}>{b}</option>)}
                  </select>
                </Field>
                <Field label="Address">
                  <input className="input-base" value={form.address} onChange={set("address")} placeholder="Street, City" />
                </Field>
              </div>

              {/* Appointment */}
              <p style={{ fontSize: ".75rem", fontWeight: "800", letterSpacing: ".08em", color: "var(--color-primary)", marginBottom: "var(--space-3)", textTransform: "uppercase" }}>Appointment Details</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--space-4)", marginBottom: "var(--space-8)" }}>
                <Field label="Doctor">
                  <select className="input-base" required value={form.doctorId} onChange={set("doctorId")}>
                    <option value="">Select doctor</option>
                    {MOCK_DOCTORS.map(d => <option key={d.id} value={d.id}>{d.name} — {d.dept}</option>)}
                  </select>
                </Field>
                <Field label="Date">
                  <input className="input-base" type="date" required value={form.date} onChange={set("date")}
                    min={new Date().toISOString().split("T")[0]} />
                </Field>
                <Field label="Time Slot">
                  <select className="input-base" required value={form.slot} onChange={set("slot")} disabled={!selectedDoctor}>
                    <option value="">Select slot</option>
                    {(selectedDoctor?.slots || []).map(s => <option key={s}>{s}</option>)}
                  </select>
                </Field>
              </div>

              <button className="btn-primary" type="submit" style={{ padding: "var(--space-3) var(--space-8)", fontSize: ".95rem" }}>
                Register & Book Appointment
              </button>
            </form>
          </div>
        )}

        {/* ── Appointments Tab ── */}
        {tab === "appointments" && (
          <div className="card animate-fade-up" style={{ overflow: "hidden" }}>
            <div style={{ padding: "var(--space-5) var(--space-6)", borderBottom: "1px solid var(--color-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: "700" }}>
                Today's Appointments
              </h2>
              <span className="badge" style={{ background: "var(--color-primary-muted)", color: "var(--color-primary)" }}>
                {appointments.length} total
              </span>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "var(--color-surface-alt)" }}>
                    {["Appt ID","Patient","Doctor","Dept","Date","Slot","Status"].map(h => (
                      <th key={h} style={{
                        padding: "var(--space-3) var(--space-4)", textAlign: "left",
                        fontSize: ".72rem", fontWeight: "700", color: "var(--color-text-muted)",
                        textTransform: "uppercase", letterSpacing: ".06em",
                        borderBottom: "1px solid var(--color-border)",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((a, i) => (
                    <tr key={a.id} style={{ borderBottom: "1px solid var(--color-border)", background: i % 2 === 0 ? "var(--color-surface)" : "var(--color-surface-alt)" }}>
                      <td style={{ padding: "var(--space-3) var(--space-4)", fontWeight: "700", color: "var(--color-primary)", fontFamily: "var(--font-mono)", fontSize: ".82rem" }}>{a.id}</td>
                      <td style={{ padding: "var(--space-3) var(--space-4)", fontWeight: "600" }}>{a.patient}</td>
                      <td style={{ padding: "var(--space-3) var(--space-4)", color: "var(--color-text-muted)" }}>{a.doctor}</td>
                      <td style={{ padding: "var(--space-3) var(--space-4)", color: "var(--color-text-muted)" }}>{a.dept}</td>
                      <td style={{ padding: "var(--space-3) var(--space-4)", color: "var(--color-text-muted)" }}>{a.date}</td>
                      <td style={{ padding: "var(--space-3) var(--space-4)", fontFamily: "var(--font-mono)", fontWeight: "600" }}>{a.slot}</td>
                      <td style={{ padding: "var(--space-3) var(--space-4)" }}>
                        <span className="badge" style={{ background: `${statusColor[a.status]}1a`, color: statusColor[a.status] }}>
                          {a.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}