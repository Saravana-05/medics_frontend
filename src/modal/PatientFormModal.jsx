// src/modal/PatientFormModal.jsx
import { useState, useEffect } from "react";
import { X, Save, Heart } from "lucide-react";
import { getAllClinics } from "../services/clinicService";
import { getAllClinicBranches } from "../services/clinicBranchService";

export default function PatientFormModal({ patient, onClose, onSave, isEdit = false }) {
  const [clinics, setClinics] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loadingClinics, setLoadingClinics] = useState(true);
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [formData, setFormData] = useState({
    clinic_id: "",
    branch_id: "",
    patient_no: "",
    first_name: "",
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
    allergies: "",
    chronic_disease: "",
    insurance_provider: "",
    insurance_number: "",
    height_cm: "",
    weight_kg: "",
    bmi: "",
    status: "ACTIVE"
  });
  const [loading, setLoading] = useState(false);

  // Calculate BMI automatically when height or weight changes
  useEffect(() => {
    const height = parseFloat(formData.height_cm);
    const weight = parseFloat(formData.weight_kg);
    if (height && weight && height > 0) {
      const heightInMeters = height / 100;
      const bmiValue = weight / (heightInMeters * heightInMeters);
      const roundedBMI = bmiValue.toFixed(1);
      if (roundedBMI !== formData.bmi) {
        setFormData(prev => ({ ...prev, bmi: roundedBMI }));
      }
    } else if (formData.bmi) {
      setFormData(prev => ({ ...prev, bmi: "" }));
    }
  }, [formData.height_cm, formData.weight_kg]);

  // Fetch clinics
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

  useEffect(() => {
    if (patient && isEdit) {
      setFormData({
        clinic_id: patient.clinic_id || "",
        branch_id: patient.branch_id || "",
        patient_no: patient.patient_no || "",
        first_name: patient.first_name || "",
        last_name: patient.last_name || "",
        gender: patient.gender || "",
        dob: patient.dob ? patient.dob.split('T')[0] : "",
        mobile: patient.mobile || "",
        email: patient.email || "",
        address_line1: patient.address_line1 || "",
        address_line2: patient.address_line2 || "",
        city: patient.city || "",
        state: patient.state || "",
        country: patient.country || "",
        pincode: patient.pincode || "",
        allergies: patient.allergies || "",
        chronic_disease: patient.chronic_disease || "",
        insurance_provider: patient.insurance_provider || "",
        insurance_number: patient.insurance_number || "",
        height_cm: patient.height_cm || "",
        weight_kg: patient.weight_kg || "",
        bmi: patient.bmi || "",
        status: patient.status || "ACTIVE"
      });
    }
  }, [patient, isEdit]);

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
      console.error("Error saving patient:", error);
      alert("Failed to save patient. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="rounded-xl overflow-hidden shadow-2xl" style={{ background: "var(--color-surface)", width: "800px", maxHeight: "85vh", display: "flex", flexDirection: "column" }}>
        
        {/* Header */}
        <div className="px-4 py-3 flex justify-between items-center flex-shrink-0" style={{ background: "var(--color-danger)", color: "white" }}>
          <div className="flex items-center gap-2">
            <Heart size={18} />
            <span className="text-sm font-bold">{isEdit ? "Edit Patient" : "Add New Patient"}</span>
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
              <h3 className="text-sm font-semibold mb-3 pb-1 border-b" style={{ color: "var(--color-danger)", borderColor: "var(--color-border)" }}>
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
                    Patient No *
                  </label>
                  <input
                    type="text"
                    name="patient_no"
                    value={formData.patient_no}
                    onChange={handleChange}
                    required
                    className="w-full px-2 py-1.5 rounded text-sm outline-none"
                    style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}
                    placeholder="Enter patient number"
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

            {/* Contact Information Section */}
            <div>
              <h3 className="text-sm font-semibold mb-3 pb-1 border-b" style={{ color: "var(--color-danger)", borderColor: "var(--color-border)" }}>
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
              <h3 className="text-sm font-semibold mb-3 pb-1 border-b" style={{ color: "var(--color-danger)", borderColor: "var(--color-border)" }}>
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

            {/* Medical Information Section */}
            <div>
              <h3 className="text-sm font-semibold mb-3 pb-1 border-b" style={{ color: "var(--color-danger)", borderColor: "var(--color-border)" }}>
                Medical Information
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[0.65rem] font-bold uppercase tracking-wide block mb-1" style={{ color: "var(--color-text-muted)" }}>
                    Allergies
                  </label>
                  <input
                    type="text"
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleChange}
                    className="w-full px-2 py-1.5 rounded text-sm outline-none"
                    style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}
                    placeholder="e.g., Penicillin, Dust"
                  />
                </div>
                <div>
                  <label className="text-[0.65rem] font-bold uppercase tracking-wide block mb-1" style={{ color: "var(--color-text-muted)" }}>
                    Chronic Disease
                  </label>
                  <input
                    type="text"
                    name="chronic_disease"
                    value={formData.chronic_disease}
                    onChange={handleChange}
                    className="w-full px-2 py-1.5 rounded text-sm outline-none"
                    style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}
                    placeholder="e.g., Diabetes, Hypertension"
                  />
                </div>
              </div>
            </div>

            {/* Insurance Information Section */}
            <div>
              <h3 className="text-sm font-semibold mb-3 pb-1 border-b" style={{ color: "var(--color-danger)", borderColor: "var(--color-border)" }}>
                Insurance Information
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[0.65rem] font-bold uppercase tracking-wide block mb-1" style={{ color: "var(--color-text-muted)" }}>
                    Insurance Provider
                  </label>
                  <input
                    type="text"
                    name="insurance_provider"
                    value={formData.insurance_provider}
                    onChange={handleChange}
                    className="w-full px-2 py-1.5 rounded text-sm outline-none"
                    style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}
                    placeholder="Enter insurance provider"
                  />
                </div>
                <div>
                  <label className="text-[0.65rem] font-bold uppercase tracking-wide block mb-1" style={{ color: "var(--color-text-muted)" }}>
                    Insurance Number
                  </label>
                  <input
                    type="text"
                    name="insurance_number"
                    value={formData.insurance_number}
                    onChange={handleChange}
                    className="w-full px-2 py-1.5 rounded text-sm outline-none"
                    style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}
                    placeholder="Enter insurance number"
                  />
                </div>
              </div>
            </div>

            {/* Vitals Information Section */}
            <div>
              <h3 className="text-sm font-semibold mb-3 pb-1 border-b" style={{ color: "var(--color-danger)", borderColor: "var(--color-border)" }}>
                Vitals Information
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[0.65rem] font-bold uppercase tracking-wide block mb-1" style={{ color: "var(--color-text-muted)" }}>
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    name="height_cm"
                    value={formData.height_cm}
                    onChange={handleChange}
                    step="0.1"
                    className="w-full px-2 py-1.5 rounded text-sm outline-none"
                    style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}
                    placeholder="Height in cm"
                  />
                </div>
                <div>
                  <label className="text-[0.65rem] font-bold uppercase tracking-wide block mb-1" style={{ color: "var(--color-text-muted)" }}>
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    name="weight_kg"
                    value={formData.weight_kg}
                    onChange={handleChange}
                    step="0.1"
                    className="w-full px-2 py-1.5 rounded text-sm outline-none"
                    style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}
                    placeholder="Weight in kg"
                  />
                </div>
                <div>
                  <label className="text-[0.65rem] font-bold uppercase tracking-wide block mb-1" style={{ color: "var(--color-text-muted)" }}>
                    BMI
                  </label>
                  <input
                    type="text"
                    name="bmi"
                    value={formData.bmi}
                    readOnly
                    className="w-full px-2 py-1.5 rounded text-sm outline-none bg-gray-50"
                    style={{ border: "1px solid var(--color-border)", background: "var(--color-surface-alt)", color: "var(--color-text-muted)" }}
                    placeholder="Auto-calculated"
                  />
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
                style={{ background: "var(--color-danger)" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#b91c1c"}
                onMouseLeave={(e) => e.currentTarget.style.background = "var(--color-danger)"}
              >
                {loading ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    {isEdit ? "Update Patient" : "Create Patient"}
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