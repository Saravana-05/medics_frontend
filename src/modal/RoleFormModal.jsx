// src/modal/RoleFormModal.jsx
import { useState, useEffect } from "react";
import { X, Save, Shield } from "lucide-react";

export default function RoleFormModal({ role, onClose, onSave, isEdit = false }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    is_active: true
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (role && isEdit) {
      setFormData({
        name: role.name || "",
        description: role.description || "",
        is_active: role.is_active !== undefined ? role.is_active : true
      });
    }
  }, [role, isEdit]);

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
      console.error("Error saving role:", error);
      alert("Failed to save role. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="rounded-xl overflow-hidden shadow-2xl" style={{ background: "var(--color-surface)", width: "500px", maxHeight: "85vh", display: "flex", flexDirection: "column" }}>
        
        {/* Header */}
        <div className="px-4 py-3 flex justify-between items-center flex-shrink-0" style={{ background: "var(--color-warning)", color: "white" }}>
          <div className="flex items-center gap-2">
            <Shield size={18} />
            <span className="text-sm font-bold">{isEdit ? "Edit Role" : "Add New Role"}</span>
          </div>
          <button onClick={onClose} className="p-1 rounded transition-all hover:bg-white/20">
            <X size={16} style={{ color: "white" }} />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[0.65rem] font-bold uppercase tracking-wide block mb-1" style={{ color: "var(--color-text-muted)" }}>
                Role Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-2 py-1.5 rounded text-sm outline-none"
                style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}
                placeholder="Enter role name"
              />
            </div>

            <div>
              <label className="text-[0.65rem] font-bold uppercase tracking-wide block mb-1" style={{ color: "var(--color-text-muted)" }}>
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-2 py-1.5 rounded text-sm outline-none resize-none"
                style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}
                placeholder="Enter role description"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="w-4 h-4 rounded"
                style={{ accentColor: "var(--color-warning)" }}
              />
              <label className="text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>
                Active
              </label>
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
                style={{ background: "var(--color-warning)" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#d97706"}
                onMouseLeave={(e) => e.currentTarget.style.background = "var(--color-warning)"}
              >
                {loading ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    {isEdit ? "Update Role" : "Create Role"}
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