import { useState, useRef, useCallback, useEffect } from "react";
import {
  Plus, Copy, Clipboard, FileText, Printer, Save, X,
  Edit2, MinusCircle, RotateCcw, Stethoscope, Calendar, Hash,
  FolderOpen, Search, ChevronDown, File, Image, Clock,
  Eye, Trash2, FilePlus, Upload, Download, FileSignature,
  BookOpen, Trash, CheckCircle
} from "lucide-react";

const FINDINGS_COLOR = {
  accent: "var(--color-info)",
  light: "var(--color-info-muted)",
};

// Ordered list of focusable field keys in the add row
const FIELD_ORDER = ["title", "content", "commit"];

/* ── Action Button Component with Label ── */
function ActionButton({ onClick, variant = "primary", icon: Icon, label, disabled = false }) {
  const variants = {
    primary: { bg: "var(--color-primary)", color: "white", hoverBg: "var(--color-primary-light)" },
    success: { bg: FINDINGS_COLOR.accent, color: "white", hoverBg: "#0d6e7a" },
    danger: { bg: "var(--color-danger)", color: "white", hoverBg: "#b91c1c" },
    warning: { bg: "var(--color-warning)", color: "white", hoverBg: "#d97706" },
    ghost: { bg: "transparent", color: "var(--color-text-muted)", hoverBg: "var(--color-surface-alt)" },
  };
  const style = variants[variant] || variants.primary;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold transition-all duration-150 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      style={{ background: style.bg, color: style.color, border: variant === "ghost" ? "1px solid var(--color-border)" : "none" }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.background = style.hoverBg; }}
      onMouseLeave={(e) => { if (!disabled) e.currentTarget.style.background = style.bg; }}
    >
      {Icon && <Icon size={14} />}
      {label}
    </button>
  );
}

/* ── Modern Toolbar Component (without Save and Clear) ── */
function ModernToolbar({ docNo, docDt, onProto }) {
  return (
    <div className="flex items-center justify-between p-1 border-b" style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
      <div className="flex items-center gap-6">
        {/* <div className="flex gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-wider block" style={{ color: "var(--color-text-muted)" }}>
              <Hash size={10} className="inline mr-1" /> Doc #
            </span>
            <span className="text-sm font-bold" style={{ color: "var(--color-text-base)" }}>{docNo || "—"}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider block" style={{ color: "var(--color-text-muted)" }}>
              <Calendar size={10} className="inline mr-1" /> Doc. Dt
            </span>
            <span className="text-sm font-semibold" style={{ color: "var(--color-primary)" }}>{docDt || "—"}</span>
          </div>
        </div> */}
        <div className="h-8 w-px" style={{ background: "var(--color-border)" }} />
        {/* <span className="px-3 py-1 rounded-md text-xs font-semibold inline-flex items-center gap-1" style={{ background: FINDINGS_COLOR.light, color: FINDINGS_COLOR.accent }}>
          <Stethoscope size={12} /> OP-F: {docNo?.split(":")[0] || "3902"}
        </span> */}
      </div>
      <div className="flex gap-2">
        {/* <ActionButton variant="ghost" icon={Copy} label="Copy" /> */}
        <ActionButton variant="ghost" icon={Clipboard} label="Paste" />
        <div className="w-px h-6 self-center" style={{ background: "var(--color-border)" }} />
        <ActionButton variant="ghost" icon={BookOpen} label="Proto" onClick={onProto} />
        <ActionButton variant="ghost" icon={FileText} label="Preview" />
        <div className="w-px h-6 self-center" style={{ background: "var(--color-border)" }} />
        <ActionButton variant="ghost" icon={Printer} label="Print" />
      </div>
    </div>
  );
}

