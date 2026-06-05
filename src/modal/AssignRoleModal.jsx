// src/modal/AssignRoleModal.jsx
import { useState, useEffect } from "react";
import { X, Shield, Save } from "lucide-react";
import { assignRoleToUser } from "../services/userService";

export default function AssignRoleModal({ user, roles, userRoles, onClose, onAssignComplete }) {
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);

  useEffect(() => {
    // Check if user already has a role
    const existingRole = userRoles.find(ur => ur.user_id === user?.id);
    if (existingRole) {
      setCurrentRole(roles.find(r => r.id === existingRole.role_id));
      setSelectedRoleId(existingRole.role_id);
    }
  }, [user, roles, userRoles]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRoleId) {
      alert("Please select a role");
      return;
    }
    
    setLoading(true);
    try {
      await assignRoleToUser(user.id, selectedRoleId);
      alert(`Role assigned successfully to ${user.full_name}`);
      onAssignComplete();
      onClose();
    } catch (error) {
      console.error("Error assigning role:", error);
      alert("Failed to assign role. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const availableRoles = roles.filter(role => role.is_active);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="rounded-xl overflow-hidden shadow-2xl" style={{ background: "var(--color-surface)", width: "450px", maxHeight: "85vh", display: "flex", flexDirection: "column" }}>
        
        {/* Header */}
        <div className="px-4 py-3 flex justify-between items-center flex-shrink-0" style={{ background: "var(--color-info)", color: "white" }}>
          <div className="flex items-center gap-2">
            <Shield size={18} />
            <span className="text-sm font-bold">Assign Role to User</span>
          </div>
          <button onClick={onClose} className="p-1 rounded transition-all hover:bg-white/20">
            <X size={16} style={{ color: "white" }} />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-3 rounded-lg" style={{ background: "var(--color-surface-alt)" }}>
              <div className="text-sm font-semibold" style={{ color: "var(--color-text-base)" }}>
                {user?.full_name}
              </div>
              <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                {user?.email}
              </div>
            </div>

            {currentRole && (
              <div className="p-3 rounded-lg" style={{ background: "#fef3c7" }}>
                <div className="text-xs font-semibold" style={{ color: "#d97706" }}>Current Role</div>
                <div className="text-sm font-medium" style={{ color: "#92400e" }}>{currentRole?.name}</div>
              </div>
            )}

            <div>
              <label className="text-[0.65rem] font-bold uppercase tracking-wide block mb-1" style={{ color: "var(--color-text-muted)" }}>
                Select Role *
              </label>
              <select
                value={selectedRoleId}
                onChange={(e) => setSelectedRoleId(e.target.value)}
                required
                className="w-full px-2 py-1.5 rounded text-sm outline-none"
                style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}
              >
                <option value="">-- Select Role --</option>
                {availableRoles.map(role => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
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
                style={{ background: "var(--color-info)" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#0284c7"}
                onMouseLeave={(e) => e.currentTarget.style.background = "var(--color-info)"}
              >
                {loading ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Assigning...
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    Assign Role
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