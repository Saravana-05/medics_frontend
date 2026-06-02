import { useState } from "react";
import {
  X, Search, BookOpen, MessageCircle, Video, Phone,
  ChevronRight, ChevronDown, ExternalLink, Mail,
  Headphones, FileText, Zap, Star
} from "lucide-react";

const FAQS = [
  {
    q: "How do I add a new prescription?",
    a: "Navigate to the patient's record, click the 'Rx' tab in the main panel, then use the drug search bar to add medications. Save using Ctrl+S or the Save button.",
  },
  {
    q: "How do I view a patient's lab reports?",
    a: "Select the patient from the OP List dropdown. Lab reports appear in the right sidebar under 'Patient Reports'. Click any report to view the full result.",
  },
  {
    q: "How do I mark a patient as parked?",
    a: "From the top action bar, click 'Park Patient'. The patient will appear in the right sidebar under 'Patients Parked' until you resume the consultation.",
  },
  {
    q: "How do I switch between OP and IP modes?",
    a: "Use the 'OP List' and 'IP List' buttons in the top navigation bar to switch between outpatient and inpatient views.",
  },
  {
    q: "Can I print a prescription directly?",
    a: "Yes — use the print icon in the top-right of the prescription panel, or press Ctrl+P. Make sure a printer is configured in Settings.",
  },
];

const QUICK_LINKS = [
  { icon: BookOpen,   label: "User Manual",       color: "var(--color-primary)" },
  { icon: Video,      label: "Video Tutorials",    color: "#8b5cf6"              },
  { icon: FileText,   label: "Release Notes",      color: "var(--color-success)" },
  { icon: Zap,        label: "Keyboard Shortcuts", color: "var(--color-warning)" },
];

export default function HelpPopup({ onClose }) {
  const [search,     setSearch]     = useState("");
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [activeTab,  setActiveTab]  = useState("faq"); // faq | contact

  const filtered = FAQS.filter(f =>
    f.q.toLowerCase().includes(search.toLowerCase()) ||
    f.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center pt-16"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="relative flex flex-col overflow-hidden rounded-2xl shadow-2xl"
        style={{ width: 520, height: 520, background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex-shrink-0 px-5 py-4"
          style={{ background: "linear-gradient(135deg, var(--color-sidebar-bg) 0%, #0a4a6e 100%)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm font-bold text-white">Help & Support</div>
              <div className="text-[0.6rem] mt-0.5" style={{ color: "rgba(255,255,255,0.6)" }}>Medix OP Desk v2.0</div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.15)", color: "white" }}>
              <X size={14} />
            </button>
          </div>
          {/* Search */}
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.5)" }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search help articles…"
              className="w-full pl-8 pr-3 py-2 rounded-lg text-xs outline-none"
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "white",
              }}
            />
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex flex-shrink-0 border-b" style={{ borderColor: "var(--color-border)" }}>
          {[{ key: "faq", label: "FAQs" }, { key: "contact", label: "Contact Support" }].map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className="flex-1 py-2.5 text-xs font-semibold transition-all"
              style={{
                color:        activeTab === t.key ? "var(--color-primary)" : "var(--color-text-muted)",
                borderBottom: activeTab === t.key ? "2px solid var(--color-primary)" : "2px solid transparent",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "faq" ? (
            <div>
              {/* Quick links */}
              {!search && (
                <div className="grid grid-cols-4 gap-2 p-4 border-b" style={{ borderColor: "var(--color-border)" }}>
                  {QUICK_LINKS.map(({ icon: Icon, label, color }) => (
                    <button
                      key={label}
                      className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all"
                      style={{ background: `${color}10`, border: `1px solid ${color}20` }}
                    >
                      <Icon size={16} style={{ color }} />
                      <span className="text-[0.58rem] font-semibold text-center leading-tight" style={{ color }}>{label}</span>
                    </button>
                  ))}
                </div>
              )}
              {/* FAQ list */}
              <div className="px-4 py-2">
                {filtered.length === 0 ? (
                  <div className="text-center py-8 text-xs" style={{ color: "var(--color-text-muted)" }}>
                    No results for "{search}"
                  </div>
                ) : (
                  filtered.map((faq, i) => (
                    <div key={i} className="border-b" style={{ borderColor: "var(--color-border)" }}>
                      <button
                        className="w-full flex items-center justify-between py-3 text-left"
                        onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                      >
                        <span className="text-xs font-semibold pr-3" style={{ color: "var(--color-text-base)" }}>{faq.q}</span>
                        {expandedFaq === i
                          ? <ChevronDown size={14} style={{ color: "var(--color-primary)", flexShrink: 0 }} />
                          : <ChevronRight size={14} style={{ color: "var(--color-text-muted)", flexShrink: 0 }} />
                        }
                      </button>
                      {expandedFaq === i && (
                        <div className="pb-3 text-xs leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                          {faq.a}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="p-5 space-y-3">
              {[
                { icon: Headphones, label: "Live Chat Support",   sub: "Available Mon–Sat 9AM–6PM",   badge: "Online",   color: "var(--color-success)" },
                { icon: Phone,      label: "Phone Support",        sub: "+91 044 4567 8900",           badge: null,       color: "var(--color-primary)" },
                { icon: Mail,       label: "Email Support",        sub: "support@medix.com",           badge: "24h reply", color: "#8b5cf6"             },
                { icon: MessageCircle, label: "Submit a Ticket",   sub: "Track your issue online",     badge: null,       color: "var(--color-warning)" },
              ].map(({ icon: Icon, label, sub, badge, color }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all"
                  style={{ border: `1px solid ${color}30`, background: `${color}08` }}
                >
                  <div className="p-2.5 rounded-xl flex-shrink-0" style={{ background: `${color}15` }}>
                    <Icon size={16} style={{ color }} />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-semibold" style={{ color: "var(--color-text-base)" }}>{label}</div>
                    <div className="text-[0.6rem] mt-0.5" style={{ color: "var(--color-text-muted)" }}>{sub}</div>
                  </div>
                  {badge && (
                    <span className="text-[0.55rem] font-bold px-2 py-0.5 rounded-full" style={{ background: `${color}20`, color }}>
                      {badge}
                    </span>
                  )}
                  <ChevronRight size={14} style={{ color: "var(--color-text-muted)" }} />
                </div>
              ))}

              {/* Rating */}
              <div className="mt-4 p-4 rounded-xl text-center" style={{ background: "var(--color-surface-alt)", border: "1px solid var(--color-border)" }}>
                <div className="text-xs font-semibold mb-2" style={{ color: "var(--color-text-base)" }}>Rate your experience</div>
                <div className="flex justify-center gap-2">
                  {[1,2,3,4,5].map(n => (
                    <button key={n}>
                      <Star size={20} style={{ color: n <= 4 ? "#f59e0b" : "var(--color-border)" }} fill={n <= 4 ? "#f59e0b" : "none"} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}