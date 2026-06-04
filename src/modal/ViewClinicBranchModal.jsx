// src/modal/ViewClinicBranchModal.jsx
import { useState } from "react";
import { X, MapPin, Phone, Mail, Calendar, Building2, User, Activity, Clock, Hash, CheckCircle } from "lucide-react";

export default function ViewClinicBranchModal({ branch, onClose }) {
  if (!branch) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="rounded-xl overflow-hidden shadow-2xl" style={{ background: "var(--color-surface)", width: "650px", maxHeight: "85vh", display: "flex", flexDirection: "column" }}>
        
        {/* Header */}
        <div className="px-4 py-3 flex justify-between items-center flex-shrink-0" style={{ background: "var(--color-drugs)", color: "white" }}>
          <div className="flex items-center gap-2">
            <MapPin size={18} />
            <span className="text-sm font-bold">Branch Details</span>
            <span className="text-xs opacity-80">ID: {branch.branch_code}</span>
          </div>
          <button onClick={onClose} className="p-1 rounded transition-all hover:bg-white/20">
            <X size={16} style={{ color: "white" }} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Branch Name Header */}
          <div className="mb-4 pb-3 border-b" style={{ borderColor: "var(--color-border)" }}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold" style={{ color: "var(--color-text-base)" }}>
                  {branch.branch_name}
                </h2>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm font-medium" style={{ color: "var(--color-drugs)" }}>
                    Code: {branch.branch_code}
                  </span>
                  {branch.is_main_branch && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: "#d1fae5", color: "#059669" }}>
                      <CheckCircle size={10} /> Main Branch
                    </span>
                  )}
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    branch.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {branch.status === "ACTIVE" ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Created On</div>
                <div className="text-sm font-semibold">{formatDate(branch.created_at)}</div>
              </div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-2 gap-4">
            {/* Left Column */}
            <div>
              {/* Basic Information */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-2 pb-1 border-b flex items-center gap-1" style={{ color: "var(--color-drugs)", borderColor: "var(--color-border)" }}>
                  <Building2 size={14} /> Basic Information
                </h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Building2 size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                    <div>
                      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Branch Code</div>
                      <div className="text-sm font-medium">{branch.branch_code}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                    <div>
                      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Branch Name</div>
                      <div className="text-sm font-medium">{branch.branch_name}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Building2 size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                    <div>
                      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Clinic</div>
                      <div className="text-sm font-medium">{branch.clinic_name || "—"}</div>
                    </div>
                  </div>
                  {branch.is_main_branch && (
                    <div className="flex items-start gap-2">
                      <CheckCircle size={14} className="mt-0.5" style={{ color: "#059669" }} />
                      <div>
                        <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Main Branch</div>
                        <div className="text-sm font-medium text-green-600">Yes</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-2 pb-1 border-b flex items-center gap-1" style={{ color: "var(--color-drugs)", borderColor: "var(--color-border)" }}>
                  <Phone size={14} /> Contact Information
                </h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Phone size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                    <div>
                      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Mobile Number</div>
                      <div className="text-sm font-medium">{branch.mobile || "—"}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Mail size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                    <div>
                      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Email Address</div>
                      <div className="text-sm font-medium">{branch.email || "—"}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div>
              {/* Address Information */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-2 pb-1 border-b flex items-center gap-1" style={{ color: "var(--color-drugs)", borderColor: "var(--color-border)" }}>
                  <MapPin size={14} /> Address Information
                </h3>
                <div className="space-y-2">
                  {(branch.address_line1 || branch.address_line2) ? (
                    <>
                      <div className="text-sm" style={{ color: "var(--color-text-base)" }}>
                        {branch.address_line1 && <div>{branch.address_line1}</div>}
                        {branch.address_line2 && <div>{branch.address_line2}</div>}
                        {(branch.city || branch.state) && (
                          <div>
                            {branch.city && <span>{branch.city}</span>}
                            {branch.city && branch.state && <span>, </span>}
                            {branch.state && <span>{branch.state}</span>}
                          </div>
                        )}
                        {branch.country && <div>{branch.country}</div>}
                        {branch.pincode && <div>PIN: {branch.pincode}</div>}
                      </div>
                    </>
                  ) : (
                    <div className="text-sm" style={{ color: "var(--color-text-muted)" }}>No address provided</div>
                  )}
                </div>
              </div>

              {/* Timestamps */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-2 pb-1 border-b flex items-center gap-1" style={{ color: "var(--color-drugs)", borderColor: "var(--color-border)" }}>
                  <Clock size={14} /> Timestamps
                </h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Calendar size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                    <div>
                      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Created At</div>
                      <div className="text-sm font-medium">{formatDate(branch.created_at)}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                    <div>
                      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Last Updated</div>
                      <div className="text-sm font-medium">{formatDate(branch.updated_at)}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Staff Information (if available) */}
              {branch.staff_count !== undefined && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold mb-2 pb-1 border-b flex items-center gap-1" style={{ color: "var(--color-drugs)", borderColor: "var(--color-border)" }}>
                    <User size={14} /> Staff Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <User size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                      <div>
                        <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Total Staff</div>
                        <div className="text-sm font-medium">{branch.staff_count} members</div>
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
              style={{ background: "var(--color-drugs)", color: "white" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#146b4c"}
              onMouseLeave={(e) => e.currentTarget.style.background = "var(--color-drugs)"}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}