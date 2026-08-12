import { useState, useRef } from "react";
import { Plus, Search, Eye, Edit2, X, Upload, FileText, ArrowRightCircle, CheckCircle2, ListFilter } from "lucide-react";
import useFillRowCount from "../../hooks/useFillRowCount";

import drugGroups from "../../data/drugGroups.json";
import labGroups from "../../data/labGroups.json";
import serviceFiles from "../../data/serviceFiles.json";
import carePlanTemplatesSeed from "../../data/carePlanTemplates.json";
import doctors from "../../data/doctors.json";
import medicineList from "../../data/medicines.json";
import labTestList from "../../data/labTest.json";
import medConditionList from "../../data/medConditions.json";

const GROUP_LIST_SEEDS = { drugGroups, labGroups };
// Which real catalog backs each tab's group-list picker — keyed by config.searchSource.
const CATALOG_SOURCES = { medicines: medicineList, lab_tests: labTestList, med_conditions: medConditionList };

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
function GroupListPanel({
  sidePanel, accentColor, accentLight, accentText = "white", textAccent, icon, hasPatient = false, onApplyGroup, catalogList = [], typeLabel = "", onGroupSaved,
  // New-group flow, step 2: the title popup closes and hands off to the main
  // grid's own add-row — draftActive/draftTitle/draftItems mirror OPDeskScreen's
  // groupDraft state (items are whatever's been added to the grid since the
  // draft started), so no separate add-entry UI is built here.
  draftActive = false, draftTitle = "", draftItems = [], onStartDraft, onSaveDraft, onCancelDraft,
}) {
  const [entries, setEntries] = useState(() => GROUP_LIST_SEEDS[sidePanel.dataFile] || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [doctorFilter, setDoctorFilter] = useState("All Doctors");
  const [modalMode, setModalMode] = useState(null); // null | "add" | { id, title, days, medicines } | { id, title, metrics }
  const [selectedId, setSelectedId] = useState(null);
  const [draftDays, setDraftDays] = useState("1");
  // Which groups have already been "Used" (loaded into the grid) — several can be
  // applied at once, so this is a set of ids, not a single last-clicked row.
  const [appliedIds, setAppliedIds] = useState([]);
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

  const handleAdd = (title, metrics, medicines, remarks) => {
    setEntries(prev => [...prev, {
      id: Date.now(), title, doctor: doctorFilter === "All Doctors" ? doctors[0] : doctorFilter,
      ...(sidePanel.medicinePicker ? { ...(hasDaysField ? { days: metrics[0] } : {}), medicines: medicines || [] } : { metrics }),
      ...(sidePanel.remarksField ? { remarks: remarks || "" } : {}),
    }]);
    onGroupSaved?.(`"${title}" group of ${typeLabel.toLowerCase() || "items"} saved!`);
  };
  const handleModify = (id, title, metrics, medicines, remarks) => setEntries(prev => prev.map(e => e.id === id ? {
    ...e, title,
    ...(sidePanel.medicinePicker ? { ...(hasDaysField ? { days: metrics[0] } : {}), medicines: medicines || [] } : { metrics }),
    ...(sidePanel.remarksField ? { remarks: remarks || "" } : {}),
  } : e));
  const handleDelete = id => { if (window.confirm("Delete this entry?")) { setEntries(prev => prev.filter(e => e.id !== id)); setAppliedIds(prev => prev.filter(x => x !== id)); } };
  const handleView = e => alert(`${e.title}\n${sidePanel.columns.slice(1).map((c, i) => `${c}: ${metricsFor(e)[i]}`).join(" · ")}${e.medicines ? `\n\n${sidePanel.pickerLabel || "Items"}: ${e.medicines.join(", ")}` : ""}${e.remarks ? `\n\nRemarks: ${e.remarks}` : ""}`);
  // Clicking Use toggles: first click applies the group (loads its items into
  // the grid), clicking again on an already-applied group reverts it (removes
  // just that group's items) — so re-clicking is how you undo a selection.
  const handleToggleApply = e => {
    const isApplied = appliedIds.includes(e.id);
    onApplyGroup(e, isApplied);
    setAppliedIds(prev => isApplied ? prev.filter(x => x !== e.id) : [...prev, e.id]);
  };

  // New Group, step 2: title confirmed → tell OPDeskScreen to start capturing
  // into the main grid's own add-row instead of opening a second modal here.
  const startDraft = title => { setModalMode(null); setDraftDays("1"); onStartDraft?.(title); };
  const handleSaveDraft = () => {
    if (!draftActive || draftItems.length === 0) return;
    const metrics = hasDaysField ? [parseInt(draftDays, 10) || 0, draftItems.length] : [draftItems.length];
    handleAdd(draftTitle, metrics, draftItems, "");
    onSaveDraft?.();
  };

  return (
    <>
      <PanelHeader icon={icon} title={sidePanel.title} accentColor={accentColor} accentLight={accentLight} accentText={accentText} textAccent={textAccent}
        subtitle={`${entries.length} ${sidePanel.itemLabel}`}
        searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <div className="flex items-center border-b flex-shrink-0" style={{ background: "var(--color-primary-muted)", borderColor: "var(--color-border)", height: "30px", boxSizing: "border-box" }}>
        <div className="w-12 px-3 text-center" style={{ fontSize: "0.65rem", fontWeight: "800", letterSpacing: "0.03em", lineHeight: 1, color: "var(--color-primary-dark)" }}>No.</div>
        {sidePanel.columns.map((col, i) => (
          <div key={col} className={i === 0 ? "flex-1 px-3 text-center" : "w-16 px-3 text-center"}
            style={{ fontSize: "0.65rem", fontWeight: "800", letterSpacing: "0.03em", lineHeight: 1, color: "var(--color-primary-dark)" }}>{col}</div>
        ))}
        <div className="w-40 pl-3 pr-2 text-center" style={{ fontSize: "0.65rem", fontWeight: "800", letterSpacing: "0.03em", lineHeight: 1, color: "var(--color-primary-dark)" }}>Actions</div>
      </div>

      <div ref={rowsScrollRef} className="overflow-y-auto flex-1 no-scrollbar">
        {filtered.map((e, index) => {
          const isApplied = appliedIds.includes(e.id);
          return (
          <div key={e.id} tabIndex={0} onClick={() => setSelectedId(e.id)} onFocus={() => setSelectedId(e.id)}
            className="side-panel-data-row flex items-center border-b outline-none cursor-pointer" style={{ borderColor: "var(--color-border)", background: selectedId === e.id ? accentLight : isApplied ? "var(--color-success-light, #dcfce7)" : index % 2 === 0 ? "var(--color-surface)" : "var(--color-surface-alt)", boxShadow: selectedId === e.id ? `inset 0 0 0 2px ${accentColor}` : "none", height: `${ROW_HEIGHT_PX}px`, boxSizing: "border-box" }}>
            <div className="w-12 px-3 py-2.5 text-left"><span className="text-xs font-normal" style={{ color: "var(--color-text-base)" }}>{index + 1}.</span></div>
            <div className="flex-1 px-3 py-2.5 min-w-0">
              <div className="flex items-center gap-1">
                {isApplied && <CheckCircle2 size={11} style={{ color: "var(--color-success)", flexShrink: 0 }} />}
                <div className="text-xs font-normal truncate" style={{ color: "var(--color-text-base)" }}>{e.title}</div>
              </div>
              {e.remarks && <div className="text-xs font-normal truncate" style={{ color: "var(--color-text-base)" }}>{e.remarks}</div>}
            </div>
            {metricsFor(e).map((m, i) => (
              <div key={i} className="w-16 px-3 py-2.5 text-left"><span className="text-xs font-normal" style={{ color: "var(--color-text-base)" }}>{m}</span></div>
            ))}
            <div className="w-40 pl-3 pr-2 py-2.5 flex items-center justify-end gap-1.5">
              {onApplyGroup && sidePanel.applyLabel && (
                <button onClick={() => handleToggleApply(e)} className="p-1 rounded transition-all"
                  title={isApplied ? "Used — click to remove from the grid" : `${sidePanel.applyLabel} — load into the grid`}
                  style={{ background: isApplied ? "var(--color-success-light, #dcfce7)" : accentLight, color: isApplied ? "var(--color-success)" : (textAccent || accentColor) }}>
                  {isApplied ? <CheckCircle2 size={11} /> : <ArrowRightCircle size={11} />}
                </button>
              )}
              <button onClick={() => handleView(e)} className="p-1 rounded transition-all" title="View" style={{ background: "var(--color-primary-muted)", color: "var(--color-primary)" }}><Eye size={11} /></button>
              <button onClick={() => setModalMode(sidePanel.medicinePicker ? { id: e.id, title: e.title, days: e.days, medicines: e.medicines, remarks: e.remarks } : { id: e.id, title: e.title, metrics: e.metrics })} className="p-1 rounded transition-all" title="Modify" style={{ background: accentLight, color: textAccent || accentColor }}><Edit2 size={11} /></button>
              <button onClick={() => handleDelete(e.id)} className="p-1 rounded transition-all" title="Delete" style={{ background: "#fee2e2", color: "var(--color-danger)" }}><X size={11} /></button>
            </div>
          </div>
          );
        })}
        {Array.from({ length: fillRowCount }).map((_, i) => <EmptyPanelRow key={`empty-${i}`} columnCount={2 + metricCount + 1} />)}
      </div>

      {/* Status bar while a new group is being built — actual items are added
          via the main grid's own add-row below, not here; this just shows
          the running count and lets you finish or discard the capture. */}
      {draftActive && (
        <div className="flex-shrink-0 border-t p-3 flex items-center justify-between gap-3" style={{ borderColor: accentColor, background: accentLight }}>
          <div className="min-w-0">
            <div className="text-xs font-bold truncate" style={{ color: textAccent || accentColor }}>Adding: {draftTitle}</div>
            <div className="text-[0.65rem]" style={{ color: textAccent || accentColor, opacity: 0.85 }}>
              {draftItems.length} item{draftItems.length !== 1 ? "s" : ""} added — add more from the tab below, then Save.
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {hasDaysField && (
              <div className="flex items-center gap-1.5">
                <label className="text-[0.65rem] font-semibold" style={{ color: textAccent || accentColor }}>Days</label>
                <input type="number" min="0" value={draftDays} onChange={e => setDraftDays(e.target.value)}
                  className="w-14 px-2 py-1 rounded text-xs outline-none" style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }} />
              </div>
            )}
            <button onClick={onCancelDraft} className="px-3 py-1.5 rounded-md text-xs font-semibold" style={{ background: "var(--color-danger)", color: "white" }}>Cancel</button>
            <button onClick={handleSaveDraft} disabled={draftItems.length === 0}
              className="px-3 py-1.5 rounded-md text-xs font-semibold" style={{ background: "var(--color-success)", color: "white", opacity: draftItems.length ? 1 : 0.5 }}>Save</button>
          </div>
        </div>
      )}

      <div className="side-panel-footer flex-shrink-0 flex items-center justify-between gap-4 px-4 border-t" style={{ height: "48px", boxSizing: "border-box", background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[0.68rem] font-semibold flex-shrink-0" style={{ color: "var(--color-text-base)" }}>{sidePanel.listSourceLabel}:</span>
          <select value={doctorFilter} onChange={e => setDoctorFilter(e.target.value)}
            className="w-36 px-2 py-1.5 rounded text-xs outline-none" style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)", color: "var(--color-text-base)" }}>
            <option>All Doctors</option>
            {doctors.map(d => <option key={d}>{d}</option>)}
          </select>
          <span className="text-[0.65rem] whitespace-nowrap" style={{ color: "var(--color-text-subtle)" }}>Showing {filtered.length}/{byDoctor.length}</span>
        </div>
        {!hasPatient && !draftActive && (
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
          mode={modalMode === "add" ? "new" : "modify"}
          initialTitle={modalMode === "add" ? "" : modalMode.title}
          initialDays={modalMode === "add" ? "" : modalMode.days}
          initialMedicines={modalMode === "add" ? [] : (modalMode.medicines || [])}
          initialMetrics={modalMode === "add" ? Array(metricCount).fill(0) : modalMode.metrics}
          initialRemarks={modalMode === "add" ? "" : (modalMode.remarks || "")}
          heading={modalMode === "add" ? sidePanel.newButtonLabel : "Modify Entry"}
          onTitleConfirmed={startDraft}
          onSave={(title, metrics, medicines, remarks) => { handleModify(modalMode.id, title, metrics, medicines, remarks); setModalMode(null); }}
          onCancel={() => setModalMode(null)}
        />
      )}
    </>
  );
}

