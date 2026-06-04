// src/modal/DoctorFormModal.jsx
import { useState, useEffect } from "react";
import { X, Save, Stethoscope } from "lucide-react";
import { getAllStaff } from "../services/staffService";
import { getAllDepartments } from "../services/departmentService";
import { getAllClinics } from "../services/clinicService";

export default function DoctorFormModal({ doctor, onClose, onSave, isEdit = false }) {
  const [staffList, setStaffList] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [loadingStaff, setLoadingStaff] = useState(true);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [selectedClinicId, setSelectedClinicId] = useState("");
  const [formData, setFormData] = useState({
    staff_id: "",
    department_id: "",
    doctor_registration_no: "",
    qualification: "",
    specialization: "",
    consultation_fee: "",
    experience_years: "",
    available_from: "",
    available_to: "",
    signature_url: "",
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
    }
  }, [formData.staff_id, staffList]);

  useEffect(() => {
    if (doctor && isEdit) {
      setFormData({
        staff_id: doctor.staff_id || "",
        department_id: doctor.department_id || "",
        doctor_registration_no: doctor.doctor_registration_no || "",
        qualification: doctor.qualification || "",
        specialization: doctor.specialization || "",
        consultation_fee: doctor.consultation_fee || "",
        experience_years: doctor.experience_years || "",
        available_from: doctor.available_from || "",
        available_to: doctor.available_to || "",
        signature_url: doctor.signature_url || "",
        status: doctor.status || "ACTIVE"
      });
      
      // Set clinic based on staff
      if (doctor.staff_id) {
        const selectedStaff = staffList.find(s => s.id === doctor.staff_id);
        if (selectedStaff) {
          setSelectedClinicId(selectedStaff.clinic_id);
        }
      }
    }
  }, [doctor, isEdit, staffList]);

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
      console.error("Error saving doctor:", error);
      alert("Failed to save doctor. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="rounded-xl overflow-hidden shadow-2xl" style={{ background: "var(--color-surface)", width: "650px", maxHeight: "85vh", display: "flex", flexDirection: "column" }}>
        
        {/* Header */}
        <div className="px-4 py-3 flex justify-between items-center flex-shrink-0" style={{ background: "var(--color-primary)", color: "white" }}>
          <div className="flex items-center gap-2">
            <Stethoscope size={18} />
            <span className="text-sm font-bold">{isEdit ? "Edit Doctor" : "Add New Doctor"}</span>
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
              <h3 className="text-sm font-semibold mb-3 pb-1 border-b" style={{ color: "var(--color-primary)", borderColor: "var(--color-border)" }}>
                Basic Information
              </h3>
              <div className="grid grid-cols-2 gap-3">
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
                    Department *
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
                <div>
                  <label className="text-[0.65rem] font-bold uppercase tracking-wide block mb-1" style={{ color: "var(--color-text-muted)" }}>
                    Registration No
                  </label>
                  <input
                    type="text"
                    name="doctor_registration_no"
                    value={formData.doctor_registration_no}
                    onChange={handleChange}
                    className="w-full px-2 py-1.5 rounded text-sm outline-none"
                    style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}
                    placeholder="Enter registration number"
                  />
                </div>
                <div>
                  <label className="text-[0.65rem] font-bold uppercase tracking-wide block mb-1" style={{ color: "var(--color-text-muted)" }}>
                    Experience (Years)
                  </label>
                  <input
                    type="number"
                    name="experience_years"
                    value={formData.experience_years}
                    onChange={handleChange}
                    min="0"
                    step="1"
                    className="w-full px-2 py-1.5 rounded text-sm outline-none"
                    style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}
                    placeholder="Years of experience"
                  />
                </div>
              </div>
            </div>

            {/* Professional Details Section */}
            <div>
              <h3 className="text-sm font-semibold mb-3 pb-1 border-b" style={{ color: "var(--color-primary)", borderColor: "var(--color-border)" }}>
                Professional Details
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
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
                    placeholder="e.g., MBBS, MD, MS"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-[0.65rem] font-bold uppercase tracking-wide block mb-1" style={{ color: "var(--color-text-muted)" }}>
                    Specialization
                  </label>
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    className="w-full px-2 py-1.5 rounded text-sm outline-none"
                    style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}
                    placeholder="e.g., Cardiologist, Neurologist"
                  />
                </div>
                <div>
                  <label className="text-[0.65rem] font-bold uppercase tracking-wide block mb-1" style={{ color: "var(--color-text-muted)" }}>
                    Consultation Fee
                  </label>
                  <input
                    type="number"
                    name="consultation_fee"
                    value={formData.consultation_fee}
                    onChange={handleChange}
                    min="0"
                    step="100"
                    className="w-full px-2 py-1.5 rounded text-sm outline-none"
                    style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}
                    placeholder="Consultation fee amount"
                  />
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

            {/* Availability Section */}
            <div>
              <h3 className="text-sm font-semibold mb-3 pb-1 border-b" style={{ color: "var(--color-primary)", borderColor: "var(--color-border)" }}>
                Availability
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[0.65rem] font-bold uppercase tracking-wide block mb-1" style={{ color: "var(--color-text-muted)" }}>
                    Available From
                  </label>
                  <input
                    type="time"
                    name="available_from"
                    value={formData.available_from}
                    onChange={handleChange}
                    className="w-full px-2 py-1.5 rounded text-sm outline-none"
                    style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}
                  />
                </div>
                <div>
                  <label className="text-[0.65rem] font-bold uppercase tracking-wide block mb-1" style={{ color: "var(--color-text-muted)" }}>
                    Available To
                  </label>
                  <input
                    type="time"
                    name="available_to"
                    value={formData.available_to}
                    onChange={handleChange}
                    className="w-full px-2 py-1.5 rounded text-sm outline-none"
                    style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}
                  />
                </div>
              </div>
            </div>

            {/* Signature URL */}
            <div>
              <label className="text-[0.65rem] font-bold uppercase tracking-wide block mb-1" style={{ color: "var(--color-text-muted)" }}>
                Signature URL
              </label>
              <input
                type="text"
                name="signature_url"
                value={formData.signature_url}
                onChange={handleChange}
                className="w-full px-2 py-1.5 rounded text-sm outline-none"
                style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}
                placeholder="Enter signature image URL"
              />
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
                style={{ background: "var(--color-primary)" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "var(--color-primary-light)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "var(--color-primary)"}
              >
                {loading ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    {isEdit ? "Update Doctor" : "Create Doctor"}
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