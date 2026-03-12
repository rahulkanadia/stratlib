// src/components/RightSidebar.tsx
import React from 'react';
import { UploadCloud } from 'lucide-react';

export default function RightSidebar() {
  return (
    <aside className="w-80 bg-[var(--bg-panel)] border-l border-[var(--border-color)] p-5 flex flex-col shrink-0 overflow-y-auto">
      <div className="flex items-center gap-2 text-sm font-bold text-[var(--text-main)] mb-6 uppercase tracking-wider">
        {/* Cloud icon specifically forced to white as requested */}
        <UploadCloud className="w-5 h-5 text-white"/> Contribute
      </div>

      <form className="flex flex-col flex-1 gap-5 text-sm" onSubmit={(e) => e.preventDefault()}>
        <div className="flex flex-col gap-1.5">
          <label className="text-[var(--text-muted)] font-medium text-xs">
            Strategy Name <span className="text-[var(--danger)]">*</span>
          </label>
          <input type="text" placeholder="e.g. Adaptive RSI" required className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-md p-2.5 focus:border-[var(--accent)] outline-none text-[var(--text-main)]" />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[var(--text-muted)] font-medium text-xs">
            Type <span className="text-[var(--danger)]">*</span>
          </label>
          <select required className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-md p-2.5 focus:border-[var(--accent)] outline-none text-[var(--text-main)]">
            <option>Indicator</option>
            <option>Strategy</option>
            <option>Utility</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[var(--text-muted)] font-medium text-xs">
            Upload Code <span className="text-[var(--danger)]">*</span>
          </label>
          <div className="border-2 border-dashed border-[var(--border-color)] hover:border-[var(--accent)] rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer bg-[var(--bg-main)] transition h-32">
             <input type="file" required className="hidden" id="file-upload" accept=".pine,.py,.md,.txt" />
             <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center text-center">
               <UploadCloud className="w-6 h-6 text-[var(--text-muted)] mb-2" />
               <span className="text-[var(--text-muted)] text-xs">Drag and drop or browse to upload</span>
             </label>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 flex-1">
          <label className="text-[var(--text-muted)] font-medium text-xs">
            Description <span className="text-[var(--text-muted)] opacity-50">(Optional)</span>
          </label>
          <textarea placeholder="Briefly explain the logic..." className="w-full h-full min-h-[100px] bg-[var(--bg-main)] border border-[var(--border-color)] rounded-md p-2.5 focus:border-[var(--accent)] outline-none text-[var(--text-main)] resize-none" />
        </div>

        <div className="mt-auto pt-4 border-t border-[var(--border-color)]">
          <p className="text-xs text-[var(--text-muted)] mb-4 leading-relaxed italic text-center">
            Your contributions will be indexed and searchable after moderation to avoid spam.
          </p>
          <button type="submit" className="w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] py-3 rounded-md font-bold text-white transition shadow-lg text-sm uppercase tracking-wider">
            Contribute to Library
          </button>
        </div>
      </form>
    </aside>
  );
}