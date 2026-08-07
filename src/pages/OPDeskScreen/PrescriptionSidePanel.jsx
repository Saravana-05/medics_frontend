import { useState, useRef } from "react";
import { Plus, Search, Eye, Edit2, X, Upload, FileText, ArrowRightCircle } from "lucide-react";
import useFillRowCount from "../../hooks/useFillRowCount";

import drugGroups from "../../data/drugGroups.json";
import labGroups from "../../data/labGroups.json";
import serviceFiles from "../../data/serviceFiles.json";
import doctors from "../../data/doctors.json";
import medicineList from "../../data/medicines.json";
import labTestList from "../../data/labTest.json";

const GROUP_LIST_SEEDS = { drugGroups, labGroups };
// Which real catalog backs each tab's group-list picker — keyed by config.searchSource.
const CATALOG_SOURCES = { medicines: medicineList, lab_tests: labTestList };

/* Row height (px) — matches Previous Information's / other grids' fixed row height
   so all top-level columns line up. */
const ROW_HEIGHT_PX = 42;

/* ── Centered modal, reused for both "add title" (group-list) and "upload file" (file-manager) ── */
function SidePanelModal({ title, accentColor, accentLight, textAccent, children, footer, onCancel }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ background: "rgba(0,0,0,0.35)" }} onClick={onCancel}>
      <div className="rounded-lg shadow-xl w-full max-w-sm" style={{ background: "var(--color-surface)", border: `1px solid ${accentColor}` }} onClick={e => e.stopPropagation()}>
        <div className="px-4 py-3 border-b" style={{ borderColor: "var(--color-border)", background: accentLight }}>
          <span className="text-sm font-bold" style={{ color: textAccent || accentColor }}>{title}</span>
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

