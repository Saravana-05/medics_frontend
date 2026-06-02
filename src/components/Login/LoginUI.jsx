// src/components/Login/LoginUI.jsx
import { useState } from "react";
import DoctorImg from "../../assets/doctor2.svg";

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
    <div className="min-h-screen flex overflow-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&family=Sora:wght@600;700;800&display=swap');
        @keyframes floatA  { 0%,100%{transform:translateY(0)}   50%{transform:translateY(-10px)} }
        @keyframes floatB  { 0%,100%{transform:translateY(-6px)} 50%{transform:translateY(6px)}  }
        @keyframes floatC  { 0%,100%{transform:translateY(4px)}  50%{transform:translateY(-8px)} }
        @keyframes floatD  { 0%,100%{transform:translateY(-4px)} 50%{transform:translateY(8px)}  }
        @keyframes pulseRing { 0%,100%{opacity:.35;transform:scale(1)} 50%{opacity:.12;transform:scale(1.1)} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }
        .fa { animation: floatA 3.2s ease-in-out infinite }
        .fb { animation: floatB 3.8s ease-in-out infinite }
        .fc { animation: floatC 4.2s ease-in-out infinite }
        .fd { animation: floatD 3.5s ease-in-out infinite }
        .left-panel  { animation: slideIn .7s cubic-bezier(.22,1,.36,1) both }
        .su1 { animation: slideUp .5s cubic-bezier(.22,1,.36,1) .05s both }
        .su2 { animation: slideUp .5s cubic-bezier(.22,1,.36,1) .15s both }
        .su3 { animation: slideUp .5s cubic-bezier(.22,1,.36,1) .25s both }
        .su4 { animation: slideUp .5s cubic-bezier(.22,1,.36,1) .35s both }
        .su5 { animation: slideUp .5s cubic-bezier(.22,1,.36,1) .45s both }
        .su6 { animation: slideUp .5s cubic-bezier(.22,1,.36,1) .55s both }
        .su7 { animation: slideUp .5s cubic-bezier(.22,1,.36,1) .65s both }
        .input-ring:focus { box-shadow: 0 0 0 3px rgba(15,108,189,0.18); }
        .btn-login { transition: all .22s ease; background: linear-gradient(135deg,#0f6cbd,#1a9fd4); }
        .btn-login:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 10px 28px rgba(15,108,189,.45); }
        .btn-login:active:not(:disabled) { transform:translateY(0); }
        .role-btn { transition: all .15s ease; }
        .role-btn:hover { transform:translateY(-2px); }
      `}</style>

      {/* ═══════════ LEFT BLUE PANEL ═══════════ */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col overflow-hidden left-panel"
        style={{ background: "linear-gradient(145deg,#083358 0%,#0f6cbd 55%,#1a9fd4 100%)" }}>

        {/* Dot grid background */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="dotgrid" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.3" fill="white"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dotgrid)"/>
          </svg>
        </div>

        {/* Blobs */}
        <div className="absolute pointer-events-none" style={{ top:"-100px", left:"-100px", width:"400px", height:"400px", borderRadius:"50%", background:"rgba(255,255,255,.06)", animation:"pulseRing 5s ease-in-out infinite" }}/>
        <div className="absolute pointer-events-none" style={{ bottom:"-80px", right:"-60px", width:"320px", height:"320px", borderRadius:"50%", background:"rgba(255,255,255,.05)", animation:"pulseRing 6s ease-in-out 1.5s infinite" }}/>
        <div className="absolute pointer-events-none" style={{ top:"45%", left:"65%", width:"160px", height:"160px", borderRadius:"50%", background:"rgba(255,255,255,.04)" }}/>

        {/* Logo */}
        <div className="relative z-10 p-8 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background:"rgba(255,255,255,.15)", border:"1.5px solid rgba(255,255,255,.28)" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 2v20M9 5c0-1.657 1.343-3 3-3s3 1.343 3 3c0 3-6 3-6 6s6 3 6 6c0 1.657-1.343 3-3 3s-3-1.343-3-3" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <div className="text-white font-bold text-xl leading-none" style={{ fontFamily:"'Sora',sans-serif" }}>Medix</div>
            <div className="text-blue-200 text-xs">Healthcare Platform</div>
          </div>
        </div>

        {/* Illustration + floating cards */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
          <div className="relative" style={{ width:"400px", maxWidth:"100%" }}>
            {/* Floating stat cards */}
            <div className="fa absolute z-20" style={{ top:"0px", left:"-70px" }}>
              <div className="absolute flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl shadow-lg" style={{
                background: "rgba(255,255,255,0.13)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.22)",
              }}>
                <span className="text-xl">💊</span>
                <div>
                  <div className="text-white font-bold text-sm leading-none">3,820</div>
                  <div className="text-blue-200 text-xs mt-0.5 whitespace-nowrap">Prescriptions</div>
                </div>
              </div>
            </div>
            <div className="fb absolute z-20" style={{ top:"0px", right:"50px" }}>
              <div className="absolute flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl shadow-lg" style={{
                background: "rgba(255,255,255,0.13)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.22)",
              }}>
                <span className="text-xl">🔬</span>
                <div>
                  <div className="text-white font-bold text-sm leading-none">99.2%</div>
                  <div className="text-blue-200 text-xs mt-0.5 whitespace-nowrap">Report Accuracy</div>
                </div>
              </div>
            </div>
            <div className="fc absolute z-20" style={{ bottom:"44px", left:"-80px" }}>
              <div className="absolute flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl shadow-lg" style={{
                background: "rgba(255,255,255,0.13)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.22)",
              }}>
                <span className="text-xl">🩺</span>
                <div>
                  <div className="text-white font-bold text-sm leading-none">1,248</div>
                  <div className="text-blue-200 text-xs mt-0.5 whitespace-nowrap">Active Patients</div>
                </div>
              </div>
            </div>
            <div className="fd absolute z-20" style={{ bottom:"44px", right:"50px" }}>
              <div className="absolute flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl shadow-lg" style={{
                background: "rgba(255,255,255,0.13)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.22)",
              }}>
                <span className="text-xl">📋</span>
                <div>
                  <div className="text-white font-bold text-sm leading-none">94</div>
                  <div className="text-blue-200 text-xs mt-0.5 whitespace-nowrap">Today's OPD</div>
                </div>
              </div>
            </div>

            {/* Doctor image */}
            <div className="mx-auto overflow-hidden"
              style={{
                width: "320px",
                height: "320px",
                borderRadius: "40px",
                background: "rgba(255,255,255,0.08)",
                border: "1.5px solid rgba(255,255,255,0.18)",
                boxShadow: "0 24px 60px rgba(0,0,0,0.28), 0 0 0 8px rgba(255,255,255,0.06)",
                margin: "48px auto",
              }}>
              <img
                src={DoctorImg}
                alt="Doctor illustration"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Tagline */}
          <div className="text-center mt-2">
            <h2 className="text-white text-3xl font-bold tracking-tight" style={{ fontFamily:"'Sora',sans-serif" }}>
              Medix
            </h2>
            <p className="text-blue-200 text-sm mt-1.5 tracking-widest font-medium uppercase" style={{ fontSize:".72rem", letterSpacing:".15em" }}>
              Efficient · Organised · Reliable
            </p>
          </div>

          {/* Feature chips */}
          <div className="flex flex-wrap justify-center gap-2 mt-5">
            {["OP Prescriptions","Lab Reports","Patient Records","Appointments"].map(f => (
              <span key={f} className="text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{ background:"rgba(255,255,255,.12)", color:"rgba(255,255,255,.9)", border:"1px solid rgba(255,255,255,.2)" }}>
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10 pb-6 text-center">
          <p className="text-blue-300/60 text-xs">© {currentYear} Medix · Secure Health Platform</p>
        </div>
      </div>

      {/* ═══════════ RIGHT FORM PANEL ═══════════ */}
      <div className="flex-1 flex items-center justify-center bg-slate-50 px-6 py-12 overflow-auto">
        <div className="w-full max-w-[400px]">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 justify-center mb-8 su1">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background:"linear-gradient(135deg,#083358,#1a9fd4)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 2v20M9 5c0-1.657 1.343-3 3-3s3 1.343 3 3c0 3-6 3-6 6s6 3 6 6c0 1.657-1.343 3-3 3s-3-1.343-3-3" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-xl font-bold text-slate-800" style={{ fontFamily:"'Sora',sans-serif" }}>Medix</span>
          </div>

          {/* Icon + heading */}
          <div className="mb-7 su1">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
              style={{ background:"linear-gradient(135deg,#e8f2fb,#dbeafe)" }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0f6cbd" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <h1 className="font-bold text-slate-800 leading-tight" style={{ fontFamily:"'Sora',sans-serif", fontSize:"1.6rem" }}>
              Welcome back 👋
            </h1>
            <p className="text-slate-500 text-sm mt-1">Sign in to your Medix account to continue</p>
          </div>

          {/* Quick-fill role pills - Three columns for OP Doctor, Front Office, Platform Admin */}
          <div className="grid grid-cols-3 gap-2.5 mb-6 su2">
            <button 
              className="role-btn flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-semibold"
              style={{ background: "#eff6ff", borderColor: "#bfdbfe", color: "#1d4ed8" }}
              onClick={() => handleRoleSelect("opdesk@gmail.com", "doctor")}>
              <span className="text-base">🩺</span>
              <span>OP Doctor</span>
            </button>
            <button 
              className="role-btn flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-semibold"
              style={{ background: "#f5f3ff", borderColor: "#c4b5fd", color: "#6d28d9" }}
              onClick={() => handleRoleSelect("frontdesk@gmail.com", "office")}>
              <span className="text-base">🏥</span>
              <span>Front Office</span>
            </button>
            <button 
              className="role-btn flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-semibold"
              style={{ background: "#f0fdf4", borderColor: "#86efac", color: "#166534" }}
              onClick={() => handleRoleSelect("platformdesk@gmail.com", "platform")}>
              <span className="text-base">👨‍💻</span>
              <span>Platform Admin</span>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5 su3">
            <div className="flex-1 h-px bg-slate-200"/>
            <span className="text-xs text-slate-400 font-medium">or sign in manually</span>
            <div className="flex-1 h-px bg-slate-200"/>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div className="su3">
              <label className="block text-xs font-bold text-slate-500 mb-1.5 tracking-widest uppercase">Email</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                    stroke={focusEmail ? "#0f6cbd" : "#94a3b8"} strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <input type="email" required value={username}
                  onChange={e => setUsername(e.target.value)}
                  onFocus={() => setFocusEmail(true)} onBlur={() => setFocusEmail(false)}
                  placeholder="Enter your email"
                  className="input-ring w-full pl-10 pr-4 py-3 rounded-xl bg-white text-slate-800 text-sm outline-none transition-all duration-200"
                  style={{ border:`1.5px solid ${focusEmail ? "#0f6cbd" : "#d1dce9"}`, fontSize:".875rem" }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="su4">
              <label className="block text-xs font-bold text-slate-500 mb-1.5 tracking-widest uppercase">Password</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                    stroke={focusPwd ? "#0f6cbd" : "#94a3b8"} strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                </div>
                <input type={showPwd ? "text" : "password"} required value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocusPwd(true)} onBlur={() => setFocusPwd(false)}
                  placeholder="Enter your password"
                  className="input-ring w-full pl-10 pr-11 py-3 rounded-xl bg-white text-slate-800 text-sm outline-none transition-all duration-200"
                  style={{ border:`1.5px solid ${focusPwd ? "#0f6cbd" : "#d1dce9"}`, fontSize:".875rem" }}
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  {showPwd
                    ? <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                    : <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  }
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between su4">
              <label className="flex items-center gap-2.5 cursor-pointer" onClick={() => setRememberMe(!rememberMe)}>
                <div className="w-9 h-5 rounded-full relative transition-colors duration-200 flex-shrink-0"
                  style={{ background: rememberMe ? "#0f6cbd" : "#cbd5e1" }}>
                  <div className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-200"
                    style={{ left: rememberMe ? "18px" : "2px" }}/>
                </div>
                <span className="text-xs text-slate-500 select-none">Remember Me</span>
              </label>
              <button type="button" className="text-xs font-semibold transition-colors"
                style={{ color:"#0f6cbd" }}
                onMouseEnter={e => e.currentTarget.style.color="#083358"}
                onMouseLeave={e => e.currentTarget.style.color="#0f6cbd"}>
                Forgot Password?
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl text-xs su4"
                style={{ background:"#fef2f2", border:"1px solid #fca5a5", color:"#dc2626" }}>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                {error}
              </div>
            )}

            {/* Login button */}
            <button type="submit" disabled={loading}
              className="btn-login su5 w-full py-3.5 rounded-xl font-bold text-white tracking-wide disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ fontSize:".9rem" }}>
              {loading ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" style={{ animation:"spin 1s linear infinite" }}>
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                  </svg>
                  Signing in…
                </>
              ) : (
                <>
                  Log In
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Demo creds - Three columns for all roles */}
          <div className="mt-5 su6">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 h-px bg-slate-200"/>
              <span className="text-xs text-slate-400 font-medium px-1">Demo Credentials</span>
              <div className="flex-1 h-px bg-slate-200"/>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { role:"OP Doctor", icon:"🩺", email:"opdesk@gmail.com", bg:"#eff6ff", border:"#bfdbfe", color:"#1e40af", roleType:"doctor" },
                { role:"Front Office", icon:"🏥", email:"frontdesk@gmail.com", bg:"#f5f3ff", border:"#c4b5fd", color:"#5b21b6", roleType:"office" },
                { role:"Platform Admin", icon:"👨‍💻", email:"platformdesk@gmail.com", bg:"#f0fdf4", border:"#86efac", color:"#166534", roleType:"platform" },
              ].map(c => (
                <div key={c.role} className="rounded-xl p-3 border cursor-pointer hover:shadow-md transition-all"
                  style={{ background: c.bg, borderColor: c.border }}
                  onClick={() => handleRoleSelect(c.email, c.roleType)}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span>{c.icon}</span>
                    <span className="text-xs font-bold" style={{ color: c.color }}>{c.role}</span>
                  </div>
                  <div className="text-xs truncate font-mono" style={{ color: c.color, opacity: .7 }}>{c.email}</div>
                  <div className="text-xs mt-0.5" style={{ color: c.color, opacity: .55 }}>Password@123</div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-xs text-slate-400 mt-5 su7">
            © {currentYear} Medix · Secure Health Platform
          </p>
        </div>
      </div>
    </div>
  );
}