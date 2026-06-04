// src/modal/ViewClinicModal.jsx
import { useState } from "react";
import { X, Building2, Phone, Mail, MapPin, Calendar, Globe, User, Activity, Clock, CreditCard, FileText, Hash } from "lucide-react";

export default function ViewClinicModal({ clinic, onClose }) {
  if (!clinic) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="rounded-xl overflow-hidden shadow-2xl" style={{ background: "var(--color-surface)", width: "700px", maxHeight: "85vh", display: "flex", flexDirection: "column" }}>
        
        {/* Header */}
        <div className="px-4 py-3 flex justify-between items-center flex-shrink-0" style={{ background: "var(--color-primary)", color: "white" }}>
          <div className="flex items-center gap-2">
            <Building2 size={18} />
            <span className="text-sm font-bold">Clinic Details</span>
            <span className="text-xs opacity-80">ID: {clinic.clinic_code}</span>
          </div>
          <button onClick={onClose} className="p-1 rounded transition-all hover:bg-white/20">
            <X size={16} style={{ color: "white" }} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Clinic Name Header */}
          <div className="mb-4 pb-3 border-b" style={{ borderColor: "var(--color-border)" }}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold" style={{ color: "var(--color-text-base)" }}>
                  {clinic.clinic_name}
                </h2>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm font-medium" style={{ color: "var(--color-primary)" }}>
                    Code: {clinic.clinic_code}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    clinic.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {clinic.status === "ACTIVE" ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Registered On</div>
                <div className="text-sm font-semibold">{formatDate(clinic.created_at)}</div>
              </div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-2 gap-4">
            {/* Left Column */}
            <div>
              {/* Basic Information */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-2 pb-1 border-b flex items-center gap-1" style={{ color: "var(--color-primary)", borderColor: "var(--color-border)" }}>
                  <Building2 size={14} /> Basic Information
                </h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Hash size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                    <div>
                      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Clinic Code</div>
                      <div className="text-sm font-medium">{clinic.clinic_code}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Building2 size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                    <div>
                      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Clinic Name</div>
                      <div className="text-sm font-medium">{clinic.clinic_name}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <FileText size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                    <div>
                      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Clinic Type</div>
                      <div className="text-sm font-medium">{clinic.clinic_type || "—"}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CreditCard size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                    <div>
                      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>GST Number</div>
                      <div className="text-sm font-medium">{clinic.gst_number || "—"}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Hash size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                    <div>
                      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Registration Number</div>
                      <div className="text-sm font-medium">{clinic.registration_number || "—"}</div>
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
                      <div className="text-sm font-medium">{clinic.mobile || "—"}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Phone size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                    <div>
                      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Alternate Mobile</div>
                      <div className="text-sm font-medium">{clinic.alternate_mobile || "—"}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Mail size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                    <div>
                      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Email Address</div>
                      <div className="text-sm font-medium">{clinic.email || "—"}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Globe size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                    <div>
                      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Website</div>
                      <div className="text-sm font-medium">
                        {clinic.website ? (
                          <a href={clinic.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            {clinic.website}
                          </a>
                        ) : "—"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div>
              {/* Address Information */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-2 pb-1 border-b flex items-center gap-1" style={{ color: "var(--color-primary)", borderColor: "var(--color-border)" }}>
                  <MapPin size={14} /> Address Information
                </h3>
                <div className="space-y-2">
                  {(clinic.address_line1 || clinic.address_line2) ? (
                    <>
                      <div className="text-sm" style={{ color: "var(--color-text-base)" }}>
                        {clinic.address_line1 && <div>{clinic.address_line1}</div>}
                        {clinic.address_line2 && <div>{clinic.address_line2}</div>}
                        {(clinic.city || clinic.state) && (
                          <div>
                            {clinic.city && <span>{clinic.city}</span>}
                            {clinic.city && clinic.state && <span>, </span>}
                            {clinic.state && <span>{clinic.state}</span>}
                          </div>
                        )}
                        {clinic.country && <div>{clinic.country}</div>}
                        {clinic.pincode && <div>PIN: {clinic.pincode}</div>}
                      </div>
                    </>
                  ) : (
                    <div className="text-sm" style={{ color: "var(--color-text-muted)" }}>No address provided</div>
                  )}
                </div>
              </div>

              {/* Additional Information */}
              {clinic.logo_url && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold mb-2 pb-1 border-b flex items-center gap-1" style={{ color: "var(--color-primary)", borderColor: "var(--color-border)" }}>
                    <Image size={14} /> Logo
                  </h3>
                  <div className="p-2 rounded-lg" style={{ background: "var(--color-surface-alt)" }}>
                    <img 
                      src={clinic.logo_url} 
                      alt={`${clinic.clinic_name} logo`} 
                      className="max-w-full h-20 object-contain mx-auto"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  </div>
                </div>
              )}

              {/* Branch Information */}
              {clinic.total_branches !== undefined && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold mb-2 pb-1 border-b flex items-center gap-1" style={{ color: "var(--color-primary)", borderColor: "var(--color-border)" }}>
                    <Building2 size={14} /> Branch Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Building2 size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                      <div>
                        <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Total Branches</div>
                        <div className="text-sm font-medium">{clinic.total_branches || "—"}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-2 pb-1 border-b flex items-center gap-1" style={{ color: "var(--color-primary)", borderColor: "var(--color-border)" }}>
                  <Clock size={14} /> Timestamps
                </h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Calendar size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                    <div>
                      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Created At</div>
                      <div className="text-sm font-medium">{formatDate(clinic.created_at)}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                    <div>
                      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Last Updated</div>
                      <div className="text-sm font-medium">{formatDate(clinic.updated_at)}</div>
                    </div>
                  </div>
                </div>
              </div>
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