function PanelHeader({ icon: Icon, title, subtitle, accentColor, accentLight, accentText = "white", textAccent, onAdd, addLabel, searchTerm, onSearchChange, actions }) {
  return (
    <>
      <div className="flex-shrink-0 px-3 py-1.5 border-b flex justify-between items-center" style={{ background: accentLight, borderColor: "var(--color-border)" }}>
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md" style={{ background: accentColor, color: accentText }}><Icon size={12} /></div>
          <div>
            <h3 className="text-xs font-bold leading-tight" style={{ color: textAccent || accentColor }}>{title}</h3>
            <p className="text-[0.58rem] font-medium leading-tight" style={{ color: "var(--color-text-muted)" }}>{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {actions}
          {onAdd && (
            <button onClick={onAdd} className="p-1 rounded-md transition-all" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }} title={addLabel}>
              <Plus size={12} style={{ color: textAccent || accentColor }} />
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
function GroupListPanel({ sidePanel, accentColor, accentLight, accentText = "white", textAccent, icon, hasPatient = false, onApplyGroup, catalogList = [] }) {
  const [entries, setEntries] = useState(() => GROUP_LIST_SEEDS[sidePanel.dataFile] || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [doctorFilter, setDoctorFilter] = useState("All Doctors");
  const [modalMode, setModalMode] = useState(null); // null | "add" | { id, title, days, medicines } | { id, title, metrics }
  const rowsScrollRef = useRef(null);

  const byDoctor = doctorFilter === "All Doctors" ? entries : entries.filter(e => e.doctor === doctorFilter);
  const filtered = searchTerm.trim() ? byDoctor.filter(e => e.title.toLowerCase().includes(searchTerm.toLowerCase())) : byDoctor;
  const fillRowCount = useFillRowCount(rowsScrollRef, ROW_HEIGHT_PX, filtered.length);

  const metricCount = sidePanel.columns.length - 1;
  // Some group types (Drug) have a Days column alongside the item count; others
  // (Lab) just have the count. Groups with a real `medicines` list derive their
  // displayed metrics from it instead of storing a separate metrics array.
  const hasDaysField = metricCount > 1;
  const metricsFor = e => e.medicines ? (hasDaysField ? [e.days, e.medicines.length] : [e.medicines.length]) : e.metrics;

  const handleAdd = (title, metrics, medicines, remarks) => setEntries(prev => [...prev, {
    id: Date.now(), title, doctor: doctorFilter === "All Doctors" ? doctors[0] : doctorFilter,
    ...(sidePanel.medicinePicker ? { ...(hasDaysField ? { days: metrics[0] } : {}), medicines: medicines || [] } : { metrics }),
    ...(sidePanel.remarksField ? { remarks: remarks || "" } : {}),
  }]);
  const handleModify = (id, title, metrics, medicines, remarks) => setEntries(prev => prev.map(e => e.id === id ? {
    ...e, title,
    ...(sidePanel.medicinePicker ? { ...(hasDaysField ? { days: metrics[0] } : {}), medicines: medicines || [] } : { metrics }),
    ...(sidePanel.remarksField ? { remarks: remarks || "" } : {}),
  } : e));
  const handleDelete = id => { if (window.confirm("Delete this entry?")) setEntries(prev => prev.filter(e => e.id !== id)); };
  const handleView = e => alert(`${e.title}\n${sidePanel.columns.slice(1).map((c, i) => `${c}: ${metricsFor(e)[i]}`).join(" · ")}${e.medicines ? `\n\n${sidePanel.pickerLabel || "Items"}: ${e.medicines.join(", ")}` : ""}${e.remarks ? `\n\nRemarks: ${e.remarks}` : ""}`);

  return (
    <>
      <PanelHeader icon={icon} title={sidePanel.title} accentColor={accentColor} accentLight={accentLight} accentText={accentText} textAccent={textAccent}
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
            <div className="flex-1 px-3 py-2.5 min-w-0">
              <div className="text-xs font-medium truncate" style={{ color: "var(--color-text-base)" }}>{e.title}</div>
              {e.remarks && <div className="text-[0.6rem] truncate" style={{ color: "var(--color-text-subtle)" }}>{e.remarks}</div>}
            </div>
            {metricsFor(e).map((m, i) => (
              <div key={i} className="w-16 px-3 py-2.5 text-center"><span className="text-xs" style={{ color: "var(--color-text-muted)" }}>{m}</span></div>
            ))}
            <div className="w-40 px-3 py-2.5 flex items-center justify-center gap-1.5">
              {onApplyGroup && sidePanel.applyLabel && (
                <button onClick={() => onApplyGroup(e)} className="p-1 rounded transition-all" title={`${sidePanel.applyLabel} — load into the grid`} style={{ background: accentLight, color: textAccent || accentColor }}><ArrowRightCircle size={11} /></button>
              )}
              <button onClick={() => handleView(e)} className="p-1 rounded transition-all" title="View" style={{ background: "var(--color-primary-muted)", color: "var(--color-primary)" }}><Eye size={11} /></button>
              <button onClick={() => setModalMode(sidePanel.medicinePicker ? { id: e.id, title: e.title, days: e.days, medicines: e.medicines, remarks: e.remarks } : { id: e.id, title: e.title, metrics: e.metrics })} className="p-1 rounded transition-all" title="Modify" style={{ background: accentLight, color: textAccent || accentColor }}><Edit2 size={11} /></button>
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
        {!hasPatient && (
          <button onClick={() => setModalMode("add")} className="flex items-center gap-1.5 text-xs font-bold flex-shrink-0" style={{ color: textAccent || accentColor }}>
            {sidePanel.newButtonLabel}
            <span className="flex items-center justify-center w-5 h-5 rounded-full" style={{ background: accentColor, color: accentText }}>
              <Plus size={12} />
            </span>
          </button>
        )}
      </div>

      {modalMode && (
        <GroupEntryModal
          accentColor={accentColor} accentLight={accentLight} accentText={accentText} textAccent={textAccent}
          metricLabels={sidePanel.columns.slice(1)}
          medicinePicker={sidePanel.medicinePicker}
          pickerLabel={sidePanel.pickerLabel || "Items"}
          catalogList={catalogList}
          remarksField={sidePanel.remarksField}
          initialTitle={modalMode === "add" ? "" : modalMode.title}
          initialDays={modalMode === "add" ? "" : modalMode.days}
          initialMedicines={modalMode === "add" ? [] : (modalMode.medicines || [])}
          initialMetrics={modalMode === "add" ? Array(metricCount).fill(0) : modalMode.metrics}
          initialRemarks={modalMode === "add" ? "" : (modalMode.remarks || "")}
          heading={modalMode === "add" ? sidePanel.newButtonLabel : "Modify Entry"}
          onSave={(title, metrics, medicines, remarks) => { modalMode === "add" ? handleAdd(title, metrics, medicines, remarks) : handleModify(modalMode.id, title, metrics, medicines, remarks); setModalMode(null); }}
          onCancel={() => setModalMode(null)}
        />
      )}
    </>
  );
}

/* Title + one numeric field per metric column (e.g. Days/Drugs, Tests, Days/Items) —
   so "New Group" captures everything the table actually displays, not just the title. */
function GroupEntryModal({
  accentColor, accentLight, accentText = "white", textAccent, metricLabels, medicinePicker,
  pickerLabel = "Items", catalogList = [], remarksField,
  initialTitle, initialMetrics, initialDays, initialMedicines = [], initialRemarks = "", heading, onSave, onCancel,
}) {
  const [title, setTitle] = useState(initialTitle);
  const [metrics, setMetrics] = useState(initialMetrics);
  const [days, setDays] = useState(initialDays ?? "");
  const [medicines, setMedicines] = useState(initialMedicines);
  const [medQuery, setMedQuery] = useState("");
  const [remarks, setRemarks] = useState(initialRemarks);

  // Some group types (Lab) don't have a separate Days metric — just the item count.
  const hasDaysField = metricLabels.length > 1;

  const setMetric = (i, value) => setMetrics(prev => prev.map((m, idx) => idx === i ? value : m));
  const medSuggestions = medQuery.trim()
    ? catalogList.filter(m => m.toLowerCase().includes(medQuery.toLowerCase()) && !medicines.includes(m)).slice(0, 6)
    : [];

  const addMedicine = name => { if (name && !medicines.includes(name)) setMedicines(prev => [...prev, name]); setMedQuery(""); };
  const removeMedicine = name => setMedicines(prev => prev.filter(m => m !== name));

  const handleSave = () => {
    if (!title.trim()) return;
    if (medicinePicker) {
      const nextMetrics = hasDaysField ? [parseInt(days, 10) || 0, medicines.length] : [medicines.length];
      onSave(title.trim(), nextMetrics, medicines, remarks.trim());
    } else {
      onSave(title.trim(), metrics.map(m => parseInt(m, 10) || 0));
    }
  };

  return (
    <SidePanelModal title={heading} accentColor={accentColor} accentLight={accentLight} textAccent={textAccent} onCancel={onCancel}
      footer={<>
        <button onClick={onCancel} className="px-3 py-1.5 rounded-md text-xs font-semibold" style={{ background: "var(--color-danger)", color: "white" }}>Cancel</button>
        <button onClick={handleSave} disabled={!title.trim()}
          className="px-3 py-1.5 rounded-md text-xs font-semibold" style={{ background: "var(--color-success)", color: "white", opacity: title.trim() ? 1 : 0.5 }}>Save</button>
      </>}>
      <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--color-text-muted)" }}>Title</label>
      <input autoFocus type="text" value={title} onChange={e => setTitle(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter" && title.trim()) handleSave(); if (e.key === "Escape") onCancel(); }}
        placeholder="Enter title..." className="w-full px-3 py-2 rounded text-sm outline-none" style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }} />

      {medicinePicker ? (
        <>
          {hasDaysField && (
            <div className="mt-3">
              <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--color-text-muted)" }}>Days</label>
              <input type="number" min="0" value={days} onChange={e => setDays(e.target.value)}
                className="w-24 px-3 py-2 rounded text-sm outline-none" style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }} />
            </div>
          )}

          <div className="mt-3 relative">
            <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--color-text-muted)" }}>{pickerLabel} ({medicines.length})</label>
            <div className="flex gap-2">
              <input type="text" value={medQuery} onChange={e => setMedQuery(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && medSuggestions[0]) { e.preventDefault(); addMedicine(medSuggestions[0]); } }}
                placeholder={`Search ${pickerLabel.toLowerCase()} to add...`} className="flex-1 min-w-0 px-3 py-2 rounded text-sm outline-none" style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }} />
              <button type="button" onClick={() => addMedicine(medQuery.trim())} disabled={!medQuery.trim()}
                className="px-3 rounded text-xs font-semibold flex-shrink-0" style={{ background: accentColor, color: accentText, opacity: medQuery.trim() ? 1 : 0.5 }}>Add</button>
            </div>
            {medSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 mt-1 rounded shadow-lg z-10 overflow-hidden" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
                {medSuggestions.map(m => (
                  <div key={m} onMouseDown={() => addMedicine(m)} className="px-3 py-2 text-sm cursor-pointer" style={{ borderBottom: "1px solid var(--color-border)" }}>{m}</div>
                ))}
              </div>
            )}
          </div>

          {medicines.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {medicines.map(m => (
                <span key={m} className="flex items-center gap-1 px-2 py-1 rounded-full text-xs" style={{ background: accentLight, color: textAccent || accentColor }}>
                  {m}
                  <button type="button" onClick={() => removeMedicine(m)} className="flex items-center justify-center rounded-full" style={{ width: 14, height: 14, background: "rgba(0,0,0,0.15)" }}>
                    <X size={9} />
                  </button>
                </span>
              ))}
            </div>
          )}

          {remarksField && (
            <div className="mt-3">
              <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--color-text-muted)" }}>Remarks</label>
              <textarea value={remarks} onChange={e => setRemarks(e.target.value)} rows={2}
                placeholder="Enter remarks..." className="w-full px-3 py-2 rounded text-sm outline-none resize-none" style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }} />
            </div>
          )}
        </>
      ) : metricLabels.length > 0 && (
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
          <div key={col} className={`${i === 0 ? "flex-1" : i === 1 ? "w-28" : i === 2 ? "w-20" : i === 3 ? "w-48" : "w-24"} px-3 py-2.5 truncate`}
            style={{ fontSize: "0.7rem", fontWeight: "800", letterSpacing: "0.05em", color: accentColor, whiteSpace: "nowrap" }}>{col}</div>
        ))}
      </div>

      <div ref={rowsScrollRef} className="overflow-y-auto flex-1 no-scrollbar">
        {reportItems.map((item, index) => (
          <div key={item.id} className="flex border-b" style={{ borderColor: "var(--color-border)", background: index % 2 === 0 ? "var(--color-surface)" : "var(--color-surface-alt)", height: `${ROW_HEIGHT_PX}px`, boxSizing: "border-box" }}>
            <div className="flex-1 px-3 py-2.5 truncate"><span className="text-sm font-medium" style={{ color: "var(--color-text-base)" }}>{item.display?.primaryLine || item.name || "—"}</span></div>
            <div className="w-28 px-3 py-2.5 truncate"><span className="text-sm" style={{ color: item.observedValue ? "var(--color-text-base)" : "var(--color-text-subtle)" }}>{item.observedValue || "—"}</span></div>
            <div className="w-20 px-3 py-2.5 text-center"><span className="text-sm" style={{ color: item.unit ? "var(--color-text-base)" : "var(--color-text-subtle)" }}>{item.unit || "—"}</span></div>
            <div className="w-48 px-3 py-2.5 truncate"><span className="text-sm" style={{ color: item.bioRef ? "var(--color-text-base)" : "var(--color-text-subtle)" }}>{item.bioRef || "—"}</span></div>
            <div className="w-24 px-3 py-2.5 truncate"><span className="text-sm" style={{ color: item.specimen ? "var(--color-text-base)" : "var(--color-text-subtle)" }}>{item.specimen || "—"}</span></div>
          </div>
        ))}
        {Array.from({ length: fillRowCount }).map((_, i) => <EmptyPanelRow key={`empty-${i}`} columnCount={5} />)}
      </div>
    </>
  );
}