/* Title + one numeric field per metric column (e.g. Days/Drugs, Tests, Days/Items) —
   so "Modify" captures everything the table actually displays, not just the title.
   "New" (mode="new") groups only collect the Title here — clicking Add closes this
   popup, and the actual items get added via the main grid's own add-row (see
   OPDeskScreen's groupDraft state), not a second modal screen here.
   "Modify" (mode="modify") keeps the original single-screen form, unchanged. */
function GroupEntryModal({
  accentColor, accentLight, accentText = "white", textAccent, metricLabels, medicinePicker,
  pickerLabel = "Items", catalogList = [], remarksField,
  initialTitle, initialMetrics, initialDays, initialMedicines = [], initialRemarks = "",
  heading, mode = "modify", onSave, onTitleConfirmed, onCancel,
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

  // ── New group: Title only, then hand off to the inline add-entry section ──
  if (mode === "new" && medicinePicker) {
    const confirm = () => { if (title.trim()) onTitleConfirmed(title.trim()); };
    return (
      <SidePanelModal title={heading} accentColor={accentColor} accentLight={accentLight} textAccent={textAccent} onCancel={onCancel}
        footer={<>
          <button onClick={onCancel} className="px-3 py-1.5 rounded-md text-xs font-semibold" style={{ background: "var(--color-danger)", color: "white" }}>Cancel</button>
          <button onClick={confirm} disabled={!title.trim()}
            className="px-3 py-1.5 rounded-md text-xs font-semibold" style={{ background: accentColor, color: accentText, opacity: title.trim() ? 1 : 0.5 }}>Add</button>
        </>}>
        <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--color-text-muted)" }}>Title</label>
        <input autoFocus type="text" value={title} onChange={e => setTitle(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && title.trim()) confirm(); if (e.key === "Escape") onCancel(); }}
          placeholder="Enter title..." className="w-full px-3 py-2 rounded text-sm outline-none" style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }} />
      </SidePanelModal>
    );
  }

  // ── Single-screen form: Modify Entry (any type), or a New non-medicinePicker group ──
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
                  <div key={m} onMouseDown={() => addMedicine(m)} className="px-3 py-1.5 text-xs cursor-pointer" style={{ borderBottom: "1px solid var(--color-border)" }}>{m}</div>
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
  const [selectedId, setSelectedId] = useState(null);
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
          <div key={col} className={`${i === 0 ? "flex-1" : i === 1 ? "w-28" : i === 2 ? "w-20" : i === 3 ? "w-48" : "w-24"} px-3 py-2.5 truncate text-center`}
            style={{ fontSize: "0.7rem", fontWeight: "800", letterSpacing: "0.05em", color: accentColor, whiteSpace: "nowrap" }}>{col}</div>
        ))}
      </div>

      <div ref={rowsScrollRef} className="overflow-y-auto flex-1 no-scrollbar">
        {reportItems.map((item, index) => (
          <div key={item.id} tabIndex={0} onClick={() => setSelectedId(item.id)} onFocus={() => setSelectedId(item.id)}
            className="side-panel-data-row flex border-b outline-none cursor-pointer" style={{ borderColor: "var(--color-border)", background: selectedId === item.id ? accentLight : index % 2 === 0 ? "var(--color-surface)" : "var(--color-surface-alt)", boxShadow: selectedId === item.id ? `inset 0 0 0 2px ${accentColor}` : "none", height: `${ROW_HEIGHT_PX}px`, boxSizing: "border-box" }}>
            <div className="flex-1 px-3 py-2.5 truncate"><span className="text-xs font-normal" style={{ color: "var(--color-text-base)" }}>{item.display?.primaryLine || item.name || "—"}</span></div>
            <div className="w-28 px-3 py-2.5 truncate"><span className="text-xs font-normal" style={{ color: "var(--color-text-base)" }}>{item.observedValue || "—"}</span></div>
            <div className="w-20 px-3 py-2.5 text-left"><span className="text-xs font-normal" style={{ color: "var(--color-text-base)" }}>{item.unit || "—"}</span></div>
            <div className="w-48 px-3 py-2.5 truncate"><span className="text-xs font-normal" style={{ color: "var(--color-text-base)" }}>{item.bioRef || "—"}</span></div>
            <div className="w-24 px-3 py-2.5 truncate"><span className="text-xs font-normal" style={{ color: "var(--color-text-base)" }}>{item.specimen || "—"}</span></div>
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
  const [selectedId, setSelectedId] = useState(null);
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
          <div key={col} className={i !== 1 ? "w-24 px-3 text-center" : "flex-1 px-3 text-center"}
            style={{ fontSize: "0.65rem", fontWeight: "800", letterSpacing: "0.03em", lineHeight: 1, color: "var(--color-primary-dark)" }}>{col}</div>
        ))}
        <div className="w-16 px-3 text-center" style={{ fontSize: "0.65rem", fontWeight: "800", letterSpacing: "0.03em", lineHeight: 1, color: "var(--color-primary-dark)" }}>Actions</div>
      </div>

      <div ref={rowsScrollRef} className="overflow-y-auto flex-1 no-scrollbar">
        {filtered.map((item, index) => (
          <div key={item.id} tabIndex={0} onClick={() => setSelectedId(item.id)} onFocus={() => setSelectedId(item.id)}
            className="side-panel-data-row flex border-b outline-none cursor-pointer" style={{ borderColor: "var(--color-border)", background: selectedId === item.id ? accentLight : index % 2 === 0 ? "var(--color-surface)" : "var(--color-surface-alt)", boxShadow: selectedId === item.id ? `inset 0 0 0 2px ${accentColor}` : "none", height: `${ROW_HEIGHT_PX}px`, boxSizing: "border-box" }}>
            <div className="w-12 px-3 py-2.5 text-left"><span className="text-xs font-normal" style={{ color: "var(--color-text-base)" }}>{index + 1}.</span></div>
            <div className="w-24 px-3 py-2.5 text-left"><span className="text-xs font-normal" style={{ color: "var(--color-text-base)" }}>{item.entryType || "—"}</span></div>
            <div className="flex-1 px-3 py-2.5 truncate"><span className="text-xs font-normal" style={{ color: "var(--color-text-base)" }}>{item.display?.primaryLine || "—"}</span></div>
            <div className="w-24 px-3 py-2.5 truncate"><span className="text-xs font-normal" style={{ color: "var(--color-text-base)" }}>{item.notes || "—"}</span></div>
            <div className="w-16 px-3 py-2.5 flex items-center justify-center">
              <button onClick={() => handleView(item)} className="p-1 rounded transition-all" title="View" style={{ background: "var(--color-primary-muted)", color: "var(--color-primary)" }}><Eye size={11} /></button>
            </div>
          </div>
        ))}
        {Array.from({ length: fillRowCount }).map((_, i) => <EmptyPanelRow key={`empty-${i}`} columnCount={2 + sidePanel.columns.length + 1} />)}
      </div>

      <div className="side-panel-footer flex-shrink-0 flex items-center justify-between gap-4 px-4 border-t" style={{ height: "48px", boxSizing: "border-box", background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[0.68rem] font-semibold flex-shrink-0" style={{ color: "var(--color-text-base)" }}>Entry Type:</span>
          <select value={entryTypeFilter} onChange={e => setEntryTypeFilter(e.target.value)}
            className="w-36 px-2 py-1.5 rounded text-xs outline-none" style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)", color: "var(--color-text-base)" }}>
            <option>All Types</option>
            {entryTypes.map(t => <option key={t}>{t}</option>)}
          </select>
          <span className="text-[0.65rem] whitespace-nowrap" style={{ color: "var(--color-text-subtle)" }}>Showing {filtered.length}/{mirrorItems.length}</span>
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
  const [selectedId, setSelectedId] = useState(null);
  const rowsScrollRef = useRef(null);
  const byType = fileTypeFilter === "All Types" ? files : files.filter(f => f.type === fileTypeFilter);
  const filtered = searchTerm.trim() ? byType.filter(f => f.fileName.toLowerCase().includes(searchTerm.toLowerCase())) : byType;
  const fillRowCount = useFillRowCount(rowsScrollRef, ROW_HEIGHT_PX, filtered.length);
  const fileTypes = [...new Set(files.map(f => f.type))];

  const formatBytes = bytes => bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)}KB` : `${(bytes / (1024 * 1024)).toFixed(2)}MB`;

  const handleFilePick = e => {
    const picked = Array.from(e.target.files || []);
    if (picked.length === 0) return;
    const now = new Date();
    const pad = n => String(n).padStart(2, "0");
    const dtTime = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${String(now.getFullYear()).slice(2)} ${pad(now.getHours() % 12 || 12)}.${pad(now.getMinutes())}${now.getHours() >= 12 ? "PM" : "AM"}`;
    const totalSize = picked.reduce((sum, f) => sum + f.size, 0);
    // One upload action = one row, however many files were picked in it — the
    // No. column marks it with a trailing "+" only when it holds more than one file.
    setFiles(prev => [...prev, {
      id: Date.now(),
      fileName: picked[0].name.replace(/\.[^/.]+$/, ""),
      fileCount: picked.length,
      type: (picked[0].name.split(".").pop() || "FILE").toUpperCase(),
      size: formatBytes(totalSize),
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
        <div className="flex-1 px-3 text-center" style={{ fontSize: "0.65rem", fontWeight: "800", letterSpacing: "0.03em", lineHeight: 1, color: "var(--color-primary-dark)" }}>File Name</div>
        <div className="w-14 px-3 text-center" style={{ fontSize: "0.65rem", fontWeight: "800", letterSpacing: "0.03em", lineHeight: 1, color: "var(--color-primary-dark)" }}>Type</div>
        <div className="w-16 px-3 text-center" style={{ fontSize: "0.65rem", fontWeight: "800", letterSpacing: "0.03em", lineHeight: 1, color: "var(--color-primary-dark)" }}>Size</div>
        <div className="w-32 px-3 text-center" style={{ fontSize: "0.65rem", fontWeight: "800", letterSpacing: "0.03em", lineHeight: 1, color: "var(--color-primary-dark)" }}>Dt-Time</div>
        <div className="w-16 px-3 text-center" style={{ fontSize: "0.65rem", fontWeight: "800", letterSpacing: "0.03em", lineHeight: 1, color: "var(--color-primary-dark)" }}>Actions</div>
      </div>

      <div ref={rowsScrollRef} className="overflow-y-auto flex-1 no-scrollbar">
        {filtered.map((f, index) => (
          <div key={f.id} tabIndex={0} onClick={() => setSelectedId(f.id)} onFocus={() => setSelectedId(f.id)}
            className="side-panel-data-row flex items-center border-b outline-none cursor-pointer" style={{ borderColor: "var(--color-border)", background: selectedId === f.id ? accentLight : index % 2 === 0 ? "var(--color-surface)" : "var(--color-surface-alt)", boxShadow: selectedId === f.id ? `inset 0 0 0 2px ${accentColor}` : "none", height: `${ROW_HEIGHT_PX}px`, boxSizing: "border-box" }}>
            <div className="w-12 px-3 py-2.5 text-left"><span className="text-xs font-normal" style={{ color: "var(--color-text-base)" }}>{index + 1}{f.fileCount > 1 ? "+" : ""}</span></div>
            <div className="flex-1 px-3 py-2.5 flex items-center gap-1.5 min-w-0">
              <FileText size={12} style={{ color: textAccent || accentColor, flexShrink: 0 }} />
              <span className="text-xs font-normal truncate" style={{ color: "var(--color-text-base)" }}>
                {f.fileName}{f.fileCount > 1 ? ` +${f.fileCount - 1} more` : ""}
              </span>
            </div>
            <div className="w-14 px-3 py-2.5 text-left"><span className="text-xs font-normal" style={{ color: "var(--color-text-base)" }}>{f.type}</span></div>
            <div className="w-16 px-3 py-2.5 text-left"><span className="text-xs font-normal" style={{ color: "var(--color-text-base)" }}>{f.size}</span></div>
            <div className="w-32 px-3 py-2.5 text-left"><span className="text-xs font-normal whitespace-nowrap" style={{ color: "var(--color-text-base)" }}>{f.dtTime}</span></div>
            <div className="w-16 px-3 py-2.5 flex items-center justify-center gap-1.5">
              <button onClick={() => handleDelete(f.id)} className="p-1 rounded transition-all" title="Delete" style={{ background: "#fee2e2", color: "var(--color-danger)" }}><X size={11} /></button>
            </div>
          </div>
        ))}
        {Array.from({ length: fillRowCount }).map((_, i) => <EmptyPanelRow key={`empty-${i}`} columnCount={6} />)}
      </div>

      <div className="side-panel-footer flex-shrink-0 flex items-center justify-between gap-4 px-4 border-t" style={{ height: "48px", boxSizing: "border-box", background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[0.68rem] font-semibold flex-shrink-0" style={{ color: "var(--color-text-base)" }}>File Type:</span>
          <select value={fileTypeFilter} onChange={e => setFileTypeFilter(e.target.value)}
            className="w-36 px-2 py-1.5 rounded text-xs outline-none" style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)", color: "var(--color-text-base)" }}>
            <option>All Types</option>
            {fileTypes.map(t => <option key={t}>{t}</option>)}
          </select>
          <span className="text-[0.65rem] whitespace-nowrap" style={{ color: "var(--color-text-subtle)" }}>Showing {filtered.length}/{files.length}</span>
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
            <input type="file" multiple className="hidden" onChange={handleFilePick} />
          </label>
        </SidePanelModal>
      )}
    </>
  );
}

