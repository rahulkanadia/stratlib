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

      {/* Right: Quick Filters (Exact width of Right Sidebar: w-80/320px) */}
      <div className="w-80 flex items-center px-5 shrink-0 justify-start">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[var(--text-muted)] font-medium mr-1">Filters:</span>
          {['PineScript', 'Python'].map(tag => (
            <button 
              key={tag}
              onClick={() => setActiveFilter(activeFilter === tag ? null : tag)}
              className={`px-3 py-1.5 rounded-full border transition ${
                activeFilter === tag 
                  ? 'bg-[var(--accent)] border-[var(--accent)] text-white font-bold shadow-md' 
                  : 'border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)]'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

    </header>
  );
}