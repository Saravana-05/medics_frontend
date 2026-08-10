import { useState } from "react";
import {
  X, Bell, FlaskConical, Calendar, Cpu,
  AlertTriangle, CheckCircle, Clock, Dot
} from "lucide-react";

const NOTIFICATIONS = [
  {
    id: 1,
    icon: FlaskConical,
    color: "var(--color-primary)",
    title: "New lab results available",
    body: "3 patients have new reports ready for review.",
    time: "2 min ago",
    unread: true,
  },
  {
    id: 2,
    icon: Calendar,
    color: "var(--color-warning)",
    title: "Appointment reminder",
    body: "Next patient (Smt. Vijayalakshmi) in 5 minutes.",
    time: "15 min ago",
    unread: true,
  },
  {
    id: 3,
    icon: AlertTriangle,
    color: "var(--color-danger)",
    title: "Emergency case assigned",
    body: "Meena Iyer — High fever (104°F). Please attend immediately.",
    time: "22 min ago",
    unread: true,
  },
  {
    id: 4,
    icon: Cpu,
    color: "var(--color-success)",
    title: "System update completed",
    body: "Medix v2.1 is live. New prescription templates added.",
    time: "1 hr ago",
    unread: false,
  },
  {
    id: 5,
    icon: CheckCircle,
    color: "var(--color-success)",
    title: "Prescription saved",
    body: "OP-1234 prescription was saved and sent to pharmacy.",
    time: "2 hr ago",
    unread: false,
  },
];

export default function NotificationDropdown({ onClose }) {
  const [items, setItems] = useState(NOTIFICATIONS);

  const unreadCount = items.filter(n => n.unread).length;

  const markAllRead = () => setItems(prev => prev.map(n => ({ ...n, unread: false })));
  const dismiss     = (id) => setItems(prev => prev.filter(n => n.id !== id));

  return (
    <div
      className="absolute right-0 top-full mt-2 rounded-xl shadow-2xl z-50 overflow-hidden"
      style={{
        width: 320,
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--color-border)" }}>
        <div className="flex items-center gap-2">
          <Bell size={14} style={{ color: "var(--color-primary)" }} />
          <span className="text-xs font-bold" style={{ color: "var(--color-text-base)" }}>Notifications</span>
          {unreadCount > 0 && (
            <span className="text-[0.55rem] font-bold px-1.5 py-0.5 rounded-full"
              style={{ background: "var(--color-danger)", color: "white" }}>
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="text-[0.6rem] font-semibold" style={{ color: "var(--color-primary)" }}>
            Mark all read
          </button>
        )}
      </div>

      {/* List */}
      <div className="overflow-y-auto" style={{ maxHeight: 340 }}>
        {items.length === 0 ? (
          <div className="py-10 text-center">
            <Bell size={28} style={{ color: "var(--color-text-subtle)", margin: "0 auto 8px" }} />
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>All caught up!</p>
          </div>
        ) : (
          items.map(({ id, icon: Icon, color, title, body, time, unread }) => (
            <div
              key={id}
              className="relative flex items-start gap-3 px-4 py-2 border-b transition-all cursor-pointer"
              style={{
                borderColor: "var(--color-border)",
                background: unread ? `${color}07` : "transparent",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--color-surface-alt)"}
              onMouseLeave={e => e.currentTarget.style.background = unread ? `${color}07` : "transparent"}
            >
              {/* Icon */}
              <div className="p-2 rounded-xl flex-shrink-0 mt-0.5" style={{ background: `${color}15` }}>
                <Icon size={13} style={{ color }} />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-semibold leading-tight" style={{ color: "var(--color-text-base)" }}>
                    {title}
                  </span>
                  {unread && (
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: color }} />
                  )}
                </div>
                <p className="text-[0.62rem] mt-0.5 leading-relaxed" style={{ color: "var(--color-text-muted)" }}>{body}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Clock size={9} style={{ color: "var(--color-text-subtle)" }} />
                  <span className="text-[0.55rem]" style={{ color: "var(--color-text-subtle)" }}>{time}</span>
                </div>
              </div>

              {/* Dismiss */}
              <button
                onClick={e => { e.stopPropagation(); dismiss(id); }}
                className="opacity-0 group-hover:opacity-100 p-0.5 rounded-full flex-shrink-0 mt-0.5 transition-opacity"
                style={{ background: "var(--color-surface-alt)" }}
                onMouseEnter={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.background = "var(--color-border)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "var(--color-surface-alt)"; }}
              >
                <X size={10} style={{ color: "var(--color-text-muted)" }} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t text-center" style={{ borderColor: "var(--color-border)" }}>
        <button className="text-[0.65rem] font-semibold" style={{ color: "var(--color-primary)" }}>
          View all notifications
        </button>
      </div>
    </div>
  );
}