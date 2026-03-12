import React, { useState } from 'react';
import { ChevronDown, ChevronRight, FileCode, X, Download, CheckSquare, Square } from 'lucide-react';
import { MetadataItem } from '@/types';

interface LeftSidebarProps {
  isSidebarOpen: boolean;
  totalFiles: number;
  displayResults: MetadataItem[];
  history: MetadataItem[];
  setHistory: React.Dispatch<React.SetStateAction<MetadataItem[]>>;
  selectedIds: Set<string>;
  toggleSelection: (id: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedFile: MetadataItem | null;
  handleSelectFile: (file: MetadataItem) => void;
  activeFilter: string | null;
  setActiveFilter: (filter: string | null) => void;
  setQuery: (q: string) => void; // Added setQuery
  handleSelectAll: () => void;
  handleUnselectAll: () => void;
  handleDownloadZip: () => void;
}

export default function LeftSidebar({ 
  isSidebarOpen, totalFiles, displayResults, history, setHistory, 
  selectedIds, toggleSelection, selectedFile, handleSelectFile, 
  activeFilter, setActiveFilter, setQuery, handleSelectAll, handleUnselectAll, handleDownloadZip 
}: LeftSidebarProps) {
  
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isModQueueOpen, setIsModQueueOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(true);

  // Check if we have anything to clear
  const canClearFilter = activeFilter !== null || displayResults.length !== totalFiles;

  return (
    <aside className={`${isSidebarOpen ? 'w-80' : 'w-0'} flex flex-col bg-[var(--bg-panel)] border-r border-[var(--border-color)] overflow-hidden shrink-0 transition-all duration-300`}>
      
      {/* 1. History Section */}
      <div className="border-b border-[var(--border-color)] flex flex-col">
        <div className="p-2.5 bg-[var(--bg-main)] flex justify-between items-center cursor-pointer hover:bg-[var(--bg-hover)] transition" onClick={() => setIsHistoryOpen(!isHistoryOpen)}>
          <span className="text-xs font-bold text-[var(--text-muted)] flex items-center gap-1">
            {isHistoryOpen ? <ChevronDown size={14}/> : <ChevronRight size={14}/>} 
            LAST VIEWED ({history.length})
          </span>
          <button 
            disabled={history.length === 0}
            onClick={(e) => { e.stopPropagation(); setHistory([]); }} 
            className="text-[10px] bg-[var(--border-color)] text-[var(--text-main)] px-2 py-0.5 rounded hover:bg-[var(--danger)] hover:text-white transition disabled:opacity-30 disabled:hover:bg-[var(--border-color)]"
          >
            Clear History
          </button>
        </div>
        
        {isHistoryOpen && (
          <div className="max-h-40 overflow-y-auto">
            {history.map(file => (
              <div key={`hist-${file.id}`} className="flex items-center gap-2 p-1.5 hover:bg-[var(--bg-hover)] cursor-pointer text-xs" onClick={() => handleSelectFile(file)}>
                <input type="checkbox" checked={selectedIds.has(file.id)} onChange={(e) => toggleSelection(file.id, e)} onClick={(e) => e.stopPropagation()} className="cursor-pointer" />
                <span className="truncate flex-1 text-[var(--text-main)]">{file.name}</span>
                <X className="w-3.5 h-3.5 text-[var(--text-muted)] hover:text-[var(--danger)]" onClick={(e) => { e.stopPropagation(); setHistory(h => h.filter(f => f.id !== file.id)); }} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Moderation Queue */}
      <div className="border-b border-[var(--border-color)] flex flex-col bg-[var(--bg-main)]">
        <div className="p-2.5 flex items-center gap-1 cursor-pointer hover:bg-[var(--bg-hover)] transition text-xs font-bold text-[var(--text-muted)]" onClick={() => setIsModQueueOpen(!isModQueueOpen)}>
          {isModQueueOpen ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
          AWAITING MODERATION (2)
        </div>
        {isModQueueOpen && (
          <div className="p-2 opacity-50 pointer-events-none">
             <div className="flex items-center gap-2 p-1 text-xs text-[var(--text-main)]"><FileCode className="w-3 h-3"/> new_rsi_strat.py</div>
             <div className="flex items-center gap-2 p-1 text-xs text-[var(--text-main)]"><FileCode className="w-3 h-3"/> my_indicator.pine</div>
          </div>
        )}
      </div>

      {/* 3. Main File Tree */}
      <div className="flex-1 overflow-y-auto flex flex-col">
        <div className="p-2.5 bg-[var(--bg-main)] flex justify-between items-center cursor-pointer hover:bg-[var(--bg-hover)] transition sticky top-0 z-10" onClick={() => setIsLibraryOpen(!isLibraryOpen)}>
          <span className="text-xs font-bold text-[var(--text-muted)] flex items-center gap-1">
            {isLibraryOpen ? <ChevronDown size={14}/> : <ChevronRight size={14}/>} 
            LIBRARY ({displayResults.length}/{totalFiles})
          </span>
          <button 
            disabled={!canClearFilter}
            onClick={(e) => { e.stopPropagation(); setActiveFilter(null); setQuery(''); }} 
            className="text-[10px] bg-[var(--border-color)] text-[var(--text-main)] px-2 py-0.5 rounded hover:bg-[var(--danger)] hover:text-white transition disabled:opacity-30 disabled:hover:bg-[var(--border-color)]"
          >
            Clear Search/Filter
          </button>
        </div>

        {isLibraryOpen && (
          <div className="p-2">
            {displayResults.map((file) => (
              <div key={file.id} onClick={() => handleSelectFile(file)} className={`flex items-center gap-2 p-1.5 rounded cursor-pointer mb-0.5 text-xs ${selectedFile?.id === file.id ? 'bg-[var(--border-color)] text-[var(--accent)] font-semibold' : 'hover:bg-[var(--bg-hover)] text-[var(--text-main)]'}`}>
                <input type="checkbox" checked={selectedIds.has(file.id)} onChange={(e) => toggleSelection(file.id, e)} onClick={(e) => e.stopPropagation()} className="cursor-pointer" />
                <FileCode className="w-3 h-3 shrink-0 opacity-50" />
                <span className="truncate">{file.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Action Button Bar */}
      <div className="p-3 bg-[var(--bg-panel)] border-t border-[var(--border-color)] flex flex-col gap-3 shrink-0">
         <div className="flex justify-between gap-2">
            <button 
              disabled={displayResults.length === 0} 
              onClick={handleSelectAll} 
              className="flex-1 py-1.5 text-xs font-medium bg-[var(--border-color)] hover:bg-[var(--bg-hover)] text-[var(--text-main)] rounded disabled:opacity-30 transition flex justify-center items-center gap-1"
            >
              <CheckSquare size={12}/> Select All
            </button>
            <button 
              disabled={selectedIds.size === 0} 
              onClick={handleUnselectAll} 
              className="flex-1 py-1.5 text-xs font-medium bg-[var(--border-color)] hover:bg-[var(--bg-hover)] text-[var(--text-main)] rounded disabled:opacity-30 transition flex justify-center items-center gap-1"
            >
              <Square size={12}/> Unselect All
            </button>
         </div>
         <button 
            disabled={selectedIds.size === 0} 
            onClick={handleDownloadZip}
            className="w-full py-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-bold rounded flex justify-center items-center gap-2 disabled:opacity-30 transition shadow-lg"
          >
            <Download size={14}/> Download ZIP ({selectedIds.size})
         </button>
      </div>

    </aside>
  );
}