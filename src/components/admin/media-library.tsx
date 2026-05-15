'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Upload, Trash2, Copy, Check, Search, Edit3 } from 'lucide-react';
import { uploadFile, deleteFile } from '@/lib/media';
import { Input } from '@/components/admin/form-components';

interface MediaFile {
  $id: string;
  name: string;
  mimeType: string;
  sizeOriginal: number;
  $createdAt: string;
  url: string;
}

export function MediaLibrary() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [editingAlt, setEditingAlt] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/admin/media/api');
      if (res.ok) {
        const data = await res.json();
        setFiles(data.files || []);
      }
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  useEffect(() => { fetchFiles(); }, [fetchFiles]);

  async function processFiles(fileList: FileList | File[]) {
    const arr = Array.from(fileList);
    if (!arr.length) return;
    setUploading(true);
    setUploadProgress(0);
    for (let i = 0; i < arr.length; i++) {
      const formData = new FormData();
      formData.append('file', arr[i]);
      await uploadFile(formData);
      setUploadProgress(Math.round(((i + 1) / arr.length) * 100));
    }
    setUploading(false);
    setUploadProgress(0);
    await fetchFiles();
  }

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) processFiles(e.target.files);
    e.target.value = '';
  }

  // Drag & drop
  function handleDragOver(e: React.DragEvent) { e.preventDefault(); setDragOver(true); }
  function handleDragLeave(e: React.DragEvent) { e.preventDefault(); setDragOver(false); }
  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) processFiles(e.dataTransfer.files);
  }

  async function handleDelete(fileId: string) {
    if (!confirm('Delete this file permanently?')) return;
    const result = await deleteFile(fileId);
    if (result.success) setFiles((prev) => prev.filter((f) => f.$id !== fileId));
  }

  function copyUrl(url: string, id: string) {
    navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  const filtered = search
    ? files.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()))
    : files;

  return (
    <div className="space-y-6" ref={dropRef} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Media Library</h1>
          <p className="mt-1 text-sm text-text-muted">{files.length} files</p>
        </div>
        <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-deep-teal text-white text-sm font-medium rounded-xl hover:bg-deep-teal/90 transition-colors cursor-pointer">
          <Upload size={16} />
          {uploading ? 'Uploading…' : 'Upload'}
          <input type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml" multiple onChange={handleUpload} className="sr-only" disabled={uploading} />
        </label>
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div className="space-y-1">
          <p className="text-xs text-text-muted">Uploading… {uploadProgress}%</p>
          <div className="w-full h-1.5 bg-surface-alt rounded-full overflow-hidden">
            <div className="h-full bg-deep-teal rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
          </div>
        </div>
      )}

      {/* Drag & Drop Zone */}
      {dragOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-deep-teal/10 backdrop-blur-sm pointer-events-none">
          <div className="bg-surface border-2 border-dashed border-deep-teal rounded-2xl p-12 text-center">
            <Upload size={32} className="mx-auto text-deep-teal mb-2" />
            <p className="text-sm font-medium text-deep-teal">Drop files to upload</p>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search files..." className="pl-9" />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-xl bg-surface-alt animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-surface border border-border rounded-2xl">
          <Upload size={24} className="mx-auto text-text-muted mb-2" />
          <p className="text-text-muted text-sm">{search ? 'No files match.' : 'Drop files here or click Upload.'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((file) => (
            <div key={file.$id} className="group relative aspect-square rounded-xl border border-border overflow-hidden bg-surface-alt">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={file.url} alt={file.name} className="w-full h-full object-cover" loading="lazy" />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                <div className="flex justify-end gap-1">
                  <button onClick={() => setEditingAlt(file.$id)} className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white" title="Edit alt text">
                    <Edit3 size={12} />
                  </button>
                  <button onClick={() => copyUrl(file.url, file.$id)} className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white" title="Copy URL">
                    {copied === file.$id ? <Check size={12} /> : <Copy size={12} />}
                  </button>
                  <button onClick={() => handleDelete(file.$id)} className="p-1.5 rounded-lg bg-red-500/80 hover:bg-red-500 text-white" title="Delete">
                    <Trash2 size={12} />
                  </button>
                </div>
                <div>
                  <p className="text-xs text-white truncate">{file.name}</p>
                  <p className="text-[10px] text-white/70">{formatSize(file.sizeOriginal)}</p>
                </div>
              </div>

              {/* Alt text editor */}
              {editingAlt === file.$id && (
                <div className="absolute inset-0 bg-surface/95 flex flex-col items-center justify-center p-3 z-10" onClick={(e) => e.stopPropagation()}>
                  <p className="text-xs font-medium text-text-primary mb-2">Alt Text</p>
                  <input className="w-full text-xs px-2 py-1.5 border border-border rounded-lg" defaultValue={file.name} placeholder="Describe this image..." />
                  <button onClick={() => setEditingAlt(null)} className="mt-2 text-xs text-deep-teal hover:underline">Done</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