/* ── Table Header Component ── */
function TableHeader() {
  const columns = [
    { label: "Sl.No.", width: "w-16" },
    { label: "File Name", width: "flex-1" },
    { label: "Type", width: "w-20", center: true },
    { label: "Size", width: "w-24", center: true },
    { label: "Date & Time", width: "w-36" },
    { label: "Actions", width: "w-32", center: true },
  ];
  return (
    <div className="flex border-b" style={{ background: FINDINGS_COLOR.light, borderColor: "var(--color-border)" }}>
      {columns.map(col => (
        <div key={col.label} className={`${col.width} px-3 py-2.5 ${col.center ? 'text-center' : ''}`}
          style={{ fontSize: "0.7rem", fontWeight: "800", letterSpacing: "0.05em", color: FINDINGS_COLOR.accent }}>
          {col.label}
        </div>
      ))}
    </div>
  );
}

/* ── Findings Row Component ── */
function FindingsRow({ file, index, isStruck, onDelete, onStrike, onView }) {
  const getFileTypeInfo = (type) => {
    const types = {
      JPG: { icon: Image, bg: "#e8f4fb", color: "#0a5a9a" },
      PNG: { icon: Image, bg: "#e8f4fb", color: "#0a5a9a" },
      PDF: { icon: FileText, bg: "#fee2e2", color: "#dc2626" },
      TXT: { icon: FileSignature, bg: "#f0f9f0", color: "#1a7f5a" },
      DOC: { icon: File, bg: "#e8e8fb", color: "#3a3a9a" },
      DOCX: { icon: File, bg: "#e8e8fb", color: "#3a3a9a" },
    };
    return types[type] || { icon: File, bg: "#f0f0f0", color: "#5a5a5a" };
  };

  const typeInfo = getFileTypeInfo(file.fileType);
  const IconComponent = typeInfo.icon;

  return (
    <div className="flex border-b transition-all duration-150 hover:shadow-sm"
      style={{
        borderColor: "var(--color-border)",
        background: isStruck ? "var(--color-surface-alt)" : index % 2 === 0 ? "var(--color-surface)" : "var(--color-surface-alt)",
        opacity: isStruck ? 0.6 : 1,
      }}
    >
      <div className="w-16 px-3 py-2 text-center">
        <span className="text-sm font-bold" style={{ color: FINDINGS_COLOR.accent }}>{index + 1}</span>
      </div>
      <div className="flex-1 px-3 py-2">
        <span className={`text-sm font-semibold inline-flex items-center gap-1.5 ${isStruck ? "line-through" : ""}`} style={{ color: "var(--color-text-base)" }}>
          <File size={14} style={{ color: FINDINGS_COLOR.accent }} />
          {file.fileName}
          {file.title && (
            <span className="text-xs font-normal" style={{ color: "var(--color-text-muted)" }}>
              ({file.title})
            </span>
          )}
        </span>
      </div>
      <div className="w-20 px-3 py-2 text-center">
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold" style={{ background: typeInfo.bg, color: typeInfo.color }}>
          <IconComponent size={10} />
          {file.fileType}
        </span>
      </div>
      <div className="w-24 px-3 py-2 text-center">
        <span className="text-xs font-mono" style={{ color: "var(--color-text-muted)" }}>{file.size}</span>
      </div>
      <div className="w-36 px-3 py-2">
        <span className="text-xs font-mono flex items-center gap-1" style={{ color: "var(--color-text-muted)" }}>
          <Clock size={10} />
          {file.dateTime}
        </span>
      </div>
      <div className="w-32 px-2 py-2 flex items-center justify-center gap-1.5">
        <button onClick={onView} className="p-1.5 rounded transition-all" title="View"
          style={{ background: FINDINGS_COLOR.light, color: FINDINGS_COLOR.accent }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#d0f0f5"}
          onMouseLeave={(e) => e.currentTarget.style.background = FINDINGS_COLOR.light}>
          <Eye size={14} />
        </button>
        <button onClick={onStrike} className="p-1.5 rounded transition-all" title={isStruck ? "Undo Strike (S)" : "Strike (S)"}
          style={{ background: FINDINGS_COLOR.light, color: FINDINGS_COLOR.accent }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#d0f0f5"}
          onMouseLeave={(e) => e.currentTarget.style.background = FINDINGS_COLOR.light}>
          {isStruck ? <RotateCcw size={14} /> : <MinusCircle size={14} />}
        </button>
        <button onClick={onDelete} className="p-1.5 rounded transition-all" title="Delete (Del)"
          style={{ background: "#fee2e2", color: "var(--color-danger)" }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#fecaca"}
          onMouseLeave={(e) => e.currentTarget.style.background = "#fee2e2"}>
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

/* ── Add Note Modal with Upload Field Below Content ── */
function AddNoteModal({ onSave, onCancel, onFileUpload }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleSave = () => {
    if (selectedFile) {
      // If a file is selected, upload it
      onFileUpload(selectedFile);
      setSelectedFile(null);
    } else if (content.trim()) {
      // If content is written, save as note
      const now = new Date();
      const dt = `${now.getDate().toString().padStart(2, "0")}/${(now.getMonth() + 1).toString().padStart(2, "0")}/${now.getFullYear()} ${now.getHours().toString().padStart(2, "0")}.${now.getMinutes().toString().padStart(2, "0")}`;
      onSave({
        id: Date.now(),
        fileName: `NOTE-${Date.now()}`,
        fileType: "TXT",
        size: `${content.length + (title.length * 2)}B`,
        dateTime: dt,
        content,
        title: title || "Clinical Note",
      });
      setTitle("");
      setContent("");
    }
  };

  const handleFileSelect = (e) => {
    const f = e.target.files[0];
    if (f) {
      setSelectedFile(f);
      // Auto-fill title with filename if title is empty
      if (!title) {
        setTitle(f.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const isFormValid = () => {
    return selectedFile !== null || content.trim() !== "";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="rounded-xl overflow-hidden shadow-2xl" style={{ background: "var(--color-surface)", width: "550px" }}>
        <div className="px-4 py-3 flex justify-between items-center" style={{ background: FINDINGS_COLOR.accent }}>
          <span className="text-sm font-bold text-white flex items-center gap-2">
            <FilePlus size={16} /> Add Document
          </span>
          <button onClick={onCancel} className="p-1 rounded transition-all hover:bg-white/20">
            <X size={16} style={{ color: "white" }} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Title Field */}
          <div>
            <label className="text-[0.65rem] font-bold uppercase tracking-wide block mb-1" style={{ color: "var(--color-text-muted)" }}>
              Document Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title..."
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}
              autoFocus
            />
          </div>

          {/* Content Field */}
          <div>
            <label className="text-[0.65rem] font-bold uppercase tracking-wide block mb-1" style={{ color: "var(--color-text-muted)" }}>
              Content / Notes
            </label>
            <textarea
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type clinical notes, observations, or findings here..."
              className="w-full px-3 py-2 rounded-lg text-sm resize-none outline-none"
              style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}
              disabled={selectedFile !== null}
            />
            {selectedFile && (
              <p className="text-[0.55rem] mt-1" style={{ color: "var(--color-text-subtle)" }}>
                Note field disabled while file is selected
              </p>
            )}
          </div>

          {/* File Upload Field */}
          <div>
            <label className="text-[0.65rem] font-bold uppercase tracking-wide block mb-1" style={{ color: "var(--color-text-muted)" }}>
              Upload File (Optional)
            </label>
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.txt"
                className="flex-1 px-3 py-2 rounded-lg text-sm outline-none cursor-pointer"
                style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}
              />
              {selectedFile && (
                <button
                  onClick={clearSelectedFile}
                  className="p-2 rounded-lg transition-all"
                  style={{ background: "#fee2e2", color: "var(--color-danger)" }}
                  title="Remove file"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            {selectedFile && (
              <div className="mt-2 p-2 rounded-lg" style={{ background: FINDINGS_COLOR.light }}>
                <div className="flex items-center gap-2">
                  <File size={14} style={{ color: FINDINGS_COLOR.accent }} />
                  <span className="text-xs font-medium" style={{ color: "var(--color-text-base)" }}>
                    {selectedFile.name}
                  </span>
                  <span className="text-[0.55rem]" style={{ color: "var(--color-text-muted)" }}>
                    ({(selectedFile.size / 1024).toFixed(2)} KB)
                  </span>
                </div>
              </div>
            )}
            <p className="text-[0.55rem] mt-1" style={{ color: "var(--color-text-subtle)" }}>
              Supported formats: JPG, PNG, PDF, DOC, DOCX, TXT
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={onCancel} className="px-4 py-1.5 rounded-lg text-sm font-semibold transition-all"
              style={{ border: "1px solid var(--color-border)", color: "var(--color-text-muted)" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--color-surface-alt)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
              Cancel
            </button>
            <button 
              onClick={handleSave} 
              disabled={!isFormValid()}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold text-white transition-all ${!isFormValid() ? 'opacity-50 cursor-not-allowed' : ''}`}
              style={{ background: FINDINGS_COLOR.accent }}
              onMouseEnter={(e) => { if (isFormValid()) e.currentTarget.style.background = "#0d6e7a"; }}
              onMouseLeave={(e) => { if (isFormValid()) e.currentTarget.style.background = FINDINGS_COLOR.accent; }}>
              <Save size={14} className="inline mr-1" />
              {selectedFile ? "Upload File" : "Save Note"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════ MAIN FINDINGS TAB COMPONENT ═══════════════ */
const MOCK_FILES = [
  { id: 1, fileName: "3902-F1", fileType: "JPG", size: "1439KB", dateTime: "02/02/2024 16.02", content: null, title: "Scan report" },
  { id: 2, fileName: "3902-F2", fileType: "TXT", size: "201KB", dateTime: "02/02/2024 18.02", content: "Patient shows improvement. Follow-up in 2 weeks.", title: "Doctor note" },
];

export default function FindingsTab({ findings, setFindings, patient }) {
  const [files, setFiles] = useState(MOCK_FILES);
  const [struckIds, setStruckIds] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewFile, setViewFile] = useState(null);

  const docPrefix = patient?.docNo?.replace("OP:", "").trim().split(":")[0]?.trim() || "3902";
  const docNo = `${docPrefix}: OP-F`;
  const docDt = patient?.docDate?.split(" ")[0] || "—";

  const handleFileUpload = (file) => {
    if (!file) return;
    const ext = file.name.split(".").pop().toUpperCase();
    const size = file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(0)}MB` : `${Math.ceil(file.size / 1024)}KB`;
    const now = new Date();
    const dt = `${now.getDate().toString().padStart(2, "0")}/${(now.getMonth() + 1).toString().padStart(2, "0")}/${now.getFullYear()} ${now.getHours().toString().padStart(2, "0")}.${now.getMinutes().toString().padStart(2, "0")}`;
    setFiles(prev => [...prev, {
      id: Date.now(),
      fileName: file.name,
      fileType: ext,
      size,
      dateTime: dt,
      content: null,
      title: file.name.replace(/\.[^/.]+$/, ""),
    }]);
    setShowAddModal(false);
  };

  const handleSaveNote = (note) => {
    setFiles(prev => [...prev, note]);
    setShowAddModal(false);
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all files?")) {
      setFiles([]);
      setStruckIds([]);
    }
  };

  const handleSave = () => {
    alert("Document saved successfully!");
  };

  const handleProto = () => {
    alert("Proto feature coming soon!");
  };

  const toggleStrike = (id) => {
    setStruckIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const deleteFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const ViewModal = ({ file, onClose }) => {
    if (!file) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
        <div className="rounded-xl overflow-hidden shadow-2xl" style={{ background: "var(--color-surface)", width: "560px" }}>
          <div className="px-4 py-3 flex justify-between items-center" style={{ background: FINDINGS_COLOR.accent }}>
            <div>
              <span className="text-sm font-bold text-white">{file.fileName}</span>
              <span className="text-[0.6rem] text-white/70 ml-2">{file.fileType} · {file.size} · {file.dateTime}</span>
            </div>
            <button onClick={onClose} className="p-1 rounded transition-all hover:bg-white/20">
              <X size={16} style={{ color: "white" }} />
            </button>
          </div>
          <div className="p-4">
            {file.fileType === "TXT" ? (
              <pre className="text-sm whitespace-pre-wrap font-body" style={{ color: "var(--color-text-base)", maxHeight: "300px", overflowY: "auto" }}>
                {file.content || "(No content)"}
              </pre>
            ) : (
              <div className="text-center py-12">
                <File size={48} style={{ color: FINDINGS_COLOR.accent }} />
                <p className="text-sm mt-2" style={{ color: "var(--color-text-muted)" }}>Preview not available</p>
              </div>
            )}
            <div className="flex justify-end mt-4">
              <button onClick={onClose} className="px-4 py-1.5 rounded-lg text-sm font-semibold text-white transition-all"
                style={{ background: FINDINGS_COLOR.accent }}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col rounded-lg overflow-hidden shadow-lg" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>

      {/* Header Section with Clear and Save buttons */}
      <div className="border-b" style={{ background: `linear-gradient(135deg, ${FINDINGS_COLOR.light} 0%, var(--color-surface) 100%)`, borderColor: "var(--color-border)" }}>
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderOpen size={18} style={{ color: FINDINGS_COLOR.accent }} />
            <h2 className="text-base font-extrabold" style={{ color: FINDINGS_COLOR.accent }}>
              Clinical Findings & Documents
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <ActionButton variant="warning" icon={Trash} label="Clear" onClick={handleClearAll} />
            <ActionButton variant="success" icon={Save} label="Save" onClick={handleSave} />
          </div>
        </div>
        <ModernToolbar 
          docNo={docNo} 
          docDt={docDt} 
          onProto={handleProto}
        />
      </div>

      {/* Empty State */}
      {files.length === 0 && !showAddModal && (
        <div className="flex-1 flex flex-col items-center justify-center py-5">
          <div className="text-center">
            <div className="mb-2 p-4 rounded-full inline-flex" style={{ background: FINDINGS_COLOR.light }}>
              <FolderOpen size={20} style={{ color: FINDINGS_COLOR.accent }} />
            </div>
            <h3 className="text-lg font-bold mb-2" style={{ color: "var(--color-text-base)" }}>No Documents Added Yet</h3>
            <p className="text-sm mb-3" style={{ color: "var(--color-text-muted)" }}>Add clinical notes or upload files</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-sm mx-auto"
              style={{ background: FINDINGS_COLOR.accent, color: "white" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#0d6e7a"}
              onMouseLeave={(e) => e.currentTarget.style.background = FINDINGS_COLOR.accent}>
              <FilePlus size={16} /> Add Document
            </button>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <AddNoteModal 
          onSave={handleSaveNote} 
          onCancel={() => setShowAddModal(false)} 
          onFileUpload={handleFileUpload}
        />
      )}
      {viewFile && <ViewModal file={viewFile} onClose={() => setViewFile(null)} />}

      {/* Table with rows */}
      {files.length > 0 && (
        <div className="flex-1 overflow-auto flex flex-col">
          <TableHeader />
          <div>
            {files.map((file, index) => (
              <FindingsRow
                key={file.id}
                file={file}
                index={index}
                isStruck={struckIds.includes(file.id)}
                onDelete={() => deleteFile(file.id)}
                onStrike={() => toggleStrike(file.id)}
                onView={() => setViewFile(file)}
              />
            ))}
          </div>

          {/* Bottom-right Add button */}
          <div className="flex justify-end gap-2 px-4 py-3 border-t" style={{ borderColor: "var(--color-border)" }}>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-sm"
              style={{ background: FINDINGS_COLOR.accent, color: "white" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#0d6e7a"}
              onMouseLeave={(e) => e.currentTarget.style.background = FINDINGS_COLOR.accent}>
              <Plus size={14} /> Add Document
            </button>
          </div>
        </div>
      )}

      {/* Footer bar */}
      <div className="h-1" style={{ background: `linear-gradient(90deg, ${FINDINGS_COLOR.accent} 0%, var(--color-primary) 50%, var(--color-drugs) 100%)`, opacity: 0.3 }} />
    </div>
  );
}