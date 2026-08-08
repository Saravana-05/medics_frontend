import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import TopNav from "../Dashboard/components/TopNav";
import StatCard from "../Dashboard/components/StatCard";
import navMenus from "../../data/navMenus.json";
import { getHospitals } from "../../services/hospitalRegistry";

// Public "/" landing page — no login required. Shows the product's main
// menu system (what Medix HMS can do) and the two entry points: Login for
// an existing hospital, or Create New Hospital to onboard a new one.
export default function Home() {
  // Real platform-level counts (not per-hospital patient data, which this
  // public page never shows) — hospitals/doctors come from whatever's
  // actually been registered via "Create New Hospital" in this browser.
  const [hospitalCount, setHospitalCount] = useState(0);
  const [doctorCount, setDoctorCount] = useState(0);

  useEffect(() => {
    const hospitals = getHospitals();
    setHospitalCount(hospitals.length);
    // One admin login per hospital today, so doctor count mirrors hospital
    // count — kept as its own stat since that mapping may not always hold.
    setDoctorCount(hospitals.length);
  }, []);

  const moduleCount = navMenus.length;
  const featureCount = navMenus.reduce((sum, m) => sum + m.items.length, 0);

  const platformStats = [
    { key: "hospitals", label: "Hospitals Onboarded", value: hospitalCount, sublabel: "Books created", icon: "Users", color: "#2563eb", colorLight: "#dbeafe" },
    { key: "doctors", label: "Doctors Registered", value: doctorCount, sublabel: "Admin logins", icon: "UserPlus", color: "#8b5cf6", colorLight: "#ede9fe" },
    { key: "modules", label: "Modules Included", value: moduleCount, sublabel: "Open, Settings, Lab...", icon: "FolderOpen", color: "#22c55e", colorLight: "#dcfce7" },
    { key: "features", label: "Features Available", value: featureCount, sublabel: "Across all modules", icon: "ClipboardCheck", color: "#f97316", colorLight: "#ffedd5" },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#f4f6f9" }}>
      <TopNav publicMode />

      <div className="flex-1 px-4 sm:px-6 py-10 flex flex-col gap-10 max-w-[1200px] w-full mx-auto">

        {/* ── Hero ── */}
        <div className="text-center flex flex-col items-center gap-4 py-4">
          <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full" style={{ color: "#2563eb", background: "#dbeafe" }}>
            <Sparkles size={12} /> Hospital Management System
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 max-w-2xl leading-tight">
            Run your entire hospital — OPD, IPD, Lab, Pharmacy &amp; Billing — from one system
          </h1>
          <p className="text-sm sm:text-base text-slate-500 max-w-xl">
            Medix HMS brings patient records, prescriptions, lab orders, and reporting together in a single, fast, easy-to-use workspace.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
            <Link to="/register" className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:shadow-lg"
              style={{ background: "linear-gradient(135deg, #2563eb, #0ea5e9)" }}>
              Create New Hospital <ArrowRight size={15} />
            </Link>
            <Link to="/login" className="px-5 py-2.5 rounded-lg text-sm font-semibold text-slate-700 border border-slate-200 hover:bg-white transition-colors">
              Login to Your Hospital
            </Link>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
            <ShieldCheck size={13} /> No setup fees · Get started in minutes
          </div>
        </div>

        {/* ── Platform stats — real counts from this browser's hospital
            registry, not sample/per-hospital patient data. ── */}
        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-1">Platform at a glance</h2>
          <p className="text-sm text-slate-400 mb-4">Live counts from hospitals already onboarded on Medix HMS.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {platformStats.map(s => <StatCard key={s.key} {...s} />)}
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 flex items-center justify-between px-4 sm:px-6 py-4 text-[0.68rem] text-slate-400 border-t border-slate-100">
        <span>© {new Date().getFullYear()} Medix HMS. All rights reserved.</span>
        <span>Version 1.0.0</span>
      </div>
    </div>
  );
}
