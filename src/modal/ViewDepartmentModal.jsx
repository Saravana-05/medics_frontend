// src/modal/ViewDepartmentModal.jsx
import { useState } from "react";
import { X, Building, Building2, Calendar, FileText, User, Activity, MapPin, Clock } from "lucide-react";

export default function ViewDepartmentModal({ department, onClose }) {
  if (!department) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="rounded-xl overflow-hidden shadow-2xl" style={{ background: "var(--color-surface)", width: "550px", maxHeight: "85vh", display: "flex", flexDirection: "column" }}>
        
        {/* Header */}
        <div className="px-4 py-3 flex justify-between items-center flex-shrink-0" style={{ background: "var(--color-info)", color: "white" }}>
          <div className="flex items-center gap-2">
            <Building size={18} />
            <span className="text-sm font-bold">Department Details</span>
            <span className="text-xs opacity-80">ID: {department.department_code || department.id?.slice(0, 8)}</span>
          </div>
          <button onClick={onClose} className="p-1 rounded transition-all hover:bg-white/20">
            <X size={16} style={{ color: "white" }} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Department Name Header */}
          <div className="mb-4 pb-3 border-b" style={{ borderColor: "var(--color-border)" }}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold" style={{ color: "var(--color-text-base)" }}>
                  {department.department_name}
                </h2>
                <div className="flex items-center gap-3 mt-1">
                  {department.department_code && (
                    <span className="text-sm font-medium" style={{ color: "var(--color-info)" }}>
                      Code: {department.department_code}
                    </span>
                  )}
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    department.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {department.status === "ACTIVE" ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Created On</div>
                <div className="text-sm font-semibold">{formatDate(department.created_at)}</div>
              </div>
            </div>
          </div>

          {/* Department Information */}
          <div className="space-y-4">
            {/* Basic Information */}
            <div>
              <h3 className="text-sm font-semibold mb-2 pb-1 border-b flex items-center gap-1" style={{ color: "var(--color-info)", borderColor: "var(--color-border)" }}>
                <Building size={14} /> Basic Information
              </h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Building size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                  <div>
                    <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Department Name</div>
                    <div className="text-sm font-medium">{department.department_name}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Building2 size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                  <div>
                    <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Department Code</div>
                    <div className="text-sm font-medium">{department.department_code || "—"}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Activity size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                  <div>
                    <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Status</div>
                    <div className="text-sm font-medium">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                        department.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {department.status === "ACTIVE" ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Clinic Information */}
            <div>
              <h3 className="text-sm font-semibold mb-2 pb-1 border-b flex items-center gap-1" style={{ color: "var(--color-info)", borderColor: "var(--color-border)" }}>
                <Building2 size={14} /> Clinic Information
              </h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Building2 size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                  <div>
                    <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Clinic</div>
                    <div className="text-sm font-medium">{department.clinic_name || "—"}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                  <div>
                    <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Clinic Location</div>
                    <div className="text-sm font-medium">{department.clinic_city || department.clinic_address || "—"}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {department.description && (
              <div>
                <h3 className="text-sm font-semibold mb-2 pb-1 border-b flex items-center gap-1" style={{ color: "var(--color-info)", borderColor: "var(--color-border)" }}>
                  <FileText size={14} /> Description
                </h3>
                <div className="p-3 rounded-lg" style={{ background: "var(--color-surface-alt)" }}>
                  <p className="text-sm" style={{ color: "var(--color-text-base)" }}>{department.description}</p>
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div>
              <h3 className="text-sm font-semibold mb-2 pb-1 border-b flex items-center gap-1" style={{ color: "var(--color-info)", borderColor: "var(--color-border)" }}>
                <Clock size={14} /> Timestamps
              </h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Calendar size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                  <div>
                    <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Created At</div>
                    <div className="text-sm font-medium">{formatDate(department.created_at)}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                  <div>
                    <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Last Updated</div>
                    <div className="text-sm font-medium">{formatDate(department.updated_at)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Staff Count (if available) */}
            {department.staff_count !== undefined && (
              <div>
                <h3 className="text-sm font-semibold mb-2 pb-1 border-b flex items-center gap-1" style={{ color: "var(--color-info)", borderColor: "var(--color-border)" }}>
                  <User size={14} /> Staff Information
                </h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <User size={14} className="mt-0.5" style={{ color: "var(--color-text-muted)" }} />
                    <div>
                      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Total Staff</div>
                      <div className="text-sm font-medium">{department.staff_count} members</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-4 pt-3 border-t flex justify-end" style={{ borderColor: "var(--color-border)" }}>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg text-sm font-semibold transition-all"
              style={{ background: "var(--color-info)", color: "white" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#0284c7"}
              onMouseLeave={(e) => e.currentTarget.style.background = "var(--color-info)"}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}