// src/components/Login/LoginUI.jsx
import { Link } from "react-router-dom";
import { Stethoscope, CheckCircle2, UserRound } from "lucide-react";
import StethoscopeImg from "../../assets/stethoscope.png";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutlineOutlined";

export default function LoginUI({
  username,
  setUsername,
  password,
  setPassword,
  showPwd,
  setShowPwd,
  error,
  loading,
  showSuccess,
  rememberMe,
  setRememberMe,
  focusEmail,
  setFocusEmail,
  focusPwd,
  setFocusPwd,
  handleSubmit,
  currentYear
}) {
  return (
    <div className="min-h-screen flex overflow-hidden" style={{ fontFamily: "var(--font-inter)", background: "linear-gradient(135deg, var(--color-sidebar-bg) 0%, #0a4a6e 100%)" }}>
      <style>{`
        @keyframes spin { to{transform:rotate(360deg)} }
        .input-ring:focus { box-shadow: 0 0 0 3px rgba(15,108,189,0.18); }
        .btn-login { transition: all .22s ease; background: linear-gradient(135deg, var(--color-sidebar-bg) 0%, #0a4a6e 100%); }
        .btn-login:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 10px 28px rgba(10,58,92,.45); }
        .btn-login:active:not(:disabled) { transform:translateY(0); }
        @keyframes stethoscope-pulse { 0%,100% { transform: scale(1) rotate(-6deg); } 50% { transform: scale(1.15) rotate(6deg); } }
        @keyframes ring-spin { to { transform: rotate(360deg); } }
        @keyframes pop-in { 0% { transform: scale(0.85); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes check-pop { 0% { transform: scale(0); opacity: 0; } 60% { transform: scale(1.2); } 100% { transform: scale(1); opacity: 1; } }
      `}</style>

      {/* ═══════════ LEFT IMAGE PANEL — 60% — the given stethoscope photo ═══════════ */}
      <div className="hidden lg:block lg:w-[60%] relative">
        <img
          src={StethoscopeImg}
          alt="Stethoscope"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* ═══════════ RIGHT FORM PANEL — 40% ═══════════ */}
      <div className="w-full lg:w-[40%] flex items-center justify-center px-6 py-12 overflow-auto">
        <div className="w-full max-w-[400px] rounded-2xl shadow-2xl bg-white px-6 py-8 sm:px-8 sm:py-9">

          {/* Logo + Medix-branded welcome message */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg, var(--color-sidebar-bg) 0%, #0a4a6e 100%)" }}>
                <LocalHospitalIcon sx={{ color: "white", fontSize: 24 }} />
              </div>
              <span className="text-2xl font-bold text-slate-800" style={{ fontFamily: "var(--font-inter)" }}>Medix HMS</span>
            </div>
            <h1 className="font-bold text-slate-800 leading-tight" style={{ fontFamily: "var(--font-inter)", fontSize: "1.6rem" }}>
              Welcome back to Medix Hospital
            </h1>
            <p className="text-slate-500 text-sm mt-1">Sign in to continue to your hospital's workspace</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email / Username */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 tracking-widest uppercase">Email / Username</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
                  <UserRound size={16} style={{ color: focusEmail ? "var(--color-sidebar-bg)" : "#94a3b8" }} />
                </div>
                <input type="text" required value={username}
                  onChange={e => setUsername(e.target.value)}
                  onFocus={() => setFocusEmail(true)} onBlur={() => setFocusEmail(false)}
                  placeholder="example@gmail.com"
                  className="input-ring w-full pl-10 pr-4 py-3 rounded-xl bg-white text-slate-800 text-sm outline-none transition-all duration-200"
                  style={{ border: `1.5px solid ${focusEmail ? "var(--color-sidebar-bg)" : "var(--color-border)"}`, fontSize: ".875rem" }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 tracking-widest uppercase">Password</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
                  <LockOutlinedIcon sx={{ fontSize: 17, color: focusPwd ? "var(--color-sidebar-bg)" : "#94a3b8" }} />
                </div>
                <input type={showPwd ? "text" : "password"} required value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocusPwd(true)} onBlur={() => setFocusPwd(false)}
                  placeholder="Enter your password"
                  className="input-ring w-full pl-10 pr-11 py-3 rounded-xl bg-white text-slate-800 text-sm outline-none transition-all duration-200"
                  style={{ border: `1.5px solid ${focusPwd ? "var(--color-sidebar-bg)" : "var(--color-border)"}`, fontSize: ".875rem" }}
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
              <label className="flex items-center gap-2 cursor-pointer" onClick={() => setRememberMe(!rememberMe)}>
                <span className="flex items-center justify-center rounded transition-all flex-shrink-0"
                  style={{ width: 16, height: 16, border: `1.5px solid ${rememberMe ? "var(--color-sidebar-bg)" : "#cbd5e1"}`, background: rememberMe ? "var(--color-sidebar-bg)" : "white" }}>
                  {rememberMe && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M1.5 5.2L4 7.5L8.5 2" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <span className="text-xs text-slate-600 select-none">Remember Me</span>
              </label>
              <button type="button" className="text-xs font-semibold transition-colors"
                style={{ color: "var(--color-sidebar-bg)" }}
                onMouseEnter={e => e.currentTarget.style.color = "#083358"}
                onMouseLeave={e => e.currentTarget.style.color = "var(--color-sidebar-bg)"}>
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

          <p className="text-center text-sm mt-6" style={{ color: "var(--color-text-muted)" }}>
            New hospital?{" "}
            <Link to="/register" className="font-semibold hover:underline" style={{ color: "var(--color-sidebar-bg)" }}>
              Create an account
            </Link>
          </p>

          <p className="text-center text-xs text-slate-400 mt-5">
            © {currentYear} Medix · Secure Health Platform
          </p>
        </div>
      </div>

      {/* ═══════════ Success overlay — animated stethoscope while redirecting ═══════════ */}
      {showSuccess && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ background: "rgba(8,51,88,0.55)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)" }}>
          <div className="flex flex-col items-center gap-4 px-10 py-9 rounded-2xl shadow-2xl"
            style={{ background: "white", animation: "pop-in 280ms ease-out" }}>
            <div className="relative flex items-center justify-center" style={{ width: 84, height: 84 }}>
              <div className="absolute inset-0 rounded-full" style={{ border: "3px solid #dbeafe", borderTopColor: "var(--color-sidebar-bg)", animation: "ring-spin 900ms linear infinite" }} />
              <Stethoscope size={38} style={{ color: "var(--color-sidebar-bg)", animation: "stethoscope-pulse 1100ms ease-in-out infinite" }} />
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={18} style={{ color: "var(--color-success)", animation: "check-pop 400ms ease-out" }} />
              <span className="text-base font-bold text-slate-800">Login Successful</span>
            </div>
            <p className="text-xs text-slate-400 text-center">Welcome to Medix HMS — taking you to your workspace…</p>
          </div>
        </div>
      )}
    </div>
  );
}
