export default function Modal({ open, title, onClose, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/30"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-modal border border-border bg-surface p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 id="modal-title" className="text-lg font-semibold text-text-primary">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-text-secondary hover:text-text-primary"
          >
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
