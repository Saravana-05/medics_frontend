// src/modal/NurseFormModal.jsx
import { useState, useEffect } from "react";
import { X, Save, UserCircle } from "lucide-react";
import { getAllStaff } from "../services/staffService";
import { getAllDepartments } from "../services/departmentService";
import { getAllClinics } from "../services/clinicService";

export default function NurseFormModal({ nurse, onClose, onSave, isEdit = false }) {
  const [staffList, setStaffList] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [loadingStaff, setLoadingStaff] = useState(true);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [selectedClinicId, setSelectedClinicId] = useState("");
  const [formData, setFormData] = useState({
    staff_id: "",
    department_id: "",
    qualification: "",
    shift_type: "",
    status: "ACTIVE"
  });
  const [loading, setLoading] = useState(false);

  // Fetch clinics
  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const data = await getAllClinics();
        setClinics(data);
      } catch (error) {
        console.error("Error fetching clinics:", error);
      }
    };
    fetchClinics();
  }, []);

  // Fetch staff for dropdown
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const data = await getAllStaff();
        setStaffList(data);
      } catch (error) {
        console.error("Error fetching staff:", error);
      } finally {
        setLoadingStaff(false);
      }
    };
    fetchStaff();
  }, []);

  // Fetch departments when clinic is selected
  useEffect(() => {
    const fetchDepartments = async () => {
      if (selectedClinicId) {
        setLoadingDepartments(true);
        try {
          const data = await getAllDepartments();
          const filteredDepts = data.filter(d => d.clinic_id === selectedClinicId);
          setDepartments(filteredDepts);
        } catch (error) {
          console.error("Error fetching departments:", error);
        } finally {
          setLoadingDepartments(false);
        }
      } else {
        setDepartments([]);
      }
    };
    fetchDepartments();
  }, [selectedClinicId]);

  // Set selected clinic when staff changes
  useEffect(() => {
    if (formData.staff_id) {
      const selectedStaff = staffList.find(s => s.id === formData.staff_id);
      if (selectedStaff) {
        setSelectedClinicId(selectedStaff.clinic_id);
      }
    } else {
      setSelectedClinicId("");
    }
  }, [formData.staff_id, staffList]);

  useEffect(() => {
    if (nurse && isEdit) {
      setFormData({
        staff_id: nurse.staff_id || "",
        department_id: nurse.department_id || "",
        qualification: nurse.qualification || "",
        shift_type: nurse.shift_type || "",
        status: nurse.status || "ACTIVE"
      });
      
      // Set clinic based on staff
      if (nurse.staff_id) {
        const selectedStaff = staffList.find(s => s.id === nurse.staff_id);
        if (selectedStaff) {
          setSelectedClinicId(selectedStaff.clinic_id);
        }
      }
    }
  }, [nurse, isEdit, staffList]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error saving nurse:", error);
      alert("Failed to save nurse. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const shiftOptions = [
    { value: "General", label: "General" },
    { value: "Morning", label: "Morning (6 AM - 2 PM)" },
    { value: "Evening", label: "Evening (2 PM - 10 PM)" },
    { value: "Night", label: "Night (10 PM - 6 AM)" },
    { value: "Rotational", label: "Rotational" },
    { value: "On Call", label: "On Call" }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="rounded-xl overflow-hidden shadow-2xl" style={{ background: "var(--color-surface)", width: "550px", maxHeight: "85vh", display: "flex", flexDirection: "column" }}>
        
        {/* Header */}
        <div className="px-4 py-3 flex justify-between items-center flex-shrink-0" style={{ background: "var(--color-success)", color: "white" }}>
          <div className="flex items-center gap-2">
            <UserCircle size={18} />
            <span className="text-sm font-bold">{isEdit ? "Edit Nurse" : "Add New Nurse"}</span>
          </div>
          <button onClick={onClose} className="p-1 rounded transition-all hover:bg-white/20">
            <X size={16} style={{ color: "white" }} />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Information Section */}
            <div>
              <h3 className="text-sm font-semibold mb-3 pb-1 border-b" style={{ color: "var(--color-success)", borderColor: "var(--color-border)" }}>
                Basic Information
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-[0.65rem] font-bold uppercase tracking-wide block mb-1" style={{ color: "var(--color-text-muted)" }}>
                    Staff *
                  </label>
                  <select
                    name="staff_id"
                    value={formData.staff_id}
                    onChange={handleChange}
                    required
                    disabled={loadingStaff}
                    className="w-full px-2 py-1.5 rounded text-sm outline-none"
                    style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}
                  >
                    <option value="">Select Staff</option>
                    {staffList.map(staff => (
                      <option key={staff.id} value={staff.id}>
                        {staff.first_name} {staff.last_name || ""} ({staff.staff_code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[0.65rem] font-bold uppercase tracking-wide block mb-1" style={{ color: "var(--color-text-muted)" }}>
                    Department
                  </label>
                  <select
                    name="department_id"
                    value={formData.department_id}
                    onChange={handleChange}
                    disabled={loadingDepartments || !selectedClinicId}
                    className="w-full px-2 py-1.5 rounded text-sm outline-none"
                    style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>
                        {dept.department_name} ({dept.department_code || "N/A"})
                      </option>
                    ))}
                  </select>
                  {!selectedClinicId && formData.staff_id && (
                    <p className="text-[0.55rem] mt-1" style={{ color: "var(--color-text-muted)" }}>
                      Please select staff first to load departments
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Professional Details Section */}
            <div>
              <h3 className="text-sm font-semibold mb-3 pb-1 border-b" style={{ color: "var(--color-success)", borderColor: "var(--color-border)" }}>
                Professional Details
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-[0.65rem] font-bold uppercase tracking-wide block mb-1" style={{ color: "var(--color-text-muted)" }}>
                    Qualification
                  </label>
                  <input
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    className="w-full px-2 py-1.5 rounded text-sm outline-none"
                    style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}
                    placeholder="e.g., B.Sc Nursing, GNM"
                  />
                </div>

                <div>
                  <label className="text-[0.65rem] font-bold uppercase tracking-wide block mb-1" style={{ color: "var(--color-text-muted)" }}>
                    Shift Type *
                  </label>
                  <select
                    name="shift_type"
                    value={formData.shift_type}
                    onChange={handleChange}
                    required
                    className="w-full px-2 py-1.5 rounded text-sm outline-none"
                    style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}
                  >
                    <option value="">Select Shift Type</option>
                    {shiftOptions.map(shift => (
                      <option key={shift.value} value={shift.value}>
                        {shift.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[0.65rem] font-bold uppercase tracking-wide block mb-1" style={{ color: "var(--color-text-muted)" }}>
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-2 py-1.5 rounded text-sm outline-none"
                    style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded text-sm font-semibold transition-all"
                style={{ border: "1px solid var(--color-border)", color: "var(--color-text-muted)" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "var(--color-surface-alt)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-3 py-1.5 rounded text-sm font-semibold text-white transition-all flex items-center gap-1"
                style={{ background: "var(--color-success)" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#16a34a"}
                onMouseLeave={(e) => e.currentTarget.style.background = "var(--color-success)"}
              >
                {loading ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    {isEdit ? "Update Nurse" : "Create Nurse"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}