import { useState, useRef } from "react";
import { Plus, Search, Eye, Edit2, X, Upload, FileText } from "lucide-react";
import useFillRowCount from "../../hooks/useFillRowCount";

import drugGroups from "../../data/drugGroups.json";
import labGroups from "../../data/labGroups.json";
import ipTimeGroups from "../../data/ipTimeGroups.json";
import serviceFiles from "../../data/serviceFiles.json";
import doctors from "../../data/doctors.json";

const GROUP_LIST_SEEDS = { drugGroups, labGroups, ipTimeGroups };

/* Row height (px) — matches Previous Information's / other grids' fixed row height
   so all top-level columns line up. */
const ROW_HEIGHT_PX = 42;

/* ── Centered modal, reused for both "add title" (group-list) and "upload file" (file-manager) ── */
function SidePanelModal({ title, accentColor, accentLight, children, footer, onCancel }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ background: "rgba(0,0,0,0.35)" }} onClick={onCancel}>
      <div className="rounded-lg shadow-xl w-full max-w-sm" style={{ background: "var(--color-surface)", border: `1px solid ${accentColor}` }} onClick={e => e.stopPropagation()}>
        <div className="px-4 py-3 border-b" style={{ borderColor: "var(--color-border)", background: accentLight }}>
          <span className="text-sm font-bold" style={{ color: accentColor }}>{title}</span>
        </div>
        <div className="p-4">{children}</div>
        <div className="flex items-center justify-end gap-2 px-4 py-3 border-t" style={{ borderColor: "var(--color-border)" }}>
          {footer}
        </div>
      </div>
    </div>
  );
}

function EmptyPanelRow({ columnCount }) {
  return (
    <div className="flex border-b" style={{ borderColor: "var(--color-border)", height: `${ROW_HEIGHT_PX}px`, boxSizing: "border-box" }}>
      {Array.from({ length: columnCount }).map((_, i) => <div key={i} className="flex-1 px-3 py-2.5">&nbsp;</div>)}
    </div>
  );
}

