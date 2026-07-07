// src/modal/ViewNurseModal.jsx
import { useState } from "react";
import { X, User, Phone, Mail, MapPin, Calendar, Heart, Activity, Shield, UserCircle, Clock, Building2, MapPinned, GraduationCap, Briefcase } from "lucide-react";

export default function ViewNurseModal({ nurse, onClose }) {
  if (!nurse) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
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

  const getShiftLabel = (shift) => {
    switch(shift) {
      case "Morning": return "Morning (6 AM - 2 PM)";
      case "Evening": return "Evening (2 PM - 10 PM)";
      case "Night": return "Night (10 PM - 6 AM)";
      case "Rotational": return "Rotational Shift";
      case "On Call": return "On Call";
      default: return shift || "—";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="rounded-xl overflow-hidden shadow-2xl" style={{ background: "var(--color-surface)", width: "700px", maxHeight: "85vh", display: "flex", flexDirection: "column" }}>
        
        {/* Header */}
        <div className="px-4 py-3 flex justify-between items-center flex-shrink-0" style={{ background: "var(--color-success)", color: "white" }}>
          <div className="flex items-center gap-2">
            <UserCircle size={18} />
            <span className="text-sm font-bold">Nurse Details</span>
            <span className="text-xs opacity-80">ID: {nurse.staff_code || nurse.id?.slice(0, 8)}</span>
          </div>
          <button onClick={onClose} className="p-1 rounded transition-all hover:bg-white/20">
            <X size={16} style={{ color: "white" }} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Nurse Name Header */}
          <div className="mb-4 pb-3 border-b" style={{ borderColor: "var(--color-border)" }}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold" style={{ color: "var(--color-text-base)" }}>
                  {nurse.full_name || nurse.staff_name || "Nurse"}
                </h2>
                <div className="flex items-center gap-3 mt-1">
                  {nurse.gender && (
                    <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                      {nurse.gender === "MALE" ? "Male" : nurse.gender === "FEMALE" ? "Female" : "Other"}
                    </span>
                  )}
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    nurse.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {nurse.status === "ACTIVE" ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Staff Code</div>
                <div className="text-sm font-semibold">{nurse.staff_code || "—"}</div>
              </div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-2 gap-4">
            {/* Left Column */}
            <div>
              {/* Personal Information */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-2 pb-1 border-b flex items-center gap-1" style={{ color: "var(--color-success)", borderColor: "var(--color-border)" }}>
                  <User size={14} /> Personal Information
                </h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <User size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                    <div>
                      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Full Name</div>
                      <div className="text-sm font-medium">{nurse.full_name || nurse.staff_name || "—"}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Calendar size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                    <div>
                      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Date of Birth</div>
                      <div className="text-sm font-medium">{formatDate(nurse.dob)}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Activity size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                    <div>
                      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Gender</div>
                      <div className="text-sm font-medium">
                        {nurse.gender === "MALE" ? "Male" : nurse.gender === "FEMALE" ? "Female" : nurse.gender || "—"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-2 pb-1 border-b flex items-center gap-1" style={{ color: "var(--color-success)", borderColor: "var(--color-border)" }}>
                  <Phone size={14} /> Contact Information
                </h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Phone size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                    <div>
                      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Mobile Number</div>
                      <div className="text-sm font-medium">{nurse.mobile || "—"}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Mail size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                    <div>
                      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Email Address</div>
                      <div className="text-sm font-medium">{nurse.email || "—"}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-2 pb-1 border-b flex items-center gap-1" style={{ color: "var(--color-success)", borderColor: "var(--color-border)" }}>
                  <MapPin size={14} /> Address Information
                </h3>
                <div className="space-y-2">
                  {(nurse.address_line1 || nurse.address_line2) ? (
                    <>
                      <div className="text-sm" style={{ color: "var(--color-text-base)" }}>
                        {nurse.address_line1 && <div>{nurse.address_line1}</div>}
                        {nurse.address_line2 && <div>{nurse.address_line2}</div>}
                        {(nurse.city || nurse.state) && (
                          <div>
                            {nurse.city && <span>{nurse.city}</span>}
                            {nurse.city && nurse.state && <span>, </span>}
                            {nurse.state && <span>{nurse.state}</span>}
                          </div>
                        )}
                        {nurse.country && <div>{nurse.country}</div>}
                        {nurse.pincode && <div>PIN: {nurse.pincode}</div>}
                      </div>
                    </>
                  ) : (
                    <div className="text-sm" style={{ color: "var(--color-text-muted)" }}>No address provided</div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div>
              {/* Professional Information */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-2 pb-1 border-b flex items-center gap-1" style={{ color: "var(--color-success)", borderColor: "var(--color-border)" }}>
                  <Briefcase size={14} /> Professional Information
                </h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Building2 size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                    <div>
                      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Clinic</div>
                      <div className="text-sm font-medium">{nurse.clinic_name || "—"}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPinned size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                    <div>
                      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Department</div>
                      <div className="text-sm font-medium">{nurse.department_name || "—"}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <GraduationCap size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                    <div>
                      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Qualification</div>
                      <div className="text-sm font-medium">{nurse.qualification || "—"}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock size={14} className="mt-0.5" style={{ color: getShiftColor(nurse.shift_type) }} />
                    <div>
                      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Shift Type</div>
                      <div className="text-sm font-medium">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold" 
                          style={{ background: `${getShiftColor(nurse.shift_type)}20`, color: getShiftColor(nurse.shift_type) }}>
                          {getShiftLabel(nurse.shift_type)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Calendar size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                    <div>
                      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Joining Date</div>
                      <div className="text-sm font-medium">{formatDate(nurse.joining_date)}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reporting Information */}
              {(nurse.reporting_to || nurse.reporting_officer) && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold mb-2 pb-1 border-b flex items-center gap-1" style={{ color: "var(--color-success)", borderColor: "var(--color-border)" }}>
                    <Shield size={14} /> Reporting Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <User size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                      <div>
                        <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Reporting To</div>
                        <div className="text-sm font-medium">{nurse.reporting_to || nurse.reporting_officer || "—"}</div>
                      </div>
                    </div>
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
              style={{ background: "var(--color-success)", color: "white" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#16a34a"}
              onMouseLeave={(e) => e.currentTarget.style.background = "var(--color-success)"}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}