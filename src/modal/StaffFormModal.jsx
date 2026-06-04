// src/modal/StaffFormModal.jsx
import { useState, useEffect } from "react";
import { X, Save, Users } from "lucide-react";
import { getAllClinics } from "../services/clinicService";
import { getAllClinicBranches } from "../services/clinicBranchService";
import { getAllDepartments } from "../services/departmentService";

export default function StaffFormModal({ staff, onClose, onSave, isEdit = false }) {
  const [clinics, setClinics] = useState([]);
  const [branches, setBranches] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loadingClinics, setLoadingClinics] = useState(true);
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [formData, setFormData] = useState({
    clinic_id: "",
    staff_code: "",
    first_name: "",
    branch_id: "",
    department_id: "",
    user_id: "",
    last_name: "",
    gender: "",
    dob: "",
    mobile: "",
    email: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    designation: "",
    joining_date: "",
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

  // Fetch branches when clinic changes
  useEffect(() => {
    const fetchBranches = async () => {
      if (formData.clinic_id) {
        setLoadingBranches(true);
        try {
          const data = await getAllClinicBranches();
          const filteredBranches = data.filter(b => b.clinic_id === formData.clinic_id);
          setBranches(filteredBranches);
        } catch (error) {
          console.error("Error fetching branches:", error);
        } finally {
          setLoadingBranches(false);
        }
      } else {
        setBranches([]);
      }
    };
    fetchBranches();
  }, [formData.clinic_id]);

  // Fetch departments when clinic changes
  useEffect(() => {
    const fetchDepartments = async () => {
      if (formData.clinic_id) {
        setLoadingDepartments(true);
        try {
          const data = await getAllDepartments();
          const filteredDepts = data.filter(d => d.clinic_id === formData.clinic_id);
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
  }, [formData.clinic_id]);

  useEffect(() => {
    if (staff && isEdit) {
      setFormData({
        clinic_id: staff.clinic_id || "",
        staff_code: staff.staff_code || "",
        first_name: staff.first_name || "",
        branch_id: staff.branch_id || "",
        department_id: staff.department_id || "",
        user_id: staff.user_id || "",
        last_name: staff.last_name || "",
        gender: staff.gender || "",
        dob: staff.dob || "",
        mobile: staff.mobile || "",
        email: staff.email || "",
        address_line1: staff.address_line1 || "",
        address_line2: staff.address_line2 || "",
        city: staff.city || "",
        state: staff.state || "",
        country: staff.country || "",
        pincode: staff.pincode || "",
        designation: staff.designation || "",
        joining_date: staff.joining_date || "",
        status: staff.status || "ACTIVE"
      });
    }
  }, [staff, isEdit]);

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
      console.error("Error saving staff:", error);
      alert("Failed to save staff. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="rounded-xl overflow-hidden shadow-2xl" style={{ background: "var(--color-surface)", width: "800px", maxHeight: "85vh", display: "flex", flexDirection: "column" }}>
        
        {/* Header */}
        <div className="px-4 py-3 flex justify-between items-center flex-shrink-0" style={{ background: "var(--color-warning)", color: "white" }}>
          <div className="flex items-center gap-2">
            <Users size={18} />
            <span className="text-sm font-bold">{isEdit ? "Edit Staff" : "Add New Staff"}</span>
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
              <h3 className="text-sm font-semibold mb-3 pb-1 border-b" style={{ color: "var(--color-warning)", borderColor: "var(--color-border)" }}>
                Basic Information
              </h3>
              <div className="grid grid-cols-2 gap-3">
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
                </div>
                <div>
                  <label className="text-[0.65rem] font-bold uppercase tracking-wide block mb-1" style={{ color: "var(--color-text-muted)" }}>
                    Staff Code *
                  </label>
                  <input
                    type="text"
                    name="staff_code"
                    value={formData.staff_code}
                    onChange={handleChange}
                    required
                    className="w-full px-2 py-1.5 rounded text-sm outline-none"
                    style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}
                    placeholder="Enter staff code"
                  />
                </div>
                <div>
                  <label className="text-[0.65rem] font-bold uppercase tracking-wide block mb-1" style={{ color: "var(--color-text-muted)" }}>
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                    className="w-full px-2 py-1.5 rounded text-sm outline-none"
                    style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label className="text-[0.65rem] font-bold uppercase tracking-wide block mb-1" style={{ color: "var(--color-text-muted)" }}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="w-full px-2 py-1.5 rounded text-sm outline-none"
                    style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}
                    placeholder="Enter last name"
                  />
                </div>
                <div>
                  <label className="text-[0.65rem] font-bold uppercase tracking-wide block mb-1" style={{ color: "var(--color-text-muted)" }}>
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-2 py-1.5 rounded text-sm outline-none"
                    style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}
                  >
                    <option value="">Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-[0.65rem] font-bold uppercase tracking-wide block mb-1" style={{ color: "var(--color-text-muted)" }}>
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full px-2 py-1.5 rounded text-sm outline-none"
                    style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}
                  />
                </div>
              </div>
            </div>

            {/* Assignment Section */}
            <div>
              <h3 className="text-sm font-semibold mb-3 pb-1 border-b" style={{ color: "var(--color-warning)", borderColor: "var(--color-border)" }}>
                Assignment Details
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[0.65rem] font-bold uppercase tracking-wide block mb-1" style={{ color: "var(--color-text-muted)" }}>
                    Branch
                  </label>
                  <select
                    name="branch_id"
                    value={formData.branch_id}
                    onChange={handleChange}
                    disabled={loadingBranches}
                    className="w-full px-2 py-1.5 rounded text-sm outline-none"
                    style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}
                  >
                    <option value="">Select Branch</option>
                    {branches.map(branch => (
                      <option key={branch.id} value={branch.id}>
                        {branch.branch_name} ({branch.branch_code})
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
                    disabled={loadingDepartments}
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
                </div>
                <div>
                  <label className="text-[0.65rem] font-bold uppercase tracking-wide block mb-1" style={{ color: "var(--color-text-muted)" }}>
                    Designation
                  </label>
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    className="w-full px-2 py-1.5 rounded text-sm outline-none"
                    style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}
                    placeholder="Enter designation"
                  />
                </div>
                <div>
                  <label className="text-[0.65rem] font-bold uppercase tracking-wide block mb-1" style={{ color: "var(--color-text-muted)" }}>
                    Joining Date
                  </label>
                  <input
                    type="date"
                    name="joining_date"
                    value={formData.joining_date}
                    onChange={handleChange}
                    className="w-full px-2 py-1.5 rounded text-sm outline-none"
                    style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}
                  />
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div>
              <h3 className="text-sm font-semibold mb-3 pb-1 border-b" style={{ color: "var(--color-warning)", borderColor: "var(--color-border)" }}>
                Contact Information
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[0.65rem] font-bold uppercase tracking-wide block mb-1" style={{ color: "var(--color-text-muted)" }}>
                    Mobile
                  </label>
                  <input
                    type="text"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    className="w-full px-2 py-1.5 rounded text-sm outline-none"
                    style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}
                    placeholder="Enter mobile number"
                  />
                </div>
                <div>
                  <label className="text-[0.65rem] font-bold uppercase tracking-wide block mb-1" style={{ color: "var(--color-text-muted)" }}>
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-2 py-1.5 rounded text-sm outline-none"
                    style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}
                    placeholder="Enter email address"
                  />
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div>
              <h3 className="text-sm font-semibold mb-3 pb-1 border-b" style={{ color: "var(--color-warning)", borderColor: "var(--color-border)" }}>
                Address Information
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-[0.65rem] font-bold uppercase tracking-wide block mb-1" style={{ color: "var(--color-text-muted)" }}>
                    Address Line 1
                  </label>
                  <input
                    type="text"
                    name="address_line1"
                    value={formData.address_line1}
                    onChange={handleChange}
                    className="w-full px-2 py-1.5 rounded text-sm outline-none"
                    style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}
                    placeholder="Enter address line 1"
                  />
                </div>
                <div>
                  <label className="text-[0.65rem] font-bold uppercase tracking-wide block mb-1" style={{ color: "var(--color-text-muted)" }}>
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    name="address_line2"
                    value={formData.address_line2}
                    onChange={handleChange}
                    className="w-full px-2 py-1.5 rounded text-sm outline-none"
                    style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}
                    placeholder="Enter address line 2"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[0.65rem] font-bold uppercase tracking-wide block mb-1" style={{ color: "var(--color-text-muted)" }}>
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-2 py-1.5 rounded text-sm outline-none"
                      style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}
                      placeholder="Enter city"
                    />
                  </div>
                  <div>
                    <label className="text-[0.65rem] font-bold uppercase tracking-wide block mb-1" style={{ color: "var(--color-text-muted)" }}>
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full px-2 py-1.5 rounded text-sm outline-none"
                      style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}
                      placeholder="Enter state"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[0.65rem] font-bold uppercase tracking-wide block mb-1" style={{ color: "var(--color-text-muted)" }}>
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-2 py-1.5 rounded text-sm outline-none"
                      style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}
                      placeholder="Enter country"
                    />
                  </div>
                  <div>
                    <label className="text-[0.65rem] font-bold uppercase tracking-wide block mb-1" style={{ color: "var(--color-text-muted)" }}>
                      Pincode
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      className="w-full px-2 py-1.5 rounded text-sm outline-none"
                      style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}
                      placeholder="Enter pincode"
                    />
                  </div>
                </div>
              </div>
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
                style={{ background: "var(--color-warning)" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#d97706"}
                onMouseLeave={(e) => e.currentTarget.style.background = "var(--color-warning)"}
              >
                {loading ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    {isEdit ? "Update Staff" : "Create Staff"}
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