/* ── "care-plan-list" panel type (Care-Plan): a browsable library of care-plan
   templates — Speciality / Med. Condition / Milestones / Period — distinct
   from Drug/Lab's medicine-picker group-list shape. ── */
function CarePlanListPanel({ sidePanel, accentColor, accentLight, accentText = "white", textAccent, icon }) {
  const [entries, setEntries] = useState(carePlanTemplatesSeed);
  const [specialityFilter, setSpecialityFilter] = useState("All Specialities");
  const [searchTerm, setSearchTerm] = useState("");
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({ speciality: true, condition: true, milestones: true, period: true });
  const [modalMode, setModalMode] = useState(null); // null | "add" | entry object
  const [selectedId, setSelectedId] = useState(null);
  const rowsScrollRef = useRef(null);

  const specialities = [...new Set(entries.map(e => e.speciality))];
  const bySpeciality = specialityFilter === "All Specialities" ? entries : entries.filter(e => e.speciality === specialityFilter);
  const filtered = searchTerm.trim() ? bySpeciality.filter(e => e.condition.toLowerCase().includes(searchTerm.toLowerCase())) : bySpeciality;
  const carePlanColumns = [
    { key: "speciality", label: "Speciality" },
    { key: "condition", label: "Med. Condition" },
    { key: "milestones", label: "Milestones" },
    { key: "period", label: "Period" },
  ];
  const fillRowCount = useFillRowCount(rowsScrollRef, ROW_HEIGHT_PX, filtered.length);

  const handleSave = (speciality, condition, milestones, period) => {
    if (modalMode === "add") {
      setEntries(prev => [...prev, { id: Date.now(), speciality, condition, milestones, period }]);
    } else {
      setEntries(prev => prev.map(e => e.id === modalMode.id ? { ...e, speciality, condition, milestones, period } : e));
    }
    setModalMode(null);
  };
  const handleDelete = id => { if (window.confirm("Delete this template?")) setEntries(prev => prev.filter(e => e.id !== id)); };
  const handleView = e => alert(`${e.condition}\nSpeciality: ${e.speciality}\nMilestones: ${e.milestones}\nPeriod: ${e.period}`);

  return (
    <>
      <PanelHeader icon={icon} title={sidePanel.title} accentColor={accentColor} accentLight={accentLight} accentText={accentText} textAccent={textAccent}
        subtitle={`${entries.length} ${sidePanel.itemLabel}`}
        searchTerm={searchTerm} onSearchChange={setSearchTerm}
        actions={<div className="relative">
          <button onClick={() => setShowColumnMenu(open => !open)} className="p-1 rounded-md" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }} title="Toggle Columns">
            <ListFilter size={12} style={{ color: "var(--color-text-muted)" }} />
          </button>
          {showColumnMenu && <div className="absolute right-0 top-full z-50 mt-1 w-40 rounded-lg shadow-xl" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }} onMouseLeave={() => setShowColumnMenu(false)}>
            <div className="border-b p-2 text-xs font-semibold" style={{ borderColor: "var(--color-border)" }}>Show/Hide Columns</div>
            <div className="space-y-1 p-2">
              {carePlanColumns.map(column => <label key={column.key} className="flex cursor-pointer items-center gap-2 px-1 py-1 text-xs hover:bg-surface-alt">
                <input type="checkbox" checked={visibleColumns[column.key]} onChange={() => setVisibleColumns(current => ({ ...current, [column.key]: !current[column.key] }))} style={{ accentColor }} />
                <span>{column.label}</span>
              </label>)}
            </div>
          </div>}
        </div>} />

      <div className="flex items-center border-b flex-shrink-0" style={{ background: "var(--color-primary-muted)", borderColor: "var(--color-border)", height: "30px", boxSizing: "border-box" }}>
        <div className="w-12 px-3 text-center" style={{ fontSize: "0.65rem", fontWeight: "800", letterSpacing: "0.03em", lineHeight: 1, color: "var(--color-primary-dark)" }}>No.</div>
        {visibleColumns.speciality && <div className="w-24 px-3 text-center" style={{ fontSize: "0.65rem", fontWeight: "800", letterSpacing: "0.03em", lineHeight: 1, color: "var(--color-primary-dark)" }}>Speciality</div>}
        {visibleColumns.condition && <div className="flex-1 px-3 text-center" style={{ fontSize: "0.65rem", fontWeight: "800", letterSpacing: "0.03em", lineHeight: 1, color: "var(--color-primary-dark)" }}>Med. Condition</div>}
        {visibleColumns.milestones && <div className="w-20 px-3 text-center" style={{ fontSize: "0.65rem", fontWeight: "800", letterSpacing: "0.03em", lineHeight: 1, color: "var(--color-primary-dark)" }}>Milestones</div>}
        {visibleColumns.period && <div className="w-20 px-3 text-center" style={{ fontSize: "0.65rem", fontWeight: "800", letterSpacing: "0.03em", lineHeight: 1, color: "var(--color-primary-dark)" }}>Period</div>}
        <div className="w-24 pl-3 pr-2 text-center" style={{ fontSize: "0.65rem", fontWeight: "800", letterSpacing: "0.03em", lineHeight: 1, color: "var(--color-primary-dark)" }}>Actions</div>
      </div>

      <div ref={rowsScrollRef} className="overflow-y-auto flex-1 no-scrollbar">
        {filtered.map((e, index) => (
          <div key={e.id} tabIndex={0} onClick={() => setSelectedId(e.id)} onFocus={() => setSelectedId(e.id)}
            className="side-panel-data-row flex items-center border-b outline-none cursor-pointer" style={{ borderColor: "var(--color-border)", background: selectedId === e.id ? accentLight : index % 2 === 0 ? "var(--color-surface)" : "var(--color-surface-alt)", boxShadow: selectedId === e.id ? `inset 0 0 0 2px ${accentColor}` : "none", height: `${ROW_HEIGHT_PX}px`, boxSizing: "border-box" }}>
            <div className="w-12 px-3 py-2.5 text-left"><span className="text-xs font-normal" style={{ color: "var(--color-text-base)" }}>{index + 1}.</span></div>
            {visibleColumns.speciality && <div className="w-24 px-3 py-2.5 truncate"><span className="text-xs font-normal" style={{ color: "var(--color-text-base)" }}>{e.speciality}</span></div>}
            {visibleColumns.condition && <div className="flex-1 px-3 py-2.5 min-w-0"><span className="text-xs font-normal truncate block" style={{ color: "var(--color-text-base)" }}>{e.condition}</span></div>}
            {visibleColumns.milestones && <div className="w-20 px-3 py-2.5 text-left"><span className="text-xs font-normal" style={{ color: "var(--color-text-base)" }}>{e.milestones}</span></div>}
            {visibleColumns.period && <div className="w-20 px-3 py-2.5 text-left"><span className="font-normal" style={{ color: "var(--color-text-base)", fontSize: "calc(0.8rem - 1px)" }}>{e.period}</span></div>}
            <div className="w-24 pl-3 pr-2 py-2.5 flex items-center justify-end gap-1.5">
              <button onClick={() => handleView(e)} className="p-1 rounded transition-all" title="View" style={{ background: "var(--color-primary-muted)", color: "var(--color-primary)" }}><Eye size={11} /></button>
              <button onClick={() => setModalMode(e)} className="p-1 rounded transition-all" title="Modify" style={{ background: accentLight, color: textAccent || accentColor }}><Edit2 size={11} /></button>
              <button onClick={() => handleDelete(e.id)} className="p-1 rounded transition-all" title="Delete" style={{ background: "#fee2e2", color: "var(--color-danger)" }}><X size={11} /></button>
            </div>
          </div>
        ))}
        {Array.from({ length: fillRowCount }).map((_, i) => <EmptyPanelRow key={`empty-${i}`} columnCount={5} />)}
      </div>

      <div className="side-panel-footer flex-shrink-0 flex items-center justify-between gap-4 px-4 border-t" style={{ height: "48px", boxSizing: "border-box", background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[0.68rem] font-semibold flex-shrink-0" style={{ color: "var(--color-text-base)" }}>{sidePanel.listSourceLabel}:</span>
          <select value={specialityFilter} onChange={e => setSpecialityFilter(e.target.value)}
            className="w-36 px-2 py-1.5 rounded text-xs outline-none" style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)", color: "var(--color-text-base)" }}>
            <option>All Specialities</option>
            {specialities.map(s => <option key={s}>{s}</option>)}
          </select>
          <span className="text-[0.65rem] whitespace-nowrap" style={{ color: "var(--color-text-subtle)" }}>Showing {filtered.length}/{bySpeciality.length}</span>
        </div>
        <button onClick={() => setModalMode("add")} className="flex items-center gap-1.5 text-xs font-bold flex-shrink-0" style={{ color: textAccent || accentColor }}>
          {sidePanel.newButtonLabel}
          <span className="flex items-center justify-center w-5 h-5 rounded-full" style={{ background: accentColor, color: accentText }}>
            <Plus size={12} />
          </span>
        </button>
      </div>

      {modalMode && (
        <CarePlanTemplateModal
          accentColor={accentColor} accentLight={accentLight} accentText={accentText} textAccent={textAccent}
          heading={modalMode === "add" ? sidePanel.newButtonLabel : "Modify Template"}
          initialSpeciality={modalMode === "add" ? "" : modalMode.speciality}
          initialCondition={modalMode === "add" ? "" : modalMode.condition}
          initialMilestones={modalMode === "add" ? "" : modalMode.milestones}
          initialPeriod={modalMode === "add" ? "" : modalMode.period}
          onSave={handleSave}
          onCancel={() => setModalMode(null)}
        />
      )}
    </>
  );
}

