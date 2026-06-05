// src/components/PlatformDesk/Roles.jsx
import { useState, useEffect } from "react";
import { Shield, Plus } from "lucide-react";
import TableUI from "../Table/TableUI";
import RoleFormModal from "../../modal/RoleFormModal";
import { getAllRoles, createRole, updateRole, deleteRole } from "../../services/roleService";

export default function Roles() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  // Fetch roles from API
  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const data = await getAllRoles();
      setRoles(data);
      setError(null);
    } catch (err) {
      setError("Failed to load roles. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedRole(null);
    setIsEdit(false);
    setShowModal(true);
  };

  const handleView = (role) => {
    alert(`View Role: ${role.name}\nDescription: ${role.description || "—"}\nStatus: ${role.is_active ? "Active" : "Inactive"}`);
  };

  const handleEdit = (role) => {
    setSelectedRole(role);
    setIsEdit(true);
    setShowModal(true);
  };

  const handleDelete = async (role) => {
    if (window.confirm(`Are you sure you want to delete role "${role.name}"?`)) {
      try {
        await deleteRole(role.id);
        await fetchRoles();
      } catch (err) {
        console.error("Error deleting role:", err);
        alert("Failed to delete role. Please try again.");
      }
    }
  };

  const handleSave = async (formData) => {
    if (isEdit) {
      await updateRole(selectedRole.id, formData);
    } else {
      await createRole(formData);
    }
    await fetchRoles();
    setShowModal(false);
  };

  const getStatusBadge = (isActive) => {
    if (isActive) {
      return { bg: "#d1fae5", color: "#065f46", text: "Active" };
    }
    return { bg: "#fee2e2", color: "#dc2626", text: "Inactive" };
  };

  const columns = [
    { key: "name", label: "Role Name", align: "left", sortable: true },
    { key: "description", label: "Description", align: "left", sortable: false },
    { key: "is_active", label: "Status", align: "left", sortable: true },
  ];

  const customData = roles.map(role => ({
    ...role,
    is_active: (
      <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold" 
        style={{ background: getStatusBadge(role.is_active).bg, color: getStatusBadge(role.is_active).color }}>
        {getStatusBadge(role.is_active).text}
      </span>
    )
  }));

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ background: "var(--color-surface-alt)" }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto" style={{ borderColor: "var(--color-warning)" }}></div>
          <p className="text-sm mt-2" style={{ color: "var(--color-text-muted)" }}>Loading roles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ background: "var(--color-surface-alt)" }}>
        <div className="text-center">
          <div className="p-3 rounded-full bg-red-100 mx-auto w-12 h-12 flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm mt-2" style={{ color: "var(--color-text-muted)" }}>{error}</p>
          <button 
            onClick={fetchRoles}
            className="mt-3 px-3 py-1 rounded-lg text-xs font-semibold"
            style={{ background: "var(--color-warning)", color: "white" }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-4" style={{ background: "var(--color-surface-alt)", minHeight: "100%" }}>
        <div className="mb-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Shield size={20} style={{ color: "var(--color-warning)" }} />
              <div>
                <h2 className="text-lg font-bold" style={{ color: "var(--color-text-base)" }}>Role Management</h2>
                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>Manage platform roles and permissions</p>
              </div>
            </div>
            
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm"
              style={{ background: "var(--color-warning)", color: "white" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#d97706"}
              onMouseLeave={(e) => e.currentTarget.style.background = "var(--color-warning)"}
            >
              <Plus size={14} /> Add Role
            </button>
          </div>
        </div>

        <TableUI
          columns={columns}
          data={customData}
          title="Roles List"
          searchPlaceholder="Search by role name..."
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Role Form Modal */}
      {showModal && (
        <RoleFormModal
          role={selectedRole}
          isEdit={isEdit}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </>
  );
}