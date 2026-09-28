import { AlertTriangle, X } from "lucide-react";

export default function DeleteConfirmationModal({
  open,
  title = "Delete confirmation",
  message = "Are you sure you want to delete this item?",
  itemName = "",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[140] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.45)" }}
      role="presentation"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-confirmation-title"
        className="w-full max-w-sm overflow-hidden rounded-lg shadow-2xl"
        style={{ background: "var(--color-surface)", color: "var(--color-text-base)" }}
        onClick={event => event.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3" style={{ background: "var(--color-danger)", color: "white" }}>
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} aria-hidden="true" />
            <span id="delete-confirmation-title" className="text-base font-bold">{title}</span>
          </div>
          <button type="button" onClick={onCancel} className="p-1 transition-all hover:bg-white/20" aria-label="Close confirmation">
            <X size={18} />
          </button>
        </div>

        <div className="px-4 py-4">
          <p className="text-sm leading-5">{message}</p>
          {itemName && (
            <div
              className="mt-3 border px-3 py-2 text-sm font-semibold"
              style={{ borderColor: "var(--color-border)", background: "var(--color-surface-alt)" }}
            >
              {itemName}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t px-4 py-3" style={{ borderColor: "var(--color-border)" }}>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-none border px-4 py-2 text-sm font-semibold"
            style={{ borderColor: "var(--color-border)", background: "var(--color-surface)", color: "var(--color-text-base)" }}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-none px-4 py-2 text-sm font-semibold text-white"
            style={{ background: "var(--color-danger)" }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
