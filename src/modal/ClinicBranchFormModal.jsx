// src/modal/ClinicBranchFormModal.jsx
import { useState, useEffect } from "react";
import { X, Save, MapPin, Building2 } from "lucide-react";
import { getAllClinics } from "../services/clinicService";

export default function ClinicBranchFormModal({ branch, onClose, onSave, isEdit = false }) {
  const [clinics, setClinics] = useState([]);
  const [loadingClinics, setLoadingClinics] = useState(true);
  const [formData, setFormData] = useState({
    clinic_id: "",
    branch_code: "",
    branch_name: "",
    email: "",
    mobile: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    is_main_branch: false,
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
    if (branch && isEdit) {
      setFormData({
        clinic_id: branch.clinic_id || "",
        branch_code: branch.branch_code || "",
        branch_name: branch.branch_name || "",
        email: branch.email || "",
        mobile: branch.mobile || "",
        address_line1: branch.address_line1 || "",
        address_line2: branch.address_line2 || "",
        city: branch.city || "",
        state: branch.state || "",
        country: branch.country || "",
        pincode: branch.pincode || "",
        is_main_branch: branch.is_main_branch || false,
        status: branch.status || "ACTIVE"
      });
    }
  }, [branch, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error saving clinic branch:", error);
      alert("Failed to save clinic branch. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="rounded-xl overflow-hidden shadow-2xl" style={{ background: "var(--color-surface)", width: "750px", maxHeight: "85vh", display: "flex", flexDirection: "column" }}>
        
        {/* Header */}
        <div className="px-4 py-3 flex justify-between items-center flex-shrink-0" style={{ background: "var(--color-drugs)", color: "white" }}>
          <div className="flex items-center gap-2">
            <MapPin size={18} />
            <span className="text-sm font-bold">{isEdit ? "Edit Clinic Branch" : "Add New Clinic Branch"}</span>
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
              <h3 className="text-sm font-semibold mb-3 pb-1 border-b" style={{ color: "var(--color-drugs)", borderColor: "var(--color-border)" }}>
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
                  {loadingClinics && (
                    <p className="text-[0.55rem] mt-1" style={{ color: "var(--color-text-muted)" }}>Loading clinics...</p>
                  )}
                </div>
                <div>
                  <label className="text-[0.65rem] font-bold uppercase tracking-wide block mb-1" style={{ color: "var(--color-text-muted)" }}>
                    Branch Code *
                  </label>
                  <input
                    type="text"
                    name="branch_code"
                    value={formData.branch_code}
                    onChange={handleChange}
                    required
                    className="w-full px-2 py-1.5 rounded text-sm outline-none"
                    style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}
                    placeholder="Enter branch code"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-[0.65rem] font-bold uppercase tracking-wide block mb-1" style={{ color: "var(--color-text-muted)" }}>
                    Branch Name *
                  </label>
                  <input
                    type="text"
                    name="branch_name"
                    value={formData.branch_name}
                    onChange={handleChange}
                    required
                    className="w-full px-2 py-1.5 rounded text-sm outline-none"
                    style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}
                    placeholder="Enter branch name"
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
                <div className="flex items-center mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_main_branch"
                      checked={formData.is_main_branch}
                      onChange={handleChange}
                      className="w-4 h-4 rounded"
                      style={{ accentColor: "var(--color-drugs)" }}
                    />
                    <span className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>Main Branch</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div>
              <h3 className="text-sm font-semibold mb-3 pb-1 border-b" style={{ color: "var(--color-drugs)", borderColor: "var(--color-border)" }}>
                Contact Information
              </h3>
              <div className="grid grid-cols-2 gap-3">
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
              </div>
            </div>

            {/* Address Section */}
            <div>
              <h3 className="text-sm font-semibold mb-3 pb-1 border-b" style={{ color: "var(--color-drugs)", borderColor: "var(--color-border)" }}>
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
                style={{ background: "var(--color-drugs)" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#146b4c"}
                onMouseLeave={(e) => e.currentTarget.style.background = "var(--color-drugs)"}
              >
                {loading ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    {isEdit ? "Update Branch" : "Create Branch"}
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