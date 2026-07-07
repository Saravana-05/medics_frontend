// src/components/PlatformDesk/Nurses.jsx
import { useState, useEffect } from "react";
import { UserCircle, Plus, Filter } from "lucide-react";
import TableUI from "../Table/TableUI";
import NurseFormModal from "../../modal/NurseFormModal";
import ViewNurseModal from "../../modal/ViewNurseModal";
import { getAllNurses, createNurse, updateNurse, deleteNurse } from "../../services/nurseService";
import { getAllStaff } from "../../services/staffService";
import { getAllDepartments } from "../../services/departmentService";
import { getAllClinics } from "../../services/clinicService";

export default function Nurses() {
  const [nurses, setNurses] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [clinics, setClinics] = useState([]); // Make sure clinics state is defined
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedNurse, setSelectedNurse] = useState(null);
  const [viewNurse, setViewNurse] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedDepartmentFilter, setSelectedDepartmentFilter] = useState("");
  const [selectedShiftFilter, setSelectedShiftFilter] = useState("");

  // Fetch staff, departments, and clinics for enrichment
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [staffData, deptData, clinicsData] = await Promise.all([
          getAllStaff(),
          getAllDepartments(),
          getAllClinics()
        ]);
        setStaffList(staffData);
        setDepartments(deptData);
        setClinics(clinicsData);
      } catch (err) {
        console.error("Error fetching reference data:", err);
      }
    };
    fetchData();
  }, []);

  // Fetch nurses from API
  useEffect(() => {
    fetchNurses();
  }, [selectedDepartmentFilter, selectedShiftFilter]);

  const fetchNurses = async () => {
    setLoading(true);
    try {
      let data = await getAllNurses();
      
      // Filter by department if selected
      if (selectedDepartmentFilter) {
        data = data.filter(nurse => nurse.department_id === selectedDepartmentFilter);
      }
      
      // Filter by shift if selected
      if (selectedShiftFilter) {
        data = data.filter(nurse => nurse.shift_type === selectedShiftFilter);
      }
      
      // Enrich data with staff, clinic, and department names
      const enrichedData = await Promise.all(data.map(async (nurse) => {
        const staff = staffList.find(s => s.id === nurse.staff_id);
        const department = departments.find(d => d.id === nurse.department_id);
        const clinic = clinics.find(c => c.id === staff?.clinic_id);
        return {
          ...nurse,
          ...staff,
          staff_name: staff ? `${staff.first_name} ${staff.last_name || ""}` : "Unknown",
          department_name: department ? department.department_name : "—",
          clinic_name: clinic ? clinic.clinic_name : "Unknown",
          full_name: staff ? `${staff.first_name} ${staff.last_name || ""}` : "Unknown",
          gender: staff?.gender,
          dob: staff?.dob,
          mobile: staff?.mobile,
          email: staff?.email,
          address_line1: staff?.address_line1,
          address_line2: staff?.address_line2,
          city: staff?.city,
          state: staff?.state,
          country: staff?.country,
          pincode: staff?.pincode,
          joining_date: staff?.joining_date,
          staff_code: staff?.staff_code
        };
      }));
      
      setNurses(enrichedData);
      setError(null);
    } catch (err) {
      setError("Failed to load nurses. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedNurse(null);
    setIsEdit(false);
    setShowModal(true);
  };

  const handleView = (nurse) => {
    // Enrich nurse data with clinic and department names for view
    const staff = staffList.find(s => s.id === nurse.staff_id);
    const department = departments.find(d => d.id === nurse.department_id);
    const clinic = clinics.find(c => c.id === staff?.clinic_id);
    const enrichedNurse = {
      ...nurse,
      ...staff,
      clinic_name: clinic ? clinic.clinic_name : "Unknown",
      department_name: department ? department.department_name : "—",
      full_name: staff ? `${staff.first_name} ${staff.last_name || ""}` : "Unknown",
      gender: staff?.gender,
      dob: staff?.dob,
      mobile: staff?.mobile,
      email: staff?.email,
      address_line1: staff?.address_line1,
      address_line2: staff?.address_line2,
      city: staff?.city,
      state: staff?.state,
      country: staff?.country,
      pincode: staff?.pincode,
      joining_date: staff?.joining_date,
      staff_code: staff?.staff_code
    };
    setViewNurse(enrichedNurse);
    setShowViewModal(true);
  };

  const handleEdit = (nurse) => {
    setSelectedNurse(nurse);
    setIsEdit(true);
    setShowModal(true);
  };

  const handleDelete = async (nurse) => {
    if (window.confirm(`Are you sure you want to delete nurse "${nurse.full_name}"?`)) {
      try {
        await deleteNurse(nurse.id);
        await fetchNurses();
      } catch (err) {
        console.error("Error deleting nurse:", err);
        alert("Failed to delete nurse. Please try again.");
      }
    }
  };

  const handleSave = async (formData) => {
    if (isEdit) {
      await updateNurse(selectedNurse.id, formData);
    } else {
      await createNurse(formData);
    }
    await fetchNurses();
    setShowModal(false);
  };

  const getShiftColor = (shift) => {
    switch(shift) {
      case "Morning": return "#d97706";
      case "Evening": return "#c2410c";
      case "Night": return "#4338ca";
      case "Rotational": return "#059669";
      case "On Call": return "var(--color-danger)";
      default: return "#6b7280";
    }
  };

  // Get unique shift types for filter dropdown
  const shiftTypes = [...new Set(nurses.map(n => n.shift_type))].filter(Boolean);

  const columns = [
    { key: "staff_code", label: "Staff Code", align: "left", sortable: true },
    { key: "full_name", label: "Nurse Name", align: "left", sortable: true },
    { key: "qualification", label: "Qualification", align: "left", sortable: true },
    { key: "shift_type", label: "Shift Type", align: "left", sortable: true },
    { key: "department_name", label: "Department", align: "left", sortable: true },
    { key: "status", label: "Status", align: "left", sortable: true },
  ];

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ background: "var(--color-surface-alt)" }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto" style={{ borderColor: "var(--color-success)" }}></div>
          <p className="text-sm mt-2" style={{ color: "var(--color-text-muted)" }}>Loading nurses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ background: "var(--color-surface-alt)" }}>
        <div className="text-center">
          <div className="p-3 rounded-full bg-red-100 mx-auto w-12 h-12 flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm mt-2" style={{ color: "var(--color-text-muted)" }}>{error}</p>
          <button 
            onClick={fetchNurses}
            className="mt-3 px-3 py-1 rounded-lg text-xs font-semibold"
            style={{ background: "var(--color-success)", color: "white" }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-4" style={{ background: "var(--color-surface-alt)", minHeight: "100%" }}>
        <div className="mb-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <UserCircle size={20} style={{ color: "var(--color-success)" }} />
              <div>
                <h2 className="text-lg font-bold" style={{ color: "var(--color-text-base)" }}>Nurse Management</h2>
                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>Manage all nursing staff across departments</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Department Filter Dropdown */}
              <select
                value={selectedDepartmentFilter}
                onChange={(e) => setSelectedDepartmentFilter(e.target.value)}
                className="px-2 py-1.5 text-xs rounded-lg border outline-none"
                style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>
                    {dept.department_name}
                  </option>
                ))}
              </select>
              
              {/* Shift Filter Dropdown */}
              <select
                value={selectedShiftFilter}
                onChange={(e) => setSelectedShiftFilter(e.target.value)}
                className="px-2 py-1.5 text-xs rounded-lg border outline-none"
                style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}
              >
                <option value="">All Shifts</option>
                {shiftTypes.map(shift => (
                  <option key={shift} value={shift}>
                    {shift}
                  </option>
                ))}
              </select>
              
              <button
                onClick={handleAdd}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm"
                style={{ background: "var(--color-success)", color: "white" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#16a34a"}
                onMouseLeave={(e) => e.currentTarget.style.background = "var(--color-success)"}
              >
                <Plus size={14} /> Add Nurse
              </button>
            </div>
          </div>
        </div>

        <TableUI
          columns={columns}
          data={nurses}
          title="Nurses List"
          searchPlaceholder="Search by name, qualification, shift..."
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Nurse Form Modal */}
      {showModal && (
        <NurseFormModal
          nurse={selectedNurse}
          isEdit={isEdit}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}

      {/* View Nurse Modal */}
      {showViewModal && (
        <ViewNurseModal
          nurse={viewNurse}
          onClose={() => setShowViewModal(false)}
        />
      )}
    </>
  );
}