/* ── "entry-mirror" panel type (IP Time): a live, read-only reflection of the
   left grid's own entries — Entry Type / Subject / Notes per row — not an
   aggregated group list. Adding/editing happens in the main grid only. ── */
function EntryMirrorPanel({ sidePanel, accentColor, accentLight, accentText = "white", textAccent, icon, mirrorItems = [] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [entryTypeFilter, setEntryTypeFilter] = useState("All Types");
  const rowsScrollRef = useRef(null);

  const byType = entryTypeFilter === "All Types" ? mirrorItems : mirrorItems.filter(it => it.entryType === entryTypeFilter);
  const filtered = searchTerm.trim()
    ? byType.filter(it => (it.display?.primaryLine || "").toLowerCase().includes(searchTerm.toLowerCase()) || (it.notes || "").toLowerCase().includes(searchTerm.toLowerCase()))
    : byType;
  const fillRowCount = useFillRowCount(rowsScrollRef, ROW_HEIGHT_PX, filtered.length);
  const entryTypes = [...new Set(mirrorItems.map(it => it.entryType).filter(Boolean))];

  const handleView = item => alert(`${item.entryType || "—"}\nSubject: ${item.display?.primaryLine || "—"}\nNotes: ${item.notes || "—"}`);

  return (
    <>
      <PanelHeader icon={icon} title={sidePanel.title} accentColor={accentColor} accentLight={accentLight} accentText={accentText} textAccent={textAccent}
        subtitle={`${mirrorItems.length} ${sidePanel.itemLabel}`}
        searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <div className="flex items-center border-b flex-shrink-0" style={{ background: "var(--color-primary-muted)", borderColor: "var(--color-border)", height: "30px", boxSizing: "border-box" }}>
        <div className="w-12 px-3 text-center" style={{ fontSize: "0.65rem", fontWeight: "800", letterSpacing: "0.03em", lineHeight: 1, color: "var(--color-primary-dark)" }}>No.</div>
        {sidePanel.columns.map((col, i) => (
          <div key={col} className={i !== 1 ? "w-24 px-3 text-center" : "flex-1 px-3"}
            style={{ fontSize: "0.65rem", fontWeight: "800", letterSpacing: "0.03em", lineHeight: 1, color: "var(--color-primary-dark)" }}>{col}</div>
        ))}
        <div className="w-16 px-3 text-center" style={{ fontSize: "0.65rem", fontWeight: "800", letterSpacing: "0.03em", lineHeight: 1, color: "var(--color-primary-dark)" }}>Actions</div>
      </div>

      <div ref={rowsScrollRef} className="overflow-y-auto flex-1 no-scrollbar">
        {filtered.map((item, index) => (
          <div key={item.id} className="flex border-b" style={{ borderColor: "var(--color-border)", background: index % 2 === 0 ? "var(--color-surface)" : "var(--color-surface-alt)", height: `${ROW_HEIGHT_PX}px`, boxSizing: "border-box" }}>
            <div className="w-12 px-3 py-2.5 text-center"><span className="text-xs font-semibold" style={{ color: "var(--color-primary)" }}>{index + 1}.</span></div>
            <div className="w-24 px-3 py-2.5 text-center"><span className="text-xs" style={{ color: "var(--color-text-muted)" }}>{item.entryType || "—"}</span></div>
            <div className="flex-1 px-3 py-2.5 truncate"><span className="text-xs font-medium" style={{ color: "var(--color-text-base)" }}>{item.display?.primaryLine || "—"}</span></div>
            <div className="w-24 px-3 py-2.5 truncate"><span className="text-xs" style={{ color: "var(--color-text-muted)" }}>{item.notes || "—"}</span></div>
            <div className="w-16 px-3 py-2.5 flex items-center justify-center">
              <button onClick={() => handleView(item)} className="p-1 rounded transition-all" title="View" style={{ background: "var(--color-primary-muted)", color: "var(--color-primary)" }}><Eye size={11} /></button>
            </div>
          </div>
        ))}
        {Array.from({ length: fillRowCount }).map((_, i) => <EmptyPanelRow key={`empty-${i}`} columnCount={2 + sidePanel.columns.length + 1} />)}
      </div>

      <div className="flex-shrink-0 flex items-center justify-between gap-4 px-4 border-t" style={{ height: "48px", boxSizing: "border-box", background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[0.68rem] font-semibold flex-shrink-0" style={{ color: "var(--color-text-base)" }}>Entry Type:</span>
          <select value={entryTypeFilter} onChange={e => setEntryTypeFilter(e.target.value)}
            className="w-36 px-2 py-1.5 rounded text-xs outline-none" style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)", color: "var(--color-text-base)" }}>
            <option>All Types</option>
            {entryTypes.map(t => <option key={t}>{t}</option>)}
          </select>
          <span className="text-[0.65rem] whitespace-nowrap" style={{ color: "var(--color-text-subtle)" }}>Showing {filtered.length} of {mirrorItems.length} records</span>
        </div>
      </div>
    </>
  );
}

/* ── "file-manager" panel type (Services) ── */
function FileManagerPanel({ sidePanel, accentColor, accentLight, accentText = "white", textAccent, icon }) {
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
      <PanelHeader icon={icon} title={sidePanel.title} accentColor={accentColor} accentLight={accentLight} accentText={accentText} textAccent={textAccent}
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
              <FileText size={12} style={{ color: textAccent || accentColor, flexShrink: 0 }} />
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
        <button onClick={() => setShowUpload(true)} className="flex items-center gap-1.5 text-xs font-bold flex-shrink-0" style={{ color: textAccent || accentColor }}>
          {sidePanel.newButtonLabel}
          <span className="flex items-center justify-center w-5 h-5 rounded-full" style={{ background: accentColor, color: accentText }}>
            <Plus size={12} />
          </span>
        </button>
      </div>

      {showUpload && (
        <SidePanelModal title={sidePanel.newButtonLabel} accentColor={accentColor} accentLight={accentLight} textAccent={textAccent} onCancel={() => setShowUpload(false)}
          footer={<button onClick={() => setShowUpload(false)} className="px-3 py-1.5 rounded-md text-xs font-semibold" style={{ background: "var(--color-danger)", color: "white" }}>Cancel</button>}>
          <label className="flex flex-col items-center justify-center gap-2 py-6 rounded-lg cursor-pointer transition-all" style={{ border: `2px dashed ${accentColor}`, background: accentLight }}>
            <Upload size={22} style={{ color: textAccent || accentColor }} />
            <span className="text-xs font-semibold" style={{ color: textAccent || accentColor }}>Click to choose a file</span>
            <input type="file" className="hidden" onChange={handleFilePick} />
          </label>
        </SidePanelModal>
      )}
    </>
  );
}

/* ═══════════════ MAIN GENERIC MIDDLE PANEL — one file for all 4 tabs' report/group panels ═══════════════ */
export default function PrescriptionSidePanel({ config, showReport = false, reportItems = [], onUpdateReportItem, onTogglePreview, mirrorItems = [], hasPatient = false, onApplyGroup }) {
  const { sidePanel } = config;
  if (!sidePanel) return null;

  const wrapperClass = "flex flex-col overflow-hidden";
  const wrapperStyle = { background: "var(--color-surface)", width: "100%", height: "100%" };

  if (showReport && sidePanel.reportView) {
    return (
      <div className={wrapperClass} style={wrapperStyle}>
        <ReportViewPanel key={config.key} sidePanel={sidePanel} accentColor={config.color} accentLight={config.colorLight} accentText={config.colorText} textAccent={config.textAccent} icon={config.icon}
          reportItems={reportItems} onTogglePreview={onTogglePreview} />
      </div>
    );
  }

  if (sidePanel.type === "file-manager") {
    return (
      <div className={wrapperClass} style={wrapperStyle}>
        <FileManagerPanel key={config.key} sidePanel={sidePanel} accentColor={config.color} accentLight={config.colorLight} accentText={config.colorText} textAccent={config.textAccent} icon={config.icon} />
      </div>
    );
  }

  if (sidePanel.type === "entry-mirror") {
    return (
      <div className={wrapperClass} style={wrapperStyle}>
        <EntryMirrorPanel key={config.key} sidePanel={sidePanel} accentColor={config.color} accentLight={config.colorLight} accentText={config.colorText} textAccent={config.textAccent} icon={config.icon} mirrorItems={mirrorItems} />
      </div>
    );
  }

  // default: "group-list" (Drug, Lab's default view) — keyed by tab so switching
  // Drug ↔ Lab remounts fresh (and re-seeds entries) instead of reusing stale state.
  return (
    <div className={wrapperClass} style={wrapperStyle}>
      <GroupListPanel key={config.key} sidePanel={sidePanel} accentColor={config.color} accentLight={config.colorLight} accentText={config.colorText} textAccent={config.textAccent} icon={config.icon} hasPatient={hasPatient} onApplyGroup={onApplyGroup} catalogList={CATALOG_SOURCES[config.searchSource] || []} />
    </div>
  );
}
