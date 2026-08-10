import { useState, useEffect } from "react";
import TopNav from "./components/TopNav";
import StatCard from "./components/StatCard";
import navMenus from "../../data/navMenus.json";
import { getHospitals } from "../../services/hospitalRegistry";

// Post-login main menu page — the doctor lands here right after signing in;
// OP Desk (and everything else) is reached from the top nav, not the other
// way around. Real user identity shows top-right (not Login/Register links).
export default function Dashboard({ user, onLogout }) {
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
      <TopNav user={user} onLogout={onLogout} notificationCount={3} />

      <div className="flex-1 px-4 sm:px-6 py-10 flex flex-col gap-10 max-w-[1200px] w-full mx-auto">

        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Welcome back, {user?.name || "Doctor"} 👋</h1>
          <p className="text-sm text-slate-400 mt-0.5">Use the menu above to open a module, or jump straight into OP Desk.</p>
        </div>

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
