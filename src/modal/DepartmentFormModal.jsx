// src/modal/DepartmentFormModal.jsx
import { useState, useEffect } from "react";
import { X, Save, Building } from "lucide-react";
import { getAllClinics } from "../services/clinicService";

export default function DepartmentFormModal({ department, onClose, onSave, isEdit = false }) {
  const [clinics, setClinics] = useState([]);
  const [loadingClinics, setLoadingClinics] = useState(true);
  const [formData, setFormData] = useState({
    clinic_id: "",
    department_code: "",
    department_name: "",
    description: "",
    status: "ACTIVE"
  });
  const [loading, setLoading] = useState(false);

  // Fetch clinics for dropdown
  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const data = await getAllClinics();
        setClinics(data);
      } catch (error) {
        console.error("Error fetching clinics:", error);
      } finally {
        setLoadingClinics(false);
      }
    };
    fetchClinics();
  }, []);

  useEffect(() => {
    if (department && isEdit) {
      setFormData({
        clinic_id: department.clinic_id || "",
        department_code: department.department_code || "",
        department_name: department.department_name || "",
        description: department.description || "",
        status: department.status || "ACTIVE"
      });
    }
  }, [department, isEdit]);

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
      console.error("Error saving department:", error);
      alert("Failed to save department. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="rounded-xl overflow-hidden shadow-2xl" style={{ background: "var(--color-surface)", width: "550px", maxHeight: "85vh", display: "flex", flexDirection: "column" }}>
        
        {/* Header */}
        <div className="px-4 py-3 flex justify-between items-center flex-shrink-0" style={{ background: "var(--color-info)", color: "white" }}>
          <div className="flex items-center gap-2">
            <Building size={18} />
            <span className="text-sm font-bold">{isEdit ? "Edit Department" : "Add New Department"}</span>
          </div>
          <button onClick={onClose} className="p-1 rounded transition-all hover:bg-white/20">
            <X size={16} style={{ color: "white" }} />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Clinic Selection */}
            <div>
              <label className="text-[0.65rem] font-bold uppercase tracking-wide block mb-1" style={{ color: "var(--color-text-muted)" }}>
                Clinic *
              </label>
              <select
                name="clinic_id"
                value={formData.clinic_id}
                onChange={handleChange}
                required
                disabled={loadingClinics}
                className="w-full px-2 py-1.5 rounded text-sm outline-none"
                style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}
              >
                <option value="">Select Clinic</option>
                {clinics.map(clinic => (
                  <option key={clinic.id} value={clinic.id}>
                    {clinic.clinic_name} ({clinic.clinic_code})
                  </option>
                ))}
              </select>
              {loadingClinics && (
                <p className="text-[0.55rem] mt-1" style={{ color: "var(--color-text-muted)" }}>Loading clinics...</p>
              )}
            </div>

            {/* Department Code */}
            <div>
              <label className="text-[0.65rem] font-bold uppercase tracking-wide block mb-1" style={{ color: "var(--color-text-muted)" }}>
                Department Code
              </label>
              <input
                type="text"
                name="department_code"
                value={formData.department_code}
                onChange={handleChange}
                className="w-full px-2 py-1.5 rounded text-sm outline-none"
                style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}
                placeholder="Enter department code"
              />
            </div>

            {/* Department Name */}
            <div>
              <label className="text-[0.65rem] font-bold uppercase tracking-wide block mb-1" style={{ color: "var(--color-text-muted)" }}>
                Department Name *
              </label>
              <input
                type="text"
                name="department_name"
                value={formData.department_name}
                onChange={handleChange}
                required
                className="w-full px-2 py-1.5 rounded text-sm outline-none"
                style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}
                placeholder="Enter department name"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-[0.65rem] font-bold uppercase tracking-wide block mb-1" style={{ color: "var(--color-text-muted)" }}>
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-2 py-1.5 rounded text-sm outline-none resize-none"
                style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}
                placeholder="Enter department description"
              />
            </div>

            {/* Status */}
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
                style={{ background: "var(--color-info)" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#0284c7"}
                onMouseLeave={(e) => e.currentTarget.style.background = "var(--color-info)"}
              >
                {loading ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    {isEdit ? "Update Department" : "Create Department"}
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