import { AlertTriangle } from "lucide-react";

const ConfirmDialog = ({ open, title, message, confirmLabel = "Confirm", danger = true, onConfirm, onCancel, loading }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-noir/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-luxury p-6 max-w-sm w-full">
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${danger ? "bg-red-100" : "bg-champagne/20"}`}>
            <AlertTriangle size={16} strokeWidth={1.5} className={danger ? "text-red-500" : "text-champagne"} />
          </div>
          <h3 className="font-heading text-noir text-lg">{title}</h3>
        </div>
        <p className="text-noir/60 text-[13.5px] font-body mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded-luxury text-[13px] font-body text-noir/60 hover:bg-noir/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 rounded-luxury text-[13px] font-body text-white transition-colors disabled:opacity-60 ${
              danger ? "bg-red-500 hover:bg-red-600" : "bg-noir hover:bg-noir/90"
            }`}
          >
            {loading ? "Please wait..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
