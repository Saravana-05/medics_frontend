// src/components/PlatformDesk/Departments.jsx
import { useState, useEffect } from "react";
import { Building, Plus, Filter } from "lucide-react";
import TableUI from "../Table/TableUI";
import DepartmentFormModal from "../../modal/DepartmentFormModal";
import { getAllDepartments, createDepartment, updateDepartment, deleteDepartment } from "../../services/departmentService";
import { getAllClinics } from "../../services/clinicService";

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedClinicFilter, setSelectedClinicFilter] = useState("");

  // Fetch clinics for filter dropdown
  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const data = await getAllClinics();
        setClinics(data);
      } catch (err) {
        console.error("Error fetching clinics:", err);
      }
    };
    fetchClinics();
  }, []);

  // Fetch departments from API
  useEffect(() => {
    fetchDepartments();
  }, [selectedClinicFilter]);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      let data = await getAllDepartments();
      
      // Filter by clinic if selected
      if (selectedClinicFilter) {
        data = data.filter(dept => dept.clinic_id === selectedClinicFilter);
      }
      
      // Enrich data with clinic names
      const enrichedData = await Promise.all(data.map(async (dept) => {
        const clinic = clinics.find(c => c.id === dept.clinic_id);
        return {
          ...dept,
          clinic_name: clinic ? clinic.clinic_name : "Unknown"
        };
      }));
      
      setDepartments(enrichedData);
      setError(null);
    } catch (err) {
      setError("Failed to load departments. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedDepartment(null);
    setIsEdit(false);
    setShowModal(true);
  };

  const handleView = (department) => {
    console.log("View department:", department);
    alert(`View Department: ${department.department_name}`);
  };

  const handleEdit = (department) => {
    setSelectedDepartment(department);
    setIsEdit(true);
    setShowModal(true);
  };

  const handleDelete = async (department) => {
    if (window.confirm(`Are you sure you want to delete department "${department.department_name}"?`)) {
      try {
        await deleteDepartment(department.id);
        await fetchDepartments();
      } catch (err) {
        console.error("Error deleting department:", err);
        alert("Failed to delete department. Please try again.");
      }
    }
  };

  const handleSave = async (formData) => {
    if (isEdit) {
      await updateDepartment(selectedDepartment.id, formData);
    } else {
      await createDepartment(formData);
    }
    await fetchDepartments();
    setShowModal(false);
  };

  const getClinicName = (clinicId) => {
    const clinic = clinics.find(c => c.id === clinicId);
    return clinic ? clinic.clinic_name : "Unknown";
  };

  const columns = [
    { key: "department_code", label: "Dept Code", align: "left", sortable: true },
    { key: "department_name", label: "Department Name", align: "left", sortable: true },
    { 
      key: "clinic_name", 
      label: "Clinic", 
      align: "left", 
      sortable: true,
      render: (row) => getClinicName(row.clinic_id)
    },
    { key: "description", label: "Description", align: "left", sortable: false },
    { key: "status", label: "Status", align: "left", sortable: true },
  ];

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ background: "var(--color-surface-alt)" }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto" style={{ borderColor: "var(--color-info)" }}></div>
          <p className="text-sm mt-2" style={{ color: "var(--color-text-muted)" }}>Loading departments...</p>
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
            onClick={fetchDepartments}
            className="mt-3 px-3 py-1 rounded-lg text-xs font-semibold"
            style={{ background: "var(--color-info)", color: "white" }}
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
              <Building size={20} style={{ color: "var(--color-info)" }} />
              <div>
                <h2 className="text-lg font-bold" style={{ color: "var(--color-text-base)" }}>Department Management</h2>
                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>Manage all departments across clinics</p>
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
                style={{ background: "var(--color-info)", color: "white" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#0284c7"}
                onMouseLeave={(e) => e.currentTarget.style.background = "var(--color-info)"}
              >
                <Plus size={14} /> Add Department
              </button>
            </div>
          </div>
        </div>

        <TableUI
          columns={columns}
          data={departments}
          title="Departments List"
          searchPlaceholder="Search by name, code..."
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Department Form Modal */}
      {showModal && (
        <DepartmentFormModal
          department={selectedDepartment}
          isEdit={isEdit}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </>
  );
}