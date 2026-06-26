import { useState, useRef, useCallback, useEffect } from "react";
import {
  Plus, Copy, Clipboard, FileText, Printer, Save, X,
  Edit2, MinusCircle, RotateCcw, Stethoscope, Calendar, Hash,
  FolderOpen, Search, ChevronDown, File, Image, Clock,
  Eye, Trash2, FilePlus, Upload, Download, FileSignature,
  BookOpen, Trash, CheckCircle, Bold, Italic, Underline,
  AlignLeft, AlignCenter, AlignRight, List, ListOrdered,
  Link as LinkIcon, Type, Palette, Eraser, Circle, Square,
  PenTool, Move, Zap, RotateCw, Pencil, Minus
} from "lucide-react";
import * as fabric from "fabric";

const FINDINGS_COLOR = {
  accent: "var(--color-info)",
  light: "var(--color-info-light)",
};

// ── Toolbar Component ──
function EditorToolbar({ onFormat, onInsertImage, onOpenDrawing, hasImage }) {
  return (
    <div className="flex items-center gap-1 p-1 border-b flex-wrap" style={{ borderColor: 'var(--color-border)' }}>
      <button onClick={() => onFormat('bold')} className="p-1.5 rounded hover:bg-gray-100 transition-all" title="Bold">
        <Bold size={14} />
      </button>
      <button onClick={() => onFormat('italic')} className="p-1.5 rounded hover:bg-gray-100 transition-all" title="Italic">
        <Italic size={14} />
      </button>
      <button onClick={() => onFormat('underline')} className="p-1.5 rounded hover:bg-gray-100 transition-all" title="Underline">
        <Underline size={14} />
      </button>
      <div className="w-px h-6 bg-gray-300" />
      <button onClick={() => onFormat('unorderedList')} className="p-1.5 rounded hover:bg-gray-100 transition-all" title="Bullet List">
        <List size={14} />
      </button>
      <button onClick={() => onFormat('orderedList')} className="p-1.5 rounded hover:bg-gray-100 transition-all" title="Numbered List">
        <ListOrdered size={14} />
      </button>
      <div className="w-px h-6 bg-gray-300" />
      <button onClick={() => onFormat('left')} className="p-1.5 rounded hover:bg-gray-100 transition-all" title="Align Left">
        <AlignLeft size={14} />
      </button>
      <button onClick={() => onFormat('center')} className="p-1.5 rounded hover:bg-gray-100 transition-all" title="Align Center">
        <AlignCenter size={14} />
      </button>
      <button onClick={() => onFormat('right')} className="p-1.5 rounded hover:bg-gray-100 transition-all" title="Align Right">
        <AlignRight size={14} />
      </button>
      <div className="w-px h-6 bg-gray-300" />
      <button onClick={onInsertImage} className="p-1.5 rounded hover:bg-gray-100 transition-all" title="Upload Image">
        <Image size={14} />
      </button>
      <button onClick={onOpenDrawing} className="p-1.5 rounded hover:bg-gray-100 transition-all" title="Draw & Annotate">
        <PenTool size={14} />
      </button>
      {hasImage && (
        <span className="text-[0.55rem] px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 ml-1">
          Image uploaded
        </span>
      )}
    </div>
  );
}

// ── Rich Text Editor Component ──
function RichTextEditor({ value, onChange, onOpenDrawing }) {
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange?.(editorRef.current.innerHTML);
    }
  };

  const format = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const insertImage = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.src = e.target.result;
      img.style.maxWidth = '100%';
      img.style.height = 'auto';
      img.style.borderRadius = '4px';
      img.style.margin = '4px 0';
      img.style.display = 'block';
      
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.insertNode(img);
        range.setStartAfter(img);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      } else {
        editorRef.current?.appendChild(img);
      }
      handleInput();
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      insertImage(file);
    }
    e.target.value = '';
  };

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
      
      <EditorToolbar
        onFormat={format}
        onInsertImage={() => fileInputRef.current?.click()}
        onOpenDrawing={onOpenDrawing}
        hasImage={value?.includes('<img')}
      />

      <div
        ref={editorRef}
        contentEditable
        className="p-3 rounded-lg min-h-[200px] outline-none prose prose-sm max-w-none"
        style={{
          border: '1px solid var(--color-border)',
          background: 'var(--color-surface)',
          color: 'var(--color-text-base)',
          direction: 'ltr',
          unicodeBidi: 'normal',
        }}
        onInput={handleInput}
        suppressContentEditableWarning
      />
    </div>
  );
}