/* Speciality / Med. Condition / Milestones / Period — the 4 fields a care-plan template needs. */
function CarePlanTemplateModal({ accentColor, accentLight, accentText = "white", textAccent, heading, initialSpeciality, initialCondition, initialMilestones, initialPeriod, onSave, onCancel }) {
  const [speciality, setSpeciality] = useState(initialSpeciality);
  const [condition, setCondition] = useState(initialCondition);
  const [milestones, setMilestones] = useState(initialMilestones);
  const [period, setPeriod] = useState(initialPeriod);

  const canSave = speciality.trim() && condition.trim();
  const handleSave = () => { if (canSave) onSave(speciality.trim(), condition.trim(), parseInt(milestones, 10) || 0, period.trim()); };

  return (
    <SidePanelModal title={heading} accentColor={accentColor} accentLight={accentLight} textAccent={textAccent} onCancel={onCancel}
      footer={<>
        <button onClick={onCancel} className="px-3 py-1.5 rounded-md text-xs font-semibold" style={{ background: "var(--color-danger)", color: "white" }}>Cancel</button>
        <button onClick={handleSave} disabled={!canSave}
          className="px-3 py-1.5 rounded-md text-xs font-semibold" style={{ background: "var(--color-success)", color: "white", opacity: canSave ? 1 : 0.5 }}>Save</button>
      </>}>
      <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--color-text-muted)" }}>Speciality</label>
      <input autoFocus type="text" value={speciality} onChange={e => setSpeciality(e.target.value)}
        placeholder="e.g. Gynaecology" className="w-full px-3 py-2 rounded text-sm outline-none" style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }} />

      <label className="text-xs font-semibold mb-1 mt-3 block" style={{ color: "var(--color-text-muted)" }}>Med. Condition</label>
      <input type="text" value={condition} onChange={e => setCondition(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter" && canSave) handleSave(); if (e.key === "Escape") onCancel(); }}
        placeholder="e.g. Normal Pregnancy" className="w-full px-3 py-2 rounded text-sm outline-none" style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }} />

      <div className="flex gap-3 mt-3">
        <div className="flex-1 min-w-0">
          <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--color-text-muted)" }}>Milestones</label>
          <input type="number" min="0" value={milestones} onChange={e => setMilestones(e.target.value)}
            className="w-full px-3 py-2 rounded text-sm outline-none" style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }} />
        </div>
        <div className="flex-1 min-w-0">
          <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--color-text-muted)" }}>Period</label>
          <input type="text" value={period} onChange={e => setPeriod(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && canSave) handleSave(); if (e.key === "Escape") onCancel(); }}
            placeholder="e.g. 280 Days" className="w-full px-3 py-2 rounded text-sm outline-none" style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }} />
        </div>
      </div>
    </SidePanelModal>
  );
}

