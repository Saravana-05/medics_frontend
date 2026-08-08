import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, UserRound, Lock, Phone, MapPin, ArrowLeft, Cross } from "lucide-react";
import { registerHospital } from "../../services/hospitalRegistry";

const FIELD_CLASS = "w-full pl-9 pr-3 py-2.5 rounded-lg text-sm outline-none border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-300 transition-colors";

function Field({ icon: Icon, ...props }) {
  return (
    <div className="relative">
      <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
      <input {...props} className={FIELD_CLASS} />
    </div>
  );
}

// "Create New Hospital" — the "new book" onboarding form. Captures the
// hospital's identity plus one admin login; on success that admin account
// logs in exactly like the built-in demo doctor account and lands on OP Desk.
export default function CreateHospital() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ hospitalName: "", address: "", phone: "", adminName: "", username: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const setField = key => e => setForm(prev => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) { setError("Passwords do not match."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }

    setSubmitting(true);
    setTimeout(() => {
      const result = registerHospital(form);
      setSubmitting(false);
      if (!result.ok) { setError(result.error); return; }
      navigate("/login", { state: { registeredUsername: form.username } });
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10" style={{ background: "#f4f6f9" }}>
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 mb-5">
          <ArrowLeft size={15} /> Back to Home
        </Link>

        <div className="rounded-2xl bg-white shadow-sm border border-slate-100 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="flex items-center justify-center rounded-xl flex-shrink-0" style={{ width: 40, height: 40, background: "linear-gradient(135deg, #2563eb, #0ea5e9)" }}>
              <Cross size={20} color="white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800 leading-tight">Create New Hospital</h1>
              <p className="text-xs text-slate-400">Register your hospital on Medix HMS</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 mt-6">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Hospital Name *</label>
              <Field icon={Building2} type="text" placeholder="e.g. Sunrise Multi-Specialty Hospital" value={form.hospitalName} onChange={setField("hospitalName")} required />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Address</label>
              <Field icon={MapPin} type="text" placeholder="City, State" value={form.address} onChange={setField("address")} />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Phone</label>
              <Field icon={Phone} type="tel" placeholder="10-digit phone number" value={form.phone} onChange={setField("phone")} />
            </div>

            <div className="border-t border-slate-100 pt-3.5 mt-1">
              <p className="text-xs font-bold text-slate-700 mb-3">Admin Login</p>

              <div className="flex flex-col gap-3.5">
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1 block">Admin Name *</label>
                  <Field icon={UserRound} type="text" placeholder="Full name" value={form.adminName} onChange={setField("adminName")} required />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1 block">Username *</label>
                  <Field icon={UserRound} type="text" placeholder="Login username or email" value={form.username} onChange={setField("username")} required />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1 block">Password *</label>
                  <Field icon={Lock} type="password" placeholder="At least 6 characters" value={form.password} onChange={setField("password")} required />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1 block">Confirm Password *</label>
                  <Field icon={Lock} type="password" placeholder="Re-enter password" value={form.confirmPassword} onChange={setField("confirmPassword")} required />
                </div>
              </div>
            </div>

            {error && <p className="text-xs font-medium text-red-500 -mt-1">{error}</p>}

            <button type="submit" disabled={submitting}
              className="w-full py-2.5 rounded-lg text-sm font-semibold text-white mt-1 transition-all"
              style={{ background: "linear-gradient(135deg, #2563eb, #0ea5e9)", opacity: submitting ? 0.7 : 1 }}>
              {submitting ? "Creating…" : "Create Hospital & Continue"}
            </button>

            <p className="text-center text-xs text-slate-400 mt-1">
              Already registered? <Link to="/login" className="font-semibold hover:underline" style={{ color: "var(--color-primary)" }}>Login instead</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
