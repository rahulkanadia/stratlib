"use client";

import React, { useState, useMemo } from 'react';
import { Search, Menu, Code2, Library, UploadCloud, X, Share, Copy, Check, CheckCircle, ChevronLeft, FileCode, AlertCircle, Loader2 } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Fuse from 'fuse.js';
import { MetadataItem } from '@/types';
import rawMetadata from '@/data/metadata.json';

const metadataList = rawMetadata as MetadataItem[];

interface MobileAppProps {
  wordCloud?: Array<{word: string, count: number, color: string, size: string}>;
}

export default function MobileApp({ wordCloud = [] }: MobileAppProps) {
  // ==========================================
  // SECTION 1: STATE MANAGEMENT
  // ==========================================
  const [activeTab, setActiveTab] = useState<number>(1); // 0=Code, 1=Library, 2=Contribute
  const [selectedFile, setSelectedFile] = useState<MetadataItem | null>(null);
  const [fileContent, setFileContent] = useState<string>("");
  
  // Modal Overlays State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isTreeOpen, setIsTreeOpen] = useState(false);
  
  // Search State
  const [query, setQuery] = useState("");
  const [searchTab, setSearchTab] = useState<'code' | 'filters'>('code');
  const [copied, setCopied] = useState(false);

  // Contribute Form State
  const [name, setName] = useState('');
  const [type, setType] = useState('Indicator');
  const [description, setDescription] = useState('');
  const [password, setPassword] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  // ==========================================
  // SECTION 2: LOGIC & HANDLERS
  // ==========================================
  const fuse = useMemo(() => new Fuse(metadataList, { keys: ['name', 'description', 'content'], threshold: 0.3 }), []);
  const searchResults = useMemo(() => query ? fuse.search(query).map(r => r.item) : metadataList, [query, fuse]);
  const filterResults = useMemo(() => {
    if (!query || !wordCloud) return wordCloud || [];
    return wordCloud.filter(w => w.word.toLowerCase().includes(query.toLowerCase()));
  }, [query, wordCloud]);

  const openFile = async (fileItem: MetadataItem) => {
    setSelectedFile(fileItem);
    setIsSearchOpen(false);
    setIsTreeOpen(false);
    setActiveTab(0);
    try {
      const res = await fetch(fileItem.path);
      const text = await res.text();
      setFileContent(text);
    } catch {
      setFileContent("Error loading file content.");
    }
  };

  const handleShare = async () => {
    if (navigator.share && selectedFile) {
      try {
        await navigator.share({
          title: selectedFile.name,
          text: selectedFile.description || "Check out this script on StratLib",
          url: window.location.href, 
        });
      } catch (err) { console.log("Share cancelled", err); }
    } else {
      alert("Native sharing is not supported on this device.");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(fileContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

    const handleContributeSubmit = async (e: React.FormEvent | React.MouseEvent) => {
        e.preventDefault();
        
        // Explicit validation feedback
        if (!name || !type || !file) {
        setStatus('error'); 
        setMessage('Please fill in all required fields (Name, Type, and File).');
        setTimeout(() => setStatus('idle'), 4000);
        return;
        }

        setStatus('loading');
        const formData = new FormData();
        formData.append('name', name);
        formData.append('type', type);
        formData.append('description', description);
        if (password) formData.append('password', password);
        formData.append('file', file);

        try {
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (res.ok) {
            setStatus('success'); setMessage('Contribution submitted!');
            setName(''); setDescription(''); setPassword(''); setFile(null);
            setTimeout(() => setStatus('idle'), 5000);
        } else {
            setStatus('error'); setMessage(data.error || 'Upload failed.');
        }
        } catch (err) {
        setStatus('error'); setMessage('A network error occurred.');
        }
    };

  // Utility to handle horizontal sliding between main tabs
  const getTabClass = (tabIndex: number) => {
    if (tabIndex === activeTab) return 'translate-x-0 opacity-100 z-10';
    if (tabIndex < activeTab) return '-translate-x-full opacity-0 z-0 pointer-events-none';
    return 'translate-x-full opacity-0 z-0 pointer-events-none';
  };

  // ==========================================
  // SECTION 3: RENDER
  // ==========================================
  return (
    // LAYER 1: THE SHELL (Strict 100dvh, no scrolling allowed at the root)
    <div className="flex flex-col h-[100dvh] w-full bg-[var(--bg-main)] text-[var(--text-main)] overflow-hidden font-ui relative">
      
    {/* 1A. STATIC HEADER */}
      <header 
        onClick={() => { setIsSearchOpen(false); setIsTreeOpen(false); }}
        className="flex justify-between items-center h-16 px-4 bg-[var(--bg-panel)] border-b border-[var(--border-color)] shrink-0 z-20 shadow-sm cursor-pointer"
      >
        
        {/* Simplified Stat Block */}
        <div className="flex flex-col items-center justify-center shrink-0">
          <span className="text-2xl font-black text-[var(--text-main)] leading-none tracking-tighter">
            {metadataList.length}
          </span>
          <span className="text-[8px] text-[var(--text-muted)] uppercase tracking-widest mt-1">
            Codebases
          </span>
        </div>

        <h1 className="text-xl font-heading font-extrabold tracking-wide absolute left-1/2 -translate-x-1/2">
          StratLib
        </h1>

        <div className="w-16 flex justify-end">
          {(activeTab === 0 || activeTab === 1) && (
            <button onClick={() => setActiveTab(2)} className="flex flex-col items-center justify-center py-1.5 px-3 border border-[var(--border-color)] rounded-lg bg-[var(--bg-hover)] text-[var(--accent)] active:scale-95 transition-transform shadow-sm">
              <UploadCloud size={16}/>
              <span className="text-[9px] font-bold mt-0.5 tracking-wide">Contribute</span>
            </button>
          )}
        </div>
      </header>

      {/* 1B. MIDDLE CONTENT AREA (Holds the sliding tabs) */}
      <main className="flex-1 relative overflow-hidden">
        
        {/* ========================================== */}
        {/* LAYER 2: THE TABS                          */}
        {/* ========================================== */}

        {/* TAB 0: CODE VIEWER */}
        <div className={`absolute inset-0 flex flex-col bg-[var(--bg-main)] transition-transform duration-300 ease-in-out ${getTabClass(0)}`}>
          {selectedFile ? (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              <div className="p-5 border-b border-[var(--border-color)] bg-[var(--bg-panel)] shrink-0 shadow-sm flex flex-col gap-2">
                <h2 className="text-xl font-bold leading-tight break-words">{selectedFile.name}</h2>
                <p className="text-sm text-[var(--text-muted)] line-clamp-3 leading-relaxed break-words">{selectedFile.description || "No description provided."}</p>
                <div className="self-start mt-1">
                  <span className="text-[10px] px-2 py-1 rounded bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--accent)] font-bold uppercase tracking-wider">
                    {selectedFile.path.endsWith('.py') ? 'Python' : 'PineScript'}
                  </span>
                </div>
              </div>
              <div className="flex-1 overflow-auto bg-[#1e1e1e] pb-40">
                <SyntaxHighlighter language={selectedFile.path.endsWith('.py') ? 'python' : 'javascript'} style={vscDarkPlus} customStyle={{ margin: 0, padding: '1.5rem', fontSize: '13px', background: 'transparent' }}>
                  {fileContent || "Loading..."}
                </SyntaxHighlighter>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-[var(--text-muted)] pb-40">
              <Code2 size={48} className="mb-4 opacity-20"/>
              <p className="text-sm">No script selected.</p>
            </div>
          )}
        </div>

        {/* TAB 1: LIBRARY (WORD CLOUD) */}
        <div className={`absolute inset-0 flex flex-col bg-[var(--bg-main)] overflow-y-auto pb-40 transition-transform duration-300 ease-in-out ${getTabClass(1)}`}>
          <div className="p-6 flex flex-col items-center pt-8">
            <h3 className="text-[11px] text-[var(--text-muted)] font-bold uppercase tracking-widest mb-6">Quick Filters</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {wordCloud && wordCloud.length > 0 ? (
                wordCloud.map((item, i) => (
                  <button key={i} onClick={() => { setQuery(item.word); setIsSearchOpen(true); }} className={`px-4 py-2.5 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] shadow-sm ${item.size} ${item.color} active:scale-95 transition-transform`}>
                    {item.word}
                  </button>
                ))
              ) : (
                <div className="flex items-center gap-2 text-[var(--text-muted)] text-sm animate-pulse mt-4">
                  <Loader2 className="animate-spin" size={16}/> Loading filters...
                </div>
              )}
            </div>
          </div>
        </div>

{/* --- TAB 2: CONTRIBUTE (FORM) --- */}
        <div className={`absolute inset-0 flex flex-col bg-[var(--bg-main)] transition-transform duration-300 ease-in-out ${getTabClass(2)}`}>
           <form className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col pb-36 relative">
              
              <div className="p-5 bg-[var(--bg-panel)] border-b border-[var(--border-color)] shrink-0">
                <h2 className="text-lg font-bold flex items-center gap-2"><UploadCloud className="text-[var(--accent)]"/> Contribute Code</h2>
                <p className="text-xs text-[var(--text-muted)] mt-1">Files are securely pushed to the moderation queue.</p>
              </div>

              {/* ALERTS (Smooth slide down/up animation) */}
              <div 
                className={`sticky top-0 z-30 transition-all duration-300 ease-in-out origin-top flex flex-col justify-center overflow-hidden bg-[var(--bg-main)]/95 backdrop-blur-md border-[var(--border-color)] shadow-sm ${
                  (status === 'success' || status === 'error') 
                    ? 'max-h-24 opacity-100 translate-y-0 py-3 px-5 border-b' 
                    : 'max-h-0 opacity-0 -translate-y-4 py-0 px-5 border-b-0'
                }`}
              >
                {status === 'success' && <div className="p-3 bg-green-900/30 border border-green-800 text-green-400 text-xs rounded-lg flex items-center gap-2"><Check size={16} /> {message}</div>}
                {status === 'error' && <div className="p-3 bg-red-900/30 border border-red-800 text-red-400 text-xs rounded-lg flex items-center gap-2"><AlertCircle size={16} /> {message}</div>}
              </div>

              <div className="flex flex-col gap-5 px-5 pt-5 flex-1 w-full max-w-full min-w-0">
                
                {/* Strategy Name */}
                <div className="flex flex-col gap-1.5 min-w-0">
                   <label className="text-xs font-bold text-[var(--text-muted)] ml-1">Strategy Name <span className="text-[var(--danger)]">*</span></label>
                   <input required type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Advanced RSI Divergence..." className="w-full min-w-0 bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-xl p-4 text-sm focus:border-[var(--accent)] outline-none shadow-sm" />
                </div>

                {/* Category */}
                <div className="flex flex-col gap-1.5 min-w-0">
                   <label className="text-xs font-bold text-[var(--text-muted)] ml-1">Category <span className="text-[var(--danger)]">*</span></label>
                   <select required value={type} onChange={e => setType(e.target.value)} className="w-full min-w-0 bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-xl p-4 text-sm focus:border-[var(--accent)] outline-none shadow-sm">
                     <option>Indicator</option><option>Strategy</option><option>Utility</option>
                   </select>
                </div>

                {/* Attach File */}
                <div className="flex flex-col gap-1.5 min-w-0">
                   <label className="text-xs font-bold text-[var(--text-muted)] ml-1">Attach File <span className="text-[var(--danger)]">*</span></label>
                   <label className="relative flex flex-col items-center justify-center bg-[var(--bg-panel)] border-2 border-[var(--border-color)] border-dashed rounded-xl p-6 h-32 text-center active:bg-[var(--bg-hover)] transition-colors cursor-pointer">
                      <input type="file" required className="hidden" accept=".pine,.py,.md,.txt,.html,.js,.ts,.java,.cpp,.c,.json,.pdf" onChange={e => setFile(e.target.files?.[0] || null)} />
                      {file ? (
                        <>
                          <CheckCircle className="text-green-400 mb-2" size={24}/>
                          <span className="font-bold text-sm truncate w-full px-2">{file.name}</span>
                          <button type="button" onClick={(e) => { e.preventDefault(); setFile(null); }} className="absolute bottom-2 right-2 p-2 bg-red-900/30 text-red-500 hover:bg-red-500 hover:text-white transition-colors rounded-lg">
                            <X size={16} strokeWidth={2.5}/>
                          </button>
                        </>
                      ) : (
                        <><UploadCloud className="text-[var(--text-muted)] mb-2" size={24}/><span className="text-sm text-[var(--text-muted)]">Tap to browse files</span></>
                      )}
                   </label>
                </div>

                {/* Unlock Password */}
                <div className="flex flex-col gap-1.5 min-w-0">
                   <label className="text-xs font-bold text-[var(--text-muted)] ml-1">Unlock Password <span className="opacity-50">(Optional)</span></label>
                   <p className="text-[10px] text-[var(--danger)] bg-red-900/10 p-2 rounded mb-1">Stored in plain-text. Only provide an <em>existing</em> file password.</p>
                   <input type="text" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter existing password..." className="w-full min-w-0 bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-xl p-4 text-sm focus:border-[var(--accent)] outline-none shadow-sm" />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5 min-w-0">
                   <label className="text-xs font-bold text-[var(--text-muted)] ml-1">Description <span className="opacity-50">(Optional)</span></label>
                   <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Briefly explain the logic..." className="w-full min-w-0 min-h-[120px] bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-xl p-4 text-sm focus:border-[var(--accent)] outline-none resize-none shadow-sm"></textarea>
                </div>
              </div>
           </form>

           {/* Sticky Submit Button */}
           <div className="absolute bottom-6 left-4 right-4 z-20">
              <button
                type="button"
                onClick={handleContributeSubmit}
                onTouchStart={() => {}} 
                disabled={status === 'loading'}
                className="w-full bg-[var(--accent)] active:bg-blue-600 active:scale-[0.94] transition-all duration-150 disabled:opacity-50 py-4 rounded-xl font-bold text-white shadow-[0_8px_30px_rgba(0,0,0,0.5)] flex justify-center items-center gap-2 touch-manipulation select-none"
              >
                 {status === 'loading' ? <><Loader2 className="animate-spin" size={18}/> Uploading...</> : 'Submit Contribution'}
              </button>
           </div>
        </div>

        {/* ========================================== */}
        {/* LAYER 3: UNIFIED FLOATING CONTROLS         */}
        {/* ========================================== */}
        {/* By placing this outside the tabs, it anchors cleanly to the bottom of the <main> area. */}
        <div className={`absolute bottom-6 left-4 right-4 flex flex-col gap-4 z-30 transition-opacity duration-300 ${(activeTab === 0 || activeTab === 1) ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
           
           {/* Row 1: Share & Copy (Only visible if we are in Code tab AND a file is open) */}
           <div className={`flex justify-between w-full transition-opacity duration-300 ${activeTab === 0 && selectedFile ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <button onClick={handleShare} className="p-4 rounded-full shadow-2xl flex items-center justify-center active:scale-95 bg-[var(--accent)] text-white">
                <Share size={20}/>
              </button>
              <button onClick={handleCopy} className={`p-4 rounded-full shadow-2xl flex items-center justify-center active:scale-95 transition-colors ${copied ? 'bg-green-500 text-white' : 'bg-[var(--accent)] text-white'}`}>
                {copied ? <Check size={20}/> : <Copy size={20}/>}
              </button>
           </div>
           
           {/* Row 2: Search & Menu */}
           <div className="flex gap-3">
              <button onClick={() => setIsTreeOpen(true)} className="p-4 bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.4)] active:scale-95 transition-transform">
                <Menu size={22}/>
              </button>
              <button onClick={() => setIsSearchOpen(true)} className="flex-1 bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.4)] flex items-center px-5 gap-3 text-[var(--text-muted)] active:scale-95 transition-transform">
                <Search size={20}/>
                <span className="text-sm font-medium">Search library...</span>
              </button>
           </div>
        </div>

      </main>

      {/* 1C. STATIC BOTTOM NAVIGATION BAR */}
      <nav className="flex justify-around items-center h-[68px] bg-[var(--bg-panel)] border-t border-[var(--border-color)] shrink-0 z-20 pb-safe">
        <button onClick={() => setActiveTab(0)} className={`flex flex-col items-center gap-1.5 w-1/3 transition-colors ${activeTab === 0 ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}`}>
          <Code2 size={22} className={activeTab === 0 ? 'stroke-[2.5px]' : ''}/>
          <span className="text-[10px] font-bold tracking-wide">Code Viewer</span>
        </button>
        <button onClick={() => setActiveTab(1)} className={`flex flex-col items-center gap-1.5 w-1/3 transition-colors ${activeTab === 1 ? 'text-[var(--text-main)]' : 'text-[var(--text-muted)]'}`}>
          <Library size={22} className={activeTab === 1 ? 'stroke-[2.5px]' : ''}/>
          <span className="text-[10px] font-bold tracking-wide">Library</span>
        </button>
        <button onClick={() => setActiveTab(2)} className={`flex flex-col items-center gap-1.5 w-1/3 transition-colors ${activeTab === 2 ? 'text-[var(--text-main)]' : 'text-[var(--text-muted)]'}`}>
          <UploadCloud size={22} className={activeTab === 2 ? 'stroke-[2.5px]' : ''}/>
          <span className="text-[10px] font-bold tracking-wide">Contribute</span>
        </button>
      </nav>

      {/* ========================================== */}
      {/* LAYER 4: MODALS (FIXED TO VIEWPORT)        */}
      {/* ========================================== */}
      
      {/* SEARCH FULLSCREEN MODAL */}
      <div className={`fixed top-[72px] bottom-0 left-0 right-0 z-[100] bg-[var(--bg-main)] rounded-t-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col transition-transform duration-300 ease-in-out ${isSearchOpen ? 'translate-y-0' : 'translate-y-full pointer-events-none'}`}>
         {/* Safe Area Header */}
         <div className="flex items-center gap-2 p-3 pt-safe border-b border-[var(--border-color)] bg-[var(--bg-panel)] shrink-0">
            <button onClick={() => setIsSearchOpen(false)} className="p-2 text-[var(--text-muted)] active:scale-95"><ChevronLeft size={24}/></button>
            <input autoFocus type="text" placeholder="Search logic, names..." value={query} onChange={(e) => setQuery(e.target.value)} className="flex-1 bg-transparent text-base outline-none placeholder:text-[var(--text-muted)]" />
            {query && <button onClick={() => setQuery('')} className="p-2 text-[var(--text-muted)]"><X size={20}/></button>}
         </div>
         
         <div className="flex border-b border-[var(--border-color)] bg-[var(--bg-panel)] shrink-0">
           <button onClick={() => setSearchTab('code')} className={`flex-1 py-3 text-xs font-bold transition-colors ${searchTab === 'code' ? 'text-[var(--accent)] border-b-2 border-[var(--accent)]' : 'text-[var(--text-muted)]'}`}>Codebases</button>
           <button onClick={() => setSearchTab('filters')} className={`flex-1 py-3 text-xs font-bold transition-colors ${searchTab === 'filters' ? 'text-[var(--accent)] border-b-2 border-[var(--accent)]' : 'text-[var(--text-muted)]'}`}>Quick Filters</button>
         </div>

         <div className="flex-1 overflow-y-auto bg-[var(--bg-main)]">
            {searchTab === 'code' ? (
              searchResults.map(file => (
                <div key={file.id} onClick={() => openFile(file)} className="p-4 border-b border-[var(--border-color)] flex flex-col gap-1.5 active:bg-[var(--bg-hover)]">
                  <div className="flex justify-between items-center"><span className="text-sm font-bold truncate pr-4">{file.name}</span><span className="text-[10px] border border-[var(--border-color)] px-1.5 py-0.5 rounded text-[var(--accent)] font-bold">{file.path.endsWith('.py')?'PY':'PINE'}</span></div>
                  <span className="text-xs text-[var(--text-muted)] line-clamp-2">{file.description}</span>
                </div>
              ))
            ) : (
              <div className="p-5 flex flex-wrap gap-2">
                {filterResults.length > 0 ? filterResults.map(item => (
                  <button key={item.word} onClick={() => { setQuery(item.word); setSearchTab('code'); }} className="px-4 py-2 bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-xl text-sm font-bold shadow-sm active:scale-95">
                    {item.word}
                  </button>
                )) : <p className="text-xs text-[var(--text-muted)] w-full text-center mt-4">No matching filters found.</p>}
              </div>
            )}
         </div>
      </div>

      {/* FULL LIBRARY MODAL */}
      <div className={`fixed top-[72px] bottom-0 left-0 right-0 z-[100] bg-[var(--bg-main)] rounded-t-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col transition-transform duration-300 ease-in-out ${isTreeOpen ? 'translate-y-0' : 'translate-y-full pointer-events-none'}`}>
           <div className="flex items-center justify-between p-4 pt-safe border-b border-[var(--border-color)] bg-[var(--bg-panel)] shrink-0">
             <h2 className="text-sm font-bold">Full Library ({metadataList.length})</h2>
             <button onClick={() => setIsTreeOpen(false)} className="p-2 bg-[var(--bg-hover)] rounded-full active:scale-95"><X size={18}/></button>
           </div>
           <div className="flex-1 overflow-y-auto">
             {metadataList.map(file => (
                <div key={file.id} onClick={() => openFile(file)} className="flex items-center gap-3 p-4 border-b border-[var(--border-color)] active:bg-[var(--bg-hover)]">
                  <FileCode size={18} className="text-[var(--text-muted)] shrink-0"/>
                  <span className="text-sm truncate">{file.name}</span>
                </div>
             ))}
           </div>
      </div>

    </div>
  );
}