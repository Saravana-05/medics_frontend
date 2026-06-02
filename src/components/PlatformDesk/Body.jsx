// src/components/PlatformDesk/Body.jsx
import Clinic from "./Clinic";
import ClinicBranches from "./ClinicBranches";
import Departments from "./Departments";
// import Staff from "./Staff";
// import Doctors from "./Doctors";
// import Nurses from "./Nurses";
// import Patients from "./Patients";
import Reports from "./Reports";
import Settings from "./Settings";

export default function Body({ activeMenu }) {
  return (
    <div className="flex-1 overflow-y-auto" style={{ background: "var(--color-surface-alt)" }}>
      {activeMenu === "clinic" && <Clinic />}
      {activeMenu === "clinicBranches" && <ClinicBranches />}
      {activeMenu === "departments" && <Departments />}
      {/* {activeMenu === "staff" && <Staff />}
      {activeMenu === "doctors" && <Doctors />}
      {activeMenu === "nurses" && <Nurses />}
      {activeMenu === "patients" && <Patients />} */}
      {activeMenu === "reports" && <Reports />}
      {activeMenu === "settings" && <Settings />}
    </div>
  );
}