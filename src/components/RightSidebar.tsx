// src/components/RightSidebar.tsx
import React, { useState } from 'react';
import { UploadCloud, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function RightSidebar() {
  const [name, setName] = useState('');
  const [type, setType] = useState('Indicator');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !name || !type) return;

    setStatus('loading');
    
    const formData = new FormData();
    formData.append('name', name);
    formData.append('type', type);
    formData.append('description', description);
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage('Contribution submitted for review!');
        // Reset form
        setName('');
        setDescription('');
        setFile(null);
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Upload failed.');
      }
    } catch (err) {
      setStatus('error');
      setMessage('A network error occurred.');
    }
  };

  return (
    <aside className="w-80 bg-[var(--bg-panel)] border-l border-[var(--border-color)] p-5 flex flex-col shrink-0 overflow-y-auto">
      <div className="flex items-center gap-2 text-sm font-bold text-[var(--text-main)] mb-6 uppercase tracking-wider">
        <UploadCloud className="w-5 h-5 text-white"/> Contribute
      </div>

      <form className="flex flex-col flex-1 gap-5 text-sm" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1.5">
          <label className="text-[var(--text-muted)] font-medium text-xs">
            Strategy Name <span className="text-[var(--danger)]">*</span>
          </label>
          <input 
            type="text" 
            placeholder="e.g. Adaptive RSI" 
            required 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-md p-2.5 focus:border-[var(--accent)] outline-none text-[var(--text-main)]" 
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[var(--text-muted)] font-medium text-xs">
            Type <span className="text-[var(--danger)]">*</span>
          </label>
          <select 
            required 
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-md p-2.5 focus:border-[var(--accent)] outline-none text-[var(--text-main)]"
          >
            <option>Indicator</option>
            <option>Strategy</option>
            <option>Utility</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[var(--text-muted)] font-medium text-xs">
            Upload Code <span className="text-[var(--danger)]">*</span>
          </label>
          <div className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition h-32 ${file ? 'border-[var(--accent)] bg-[var(--bg-hover)]' : 'border-[var(--border-color)] hover:border-[var(--accent)] bg-[var(--bg-main)]'}`}>
             <input 
               type="file" 
               required 
               className="hidden" 
               id="file-upload" 
               accept=".pine,.py,.md,.txt" 
               onChange={(e) => setFile(e.target.files?.[0] || null)}
             />
             <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center text-center w-full">
               {file ? (
                 <>
                   <CheckCircle className="w-6 h-6 text-green-400 mb-2" />
                   <span className="text-[var(--text-main)] text-xs font-bold truncate w-full px-2">{file.name}</span>
                 </>
               ) : (
                 <>
                   <UploadCloud className="w-6 h-6 text-[var(--text-muted)] mb-2" />
                   <span className="text-[var(--text-muted)] text-xs">Drag and drop or browse to upload</span>
                 </>
               )}
             </label>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 flex-1">
          <label className="text-[var(--text-muted)] font-medium text-xs">
            Description <span className="text-[var(--text-muted)] opacity-50">(Optional)</span>
          </label>
          <textarea 
            placeholder="Briefly explain the logic..." 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full h-full min-h-[100px] bg-[var(--bg-main)] border border-[var(--border-color)] rounded-md p-2.5 focus:border-[var(--accent)] outline-none text-[var(--text-main)] resize-none" 
          />
        </div>

        <div className="mt-auto pt-4 border-t border-[var(--border-color)]">
          {status === 'success' && (
            <div className="mb-4 p-3 bg-green-900/30 border border-green-800 text-green-400 text-xs rounded-md flex items-center gap-2">
              <CheckCircle size={16} /> {message}
            </div>
          )}
          {status === 'error' && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-800 text-red-400 text-xs rounded-md flex items-center gap-2">
              <AlertCircle size={16} /> {message}
            </div>
          )}
          
          <p className="text-xs text-[var(--text-muted)] mb-4 leading-relaxed italic text-center">
            Your contributions will be indexed and searchable after moderation to avoid spam.
          </p>
          
          <button 
            type="submit" 
            disabled={status === 'loading'}
            className="w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:bg-[var(--bg-hover)] disabled:text-[var(--text-muted)] disabled:cursor-not-allowed py-3 rounded-md font-bold text-white transition shadow-lg text-sm uppercase tracking-wider flex justify-center items-center gap-2"
          >
            {status === 'loading' ? <><Loader2 className="w-4 h-4 animate-spin"/> Uploading...</> : 'Contribute to Library'}
          </button>
        </div>
      </form>
    </aside>
  );
}