/* ═══════════════ MAIN GENERIC MIDDLE PANEL — one file for all 4 tabs' report/group panels ═══════════════ */
export default function PrescriptionSidePanel({
  config, showReport = false, reportItems = [], onUpdateReportItem, onTogglePreview, mirrorItems = [], hasPatient = false, onApplyGroup, onGroupSaved,
  draftActive = false, draftTitle = "", draftItems = [], onStartDraft, onSaveDraft, onCancelDraft,
}) {
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

  if (sidePanel.type === "care-plan-list") {
    return (
      <div className={wrapperClass} style={wrapperStyle}>
        <CarePlanListPanel key={config.key} sidePanel={sidePanel} accentColor={config.color} accentLight={config.colorLight} accentText={config.colorText} textAccent={config.textAccent} icon={config.icon} />
      </div>
    );
  }

  // default: "group-list" (Drug, Lab's default view) — keyed by tab so switching
  // Drug ↔ Lab remounts fresh (and re-seeds entries) instead of reusing stale state.
  return (
    <div className={wrapperClass} style={wrapperStyle}>
      <GroupListPanel key={config.key} sidePanel={sidePanel} accentColor={config.color} accentLight={config.colorLight} accentText={config.colorText} textAccent={config.textAccent} icon={config.icon} hasPatient={hasPatient} onApplyGroup={onApplyGroup} catalogList={CATALOG_SOURCES[config.searchSource] || []} typeLabel={config.label} onGroupSaved={onGroupSaved}
        draftActive={draftActive} draftTitle={draftTitle} draftItems={draftItems} onStartDraft={onStartDraft} onSaveDraft={onSaveDraft} onCancelDraft={onCancelDraft} />
    </div>
  );
}
