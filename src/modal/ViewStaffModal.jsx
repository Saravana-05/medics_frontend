// src/modal/ViewStaffModal.jsx
import { useState } from "react";
import { X, User, Phone, Mail, MapPin, Calendar, Activity, Building2, MapPinned, Briefcase, GraduationCap, CalendarDays, BadgeCheck } from "lucide-react";

export default function ViewStaffModal({ staff, onClose }) {
  if (!staff) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  const getGenderLabel = (gender) => {
    if (gender === "MALE") return "Male";
    if (gender === "FEMALE") return "Female";
    if (gender === "OTHER") return "Other";
    return gender || "—";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="rounded-xl overflow-hidden shadow-2xl" style={{ background: "var(--color-surface)", width: "700px", maxHeight: "85vh", display: "flex", flexDirection: "column" }}>
        
        {/* Header */}
        <div className="px-4 py-3 flex justify-between items-center flex-shrink-0" style={{ background: "var(--color-warning)", color: "white" }}>
          <div className="flex items-center gap-2">
            <User size={18} />
            <span className="text-sm font-bold">Staff Details</span>
            <span className="text-xs opacity-80">ID: {staff.staff_code}</span>
          </div>
          <button onClick={onClose} className="p-1 rounded transition-all hover:bg-white/20">
            <X size={16} style={{ color: "white" }} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Staff Name Header */}
          <div className="mb-4 pb-3 border-b" style={{ borderColor: "var(--color-border)" }}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold" style={{ color: "var(--color-text-base)" }}>
                  {staff.first_name} {staff.last_name || ""}
                </h2>
                <div className="flex items-center gap-3 mt-1">
                  {staff.designation && (
                    <span className="text-sm font-medium" style={{ color: "var(--color-warning)" }}>
                      {staff.designation}
                    </span>
                  )}
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    staff.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {staff.status === "ACTIVE" ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Staff Code</div>
                <div className="text-sm font-semibold">{staff.staff_code || "—"}</div>
              </div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-2 gap-4">
            {/* Left Column */}
            <div>
              {/* Personal Information */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-2 pb-1 border-b flex items-center gap-1" style={{ color: "var(--color-warning)", borderColor: "var(--color-border)" }}>
                  <User size={14} /> Personal Information
                </h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <User size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                    <div>
                      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Full Name</div>
                      <div className="text-sm font-medium">{staff.first_name} {staff.last_name || ""}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Calendar size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                    <div>
                      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Date of Birth</div>
                      <div className="text-sm font-medium">{formatDate(staff.dob)}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Activity size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                    <div>
                      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Gender</div>
                      <div className="text-sm font-medium">{getGenderLabel(staff.gender)}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CalendarDays size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                    <div>
                      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Joining Date</div>
                      <div className="text-sm font-medium">{formatDate(staff.joining_date)}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-2 pb-1 border-b flex items-center gap-1" style={{ color: "var(--color-warning)", borderColor: "var(--color-border)" }}>
                  <Phone size={14} /> Contact Information
                </h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Phone size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                    <div>
                      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Mobile Number</div>
                      <div className="text-sm font-medium">{staff.mobile || "—"}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Mail size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                    <div>
                      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Email Address</div>
                      <div className="text-sm font-medium">{staff.email || "—"}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-2 pb-1 border-b flex items-center gap-1" style={{ color: "var(--color-warning)", borderColor: "var(--color-border)" }}>
                  <MapPin size={14} /> Address Information
                </h3>
                <div className="space-y-2">
                  {(staff.address_line1 || staff.address_line2) ? (
                    <>
                      <div className="text-sm" style={{ color: "var(--color-text-base)" }}>
                        {staff.address_line1 && <div>{staff.address_line1}</div>}
                        {staff.address_line2 && <div>{staff.address_line2}</div>}
                        {(staff.city || staff.state) && (
                          <div>
                            {staff.city && <span>{staff.city}</span>}
                            {staff.city && staff.state && <span>, </span>}
                            {staff.state && <span>{staff.state}</span>}
                          </div>
                        )}
                        {staff.country && <div>{staff.country}</div>}
                        {staff.pincode && <div>PIN: {staff.pincode}</div>}
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
              {/* Employment Information */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-2 pb-1 border-b flex items-center gap-1" style={{ color: "var(--color-warning)", borderColor: "var(--color-border)" }}>
                  <Briefcase size={14} /> Employment Information
                </h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Building2 size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                    <div>
                      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Clinic</div>
                      <div className="text-sm font-medium">{staff.clinic_name || "—"}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPinned size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                    <div>
                      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Branch</div>
                      <div className="text-sm font-medium">{staff.branch_name || "—"}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Building2 size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                    <div>
                      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Department</div>
                      <div className="text-sm font-medium">{staff.department_name || "—"}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <GraduationCap size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                    <div>
                      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Designation</div>
                      <div className="text-sm font-medium">{staff.designation || "—"}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              {staff.qualification && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold mb-2 pb-1 border-b flex items-center gap-1" style={{ color: "var(--color-warning)", borderColor: "var(--color-border)" }}>
                    <GraduationCap size={14} /> Qualification
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <GraduationCap size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                      <div>
                        <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Qualification</div>
                        <div className="text-sm font-medium">{staff.qualification || "—"}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Reporting Information */}
              {(staff.reporting_to || staff.reporting_officer) && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold mb-2 pb-1 border-b flex items-center gap-1" style={{ color: "var(--color-warning)", borderColor: "var(--color-border)" }}>
                    <BadgeCheck size={14} /> Reporting Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <User size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                      <div>
                        <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Reporting To</div>
                        <div className="text-sm font-medium">{staff.reporting_to || staff.reporting_officer || "—"}</div>
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
              style={{ background: "var(--color-warning)", color: "white" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#d97706"}
              onMouseLeave={(e) => e.currentTarget.style.background = "var(--color-warning)"}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}