// src/components/PlatformDesk/Users.jsx
import { Users as UsersIcon } from "lucide-react";
import TableUI from "../Table/TableUI";
import { useState } from "react";

export default function Users() {
  const [users, setUsers] = useState([]);

  const columns = [
    { key: "full_name", label: "Full Name", align: "left" },
    { key: "email", label: "Email", align: "left" },
    { key: "role", label: "Role", align: "left" },
    { key: "status", label: "Status", align: "left" },
  ];

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-1">
        <UsersIcon size={20} style={{ color: "var(--color-info)" }} />
        <h2 className="text-lg font-bold" style={{ color: "var(--color-text-base)" }}>User Management</h2>
      </div>
      <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>Manage platform users and their roles</p>
      
      <TableUI
        columns={columns}
        data={users}
        title="Users List"
        searchPlaceholder="Search users..."
      />
    </div>
  );
}