function PanelHeader({ icon: Icon, title, subtitle, accentColor, accentLight, onAdd, addLabel, searchTerm, onSearchChange, actions }) {
  return (
    <>
      <div className="flex-shrink-0 px-3 py-1.5 border-b flex justify-between items-center" style={{ background: accentLight, borderColor: "var(--color-border)" }}>
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md" style={{ background: accentColor, color: "white" }}><Icon size={12} /></div>
          <div>
            <h3 className="text-xs font-bold leading-tight" style={{ color: accentColor }}>{title}</h3>
            <p className="text-[0.58rem] font-medium leading-tight" style={{ color: "var(--color-text-muted)" }}>{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {actions}
          {onAdd && (
            <button onClick={onAdd} className="p-1 rounded-md transition-all" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }} title={addLabel}>
              <Plus size={12} style={{ color: accentColor }} />
            </button>
          )}
          {onSearchChange && (
            <div className="relative">
              <Search size={11} className="absolute left-2.5 top-1/2 transform -translate-y-1/2" style={{ color: "var(--color-text-muted)" }} />
              <input type="text" placeholder="Search..." value={searchTerm} onChange={e => onSearchChange(e.target.value)}
                className="pl-7 pr-2 py-1 text-[0.7rem] rounded-lg w-28 focus:w-40 transition-all duration-200 outline-none"
                style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)", color: "var(--color-text-base)" }} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* ── "group-list" panel type: Drug Group Prescription / Test Group Prescription / IP Time Group ── */
function GroupListPanel({ sidePanel, accentColor, accentLight, icon }) {
  const [entries, setEntries] = useState(() => GROUP_LIST_SEEDS[sidePanel.dataFile] || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [doctorFilter, setDoctorFilter] = useState("All Doctors");
  const [modalMode, setModalMode] = useState(null); // null | "add" | { id, title }
  const rowsScrollRef = useRef(null);

  const byDoctor = doctorFilter === "All Doctors" ? entries : entries.filter(e => e.doctor === doctorFilter);
  const filtered = searchTerm.trim() ? byDoctor.filter(e => e.title.toLowerCase().includes(searchTerm.toLowerCase())) : byDoctor;
  const fillRowCount = useFillRowCount(rowsScrollRef, ROW_HEIGHT_PX, filtered.length);

  const metricCount = sidePanel.columns.length - 1;

  const handleAdd = (title, metrics) => setEntries(prev => [...prev, { id: Date.now(), title, doctor: doctorFilter === "All Doctors" ? doctors[0] : doctorFilter, metrics }]);
  const handleModify = (id, title, metrics) => setEntries(prev => prev.map(e => e.id === id ? { ...e, title, metrics } : e));
  const handleDelete = id => { if (window.confirm("Delete this entry?")) setEntries(prev => prev.filter(e => e.id !== id)); };
  const handleView = e => alert(`${e.title}\n${sidePanel.columns.slice(1).map((c, i) => `${c}: ${e.metrics[i]}`).join(" · ")}`);

  return (
    <>
      <PanelHeader icon={icon} title={sidePanel.title} accentColor={accentColor} accentLight={accentLight}
        subtitle={`${entries.length} ${sidePanel.itemLabel}`}
        searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <div className="flex items-center border-b flex-shrink-0" style={{ background: "var(--color-primary-muted)", borderColor: "var(--color-border)", height: "30px", boxSizing: "border-box" }}>
        <div className="w-12 px-3 text-center" style={{ fontSize: "0.65rem", fontWeight: "800", letterSpacing: "0.03em", lineHeight: 1, color: "var(--color-primary-dark)" }}>No.</div>
        {sidePanel.columns.map((col, i) => (
          <div key={col} className={i === 0 ? "flex-1 px-3" : "w-16 px-3 text-center"}
            style={{ fontSize: "0.65rem", fontWeight: "800", letterSpacing: "0.03em", lineHeight: 1, color: "var(--color-primary-dark)" }}>{col}</div>
        ))}
        <div className="w-40 px-3 text-center" style={{ fontSize: "0.65rem", fontWeight: "800", letterSpacing: "0.03em", lineHeight: 1, color: "var(--color-primary-dark)" }}>Actions</div>
      </div>

      <div ref={rowsScrollRef} className="overflow-y-auto flex-1 no-scrollbar">
        {filtered.map((e, index) => (
          <div key={e.id} className="flex border-b" style={{ borderColor: "var(--color-border)", background: index % 2 === 0 ? "var(--color-surface)" : "var(--color-surface-alt)", height: `${ROW_HEIGHT_PX}px`, boxSizing: "border-box" }}>
            <div className="w-12 px-3 py-2.5 text-center"><span className="text-xs font-semibold" style={{ color: "var(--color-primary)" }}>{index + 1}.</span></div>
            <div className="flex-1 px-3 py-2.5"><span className="text-xs font-medium" style={{ color: "var(--color-text-base)" }}>{e.title}</span></div>
            {e.metrics.map((m, i) => (
              <div key={i} className="w-16 px-3 py-2.5 text-center"><span className="text-xs" style={{ color: "var(--color-text-muted)" }}>{m}</span></div>
            ))}
            <div className="w-40 px-3 py-2.5 flex items-center justify-center gap-1.5">
              <button onClick={() => handleView(e)} className="p-1 rounded transition-all" title="View" style={{ background: "var(--color-primary-muted)", color: "var(--color-primary)" }}><Eye size={11} /></button>
              <button onClick={() => setModalMode({ id: e.id, title: e.title, metrics: e.metrics })} className="p-1 rounded transition-all" title="Modify" style={{ background: accentLight, color: accentColor }}><Edit2 size={11} /></button>
              <button onClick={() => handleDelete(e.id)} className="p-1 rounded transition-all" title="Delete" style={{ background: "#fee2e2", color: "var(--color-danger)" }}><X size={11} /></button>
            </div>
          </div>
        ))}
        {Array.from({ length: fillRowCount }).map((_, i) => <EmptyPanelRow key={`empty-${i}`} columnCount={2 + metricCount + 1} />)}
      </div>

      <div className="flex-shrink-0 flex items-center justify-between gap-4 px-4 border-t" style={{ height: "48px", boxSizing: "border-box", background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[0.68rem] font-semibold flex-shrink-0" style={{ color: "var(--color-text-base)" }}>{sidePanel.listSourceLabel}:</span>
          <select value={doctorFilter} onChange={e => setDoctorFilter(e.target.value)}
            className="w-36 px-2 py-1.5 rounded text-xs outline-none" style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)", color: "var(--color-text-base)" }}>
            <option>All Doctors</option>
            {doctors.map(d => <option key={d}>{d}</option>)}
          </select>
          <span className="text-[0.65rem] whitespace-nowrap" style={{ color: "var(--color-text-subtle)" }}>Showing {filtered.length} of {byDoctor.length} records</span>
        </div>
        <button onClick={() => setModalMode("add")} className="flex items-center gap-1.5 text-xs font-bold flex-shrink-0" style={{ color: accentColor }}>
          {sidePanel.newButtonLabel}
          <span className="flex items-center justify-center w-5 h-5 rounded-full" style={{ background: accentColor, color: "white" }}>
            <Plus size={12} />
          </span>
        </button>
      </div>

      {modalMode && (
        <GroupEntryModal
          accentColor={accentColor} accentLight={accentLight}
          metricLabels={sidePanel.columns.slice(1)}
          initialTitle={modalMode === "add" ? "" : modalMode.title}
          initialMetrics={modalMode === "add" ? Array(metricCount).fill(0) : modalMode.metrics}
          heading={modalMode === "add" ? sidePanel.newButtonLabel : "Modify Entry"}
          onSave={(title, metrics) => { modalMode === "add" ? handleAdd(title, metrics) : handleModify(modalMode.id, title, metrics); setModalMode(null); }}
          onCancel={() => setModalMode(null)}
        />
      )}
    </>
  );
}

/* Title + one numeric field per metric column (e.g. Days/Drugs, Tests, Days/Items) —
   so "New Group" captures everything the table actually displays, not just the title. */
function GroupEntryModal({ accentColor, accentLight, metricLabels, initialTitle, initialMetrics, heading, onSave, onCancel }) {
  const [title, setTitle] = useState(initialTitle);
  const [metrics, setMetrics] = useState(initialMetrics);

  const setMetric = (i, value) => setMetrics(prev => prev.map((m, idx) => idx === i ? value : m));
  const handleSave = () => {
    if (!title.trim()) return;
    onSave(title.trim(), metrics.map(m => parseInt(m, 10) || 0));
  };

  return (
    <SidePanelModal title={heading} accentColor={accentColor} accentLight={accentLight} onCancel={onCancel}
      footer={<>
        <button onClick={onCancel} className="px-3 py-1.5 rounded-md text-xs font-semibold" style={{ background: "var(--color-danger)", color: "white" }}>Cancel</button>
        <button onClick={handleSave} disabled={!title.trim()}
          className="px-3 py-1.5 rounded-md text-xs font-semibold" style={{ background: accentColor, color: "white", opacity: title.trim() ? 1 : 0.5 }}>Save</button>
      </>}>
      <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--color-text-muted)" }}>Title</label>
      <input autoFocus type="text" value={title} onChange={e => setTitle(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter" && title.trim()) handleSave(); if (e.key === "Escape") onCancel(); }}
        placeholder="Enter title..." className="w-full px-3 py-2 rounded text-sm outline-none" style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }} />

      {metricLabels.length > 0 && (
        <div className="flex gap-3 mt-3">
          {metricLabels.map((label, i) => (
            <div key={label} className="flex-1 min-w-0">
              <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--color-text-muted)" }}>{label}</label>
              <input type="number" min="0" value={metrics[i] ?? 0} onChange={e => setMetric(i, e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && title.trim()) handleSave(); if (e.key === "Escape") onCancel(); }}
                className="w-full px-3 py-2 rounded text-sm outline-none" style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }} />
            </div>
          ))}
        </div>
      )}
    </SidePanelModal>
  );
}

