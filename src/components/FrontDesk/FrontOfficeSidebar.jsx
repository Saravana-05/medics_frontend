// src/components/FrontDesk/FrontOfficeSidebar.jsx
import { useState } from "react";
import { 
  LayoutDashboard, CalendarPlus, Users, Clock, 
  ClipboardList, Archive, ChevronLeft, ChevronRight,
  Settings, HelpCircle
} from "lucide-react";

const MENU_ITEMS = [
  { 
    key: "dashboard", 
    label: "Dashboard", 
    icon: LayoutDashboard, 
    color: "#3b82f6",
    description: "Overview & statistics"
  },
  { 
    key: "appointments", 
    label: "Appointment & Registration", 
    icon: CalendarPlus, 
    color: "#8b5cf6",
    description: "Book & manage appointments"
  },
  { 
    key: "patientlist", 
    label: "Patient List", 
    icon: Users, 
    color: "#22c55e",
    description: "All registered patients"
  },
  { 
    key: "doctorschedule", 
    label: "Doctor's Schedule", 
    icon: Clock, 
    color: "#f59e0b",
    description: "View doctor availability"
  },
  { 
    key: "oplist", 
    label: "OP List", 
    icon: ClipboardList, 
    color: "#ef4444",
    description: "Outpatient appointments"
  },
  { 
    key: "parkedlist", 
    label: "Parked List", 
    icon: Archive, 
    color: "#6366f1",
    description: "Pending registrations"
  },
];

export default function FrontOfficeSidebar({ activeMenu, onMenuChange, isOpen, onToggle }) {
  const [hoveredKey, setHoveredKey] = useState(null);

  return (
    <div
      className={`flex flex-col flex-shrink-0 transition-all duration-300 overflow-hidden ${
        isOpen ? "w-64" : "w-16"
      }`}
      style={{
        background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
        borderRight: "1px solid #e2e8f0",
        boxShadow: "2px 0 8px rgba(0,0,0,0.05)",
      }}
    >
      {/* Sidebar Toggle Header */}
      <div className="p-3 border-b border-gray-200 flex items-center justify-between">
        {isOpen ? (
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-50">
              <LayoutDashboard size={16} className="text-blue-600" />
            </div>
            <div>
              <div className="text-xs font-bold text-gray-800">Front Desk</div>
              <div className="text-[0.6rem] text-gray-500">Reception Panel</div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center w-full">
            <div className="p-1.5 rounded-lg bg-blue-50">
              <LayoutDashboard size={16} className="text-blue-600" />
            </div>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-1 rounded hover:bg-gray-100 transition-colors"
        >
          {isOpen ? (
            <ChevronLeft size={14} className="text-gray-500" />
          ) : (
            <ChevronRight size={14} className="text-gray-500" />
          )}
        </button>
      </div>

      {/* Menu Items */}
      <div className="flex-1 py-3 overflow-y-auto">
        {MENU_ITEMS.map((item) => {
          const isActive = activeMenu === item.key;
          const isHovered = hoveredKey === item.key;
          const Icon = item.icon;
          const highlight = isActive || isHovered;

          return (
            <div
              key={item.key}
              onClick={() => onMenuChange(item.key)}
              onMouseEnter={() => setHoveredKey(item.key)}
              onMouseLeave={() => setHoveredKey(null)}
              className="relative cursor-pointer transition-all duration-200 group"
              style={{
                background: highlight ? `${item.color}10` : "transparent",
                borderLeft: isActive ? `3px solid ${item.color}` : "3px solid transparent",
              }}
            >
              <div className={`flex items-center gap-3 px-3 py-2.5 ${!isOpen && "justify-center"}`}>
                <div
                  className="p-1.5 rounded-lg transition-all duration-200"
                  style={{
                    background: highlight ? `${item.color}15` : "transparent",
                    transform: isHovered ? "scale(1.1)" : "scale(1)",
                  }}
                >
                  <Icon 
                    size={18} 
                    style={{ color: highlight ? item.color : "#64748b" }} 
                  />
                </div>
                {isOpen && (
                  <div className="flex-1">
                    <span
                      className="text-xs font-medium"
                      style={{ color: highlight ? item.color : "#1e293b" }}
                    >
                      {item.label}
                    </span>
                    <div className="text-[0.55rem] text-gray-400 truncate">
                      {item.description}
                    </div>
                  </div>
                )}
              </div>

              {/* Tooltip for collapsed mode */}
              {!isOpen && isHovered && (
                <div
                  className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 px-3 py-2 rounded-lg whitespace-nowrap z-50"
                  style={{
                    background: "white",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  }}
                >
                  <div className="text-xs font-semibold" style={{ color: item.color }}>
                    {item.label}
                  </div>
                  <div className="text-[0.55rem] text-gray-500">
                    {item.description}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200">
        {isOpen ? (
          <div className="flex justify-between text-[0.6rem] text-gray-400">
            <span className="flex items-center gap-1">
              <HelpCircle size={12} />
              Help
            </span>
            <span>v1.0</span>
          </div>
        ) : (
          <div className="flex justify-center">
            <Settings size={14} className="text-gray-400" />
          </div>
        )}
      </div>
    </div>
  );
}