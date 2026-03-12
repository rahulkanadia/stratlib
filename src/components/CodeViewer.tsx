import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, Copy, Download, X } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { MetadataItem } from '@/types';

interface CodeViewerProps {
  selectedFile: MetadataItem | null;
  fileContent: string;
  setSelectedFile: (file: MetadataItem | null) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  wordCloud: Array<{word: string, count: number, color: string, size: string}>;
  setActiveFilter: (filter: string) => void;
  setQuery: (query: string) => void;
}

export default function CodeViewer({ selectedFile, fileContent, setSelectedFile, isSidebarOpen, setIsSidebarOpen, wordCloud, setActiveFilter, setQuery }: CodeViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(fileContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="flex-1 flex flex-col bg-[var(--bg-main)] overflow-hidden relative min-w-0">
      
      {/* Sidebar Toggle */}
      <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="absolute left-0 top-1/2 -translate-y-1/2 bg-[var(--bg-panel)] border-y border-r border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] h-16 w-5 flex items-center justify-center rounded-r-md z-10 transition">
        {isSidebarOpen ? <ChevronLeft size={16}/> : <ChevronRight size={16}/>}
      </button>

      {selectedFile ? (
        <div className="flex flex-col h-full w-full pl-5">
          
          {/* --- STRICT NO-SCROLL HEADER --- */}
          <div className="p-3 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--bg-main)] shrink-0 min-w-0">
            
            {/* Left side: Name, Tag, Divider, Description */}
            <div className="flex items-center gap-3 flex-1 min-w-0 pr-4">
              <h2 className="text-xl font-bold text-[var(--text-main)] truncate shrink-0 max-w-[30%]">
                {selectedFile.name}
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--bg-panel)] text-[var(--accent)] border border-[var(--border-color)] uppercase tracking-wider shrink-0">
                {selectedFile.path.endsWith('.py') ? 'Python' : 'PineScript'}
              </span>
              
              <div className="w-px h-6 bg-[var(--border-color)] shrink-0 mx-1"></div>
              
              <p className="text-xs text-[var(--text-muted)] truncate flex-1 min-w-0">
                {selectedFile.description || "No description provided."}
              </p>
            </div>
            
            {/* Right side: Divider, Actions, Close */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-px h-6 bg-[var(--border-color)] mx-2"></div>
              
              <button onClick={handleCopy} className="bg-[var(--bg-panel)] hover:bg-[var(--bg-hover)] border border-[var(--border-color)] px-3 py-1.5 rounded-md text-xs flex items-center gap-1.5 text-[var(--text-main)] transition">
                {copied ? <Check size={14} className="text-green-400"/> : <Copy size={14} />} Copy
              </button>
              
              <a href={selectedFile.path} download className="bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded-md text-xs flex items-center gap-1.5 transition">
                <Download size={14} /> Save TXT
              </a>
              
              {/* Visible Faint Red Close Button */}
              <button onClick={() => setSelectedFile(null)} className="ml-2 text-red-400 hover:text-white p-1.5 bg-red-900/10 hover:bg-red-500 border border-red-900/30 rounded-md transition flex items-center justify-center">
                <X size={16} strokeWidth={2.5} />
              </button>
            </div>

          </div>
          
          {/* --- CODE VIEWER BODY --- */}
          <div className="flex-1 overflow-auto bg-[var(--bg-main)] border-b-[12px] border-[var(--bg-panel)]">
            <SyntaxHighlighter 
              language={selectedFile.path.endsWith('.py') ? 'python' : 'javascript'} 
              style={vscDarkPlus} 
              customStyle={{ 
                margin: 0, 
                padding: '2rem', 
                background: 'transparent', 
                fontSize: '13px', 
                fontFamily: 'var(--font-code)',
                overflowX: 'auto' // restricts scroll strictly to the code block
              }} 
              showLineNumbers={true}
            >
              {fileContent || "Loading content..."}
            </SyntaxHighlighter>
          </div>
        </div>
      ) : (
        
        /* --- WORD CLOUD STATE --- */
        <div className="flex-1 flex flex-col items-center justify-center p-10 bg-[var(--bg-main)]">
          <h3 className="text-[var(--text-muted)] mb-10 text-sm font-bold tracking-widest uppercase">Word Cloud / Quick Filters</h3>
          
          <div className="flex flex-wrap justify-center gap-4 max-w-5xl items-center align-middle">
            {wordCloud.map((item, i) => (
              <span 
                key={i} 
                onClick={() => { setActiveFilter(item.word); setQuery(""); }} 
                className={`${item.size} ${item.color} cursor-pointer border border-[var(--border-color)] bg-[var(--bg-panel)] rounded-xl px-5 py-2.5 hover:scale-105 hover:border-[var(--accent)] transition-all shadow-sm`}
              >
                {item.word}
              </span>
            ))}
          </div>

          <p className="mt-16 text-sm text-[var(--text-muted)]">Select a term above, or pick a file from the sidebar to view code.</p>
        </div>
      )}
    </section>
  );
}