/* ── "report-view" panel type (Lab only, toggled by the tab's Preview button) ── */
function ReportViewPanel({ sidePanel, accentColor, accentLight, icon, reportItems, onTogglePreview }) {
  const rowsScrollRef = useRef(null);
  const fillRowCount = useFillRowCount(rowsScrollRef, ROW_HEIGHT_PX, reportItems.length);

  return (
    <>
      <PanelHeader icon={icon} title={sidePanel.reportView.title} accentColor={accentColor} accentLight={accentLight}
        subtitle={`${reportItems.length} Result${reportItems.length !== 1 ? "s" : ""}`}
        actions={
          <div className="flex items-center overflow-hidden rounded-md">
            {sidePanel.reportView.actions.map(action => (
              <button key={action} onClick={action === "Preview" ? onTogglePreview : () => window.print()}
                className="px-2.5 py-1 text-[0.68rem] font-semibold text-white"
                style={{ background: action === "Preview" ? "#64748b" : "#1e293b" }}>
                {action}
              </button>
            ))}
          </div>
        } />

      <div className="flex border-b flex-shrink-0" style={{ background: "var(--color-primary-muted)", borderColor: "var(--color-border)", height: `${ROW_HEIGHT_PX}px`, boxSizing: "border-box", overflow: "hidden" }}>
        {sidePanel.reportView.columns.map((col, i) => (
          <div key={col} className={`${i === 0 ? "flex-1" : i === 1 ? "w-20" : i === 2 ? "w-48" : "w-24"} px-3 py-2.5 truncate`}
            style={{ fontSize: "0.7rem", fontWeight: "800", letterSpacing: "0.05em", color: accentColor, whiteSpace: "nowrap" }}>{col}</div>
        ))}
      </div>

      <div ref={rowsScrollRef} className="overflow-y-auto flex-1 no-scrollbar">
        {reportItems.map((item, index) => (
          <div key={item.id} className="flex border-b" style={{ borderColor: "var(--color-border)", background: index % 2 === 0 ? "var(--color-surface)" : "var(--color-surface-alt)", height: `${ROW_HEIGHT_PX}px`, boxSizing: "border-box" }}>
            <div className="flex-1 px-3 py-2.5 truncate"><span className="text-sm" style={{ color: item.observedValue ? "var(--color-text-base)" : "var(--color-text-subtle)" }}>{item.observedValue || "—"}</span></div>
            <div className="w-20 px-3 py-2.5 text-center"><span className="text-sm" style={{ color: item.unit ? "var(--color-text-base)" : "var(--color-text-subtle)" }}>{item.unit || "—"}</span></div>
            <div className="w-48 px-3 py-2.5 truncate"><span className="text-sm" style={{ color: item.bioRef ? "var(--color-text-base)" : "var(--color-text-subtle)" }}>{item.bioRef || "—"}</span></div>
            <div className="w-24 px-3 py-2.5 truncate"><span className="text-sm" style={{ color: item.specimen ? "var(--color-text-base)" : "var(--color-text-subtle)" }}>{item.specimen || "—"}</span></div>
          </div>
        ))}
        {Array.from({ length: fillRowCount }).map((_, i) => <EmptyPanelRow key={`empty-${i}`} columnCount={4} />)}
      </div>
    </>
  );
}

