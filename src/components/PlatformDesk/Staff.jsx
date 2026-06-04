// src/components/PlatformDesk/Staff.jsx
import { useState, useEffect } from "react";
import { Users, Plus, Filter } from "lucide-react";
import TableUI from "../Table/TableUI";
import StaffFormModal from "../../modal/StaffFormModal";
import ViewStaffModal from "../../modal/ViewStaffModal";
import { getAllStaff, createStaff, updateStaff, deleteStaff } from "../../services/staffService";
import { getAllClinics } from "../../services/clinicService";
import { getAllClinicBranches } from "../../services/clinicBranchService";
import { getAllDepartments } from "../../services/departmentService";

export default function Staff() {
  const [staffList, setStaffList] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [branches, setBranches] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [viewStaff, setViewStaff] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedClinicFilter, setSelectedClinicFilter] = useState("");

  // Fetch reference data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clinicsData, branchesData, deptsData] = await Promise.all([
          getAllClinics(),
          getAllClinicBranches(),
          getAllDepartments()
        ]);
        setClinics(clinicsData);
        setBranches(branchesData);
        setDepartments(deptsData);
      } catch (err) {
        console.error("Error fetching reference data:", err);
      }
    };
    fetchData();
  }, []);

  // Fetch staff from API
  useEffect(() => {
    fetchStaff();
  }, [selectedClinicFilter]);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      let data = await getAllStaff();
      
      // Filter by clinic if selected
      if (selectedClinicFilter) {
        data = data.filter(staff => staff.clinic_id === selectedClinicFilter);
      }
      
      // Enrich data with clinic, branch, and department names
      const enrichedData = await Promise.all(data.map(async (staff) => {
        const clinic = clinics.find(c => c.id === staff.clinic_id);
        const branch = branches.find(b => b.id === staff.branch_id);
        const department = departments.find(d => d.id === staff.department_id);
        return {
          ...staff,
          clinic_name: clinic ? clinic.clinic_name : "Unknown",
          branch_name: branch ? branch.branch_name : "—",
          department_name: department ? department.department_name : "—",
          full_name: `${staff.first_name || ""} ${staff.last_name || ""}`.trim()
        };
      }));
      
      setStaffList(enrichedData);
      setError(null);
    } catch (err) {
      setError("Failed to load staff. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedStaff(null);
    setIsEdit(false);
    setShowModal(true);
  };

  const handleView = (staff) => {
    // Enrich staff data with clinic, branch, and department names for view
    const clinic = clinics.find(c => c.id === staff.clinic_id);
    const branch = branches.find(b => b.id === staff.branch_id);
    const department = departments.find(d => d.id === staff.department_id);
    const enrichedStaff = {
      ...staff,
      clinic_name: clinic ? clinic.clinic_name : "Unknown",
      branch_name: branch ? branch.branch_name : "—",
      department_name: department ? department.department_name : "—"
    };
    setViewStaff(enrichedStaff);
    setShowViewModal(true);
  };

  const handleEdit = (staff) => {
    setSelectedStaff(staff);
    setIsEdit(true);
    setShowModal(true);
  };

  const handleDelete = async (staff) => {
    if (window.confirm(`Are you sure you want to delete staff "${staff.full_name}"?`)) {
      try {
        await deleteStaff(staff.id);
        await fetchStaff();
      } catch (err) {
        console.error("Error deleting staff:", err);
        alert("Failed to delete staff. Please try again.");
      }
    }
  };

  const handleSave = async (formData) => {
    if (isEdit) {
      await updateStaff(selectedStaff.id, formData);
    } else {
      await createStaff(formData);
    }
    await fetchStaff();
    setShowModal(false);
  };

  const columns = [
    { key: "staff_code", label: "Staff Code", align: "left", sortable: true },
    { key: "full_name", label: "Full Name", align: "left", sortable: true },
    { key: "designation", label: "Designation", align: "left", sortable: true },
    { key: "department_name", label: "Department", align: "left", sortable: true },
    { key: "mobile", label: "Mobile", align: "left", sortable: true },
    { key: "email", label: "Email", align: "left", sortable: true },
    { key: "status", label: "Status", align: "left", sortable: true },
  ];

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ background: "var(--color-surface-alt)" }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto" style={{ borderColor: "var(--color-warning)" }}></div>
          <p className="text-sm mt-2" style={{ color: "var(--color-text-muted)" }}>Loading staff...</p>
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
            onClick={fetchStaff}
            className="mt-3 px-3 py-1 rounded-lg text-xs font-semibold"
            style={{ background: "var(--color-warning)", color: "white" }}
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
              <Users size={20} style={{ color: "var(--color-warning)" }} />
              <div>
                <h2 className="text-lg font-bold" style={{ color: "var(--color-text-base)" }}>Staff Management</h2>
                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>Manage all staff members across clinics</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Clinic Filter Dropdown */}
              <select
                value={selectedClinicFilter}
                onChange={(e) => setSelectedClinicFilter(e.target.value)}
                className="px-2 py-1.5 text-xs rounded-lg border outline-none"
                style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}
              >
                <option value="">All Clinics</option>
                {clinics.map(clinic => (
                  <option key={clinic.id} value={clinic.id}>
                    {clinic.clinic_name}
                  </option>
                ))}
              </select>
              
              <button
                onClick={handleAdd}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm"
                style={{ background: "var(--color-warning)", color: "white" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#d97706"}
                onMouseLeave={(e) => e.currentTarget.style.background = "var(--color-warning)"}
              >
                <Plus size={14} /> Add Staff
              </button>
            </div>
          </div>
        </div>

        <TableUI
          columns={columns}
          data={staffList}
          title="Staff List"
          searchPlaceholder="Search by name, code, designation..."
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Staff Form Modal */}
      {showModal && (
        <StaffFormModal
          staff={selectedStaff}
          isEdit={isEdit}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}

      {/* View Staff Modal */}
      {showViewModal && (
        <ViewStaffModal
          staff={viewStaff}
          onClose={() => setShowViewModal(false)}
        />
      )}
    </>
  );
}