// src/components/Table/TableUI.jsx
import { useState } from "react";
import { Search, ChevronDown, ChevronUp, Eye, Edit2, Trash2 } from "lucide-react";

export default function TableUI({ 
  columns, 
  data, 
  title,
  onView,
  onEdit,
  onDelete,
  searchable = true,
  searchPlaceholder = "Search...",
  actionButtons = true
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredData = data.filter(item => {
    if (!searchTerm) return true;
    return columns.some(col => {
      const value = item[col.key];
      return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
    });
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;
    
    let aVal = a[sortField];
    let bVal = b[sortField];
    
    if (typeof aVal === 'string') {
      return sortDirection === "asc" 
        ? aVal.localeCompare(bVal) 
        : bVal.localeCompare(aVal);
    }
    
    if (typeof aVal === 'number') {
      return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
    }
    
    return 0;
  });

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronDown size={12} className="opacity-30" />;
    return sortDirection === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />;
  };

  const getStatusBadge = (status) => {
    if (status === "ACTIVE") {
      return { bg: "#d1fae5", color: "#065f46", text: "Active" };
    } else if (status === "INACTIVE") {
      return { bg: "#fee2e2", color: "var(--color-danger)", text: "Inactive" };
    }
    return { bg: "#fef3c7", color: "#d97706", text: status || "Unknown" };
  };

  return (
    <div className="rounded-lg overflow-hidden shadow-sm" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
      {/* Header */}
      <div className="px-4 py-3 border-b flex justify-between items-center" style={{ 
        background: "linear-gradient(135deg, var(--color-primary-muted) 0%, var(--color-surface) 100%)",
        borderColor: "var(--color-border)"
      }}>
        <div>
          <h3 className="text-sm font-bold" style={{ color: "var(--color-primary-dark)" }}>{title}</h3>
          <p className="text-[0.6rem] font-medium mt-0.5" style={{ color: "var(--color-text-muted)" }}>
            {data.length} records found
          </p>
        </div>
        
        {searchable && (
          <div className="relative">
            <Search size={12} className="absolute left-2 top-1/2 transform -translate-y-1/2" style={{ color: "var(--color-text-muted)" }} />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-7 pr-2 py-1 text-xs rounded-md w-48 focus:w-64 transition-all duration-200 outline-none"
              style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}
            />
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs">
          <thead className="sticky top-0 z-10">
            <tr style={{ background: "var(--color-surface-alt)" }}>
              {columns.map(col => (
                <th 
                  key={col.key}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                  className={`px-3 py-2.5 ${col.align === 'right' ? 'text-right' : 'text-left'} ${col.sortable !== false ? 'cursor-pointer hover:bg-opacity-80' : ''} transition-all`}
                  style={{ 
                    borderBottom: "1px solid var(--color-border)",
                    fontSize: "0.65rem",
                    fontWeight: "700",
                    letterSpacing: "0.05em",
                    color: "var(--color-primary-dark)",
                    textTransform: "uppercase"
                  }}
                >
                  <div className={`flex items-center gap-1 ${col.align === 'right' ? 'justify-end' : 'justify-start'}`}>
                    {col.label}
                    {col.sortable !== false && <SortIcon field={col.key} />}
                  </div>
                </th>
              ))}
              {actionButtons && (
                <th className="px-3 py-2.5 text-center" style={{ 
                  borderBottom: "1px solid var(--color-border)",
                  fontSize: "0.65rem",
                  fontWeight: "700",
                  letterSpacing: "0.05em",
                  color: "var(--color-primary-dark)",
                  textTransform: "uppercase"
                }}>
                  Actions
                </th>
              )}
             </tr>
          </thead>
          <tbody>
            {sortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actionButtons ? 1 : 0)} className="py-8 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                    <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>No data found</p>
                  </div>
                </td>
              </tr>
            ) : (
              sortedData.map((item, index) => {
                const isEven = index % 2 === 0;
                const statusBadge = item.status ? getStatusBadge(item.status) : null;
                
                return (
                  <tr 
                    key={item.id}
                    className="transition-all duration-150 hover:shadow-sm"
                    style={{ 
                      background: isEven ? "var(--color-surface)" : "var(--color-surface-alt)",
                      borderBottom: "1px solid var(--color-border)"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "var(--color-primary-muted)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = isEven ? "var(--color-surface)" : "var(--color-surface-alt)"}
                  >
                    {columns.map(col => (
                      <td key={col.key} className={`px-3 py-2 ${col.align === 'right' ? 'text-right' : 'text-left'}`}>
                        {col.key === "status" && statusBadge ? (
                          <span className="px-2 py-0.5 rounded-full text-[0.65rem] font-semibold" style={{ background: statusBadge.bg, color: statusBadge.color }}>
                            {statusBadge.text}
                          </span>
                        ) : (
                          <span style={{ color: "var(--color-text-base)" }}>
                            {item[col.key] || "—"}
                          </span>
                        )}
                      </td>
                    ))}
                    {actionButtons && (
                      <td className="px-3 py-2 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {onView && (
                            <button onClick={() => onView(item)} className="p-1 rounded transition-all" title="View" style={{ color: "var(--color-primary)" }}>
                              <Eye size={14} />
                            </button>
                          )}
                          {onEdit && (
                            <button onClick={() => onEdit(item)} className="p-1 rounded transition-all" title="Edit" style={{ color: "var(--color-info)" }}>
                              <Edit2 size={14} />
                            </button>
                          )}
                          {onDelete && (
                            <button onClick={() => onDelete(item)} className="p-1 rounded transition-all" title="Delete" style={{ color: "var(--color-danger)" }}>
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}