/* ── "file-manager" panel type (Services) ── */
function FileManagerPanel({ sidePanel, accentColor, accentLight, icon }) {
  const [files, setFiles] = useState(serviceFiles);
  const [fileTypeFilter, setFileTypeFilter] = useState("All Types");
  const [searchTerm, setSearchTerm] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const rowsScrollRef = useRef(null);
  const byType = fileTypeFilter === "All Types" ? files : files.filter(f => f.type === fileTypeFilter);
  const filtered = searchTerm.trim() ? byType.filter(f => f.fileName.toLowerCase().includes(searchTerm.toLowerCase())) : byType;
  const fillRowCount = useFillRowCount(rowsScrollRef, ROW_HEIGHT_PX, filtered.length);
  const fileTypes = [...new Set(files.map(f => f.type))];

  const formatBytes = bytes => bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)}KB` : `${(bytes / (1024 * 1024)).toFixed(2)}MB`;

  const handleFilePick = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    const now = new Date();
    const pad = n => String(n).padStart(2, "0");
    const dtTime = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${String(now.getFullYear()).slice(2)} ${pad(now.getHours() % 12 || 12)}.${pad(now.getMinutes())}${now.getHours() >= 12 ? "PM" : "AM"}`;
    setFiles(prev => [...prev, {
      id: Date.now(),
      fileName: file.name.replace(/\.[^/.]+$/, ""),
      type: (file.name.split(".").pop() || "FILE").toUpperCase(),
      size: formatBytes(file.size),
      dtTime,
    }]);
    setShowUpload(false);
  };

  const handleDelete = id => { if (window.confirm("Delete this file?")) setFiles(prev => prev.filter(f => f.id !== id)); };

  return (
    <>
      <PanelHeader icon={icon} title={sidePanel.title} accentColor={accentColor} accentLight={accentLight}
        subtitle={`${files.length} File${files.length !== 1 ? "s" : ""}`}
        searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <div className="flex items-center border-b flex-shrink-0" style={{ background: "var(--color-primary-muted)", borderColor: "var(--color-border)", height: "30px", boxSizing: "border-box" }}>
        <div className="w-12 px-3 text-center" style={{ fontSize: "0.65rem", fontWeight: "800", letterSpacing: "0.03em", lineHeight: 1, color: "var(--color-primary-dark)" }}>No.</div>
        <div className="flex-1 px-3" style={{ fontSize: "0.65rem", fontWeight: "800", letterSpacing: "0.03em", lineHeight: 1, color: "var(--color-primary-dark)" }}>File Name</div>
        <div className="w-14 px-3 text-center" style={{ fontSize: "0.65rem", fontWeight: "800", letterSpacing: "0.03em", lineHeight: 1, color: "var(--color-primary-dark)" }}>Type</div>
        <div className="w-16 px-3 text-center" style={{ fontSize: "0.65rem", fontWeight: "800", letterSpacing: "0.03em", lineHeight: 1, color: "var(--color-primary-dark)" }}>Size</div>
        <div className="w-32 px-3 text-center" style={{ fontSize: "0.65rem", fontWeight: "800", letterSpacing: "0.03em", lineHeight: 1, color: "var(--color-primary-dark)" }}>Dt-Time</div>
        <div className="w-16 px-3 text-center" style={{ fontSize: "0.65rem", fontWeight: "800", letterSpacing: "0.03em", lineHeight: 1, color: "var(--color-primary-dark)" }}>Actions</div>
      </div>

      <div ref={rowsScrollRef} className="overflow-y-auto flex-1 no-scrollbar">
        {filtered.map((f, index) => (
          <div key={f.id} className="flex border-b" style={{ borderColor: "var(--color-border)", background: index % 2 === 0 ? "var(--color-surface)" : "var(--color-surface-alt)", height: `${ROW_HEIGHT_PX}px`, boxSizing: "border-box" }}>
            <div className="w-12 px-3 py-2.5 text-center"><span className="text-xs font-semibold" style={{ color: "var(--color-primary)" }}>{index + 1}.</span></div>
            <div className="flex-1 px-3 py-2.5 flex items-center gap-1.5 min-w-0">
              <FileText size={12} style={{ color: accentColor, flexShrink: 0 }} />
              <span className="text-xs font-medium truncate" style={{ color: "var(--color-text-base)" }}>{f.fileName}</span>
            </div>
            <div className="w-14 px-3 py-2.5 text-center"><span className="text-xs" style={{ color: "var(--color-text-muted)" }}>{f.type}</span></div>
            <div className="w-16 px-3 py-2.5 text-center"><span className="text-xs" style={{ color: "var(--color-text-muted)" }}>{f.size}</span></div>
            <div className="w-32 px-3 py-2.5 text-center"><span className="text-xs whitespace-nowrap" style={{ color: "var(--color-text-muted)" }}>{f.dtTime}</span></div>
            <div className="w-16 px-3 py-2.5 flex items-center justify-center gap-1.5">
              <button onClick={() => handleDelete(f.id)} className="p-1 rounded transition-all" title="Delete" style={{ background: "#fee2e2", color: "var(--color-danger)" }}><X size={11} /></button>
            </div>
          </div>
        ))}
        {Array.from({ length: fillRowCount }).map((_, i) => <EmptyPanelRow key={`empty-${i}`} columnCount={6} />)}
      </div>

      <div className="flex-shrink-0 flex items-center justify-between gap-4 px-4 border-t" style={{ height: "48px", boxSizing: "border-box", background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[0.68rem] font-semibold flex-shrink-0" style={{ color: "var(--color-text-base)" }}>File Type:</span>
          <select value={fileTypeFilter} onChange={e => setFileTypeFilter(e.target.value)}
            className="w-36 px-2 py-1.5 rounded text-xs outline-none" style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)", color: "var(--color-text-base)" }}>
            <option>All Types</option>
            {fileTypes.map(t => <option key={t}>{t}</option>)}
          </select>
          <span className="text-[0.65rem] whitespace-nowrap" style={{ color: "var(--color-text-subtle)" }}>Showing {filtered.length} of {files.length} records</span>
        </div>
        <button onClick={() => setShowUpload(true)} className="flex items-center gap-1.5 text-xs font-bold flex-shrink-0" style={{ color: accentColor }}>
          {sidePanel.newButtonLabel}
          <span className="flex items-center justify-center w-5 h-5 rounded-full" style={{ background: accentColor, color: "white" }}>
            <Plus size={12} />
          </span>
        </button>
      </div>

      {showUpload && (
        <SidePanelModal title={sidePanel.newButtonLabel} accentColor={accentColor} accentLight={accentLight} onCancel={() => setShowUpload(false)}
          footer={<button onClick={() => setShowUpload(false)} className="px-3 py-1.5 rounded-md text-xs font-semibold" style={{ background: "var(--color-danger)", color: "white" }}>Cancel</button>}>
          <label className="flex flex-col items-center justify-center gap-2 py-6 rounded-lg cursor-pointer transition-all" style={{ border: `2px dashed ${accentColor}`, background: accentLight }}>
            <Upload size={22} style={{ color: accentColor }} />
            <span className="text-xs font-semibold" style={{ color: accentColor }}>Click to choose a file</span>
            <input type="file" className="hidden" onChange={handleFilePick} />
          </label>
        </SidePanelModal>
      )}
    </>
  );
}

