import { useState } from "react";

export default function AddTemplateModal({ open, onClose }) {
  const [templateName, setTemplateName] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
        {/* Header */}
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="font-semibold text-lg">
            Create Prescription Template
          </h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">
          <div>
            <label className="text-sm font-medium">Template Name</label>
            <input
              type="text"
              placeholder="e.g. Fever Treatment"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className="mt-1 w-full border rounded px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              rows="3"
              placeholder="Optional notes..."
              className="mt-1 w-full border rounded px-3 py-2 text-sm"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t p-4">
          <button
            onClick={onClose}
            className="border px-4 py-2 rounded text-sm"
          >
            Cancel
          </button>

          <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm">
            Save Template
          </button>
        </div>
      </div>
    </div>
  );
}
