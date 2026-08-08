// src/components/Login/LoginUI.jsx
import { Link } from "react-router-dom";
import LoginImg from "../../assets/login.png";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutlineOutlined";
import StethoscopeIcon from "@mui/icons-material/MonitorHeart";
import ApartmentIcon from "@mui/icons-material/Apartment";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

export default function LoginUI({
  username,
  setUsername,
  password,
  setPassword,
  showPwd,
  setShowPwd,
  error,
  loading,
  rememberMe,
  setRememberMe,
  focusEmail,
  setFocusEmail,
  focusPwd,
  setFocusPwd,
  handleSubmit,
  handleRoleSelect,
  currentYear
}) {
  return (
    <div className="min-h-screen flex overflow-hidden bg-white" style={{ fontFamily: "var(--font-inter)" }}>
      <style>{`
        @keyframes spin { to{transform:rotate(360deg)} }
        .input-ring:focus { box-shadow: 0 0 0 3px rgba(15,108,189,0.18); }
        .btn-login { transition: all .22s ease; background: linear-gradient(135deg,var(--color-primary),#1a9fd4); }
        .btn-login:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 10px 28px rgba(15,108,189,.45); }
        .btn-login:active:not(:disabled) { transform:translateY(0); }
      `}</style>

      {/* ═══════════ LEFT IMAGE PANEL ═══════════ */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src={LoginImg}
          alt="Stethoscope"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* ═══════════ RIGHT FORM PANEL ═══════════ */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 overflow-auto">
        <div className="w-full max-w-[400px]">

          {/* Logo + heading */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg,#083358,#1a9fd4)" }}>
                <LocalHospitalIcon sx={{ color: "white", fontSize: 24 }} />
              </div>
              <span className="text-2xl font-bold text-slate-800" style={{ fontFamily: "var(--font-inter)" }}>Medix</span>
            </div>
            <h1 className="font-bold text-slate-800 leading-tight" style={{ fontFamily: "var(--font-inter)", fontSize: "1.6rem" }}>
              Welcome back
            </h1>
            <p className="text-slate-500 text-sm mt-1">Sign in to your account to continue</p>
          </div>

          {/* Quick-fill role pills */}
          <div className="grid grid-cols-3 gap-2.5 mb-6">
            <button
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-semibold transition-all hover:-translate-y-0.5"
              style={{ background: "#eff6ff", borderColor: "#bfdbfe", color: "#1d4ed8" }}
              onClick={() => handleRoleSelect("opdesk@gmail.com", "doctor")}>
              <StethoscopeIcon sx={{ fontSize: 18 }} />
              <span>OP Doctor</span>
            </button>
            <button
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-semibold transition-all hover:-translate-y-0.5"
              style={{ background: "#f5f3ff", borderColor: "#c4b5fd", color: "var(--color-role-office)" }}
              onClick={() => handleRoleSelect("frontdesk@gmail.com", "office")}>
              <ApartmentIcon sx={{ fontSize: 18 }} />
              <span>Front Office</span>
            </button>
            <button
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-semibold transition-all hover:-translate-y-0.5"
              style={{ background: "#f0fdf4", borderColor: "#86efac", color: "#166534" }}
              onClick={() => handleRoleSelect("platformdesk@gmail.com", "platform")}>
              <AdminPanelSettingsIcon sx={{ fontSize: 18 }} />
              <span>Platform Admin</span>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-slate-200"/>
            <span className="text-xs text-slate-400 font-medium">or sign in manually</span>
            <div className="flex-1 h-px bg-slate-200"/>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 tracking-widest uppercase">Email</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
                  <LockOutlinedIcon sx={{ fontSize: 17, color: focusEmail ? "var(--color-primary)" : "#94a3b8" }} />
                </div>
                <input type="email" required value={username}
                  onChange={e => setUsername(e.target.value)}
                  onFocus={() => setFocusEmail(true)} onBlur={() => setFocusEmail(false)}
                  placeholder="Enter your email"
                  className="input-ring w-full pl-10 pr-4 py-3 rounded-xl bg-white text-slate-800 text-sm outline-none transition-all duration-200"
                  style={{ border: `1.5px solid ${focusEmail ? "var(--color-primary)" : "var(--color-border)"}`, fontSize: ".875rem" }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 tracking-widest uppercase">Password</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
                  <LockOutlinedIcon sx={{ fontSize: 17, color: focusPwd ? "var(--color-primary)" : "#94a3b8" }} />
                </div>
                <input type={showPwd ? "text" : "password"} required value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocusPwd(true)} onBlur={() => setFocusPwd(false)}
                  placeholder="Enter your password"
                  className="input-ring w-full pl-10 pr-11 py-3 rounded-xl bg-white text-slate-800 text-sm outline-none transition-all duration-200"
                  style={{ border: `1.5px solid ${focusPwd ? "var(--color-primary)" : "var(--color-border)"}`, fontSize: ".875rem" }}
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors flex items-center">
                  {showPwd
                    ? <VisibilityOffOutlinedIcon sx={{ fontSize: 18 }} />
                    : <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
                  }
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2.5 cursor-pointer" onClick={() => setRememberMe(!rememberMe)}>
                <div className="w-9 h-5 rounded-full relative transition-colors duration-200 flex-shrink-0"
                  style={{ background: rememberMe ? "var(--color-primary)" : "#cbd5e1" }}>
                  <div className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-200"
                    style={{ left: rememberMe ? "18px" : "2px" }}/>
                </div>
                <span className="text-xs text-slate-500 select-none">Remember Me</span>
              </label>
              <button type="button" className="text-xs font-semibold transition-colors"
                style={{ color: "var(--color-primary)" }}
                onMouseEnter={e => e.currentTarget.style.color = "#083358"}
                onMouseLeave={e => e.currentTarget.style.color = "var(--color-primary)"}>
                Forgot Password?
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl text-xs"
                style={{ background: "#fef2f2", border: "1px solid #fca5a5", color: "var(--color-danger)" }}>
                <ErrorOutlineIcon sx={{ fontSize: 15 }} className="flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Login button */}
            <button type="submit" disabled={loading}
              className="btn-login w-full py-3.5 rounded-xl font-bold text-white tracking-wide disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ fontSize: ".9rem" }}>
              {loading ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" style={{ animation: "spin 1s linear infinite" }}>
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                  </svg>
                  Signing in…
                </>
              ) : (
                "Log In"
              )}
            </button>
          </form>

          {/* Demo creds */}
          <div className="mt-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 h-px bg-slate-200"/>
              <span className="text-xs text-slate-400 font-medium px-1">Demo Credentials</span>
              <div className="flex-1 h-px bg-slate-200"/>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { role:"OP Doctor", Icon:StethoscopeIcon, email:"opdesk@gmail.com", bg:"#eff6ff", border:"#bfdbfe", color:"#1e40af", roleType:"doctor" },
                { role:"Front Office", Icon:ApartmentIcon, email:"frontdesk@gmail.com", bg:"#f5f3ff", border:"#c4b5fd", color:"#5b21b6", roleType:"office" },
                { role:"Platform Admin", Icon:AdminPanelSettingsIcon, email:"platformdesk@gmail.com", bg:"#f0fdf4", border:"#86efac", color:"#166534", roleType:"platform" },
              ].map(c => (
                <div key={c.role} className="rounded-xl p-3 border cursor-pointer hover:shadow-md transition-all"
                  style={{ background: c.bg, borderColor: c.border }}
                  onClick={() => handleRoleSelect(c.email, c.roleType)}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <c.Icon sx={{ fontSize: 15, color: c.color }} />
                    <span className="text-xs font-bold" style={{ color: c.color }}>{c.role}</span>
                  </div>
                  <div className="text-xs truncate font-mono" style={{ color: c.color, opacity: .7 }}>{c.email}</div>
                  <div className="text-xs mt-0.5" style={{ color: c.color, opacity: .55 }}>Password@123</div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-sm mt-6" style={{ color: "var(--color-text-muted)" }}>
            New hospital?{" "}
            <Link to="/register" className="font-semibold hover:underline" style={{ color: "var(--color-primary)" }}>
              Create an account
            </Link>
          </p>
          <p className="text-center text-xs mt-2">
            <Link to="/" className="hover:underline" style={{ color: "var(--color-text-subtle)" }}>
              ← Back to Home
            </Link>
          </p>

          <p className="text-center text-xs text-slate-400 mt-5">
            © {currentYear} Medix · Secure Health Platform
          </p>
        </div>
      </div>
    </div>
  );
}