/* ═══════════════ MAIN GENERIC MIDDLE PANEL — one file for all 4 tabs' report/group panels ═══════════════ */
export default function PrescriptionSidePanel({ config, showReport = false, reportItems = [], onUpdateReportItem, onTogglePreview }) {
  const { sidePanel } = config;
  if (!sidePanel) return null;

  const wrapperClass = "flex flex-col overflow-hidden";
  const wrapperStyle = { background: "var(--color-surface)", width: "100%", height: "100%" };

  if (showReport && sidePanel.reportView) {
    return (
      <div className={wrapperClass} style={wrapperStyle}>
        <ReportViewPanel sidePanel={sidePanel} accentColor={config.color} accentLight={config.colorLight} icon={config.icon}
          reportItems={reportItems} onTogglePreview={onTogglePreview} />
      </div>
    );
  }

  if (sidePanel.type === "file-manager") {
    return (
      <div className={wrapperClass} style={wrapperStyle}>
        <FileManagerPanel sidePanel={sidePanel} accentColor={config.color} accentLight={config.colorLight} icon={config.icon} />
      </div>
    );
  }

  // default: "group-list" (Drug, Lab's default view, IP Time)
  return (
    <div className={wrapperClass} style={wrapperStyle}>
      <GroupListPanel sidePanel={sidePanel} accentColor={config.color} accentLight={config.colorLight} icon={config.icon} />
    </div>
  );
}
