import React, { useState } from 'react';
import { UploadCloud, CheckCircle, AlertCircle, Loader2, FileText, Code, X } from 'lucide-react';

export default function RightSidebar() {
  const [name, setName] = useState('');
  const [type, setType] = useState('Indicator');
  const [description, setDescription] = useState('');
  const [password, setPassword] = useState('');
  
  const [inputMode, setInputMode] = useState<'upload' | 'paste'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [pastedCode, setPastedCode] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  // Robust Drag and Drop Handlers
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleClearInput = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inputMode === 'upload') setFile(null);
    else setPastedCode('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !type) return;
    
    let fileToUpload = file;
    
    // Convert pasted code into a text file object
    if (inputMode === 'paste') {
      if (!pastedCode.trim()) {
        setStatus('error'); setMessage('Code cannot be empty.'); return;
      }
      const safeName = name.replace(/[^a-zA-Z0-9-_]/g, '_').toLowerCase();
      fileToUpload = new File([pastedCode], `${safeName}_pasted.txt`, { type: 'text/plain' });
    }

    if (!fileToUpload) return;

    setStatus('loading');
    
    const formData = new FormData();
    formData.append('name', name);
    formData.append('type', type);
    formData.append('description', description);
    if (password) formData.append('password', password);
    formData.append('file', fileToUpload);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage('Contribution submitted for review!');
        setName(''); setDescription(''); setPassword(''); setFile(null); setPastedCode('');
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error'); setMessage(data.error || 'Upload failed.');
      }
    } catch (err) {
      setStatus('error'); setMessage('A network error occurred.');
    }
  };

  return (
    <aside className="w-80 bg-[var(--bg-panel)] border-l border-[var(--border-color)] p-5 flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
      <div className="flex items-center gap-2 text-sm font-bold text-[var(--text-main)] mb-6 uppercase tracking-wider">
        <UploadCloud className="w-5 h-5 text-white"/> Contribute
      </div>

      <form className="flex flex-col flex-1 gap-4 text-sm" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1.5">
          <label className="text-[var(--text-muted)] font-medium text-xs">Strategy Name <span className="text-[var(--danger)]">*</span></label>
          <input type="text" placeholder="e.g. Adaptive RSI" required value={name} onChange={(e) => setName(e.target.value)} className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-md p-2 focus:border-[var(--accent)] outline-none text-[var(--text-main)]" />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[var(--text-muted)] font-medium text-xs">Type <span className="text-[var(--danger)]">*</span></label>
          <select required value={type} onChange={(e) => setType(e.target.value)} className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-md p-2 focus:border-[var(--accent)] outline-none text-[var(--text-main)]">
            <option>Indicator</option>
            <option>Strategy</option>
            <option>Utility</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
             <label className="text-[var(--text-muted)] font-medium text-xs">Code Input <span className="text-[var(--danger)]">*</span></label>
             <div className="flex bg-[var(--bg-main)] rounded border border-[var(--border-color)] p-0.5">
               <button type="button" onClick={() => setInputMode('upload')} className={`px-2 py-1 flex items-center gap-1 text-[10px] rounded ${inputMode === 'upload' ? 'bg-[var(--bg-panel)] text-[var(--text-main)] shadow-sm' : 'text-[var(--text-muted)] hover:text-white'}`}><FileText size={12}/> Upload</button>
               <button type="button" onClick={() => setInputMode('paste')} className={`px-2 py-1 flex items-center gap-1 text-[10px] rounded ${inputMode === 'paste' ? 'bg-[var(--bg-panel)] text-[var(--text-main)] shadow-sm' : 'text-[var(--text-muted)] hover:text-white'}`}><Code size={12}/> Paste</button>
             </div>
          </div>

          {inputMode === 'upload' ? (
            <div 
              onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition h-32 ${file ? 'border-[var(--accent)] bg-[var(--bg-hover)]' : isDragging ? 'border-[var(--accent)] bg-[var(--bg-hover)]' : 'border-[var(--border-color)] hover:border-[var(--accent)] bg-[var(--bg-main)]'}`}
            >
               <input type="file" className="hidden" id="file-upload" accept=".pine,.py,.md,.txt,.html,.js,.ts,.java,.cpp,.c,.json,.pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
               <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center text-center w-full h-full p-6 z-0">
                 {file ? (
                   <><CheckCircle className="w-6 h-6 text-green-400 mb-2" /><span className="text-[var(--text-main)] text-xs font-bold truncate w-full px-2">{file.name}</span></>
                 ) : (
                   <><UploadCloud className="w-6 h-6 text-[var(--text-muted)] mb-2" /><span className="text-[var(--text-muted)] text-xs">{isDragging ? 'Drop file here' : 'Drag & drop or browse'}</span></>
                 )}
               </label>
               {file && (
                 <button type="button" onClick={handleClearInput} className="absolute bottom-2 right-2 z-10 p-1.5 bg-red-900/20 hover:bg-red-500 text-red-500 hover:text-white rounded-md transition border border-red-900/30">
                   <X size={14} strokeWidth={2.5}/>
                 </button>
               )}
            </div>
          ) : (
            <div className="relative">
              <textarea 
                placeholder="Paste your code here..." 
                required={inputMode === 'paste'}
                value={pastedCode}
                onChange={(e) => setPastedCode(e.target.value)}
                className="w-full h-32 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-md p-2.5 focus:border-[var(--accent)] outline-none text-[var(--text-main)] resize-none font-mono text-[10px]" 
              />
              {pastedCode && (
                 <button type="button" onClick={handleClearInput} className="absolute bottom-3 right-3 z-10 p-1.5 bg-red-900/20 hover:bg-red-500 text-red-500 hover:text-white rounded-md transition border border-red-900/30 shadow-md">
                   <X size={14} strokeWidth={2.5}/>
                 </button>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1 mt-1">
          <label className="text-[var(--text-muted)] font-medium text-xs">
            Unlock Password <span className="text-[var(--text-muted)] opacity-50">(Optional)</span>
          </label>
          
          <div className="text-[10px] text-[var(--danger)] leading-snug mb-1.5 p-1.5">
            <strong>Passwords are stored in plain-text.</strong> Only provide an <strong>existing</strong> password to unlock a secured file. You cannot assign a new password to your contribution here.
          </div>
          
          <input 
            type="text" 
            placeholder="Enter existing file password..." 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-md p-2 focus:border-[var(--accent)] outline-none text-[var(--text-main)]" 
          />
        </div>

        <div className="flex flex-col gap-1.5 flex-1">
          <label className="text-[var(--text-muted)] font-medium text-xs">Description <span className="text-[var(--text-muted)] opacity-50">(Optional)</span></label>
          <textarea placeholder="Briefly explain the logic..." value={description} onChange={(e) => setDescription(e.target.value)} className="w-full h-full min-h-[60px] bg-[var(--bg-main)] border border-[var(--border-color)] rounded-md p-2 focus:border-[var(--accent)] outline-none text-[var(--text-main)] resize-none" />
        </div>

        <div className="mt-auto pt-4 border-t border-[var(--border-color)]">
          {status === 'success' && <div className="mb-4 p-3 bg-green-900/30 border border-green-800 text-green-400 text-xs rounded-md flex items-center gap-2"><CheckCircle size={16} /> {message}</div>}
          {status === 'error' && <div className="mb-4 p-3 bg-red-900/30 border border-red-800 text-red-400 text-xs rounded-md flex items-center gap-2"><AlertCircle size={16} /> {message}</div>}
          
          <button type="submit" disabled={status === 'loading'} className="w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:bg-[var(--bg-hover)] disabled:text-[var(--text-muted)] disabled:cursor-not-allowed py-3 rounded-md font-bold text-white transition shadow-lg text-sm uppercase tracking-wider flex justify-center items-center gap-2">
            {status === 'loading' ? <><Loader2 className="w-4 h-4 animate-spin"/> Uploading...</> : 'Contribute to Library'}
          </button>
        </div>
      </form>
    </aside>
  );
}