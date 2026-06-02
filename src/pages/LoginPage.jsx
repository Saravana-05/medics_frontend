import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DoctorImg from "../assets/doctor2.svg";

const USERS = [
  { id: 1, username: "opdesk@gmail.com",    password: "Password@123", role: "doctor", name: "Dr. Aravind Kumar",  dept: "General OPD"  },
  { id: 2, username: "frontdesk@gmail.com", password: "Password@123", role: "office", name: "Priya Subramanian", dept: "Front Office"  },
];

// Route paths
const ROUTES = {
  DOCTOR: "/opdesk",
  OFFICE: "/frontdesk",
};

/* ── Floating stat card ── */
function StatCard({ icon, value, label, style }) {
  return (
    <div className="absolute flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl shadow-lg" style={{
      background: "rgba(255,255,255,0.13)",
      backdropFilter: "blur(12px)",
      border: "1px solid rgba(255,255,255,0.22)",
      ...style,
    }}>
      <span className="text-xl">{icon}</span>
      <div>
        <div className="text-white font-bold text-sm leading-none">{value}</div>
        <div className="text-blue-200 text-xs mt-0.5 whitespace-nowrap">{label}</div>
      </div>
    </div>
  );
}

/* ── SVG Doctor scene ── */
function DoctorScene() {
  return (
    <svg viewBox="0 0 360 440" fill="none" xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-[300px] mx-auto drop-shadow-2xl">
      {/* Glow halo */}
      <ellipse cx="180" cy="210" rx="130" ry="140" fill="rgba(255,255,255,0.05)"/>
      <ellipse cx="180" cy="210" rx="95"  ry="105" fill="rgba(255,255,255,0.04)"/>

      {/* ── Coat ── */}
      <path d="M108 295 C102 268 96 245 94 215 L138 198 L148 272 Z" fill="white" opacity="0.96"/>
      <path d="M252 295 C258 268 264 245 266 215 L222 198 L212 272 Z" fill="white" opacity="0.96"/>
      <path d="M138 198 L148 272 L212 272 L222 198 C205 190 155 190 138 198Z" fill="white" opacity="0.96"/>
      {/* Coat lapels */}
      <path d="M162 200 L172 218 L180 205 L172 196Z" fill="#e2e8f0"/>
      <path d="M198 200 L188 218 L180 205 L188 196Z" fill="#e2e8f0"/>

      {/* ── Shirt / Tie ── */}
      <path d="M172 218 L180 236 L188 218 L184 200 L176 200Z" fill="#1e40af" opacity="0.75"/>
      <path d="M177 236 L180 275 L183 236 L180 230Z" fill="#1e40af" opacity="0.65"/>

      {/* ── Stethoscope ── */}
      <path d="M135 215 Q120 242 124 263 Q128 280 146 280 Q164 280 168 263" stroke="#94a3b8" strokeWidth="3.2" fill="none" strokeLinecap="round"/>
      <circle cx="146" cy="280" r="7"  fill="#475569"/>
      <circle cx="146" cy="280" r="3.5" fill="#cbd5e1"/>

      {/* ── Head ── */}
      <ellipse cx="180" cy="136" rx="46" ry="50" fill="#fddcbc"/>

      {/* ── Hair ── */}
      <path d="M134 124 Q136 84 180 80 Q224 84 226 124 Q218 98 180 95 Q142 98 134 124Z" fill="#1e1008"/>
      <path d="M134 124 Q130 110 134 102 Q138 92 144 88" stroke="#1e1008" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      <path d="M226 124 Q230 110 226 102 Q222 92 216 88" stroke="#1e1008" strokeWidth="3.5" fill="none" strokeLinecap="round"/>

      {/* ── Glasses ── */}
      <rect x="143" y="133" width="28" height="20" rx="10" stroke="#1e293b" strokeWidth="2.5" fill="rgba(219,234,254,0.45)"/>
      <rect x="189" y="133" width="28" height="20" rx="10" stroke="#1e293b" strokeWidth="2.5" fill="rgba(219,234,254,0.45)"/>
      <line x1="171" y1="143" x2="189" y2="143" stroke="#1e293b" strokeWidth="2.2"/>
      <line x1="135" y1="140" x2="143" y2="138" stroke="#1e293b" strokeWidth="2"/>
      <line x1="225" y1="140" x2="217" y2="138" stroke="#1e293b" strokeWidth="2"/>

      {/* ── Eyes ── */}
      <circle cx="157" cy="143" r="4"   fill="#1e293b"/>
      <circle cx="203" cy="143" r="4"   fill="#1e293b"/>
      <circle cx="158.5" cy="142" r="1.2" fill="white"/>
      <circle cx="204.5" cy="142" r="1.2" fill="white"/>

      {/* ── Nose ── */}
      <path d="M177 152 Q180 158 183 152" stroke="#c9956a" strokeWidth="1.8" fill="none" strokeLinecap="round"/>

      {/* ── Smile ── */}
      <path d="M164 164 Q180 175 196 164" stroke="#c47b5a" strokeWidth="2.2" fill="none" strokeLinecap="round"/>

      {/* ── Ears ── */}
      <ellipse cx="134" cy="140" rx="7.5" ry="11" fill="#fddcbc"/>
      <ellipse cx="226" cy="140" rx="7.5" ry="11" fill="#fddcbc"/>

      {/* ── Neck ── */}
      <rect x="168" y="178" width="24" height="22" rx="5" fill="#fddcbc"/>

      {/* ── Left arm + clipboard ── */}
      <path d="M108 222 Q90 238 86 260 L108 263 Q113 244 124 233Z" fill="white" opacity="0.92"/>
      <rect x="62" y="252" width="52" height="68" rx="6" fill="#e8edf5" stroke="#c8d4e8" strokeWidth="1.5"/>
      <rect x="67" y="246" width="42" height="13" rx="4" fill="#94a3b8"/>
      <rect x="72" y="250" width="32" height="5" rx="2.5" fill="#cbd5e1"/>
      {/* Clipboard lines */}
      <line x1="68" y1="273" x2="108" y2="273" stroke="#94a3b8" strokeWidth="2"/>
      <line x1="68" y1="281" x2="108" y2="281" stroke="#94a3b8" strokeWidth="2"/>
      <line x1="68" y1="289" x2="95"  y2="289" stroke="#94a3b8" strokeWidth="2"/>
      {/* Chart spark */}
      <polyline points="68,306 74,300 80,305 87,295 94,301 101,296 108,299" stroke="#1d4ed8" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>

      {/* ── Right arm raised (greeting) ── */}
      <path d="M252 222 Q272 232 283 246 L269 256 Q258 242 238 234Z" fill="white" opacity="0.92"/>
      <ellipse cx="285" cy="254" rx="13" ry="13" fill="#fddcbc"/>
      {/* Hand fingers hint */}
      <line x1="280" y1="244" x2="278" y2="240" stroke="#fddcbc" strokeWidth="3.5" strokeLinecap="round"/>
      <line x1="286" y1="242" x2="285" y2="238" stroke="#fddcbc" strokeWidth="3.5" strokeLinecap="round"/>
      <line x1="292" y1="244" x2="292" y2="240" stroke="#fddcbc" strokeWidth="3.5" strokeLinecap="round"/>

      {/* ── Doctor badge ── */}
      <rect x="156" y="220" width="48" height="30" rx="5" fill="#dbeafe" stroke="#93c5fd" strokeWidth="1.2"/>
      <circle cx="166" cy="231" r="5.5" fill="#1d4ed8" opacity="0.7"/>
      <text x="175" y="234" fill="#1e40af" fontSize="7.5" fontWeight="bold" fontFamily="sans-serif">Dr.</text>
      <line x1="174" y1="238" x2="197" y2="238" stroke="#93c5fd" strokeWidth="1.8"/>
      <line x1="174" y1="243" x2="190" y2="243" stroke="#93c5fd" strokeWidth="1.8"/>

      {/* ── Trousers ── */}
      <path d="M148 272 L140 315 L168 315 L180 290 L192 315 L220 315 L212 272Z" fill="#334155"/>

      {/* ── Shoes ── */}
      <ellipse cx="154" cy="318" rx="20" ry="9" fill="#1e293b" opacity="0.88"/>
      <ellipse cx="206" cy="318" rx="20" ry="9" fill="#1e293b" opacity="0.88"/>

      {/* ── Mini floating elements ── */}
      {/* ECG chip top-right */}
      <rect x="238" y="158" width="78" height="44" rx="9" fill="rgba(255,255,255,0.11)" stroke="rgba(255,255,255,0.22)" strokeWidth="1"/>
      <polyline points="244,180 250,180 255,167 262,193 269,167 276,180 283,180 289,172 296,180 308,180" stroke="#4ade80" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <text x="244" y="196" fill="rgba(255,255,255,0.6)" fontSize="7" fontFamily="sans-serif">❤ 72 bpm</text>

      {/* Pills chip top-left */}
      <rect x="14" y="168" width="66" height="38" rx="9" fill="rgba(255,255,255,0.11)" stroke="rgba(255,255,255,0.22)" strokeWidth="1"/>
      <text x="20" y="182" fill="white" fontSize="9" fontWeight="bold" fontFamily="sans-serif">💊 Rx</text>
      <text x="20" y="197" fill="rgba(255,255,255,0.65)" fontSize="7.2" fontFamily="sans-serif">4 prescriptions</text>
    </svg>
  );
}

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [username,    setUsername]    = useState("");
  const [password,    setPassword]    = useState("");
  const [showPwd,     setShowPwd]     = useState(false);
  const [error,       setError]       = useState("");
  const [loading,     setLoading]     = useState(false);
  const [rememberMe,  setRememberMe]  = useState(false);
  const [focusEmail,  setFocusEmail]  = useState(false);
  const [focusPwd,    setFocusPwd]    = useState(false);
  const currentYear = new Date().getFullYear();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(""); 
    setLoading(true);
    
    setTimeout(() => {
      const user = USERS.find(u => u.username === username.trim() && u.password === password);
      if (user) {
        // Call the onLogin callback to set user in App state
        onLogin(user);
        
        // Navigate based on user role
        if (user.role === "doctor") {
          navigate(ROUTES.DOCTOR);
        } else if (user.role === "office") {
          navigate(ROUTES.OFFICE);
        }
      } else {
        setError("Invalid email or password. Please try again.");
        setLoading(false);
      }
    }, 700);
  };

  const handleRoleSelect = (email, role) => {
    setUsername(email);
    setPassword("Password@123");
    // Optional: Auto-submit after role selection
    // You can uncomment this for auto-login
    // setTimeout(() => {
    //   const user = USERS.find(u => u.username === email && u.password === "Password@123");
    //   if (user) {
    //     onLogin(user);
    //     navigate(role === "doctor" ? ROUTES.DOCTOR : ROUTES.OFFICE);
    //   }
    // }, 100);
  };

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
              <StatCard icon="💊" value="3,820" label="Prescriptions" style={{}} />
            </div>
            <div className="fb absolute z-20" style={{ top:"0px", right:"50px" }}>
              <StatCard icon="🔬" value="99.2%" label="Report Accuracy" style={{}} />
            </div>
            <div className="fc absolute z-20" style={{ bottom:"44px", left:"-80px" }}>
              <StatCard icon="🩺" value="1,248" label="Active Patients" style={{}} />
            </div>
            <div className="fd absolute z-20" style={{ bottom:"44px", right:"50px" }}>
              <StatCard icon="📋" value="94" label="Today's OPD" style={{}} />
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

          {/* Quick-fill role pills */}
          <div className="grid grid-cols-2 gap-2.5 mb-6 su2">
            {[
              { label:"OP Doctor",    icon:"🩺", email:"opdesk@gmail.com",    accent:"#1d4ed8", bg:"#eff6ff", border:"#bfdbfe", role:"doctor" },
              { label:"Front Office", icon:"🏥", email:"frontdesk@gmail.com", accent:"#6d28d9", bg:"#f5f3ff", border:"#c4b5fd", role:"office" },
            ].map(r => (
              <button key={r.label} className="role-btn flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-semibold"
                style={{ background: r.bg, borderColor: r.border, color: r.accent }}
                onClick={() => handleRoleSelect(r.email, r.role)}>
                <span className="text-base">{r.icon}</span>
                <span>{r.label}</span>
              </button>
            ))}
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

          {/* Demo creds */}
          <div className="mt-5 su6">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 h-px bg-slate-200"/>
              <span className="text-xs text-slate-400 font-medium px-1">Demo Credentials</span>
              <div className="flex-1 h-px bg-slate-200"/>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { role:"OP Doctor",    icon:"🩺", email:"opdesk@gmail.com",    bg:"#eff6ff", border:"#bfdbfe", color:"#1e40af" },
                { role:"Front Office", icon:"🏥", email:"frontdesk@gmail.com", bg:"#f5f3ff", border:"#c4b5fd", color:"#5b21b6" },
              ].map(c => (
                <div key={c.role} className="rounded-xl p-3 border cursor-pointer hover:shadow-md transition-all"
                  style={{ background:c.bg, borderColor:c.border }}
                  onClick={() => {
                    setUsername(c.email);
                    setPassword("Password@123");
                    // Optional: Auto-submit
                    // const user = USERS.find(u => u.username === c.email);
                    // if (user) {
                    //   onLogin(user);
                    //   navigate(c.role === "OP Doctor" ? ROUTES.DOCTOR : ROUTES.OFFICE);
                    // }
                  }}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span>{c.icon}</span>
                    <span className="text-xs font-bold" style={{ color:c.color }}>{c.role}</span>
                  </div>
                  <div className="text-xs truncate font-mono" style={{ color:c.color, opacity:.7 }}>{c.email}</div>
                  <div className="text-xs mt-0.5" style={{ color:c.color, opacity:.55 }}>Password@123</div>
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