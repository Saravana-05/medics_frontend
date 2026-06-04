// src/modal/ViewPatientModal.jsx
import { useState } from "react";
import { X, User, Phone, Mail, MapPin, Calendar, Heart, Activity, Shield, AlertCircle, Droplet, Ruler, Weight, Hash, Building2, MapPinned } from "lucide-react";

export default function ViewPatientModal({ patient, onClose }) {
  if (!patient) return null;

  const calculateAge = (dob) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  const age = calculateAge(patient.dob);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="rounded-xl overflow-hidden shadow-2xl" style={{ background: "var(--color-surface)", width: "750px", maxHeight: "85vh", display: "flex", flexDirection: "column" }}>
        
        {/* Header */}
        <div className="px-4 py-3 flex justify-between items-center flex-shrink-0" style={{ background: "var(--color-danger)", color: "white" }}>
          <div className="flex items-center gap-2">
            <User size={18} />
            <span className="text-sm font-bold">Patient Details</span>
            <span className="text-xs opacity-80">ID: {patient.patient_no}</span>
          </div>
          <button onClick={onClose} className="p-1 rounded transition-all hover:bg-white/20">
            <X size={16} style={{ color: "white" }} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Patient Name Header */}
          <div className="mb-4 pb-3 border-b" style={{ borderColor: "var(--color-border)" }}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold" style={{ color: "var(--color-text-base)" }}>
                  {patient.first_name} {patient.last_name || ""}
                </h2>
                <div className="flex items-center gap-3 mt-1">
                  {patient.gender && (
                    <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                      {patient.gender === "MALE" ? "Male" : patient.gender === "FEMALE" ? "Female" : "Other"}
                    </span>
                  )}
                  {age && (
                    <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>{age} years</span>
                  )}
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    patient.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {patient.status === "ACTIVE" ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Registered on</div>
                <div className="text-sm font-semibold">{formatDate(patient.created_at)}</div>
              </div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-2 gap-4">
            {/* Left Column */}
            <div>
              {/* Basic Information */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-2 pb-1 border-b flex items-center gap-1" style={{ color: "var(--color-danger)", borderColor: "var(--color-border)" }}>
                  <User size={14} /> Basic Information
                </h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Hash size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                    <div>
                      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Patient Number</div>
                      <div className="text-sm font-medium">{patient.patient_no}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Calendar size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                    <div>
                      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Date of Birth</div>
                      <div className="text-sm font-medium">{formatDate(patient.dob)}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Activity size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                    <div>
                      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Age</div>
                      <div className="text-sm font-medium">{age ? `${age} years` : "—"}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Droplet size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                    <div>
                      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Gender</div>
                      <div className="text-sm font-medium">
                        {patient.gender === "MALE" ? "Male" : patient.gender === "FEMALE" ? "Female" : patient.gender || "—"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Clinic Information */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-2 pb-1 border-b flex items-center gap-1" style={{ color: "var(--color-danger)", borderColor: "var(--color-border)" }}>
                  <Building2 size={14} /> Clinic Information
                </h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Building2 size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                    <div>
                      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Clinic Name</div>
                      <div className="text-sm font-medium">{patient.clinic_name || "—"}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPinned size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                    <div>
                      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Branch</div>
                      <div className="text-sm font-medium">{patient.branch_name || "—"}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-2 pb-1 border-b flex items-center gap-1" style={{ color: "var(--color-danger)", borderColor: "var(--color-border)" }}>
                  <Phone size={14} /> Contact Information
                </h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Phone size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                    <div>
                      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Mobile Number</div>
                      <div className="text-sm font-medium">{patient.mobile || "—"}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Mail size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                    <div>
                      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Email Address</div>
                      <div className="text-sm font-medium">{patient.email || "—"}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div>
              {/* Address Information */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-2 pb-1 border-b flex items-center gap-1" style={{ color: "var(--color-danger)", borderColor: "var(--color-border)" }}>
                  <MapPin size={14} /> Address Information
                </h3>
                <div className="space-y-2">
                  {(patient.address_line1 || patient.address_line2) ? (
                    <>
                      <div className="text-sm" style={{ color: "var(--color-text-base)" }}>
                        {patient.address_line1 && <div>{patient.address_line1}</div>}
                        {patient.address_line2 && <div>{patient.address_line2}</div>}
                        {(patient.city || patient.state) && (
                          <div>
                            {patient.city && <span>{patient.city}</span>}
                            {patient.city && patient.state && <span>, </span>}
                            {patient.state && <span>{patient.state}</span>}
                          </div>
                        )}
                        {patient.country && <div>{patient.country}</div>}
                        {patient.pincode && <div>PIN: {patient.pincode}</div>}
                      </div>
                    </>
                  ) : (
                    <div className="text-sm" style={{ color: "var(--color-text-muted)" }}>No address provided</div>
                  )}
                </div>
              </div>

              {/* Medical Information */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-2 pb-1 border-b flex items-center gap-1" style={{ color: "var(--color-danger)", borderColor: "var(--color-border)" }}>
                  <Heart size={14} /> Medical Information
                </h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertCircle size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                    <div>
                      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Allergies</div>
                      <div className="text-sm font-medium">{patient.allergies || "None"}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Activity size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                    <div>
                      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Chronic Disease</div>
                      <div className="text-sm font-medium">{patient.chronic_disease || "None"}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Insurance Information */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-2 pb-1 border-b flex items-center gap-1" style={{ color: "var(--color-danger)", borderColor: "var(--color-border)" }}>
                  <Shield size={14} /> Insurance Information
                </h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Shield size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                    <div>
                      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Provider</div>
                      <div className="text-sm font-medium">{patient.insurance_provider || "—"}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Hash size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                    <div>
                      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Policy Number</div>
                      <div className="text-sm font-medium">{patient.insurance_number || "—"}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vitals Information */}
              {(patient.height_cm || patient.weight_kg || patient.bmi) && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold mb-2 pb-1 border-b flex items-center gap-1" style={{ color: "var(--color-danger)", borderColor: "var(--color-border)" }}>
                    <Activity size={14} /> Vitals Information
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {patient.height_cm && (
                      <div className="p-2 rounded-lg text-center" style={{ background: "var(--color-surface-alt)" }}>
                        <Ruler size={14} className="mx-auto mb-1" style={{ color: "var(--color-text-muted)" }} />
                        <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Height</div>
                        <div className="text-sm font-semibold">{patient.height_cm} cm</div>
                      </div>
                    )}
                    {patient.weight_kg && (
                      <div className="p-2 rounded-lg text-center" style={{ background: "var(--color-surface-alt)" }}>
                        <Weight size={14} className="mx-auto mb-1" style={{ color: "var(--color-text-muted)" }} />
                        <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Weight</div>
                        <div className="text-sm font-semibold">{patient.weight_kg} kg</div>
                      </div>
                    )}
                    {patient.bmi && (
                      <div className="p-2 rounded-lg text-center" style={{ background: "var(--color-surface-alt)" }}>
                        <Activity size={14} className="mx-auto mb-1" style={{ color: "var(--color-text-muted)" }} />
                        <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>BMI</div>
                        <div className="text-sm font-semibold">{patient.bmi}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 pt-3 border-t flex justify-end" style={{ borderColor: "var(--color-border)" }}>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg text-sm font-semibold transition-all"
              style={{ background: "var(--color-danger)", color: "white" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#b91c1c"}
              onMouseLeave={(e) => e.currentTarget.style.background = "var(--color-danger)"}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}