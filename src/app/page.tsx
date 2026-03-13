
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Fuse from 'fuse.js';

import Header from '@/components/Header';
import LeftSidebar from '@/components/LeftSidebar';
import CodeViewer from '@/components/CodeViewer';
import RightSidebar from '@/components/RightSidebar';
import MobileApp from '@/components/MobileApp';
import { MetadataItem } from '@/types';
import rawMetadata from '@/data/metadata.json';

const metadataList = rawMetadata as MetadataItem[];

export default function StratLibIDE() {
  // --- DESKTOP STATE ---
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<MetadataItem | null>(null);
  const [fileContent, setFileContent] = useState<string>("");
  
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [history, setHistory] = useState<MetadataItem[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const [wordCloud, setWordCloud] = useState<Array<{word: string, count: number, color: string, size: string}>>([]);

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem('stratlib_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  // Fetch and Parse CSV for Word Cloud
  useEffect(() => {
    fetch('/word_frequencies.csv')
      .then(res => {
        if (!res.ok) throw new Error("CSV not found");
        return res.text();
      })
      .then(text => {
        const rows = text.split(/\r?\n/).slice(1).filter(r => r.trim());
        const colors = ['text-blue-400', 'text-purple-400', 'text-emerald-400', 'text-amber-400', 'text-rose-400', 'text-cyan-400'];
        
        const parsed = rows.slice(0, 40).map((r, i) => {
          const [word, count] = r.split(',');
          return {
            word,
            count: parseInt(count, 10),
            color: colors[i % colors.length],
            size: i < 5 ? 'text-4xl font-black' : i < 15 ? 'text-2xl font-bold' : 'text-base font-medium'
          };
        });
        setWordCloud(parsed);
      })
      .catch(() => {
        const fallbacks = ['PineScript', 'Python', 'Strategy', 'Indicator', 'RSI', 'MACD', 'EMA', 'VWAP'];
        const colors = ['text-blue-400', 'text-purple-400', 'text-emerald-400', 'text-amber-400', 'text-rose-400', 'text-cyan-400'];
        setWordCloud(fallbacks.map((word, i) => ({ word, count: 1, color: colors[i % colors.length], size: 'text-4xl font-black' })));
      });
  }, []);

  // Search Engine (Desktop)
  const fuse = useMemo(() => new Fuse(metadataList, { keys: ['name', 'content', 'description'], threshold: 0.3 }), []);

  const displayResults = useMemo(() => {
    let results = query ? fuse.search(query).map(r => r.item) : metadataList;
    if (activeFilter) {
      results = results.filter((f) => 
        f.content?.toLowerCase().includes(activeFilter.toLowerCase()) || 
        f.name.toLowerCase().includes(activeFilter.toLowerCase())
      );
    }
    return results;
  }, [query, activeFilter, fuse]);

  // Escape to clear search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') setQuery(""); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers (Desktop)
  const handleSelectFile = (file: MetadataItem) => {
    setSelectedFile(file);
    fetch(file.path).then(res => res.text()).then(text => setFileContent(text)).catch(() => setFileContent("Error loading file content."));
    setHistory(prev => {
      const newHist = [file, ...prev.filter(f => f.id !== file.id)].slice(0, 10);
      localStorage.setItem('stratlib_history', JSON.stringify(newHist));
      return newHist;
    });
  };

  const toggleSelection = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    const newSet = new Set(selectedIds);
    displayResults.forEach(f => newSet.add(f.id));
    setSelectedIds(newSet);
  };

  const handleUnselectAll = () => setSelectedIds(new Set());

  const handleDownloadZip = async () => {
    if (selectedIds.size === 0) return;
    try {
      const JSZip = (await import('jszip')).default;
      const { saveAs } = await import('file-saver');
      const zip = new JSZip();
      
      for (const id of Array.from(selectedIds)) {
        const file = metadataList.find(m => m.id === id);
        if (file) {
          const res = await fetch(file.path);
          const text = await res.text();
          zip.file(`${file.name}.txt`, text);
        }
      }
      const blob = await zip.generateAsync({ type: 'blob' });
      saveAs(blob, 'stratlib_export.zip');
    } catch (e) {
      alert("Failed to create ZIP file.");
    }
  };

  return (
    <>
      {/* 1. MOBILE APP (Shown on phones and portrait tablets < 1024px) */}
      <div className="lg:hidden">
        <MobileApp wordCloud={wordCloud} />
      </div>

      {/* 2. THE MAIN DESKTOP IDE (Shown on landscape tablets and laptops >= 1024px) */}
      <div className="hidden lg:flex h-screen flex-col overflow-hidden">
        <Header 
          totalFiles={metadataList.length} query={query} setQuery={setQuery} 
          activeFilter={activeFilter} setActiveFilter={setActiveFilter} 
        />
        
        <main className="flex-1 flex overflow-hidden">
          <LeftSidebar 
            isSidebarOpen={isSidebarOpen} totalFiles={metadataList.length} displayResults={displayResults} 
            history={history} setHistory={setHistory} selectedIds={selectedIds} toggleSelection={toggleSelection} 
            selectedFile={selectedFile} handleSelectFile={handleSelectFile} activeFilter={activeFilter} setActiveFilter={setActiveFilter}
            setQuery={setQuery}
            handleSelectAll={handleSelectAll} handleUnselectAll={handleUnselectAll} handleDownloadZip={handleDownloadZip}
          />
          <CodeViewer 
            selectedFile={selectedFile} fileContent={fileContent} setSelectedFile={setSelectedFile} 
            isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} wordCloud={wordCloud} 
            setActiveFilter={setActiveFilter} setQuery={setQuery} 
          />
          <RightSidebar />
        </main>
      </div>
    </>
  );
}