// ── Drawing Canvas Component (using Fabric.js) ──
function DrawingCanvas({ onSave, onCancel, imageToAnnotate }) {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const [selectedColor, setSelectedColor] = useState('#dc2626');
  const [brushSize, setBrushSize] = useState(4);
  const [isDrawing, setIsDrawing] = useState(true);

  const colors = ['#dc2626', '#2563eb', '#16a34a', '#eab308', '#000000', '#8b5cf6', '#ec4899'];

  useEffect(() => {
    // Initialize Fabric.js canvas
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: canvasRef.current.parentElement.clientWidth - 40,
      height: 450,
      backgroundColor: '#ffffff',
      isDrawingMode: true,
    });

    fabricRef.current = canvas;

    // Set up drawing brush
    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    canvas.freeDrawingBrush.color = selectedColor;
    canvas.freeDrawingBrush.width = brushSize;
    canvas.isDrawingMode = true;

    // If image to annotate exists, load it
    if (imageToAnnotate) {
      fabric.Image.fromURL(imageToAnnotate, (img) => {
        const maxWidth = canvas.width - 40;
        const maxHeight = canvas.height - 40;
        const scale = Math.min(
          maxWidth / img.width,
          maxHeight / img.height,
          1
        );
        img.scale(scale);
        img.set({
          left: (canvas.width - img.width * scale) / 2,
          top: (canvas.height - img.height * scale) / 2,
        });
        canvas.add(img);
        canvas.renderAll();
      });
    }

    return () => {
      canvas.dispose();
    };
  }, []);

  // Update brush color
  useEffect(() => {
    if (fabricRef.current) {
      fabricRef.current.freeDrawingBrush.color = selectedColor;
    }
  }, [selectedColor]);

  // Update brush size
  useEffect(() => {
    if (fabricRef.current) {
      fabricRef.current.freeDrawingBrush.width = brushSize;
    }
  }, [brushSize]);

  const handleSave = () => {
    if (fabricRef.current) {
      const dataUrl = fabricRef.current.toDataURL('png');
      onSave?.(dataUrl);
    }
  };

  const handleClear = () => {
    if (fabricRef.current) {
      const canvas = fabricRef.current;
      // Remove all objects except background
      canvas.getObjects().forEach(obj => {
        if (obj !== canvas.backgroundImage) {
          canvas.remove(obj);
        }
      });
      canvas.renderAll();
    }
  };

  const toggleDrawingMode = () => {
    if (fabricRef.current) {
      fabricRef.current.isDrawingMode = !fabricRef.current.isDrawingMode;
      setIsDrawing(fabricRef.current.isDrawingMode);
    }
  };

  const addShape = (type) => {
    if (!fabricRef.current) return;
    
    const canvas = fabricRef.current;
    const shape = {
      rect: new fabric.Rect({
        left: 100,
        top: 100,
        width: 80,
        height: 80,
        fill: 'transparent',
        stroke: selectedColor,
        strokeWidth: 3,
      }),
      circle: new fabric.Circle({
        left: 100,
        top: 100,
        radius: 40,
        fill: 'transparent',
        stroke: selectedColor,
        strokeWidth: 3,
      }),
    };

    canvas.add(shape[type]);
    canvas.renderAll();
  };

  return (
    <div className="p-4 bg-white rounded-lg" style={{ border: '1px solid var(--color-border)' }}>
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {/* Color presets */}
        {colors.map(color => (
          <button
            key={color}
            onClick={() => setSelectedColor(color)}
            className={`p-0.5 rounded-full transition-all ${selectedColor === color ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
          >
            <div className="w-6 h-6 rounded-full" style={{ background: color }} />
          </button>
        ))}
        
        <div className="w-px h-6 bg-gray-300" />
        
        {/* Brush size */}
        <input
          type="range"
          min="1"
          max="20"
          value={brushSize}
          onChange={(e) => setBrushSize(parseInt(e.target.value))}
          className="w-24"
        />
        <span className="text-xs text-gray-500">{brushSize}px</span>
        
        <div className="w-px h-6 bg-gray-300" />
        
        {/* Tools */}
        <button
          onClick={toggleDrawingMode}
          className={`p-1.5 rounded transition-all ${isDrawing ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
          title="Toggle Drawing Mode"
        >
          <PenTool size={16} />
        </button>
        <button
          onClick={() => addShape('rect')}
          className="p-1.5 rounded hover:bg-gray-100 transition-all"
          title="Rectangle"
        >
          <Square size={16} />
        </button>
        <button
          onClick={() => addShape('circle')}
          className="p-1.5 rounded hover:bg-gray-100 transition-all"
          title="Circle"
        >
          <Circle size={16} />
        </button>
        <button
          onClick={handleClear}
          className="p-1.5 rounded hover:bg-gray-100 transition-all"
          title="Clear Canvas"
        >
          <Trash2 size={16} />
        </button>
        
        <div className="flex-1" />
        
        {/* Actions */}
        <button
          onClick={handleSave}
          className="px-3 py-1.5 rounded text-sm font-semibold text-white"
          style={{ background: FINDINGS_COLOR.accent }}
        >
          Insert Drawing
        </button>
        <button
          onClick={onCancel}
          className="px-3 py-1.5 rounded text-sm font-semibold"
          style={{ background: '#fee2e2', color: '#dc2626' }}
        >
          Cancel
        </button>
      </div>
      
      <canvas
        ref={canvasRef}
        className="w-full border rounded"
        style={{ borderColor: 'var(--color-border)', background: 'white' }}
      />
      
      <p className="text-xs text-gray-400 mt-2">
        {isDrawing ? '✏️ Drawing mode active - click and drag to draw' : '🖱️ Click "Toggle Drawing Mode" to start drawing'}
      </p>
    </div>
  );
}

// ── Add Note Modal ──
function AddNoteModal({ onSave, onCancel }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showDrawing, setShowDrawing] = useState(false);
  const [imageToAnnotate, setImageToAnnotate] = useState(null);

  const handleContentChange = (html) => {
    setContent(html);
  };

  const handleOpenDrawing = () => {
    // Extract image from content if exists
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const img = tempDiv.querySelector('img');
    if (img) {
      setImageToAnnotate(img.src);
    } else {
      setImageToAnnotate(null);
    }
    setShowDrawing(true);
  };

  const handleDrawingSave = (dataUrl) => {
    // Insert drawing as image
    const img = document.createElement('img');
    img.src = dataUrl;
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    img.style.borderRadius = '4px';
    img.style.margin = '4px 0';
    img.style.display = 'block';
    
    // Get current content and append image
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    tempDiv.appendChild(img);
    setContent(tempDiv.innerHTML);
    setShowDrawing(false);
    setImageToAnnotate(null);
  };

  const handleSave = () => {
    if (!content.trim() || content === '<br>') {
      alert("Please add some content before saving.");
      return;
    }
    
    setIsSaving(true);
    const now = new Date();
    const dt = `${now.getDate().toString().padStart(2, "0")}/${(now.getMonth() + 1).toString().padStart(2, "0")}/${now.getFullYear()} ${now.getHours().toString().padStart(2, "0")}.${now.getMinutes().toString().padStart(2, "0")}`;
    
    const newDoc = {
      id: Date.now(),
      fileName: title || `NOTE-${Date.now()}`,
      fileType: "HTML",
      size: `${(content.length / 1024).toFixed(1)}KB`,
      dateTime: dt,
      content: content,
      title: title || "Clinical Note",
    };
    
    onSave(newDoc);
    setIsSaving(false);
    setTitle("");
    setContent("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="rounded-xl overflow-hidden shadow-2xl" style={{ background: "var(--color-surface)", width: "750px", maxHeight: "90vh" }}>
        <div className="px-4 py-3 flex justify-between items-center" style={{ background: FINDINGS_COLOR.accent }}>
          <span className="text-sm font-bold text-white flex items-center gap-2">
            <FilePlus size={16} /> Add Document
          </span>
          <button onClick={onCancel} className="p-1 rounded transition-all hover:bg-white/20">
            <X size={16} style={{ color: "white" }} />
          </button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto" style={{ maxHeight: "calc(90vh - 60px)" }}>
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

          <div>
            <label className="text-[0.65rem] font-bold uppercase tracking-wide block mb-1" style={{ color: "var(--color-text-muted)" }}>
              Content
            </label>
            {showDrawing ? (
              <DrawingCanvas
                onSave={handleDrawingSave}
                onCancel={() => {
                  setShowDrawing(false);
                  setImageToAnnotate(null);
                }}
                imageToAnnotate={imageToAnnotate}
              />
            ) : (
              <RichTextEditor
                value={content}
                onChange={handleContentChange}
                onOpenDrawing={handleOpenDrawing}
              />
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button 
              onClick={onCancel} 
              className="px-4 py-1.5 rounded-lg text-sm font-semibold transition-all"
              style={{ border: "1px solid var(--color-border)", color: "var(--color-text-muted)" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--color-surface-alt)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
              Cancel
            </button>
            <button 
              onClick={handleSave} 
              disabled={isSaving}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold text-white transition-all ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
              style={{ background: FINDINGS_COLOR.accent }}
              onMouseEnter={(e) => { if (!isSaving) e.currentTarget.style.background = "#0d6e7a"; }}
              onMouseLeave={(e) => { if (!isSaving) e.currentTarget.style.background = FINDINGS_COLOR.accent; }}>
              <Save size={14} className="inline mr-1" />
              {isSaving ? "Saving..." : "Save Document"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Action Button Component ──
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

// ── Modern Toolbar Component ──
function ModernToolbar({ docNo, docDt, onProto }) {
  return (
    <div className="flex items-center justify-between p-1 border-b" style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
      <div className="flex items-center gap-6">
        <div className="h-8 w-px" style={{ background: "var(--color-border)" }} />
      </div>
      <div className="flex gap-2">
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

// ── Table Header Component ──
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

// ── Findings Row Component ──
function FindingsRow({ file, index, isStruck, onDelete, onStrike, onView }) {
  const getFileTypeInfo = (type) => {
    const types = {
      JPG: { icon: Image, bg: "#e8f4fb", color: "#0a5a9a" },
      PNG: { icon: Image, bg: "#e8f4fb", color: "#0a5a9a" },
      PDF: { icon: FileText, bg: "#fee2e2", color: "#dc2626" },
      TXT: { icon: FileSignature, bg: "#f0f9f0", color: "#1a7f5a" },
      DOC: { icon: File, bg: "#e8e8fb", color: "#3a3a9a" },
      DOCX: { icon: File, bg: "#e8e8fb", color: "#3a3a9a" },
      HTML: { icon: File, bg: "#f0e8fb", color: "#6a3a9a" },
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

// ── View Modal Component ──
function ViewModal({ file, onClose }) {
  if (!file) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="rounded-xl overflow-hidden shadow-2xl" style={{ background: "var(--color-surface)", width: "700px", maxHeight: "90vh" }}>
        <div className="px-4 py-3 flex justify-between items-center" style={{ background: FINDINGS_COLOR.accent }}>
          <div>
            <span className="text-sm font-bold text-white">{file.fileName}</span>
            <span className="text-[0.6rem] text-white/70 ml-2">{file.fileType} · {file.size} · {file.dateTime}</span>
          </div>
          <button onClick={onClose} className="p-1 rounded transition-all hover:bg-white/20">
            <X size={16} style={{ color: "white" }} />
          </button>
        </div>
        <div className="p-4 overflow-y-auto" style={{ maxHeight: "calc(90vh - 60px)" }}>
          {file.fileType === "HTML" || file.fileType === "TXT" ? (
            <div 
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: file.content || "(No content)" }}
              style={{ color: "var(--color-text-base)", direction: 'ltr' }}
            />
          ) : (
            <div className="text-center py-12">
              {file.content && file.content.startsWith('data:image') ? (
                <img 
                  src={file.content} 
                  alt={file.fileName}
                  className="max-w-full max-h-96 mx-auto rounded-lg shadow-md"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              ) : (
                <>
                  <File size={48} style={{ color: FINDINGS_COLOR.accent }} />
                  <p className="text-sm mt-2" style={{ color: "var(--color-text-muted)" }}>Preview not available</p>
                </>
              )}
              <button className="mt-3 px-4 py-1.5 rounded-lg text-sm font-semibold text-white" style={{ background: FINDINGS_COLOR.accent }}>
                <Download size={14} className="inline mr-1" /> Download
              </button>
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
}

// ── MAIN FINDINGS TAB COMPONENT ──
const MOCK_FILES = [
  { id: 1, fileName: "3902-F1", fileType: "JPG", size: "1439KB", dateTime: "02/02/2024 16.02", content: null, title: "Scan report" },
  { id: 2, fileName: "3902-F2", fileType: "HTML", size: "201KB", dateTime: "02/02/2024 18.02", content: "<p><strong>Clinical Note:</strong> Patient shows improvement. Follow-up in 2 weeks.</p>", title: "Doctor note" },
];

export default function FindingsTab({ findings, setFindings, patient }) {
  const [files, setFiles] = useState(MOCK_FILES);
  const [struckIds, setStruckIds] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewFile, setViewFile] = useState(null);

  const docPrefix = patient?.docNo?.replace("OP:", "").trim().split(":")[0]?.trim() || "3902";
  const docNo = `${docPrefix}: OP-F`;
  const docDt = patient?.docDate?.split(" ")[0] || "—";

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

  return (
    <div className="h-full flex flex-col rounded-xs overflow-hidden shadow-lg" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
      {/* Header Section */}
      <div className="border-b" style={{ background: `linear-gradient(135deg, ${FINDINGS_COLOR.light} 0%, var(--color-surface) 100%)`, borderColor: "var(--color-border)" }}>
        <div className="px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderOpen size={16} style={{ color: FINDINGS_COLOR.accent }} />
            <h2 className="lg:text-base md:text-xs font-light" style={{ color: FINDINGS_COLOR.accent }}>
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