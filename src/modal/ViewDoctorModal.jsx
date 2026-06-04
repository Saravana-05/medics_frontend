// src/modal/ViewDoctorModal.jsx
import { useState } from "react";
import { X, User, Phone, Mail, MapPin, Calendar, Heart, Activity, Shield, Stethoscope, Clock, Building2, MapPinned, GraduationCap, Briefcase, Award, CreditCard } from "lucide-react";

export default function ViewDoctorModal({ doctor, onClose }) {
  if (!doctor) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  const formatTime = (timeString) => {
    if (!timeString) return "—";
    return timeString;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="rounded-xl overflow-hidden shadow-2xl" style={{ background: "var(--color-surface)", width: "750px", maxHeight: "85vh", display: "flex", flexDirection: "column" }}>
        
        {/* Header */}
        <div className="px-4 py-3 flex justify-between items-center flex-shrink-0" style={{ background: "var(--color-primary)", color: "white" }}>
          <div className="flex items-center gap-2">
            <Stethoscope size={18} />
            <span className="text-sm font-bold">Doctor Details</span>
            <span className="text-xs opacity-80">ID: {doctor.doctor_registration_no || doctor.id?.slice(0, 8)}</span>
          </div>
          <button onClick={onClose} className="p-1 rounded transition-all hover:bg-white/20">
            <X size={16} style={{ color: "white" }} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Doctor Name Header */}
          <div className="mb-4 pb-3 border-b" style={{ borderColor: "var(--color-border)" }}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold" style={{ color: "var(--color-text-base)" }}>
                  {doctor.full_name || doctor.staff_name || "Doctor"}
                </h2>
                <div className="flex items-center gap-3 mt-1">
                  {doctor.specialization && (
                    <span className="text-sm font-medium" style={{ color: "var(--color-primary)" }}>
                      {doctor.specialization}
                    </span>
                  )}
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    doctor.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {doctor.status === "ACTIVE" ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Registration No</div>
                <div className="text-sm font-semibold">{doctor.doctor_registration_no || "—"}</div>
              </div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-2 gap-4">
            {/* Left Column */}
            <div>
              {/* Personal Information */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-2 pb-1 border-b flex items-center gap-1" style={{ color: "var(--color-primary)", borderColor: "var(--color-border)" }}>
                  <User size={14} /> Personal Information
                </h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <User size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                    <div>
                      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Full Name</div>
                      <div className="text-sm font-medium">{doctor.full_name || doctor.staff_name || "—"}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Calendar size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                    <div>
                      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Date of Birth</div>
                      <div className="text-sm font-medium">{formatDate(doctor.dob)}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Activity size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                    <div>
                      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Gender</div>
                      <div className="text-sm font-medium">
                        {doctor.gender === "MALE" ? "Male" : doctor.gender === "FEMALE" ? "Female" : doctor.gender || "—"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-2 pb-1 border-b flex items-center gap-1" style={{ color: "var(--color-primary)", borderColor: "var(--color-border)" }}>
                  <Phone size={14} /> Contact Information
                </h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Phone size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                    <div>
                      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Mobile Number</div>
                      <div className="text-sm font-medium">{doctor.mobile || "—"}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Mail size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                    <div>
                      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Email Address</div>
                      <div className="text-sm font-medium">{doctor.email || "—"}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-2 pb-1 border-b flex items-center gap-1" style={{ color: "var(--color-primary)", borderColor: "var(--color-border)" }}>
                  <MapPin size={14} /> Address Information
                </h3>
                <div className="space-y-2">
                  {(doctor.address_line1 || doctor.address_line2) ? (
                    <>
                      <div className="text-sm" style={{ color: "var(--color-text-base)" }}>
                        {doctor.address_line1 && <div>{doctor.address_line1}</div>}
                        {doctor.address_line2 && <div>{doctor.address_line2}</div>}
                        {(doctor.city || doctor.state) && (
                          <div>
                            {doctor.city && <span>{doctor.city}</span>}
                            {doctor.city && doctor.state && <span>, </span>}
                            {doctor.state && <span>{doctor.state}</span>}
                          </div>
                        )}
                        {doctor.country && <div>{doctor.country}</div>}
                        {doctor.pincode && <div>PIN: {doctor.pincode}</div>}
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
                <h3 className="text-sm font-semibold mb-2 pb-1 border-b flex items-center gap-1" style={{ color: "var(--color-primary)", borderColor: "var(--color-border)" }}>
                  <Briefcase size={14} /> Professional Information
                </h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Building2 size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                    <div>
                      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Clinic</div>
                      <div className="text-sm font-medium">{doctor.clinic_name || "—"}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPinned size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                    <div>
                      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Department</div>
                      <div className="text-sm font-medium">{doctor.department_name || "—"}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <GraduationCap size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                    <div>
                      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Qualification</div>
                      <div className="text-sm font-medium">{doctor.qualification || "—"}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Award size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                    <div>
                      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Specialization</div>
                      <div className="text-sm font-medium">{doctor.specialization || "—"}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Activity size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                    <div>
                      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Experience</div>
                      <div className="text-sm font-medium">{doctor.experience_years ? `${doctor.experience_years} years` : "—"}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CreditCard size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                    <div>
                      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Consultation Fee</div>
                      <div className="text-sm font-medium">{doctor.consultation_fee ? `₹${doctor.consultation_fee}` : "—"}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Availability Information */}
              {(doctor.available_from || doctor.available_to) && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold mb-2 pb-1 border-b flex items-center gap-1" style={{ color: "var(--color-primary)", borderColor: "var(--color-border)" }}>
                    <Clock size={14} /> Availability
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Clock size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                      <div>
                        <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Available Hours</div>
                        <div className="text-sm font-medium">
                          {doctor.available_from && formatTime(doctor.available_from)} 
                          {doctor.available_from && doctor.available_to && " - "}
                          {doctor.available_to && formatTime(doctor.available_to)}
                          {!doctor.available_from && !doctor.available_to && "—"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Joining Information */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-2 pb-1 border-b flex items-center gap-1" style={{ color: "var(--color-primary)", borderColor: "var(--color-border)" }}>
                  <Calendar size={14} /> Joining Information
                </h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Calendar size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                    <div>
                      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Joining Date</div>
                      <div className="text-sm font-medium">{formatDate(doctor.joining_date)}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reporting Information */}
              {(doctor.reporting_to || doctor.reporting_officer) && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold mb-2 pb-1 border-b flex items-center gap-1" style={{ color: "var(--color-primary)", borderColor: "var(--color-border)" }}>
                    <Shield size={14} /> Reporting Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <User size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                      <div>
                        <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Reporting To</div>
                        <div className="text-sm font-medium">{doctor.reporting_to || doctor.reporting_officer || "—"}</div>
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
              style={{ background: "var(--color-primary)", color: "white" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--color-primary-light)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "var(--color-primary)"}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}