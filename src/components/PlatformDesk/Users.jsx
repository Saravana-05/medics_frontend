// src/components/PlatformDesk/Users.jsx
import { useState, useEffect } from "react";
import { Users as UsersIcon, Plus, Filter, Shield } from "lucide-react";
import TableUI from "../Table/TableUI";
import UserFormModal from "../../modal/UserFormModal";
import AssignRoleModal from "../../modal/AssignRoleModal";
import { getAllUsers, createUser, updateUser, deleteUser, getUserRoles } from "../../services/userService";
import { getAllRoles } from "../../services/roleService";

export default function UsersManagement() {  // Changed from "Users" to "UsersManagement"
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [userRoles, setUserRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedUserForRole, setSelectedUserForRole] = useState(null);

  // Fetch roles and user roles
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rolesData, userRolesData] = await Promise.all([
          getAllRoles(),
          getUserRoles()
        ]);
        setRoles(rolesData);
        setUserRoles(userRolesData);
      } catch (err) {
        console.error("Error fetching reference data:", err);
      }
    };
    fetchData();
  }, []);

  // Fetch users from API
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      
      // Enrich data with role names
      const enrichedData = await Promise.all(data.map(async (user) => {
        const userRole = userRoles.find(ur => ur.user_id === user.id);
        const role = roles.find(r => r.id === userRole?.role_id);
        return {
          ...user,
          role_name: role?.name || "—",
          role_id: role?.id || null
        };
      }));
      
      setUsers(enrichedData);
      setError(null);
    } catch (err) {
      setError("Failed to load users. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedUser(null);
    setIsEdit(false);
    setShowModal(true);
  };

  const handleAssignRole = (user) => {
    setSelectedUserForRole(user);
    setShowAssignModal(true);
  };

  const handleView = (user) => {
    alert(`View User: ${user.full_name}\nEmail: ${user.email}\nRole: ${user.role_name}`);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsEdit(true);
    setShowModal(true);
  };

  const handleDelete = async (user) => {
    if (window.confirm(`Are you sure you want to delete user "${user.full_name}"?`)) {
      try {
        await deleteUser(user.id);
        await fetchUsers();
      } catch (err) {
        console.error("Error deleting user:", err);
        alert("Failed to delete user. Please try again.");
      }
    }
  };

  const handleSave = async (formData) => {
    if (isEdit) {
      await updateUser(selectedUser.id, formData);
    } else {
      await createUser(formData);
    }
    await fetchUsers();
    setShowModal(false);
  };

  const columns = [
    { key: "full_name", label: "Full Name", align: "left", sortable: true },
    { key: "email", label: "Email", align: "left", sortable: true },
    { key: "role_name", label: "Role", align: "left", sortable: true },
    { key: "is_verified", label: "Verified", align: "left", sortable: true },
    { key: "is_active", label: "Status", align: "left", sortable: true },
  ];

  // Custom render for status
  const getStatusBadge = (isActive) => {
    if (isActive) {
      return { bg: "#d1fae5", color: "#065f46", text: "Active" };
    }
    return { bg: "#fee2e2", color: "#dc2626", text: "Inactive" };
  };

  const getVerifiedBadge = (isVerified) => {
    if (isVerified) {
      return { bg: "#d1fae5", color: "#065f46", text: "Verified" };
    }
    return { bg: "#fef3c7", color: "#d97706", text: "Pending" };
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ background: "var(--color-surface-alt)" }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto" style={{ borderColor: "var(--color-info)" }}></div>
          <p className="text-sm mt-2" style={{ color: "var(--color-text-muted)" }}>Loading users...</p>
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
            onClick={fetchUsers}
            className="mt-3 px-3 py-1 rounded-lg text-xs font-semibold"
            style={{ background: "var(--color-info)", color: "white" }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Custom table render with action buttons for assign role
  const customColumns = [
    ...columns,
    { key: "actions", label: "Actions", align: "center", sortable: false }
  ];

  const customData = users.map(user => ({
    ...user,
    is_verified: (
      <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold" 
        style={{ background: getVerifiedBadge(user.is_verified).bg, color: getVerifiedBadge(user.is_verified).color }}>
        {getVerifiedBadge(user.is_verified).text}
      </span>
    ),
    is_active: (
      <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold" 
        style={{ background: getStatusBadge(user.is_active).bg, color: getStatusBadge(user.is_active).color }}>
        {getStatusBadge(user.is_active).text}
      </span>
    ),
    actions: (
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => handleAssignRole(user)}
          className="p-1 rounded transition-all"
          style={{ color: "var(--color-info)" }}
          title="Assign Role"
        >
          <Shield size={14} />
        </button>
      </div>
    )
  }));

  return (
    <>
      <div className="p-4" style={{ background: "var(--color-surface-alt)", minHeight: "100%" }}>
        <div className="mb-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <UsersIcon size={20} style={{ color: "var(--color-info)" }} />
              <div>
                <h2 className="text-lg font-bold" style={{ color: "var(--color-text-base)" }}>User Management</h2>
                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>Manage platform users and their roles</p>
              </div>
            </div>
            
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm"
              style={{ background: "var(--color-info)", color: "white" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#0284c7"}
              onMouseLeave={(e) => e.currentTarget.style.background = "var(--color-info)"}
            >
              <Plus size={14} /> Add User
            </button>
          </div>
        </div>

        <TableUI
          columns={customColumns}
          data={customData}
          title="Users List"
          searchPlaceholder="Search by name, email..."
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* User Form Modal */}
      {showModal && (
        <UserFormModal
          user={selectedUser}
          isEdit={isEdit}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}

      {/* Assign Role Modal */}
      {showAssignModal && (
        <AssignRoleModal
          user={selectedUserForRole}
          roles={roles}
          userRoles={userRoles}
          onClose={() => setShowAssignModal(false)}
          onAssignComplete={fetchUsers}
        />
      )}
    </>
  );
}