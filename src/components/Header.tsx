import React from 'react';
import { Search, X } from 'lucide-react';

interface HeaderProps {
  totalFiles: number;
  query: string;
  setQuery: (q: string) => void;
  activeFilter: string | null;
  setActiveFilter: (f: string | null) => void;
}

export default function Header({ totalFiles, query, setQuery, activeFilter, setActiveFilter }: HeaderProps) {
  return (
    <header className="flex-none bg-[var(--bg-panel)] border-b border-[var(--border-color)] h-16 flex items-center shadow-md z-20">
      
      {/* Left: Branding & Stats (Exact width of Left Sidebar: w-80/320px) */}
      <div className="w-80 flex items-center justify-between px-5 shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-extrabold text-[var(--text-main)] tracking-wide" style={{ fontFamily: 'var(--font-heading)' }}>
            StratLib
          </h1>
          <div className="text-[12px] text-[var(--text-muted)] mt-1 leading-tight pl-3">
            hosting <br/> <span className="font-bold text-[var(--text-main)] text-xs">{totalFiles}</span> codebases
          </div>
        </div>
      </div>

      {/* Left Divider */}
      <div className="h-8 w-px bg-[var(--border-color)] shrink-0"></div>

      {/* Center: Search Bar */}
      <div className="flex-1 flex justify-center px-8 min-w-0">
        <div className="relative w-full max-w-4xl">
          <Search className="absolute left-4 top-2.5 text-[var(--text-muted)] w-4 h-4" />
          <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="search for indicators, strategies, assets, snippets, et al ..."
            className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] text-sm text-[var(--text-main)] rounded-full py-2 pl-11 pr-11 focus:outline-none focus:border-[var(--accent)] transition"
          />
          {query && (
            <button onClick={() => setQuery("")} className="absolute right-4 top-2.5">
              <X className="w-4 h-4 text-[var(--text-muted)] hover:text-[var(--text-main)]" />
            </button>
          )}
        </div>
      </div>

      {/* Right Divider */}
      <div className="h-8 w-px bg-[var(--border-color)] shrink-0"></div>

      {/* Right: API Usage Blob (Width of Right Sidebar: w-80/320px) */}
      <div className="w-80 flex flex-col justify-center px-5 shrink-0 min-w-0">
        <div className="flex justify-center items-baseline gap-1 mb-1 w-full overflow-hidden">
          <span className="text-[12px] text-[var(--text-muted)] font-bold uppercase tracking-widest shrink-0">
            CLI
          </span>
          <span className="text-[10px] text-[var(--text-muted)] opacity-75 truncate">
            | curl -s (for Linux/MacOS) or irm (for PowerShell)
          </span>
        </div>
        <div className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-md p-1.5 flex items-center w-full overflow-hidden cursor-text">
          <code className="text-[10px] text-white font-mono truncate w-full">
            "https://stratlib.vercel.app/api/fetch?query=moving+average"
          </code>
        </div>
      </div>

    </header>
  );
}