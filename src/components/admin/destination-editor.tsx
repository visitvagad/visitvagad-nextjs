'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle2, Save } from 'lucide-react';
import {
  Field,
  Input,
  Textarea,
  Select,
  Toggle,
  FormActions,
  FormCard,
  SeoSection,
} from '@/components/admin/form-components';
import { createDestination, updateDestination, updateDestinationStatus } from '@/features/destinations/actions';
import type { DestinationFormData, ContentStatus } from '@/types/cms';

interface Props {
  initialData?: DestinationFormData & { $id?: string };
  mode: 'create' | 'edit';
}

const EMPTY_FORM: DestinationFormData = {
  title: '', slug: '', district: 'Banswara', summary: '', story: '',
  heroImage: '', gallery: [], highlights: [], experiences: [], bestTime: '',
  lat: 0, lng: 0, nearbyPlaces: [],
  seoTitle: '', seoDescription: '', seoOgImage: '', seoKeywords: '',
  featured: false, status: 'draft',
};

function getCompleteness(form: DestinationFormData) {
  const checks = [
    { label: 'Title', ok: !!form.title },
    { label: 'Summary', ok: !!form.summary },
    { label: 'Hero image', ok: !!form.heroImage },
    { label: 'Story', ok: !!form.story },
    { label: 'Coordinates', ok: !!(form.lat && form.lng) },
    { label: 'SEO title', ok: !!form.seoTitle },
    { label: 'SEO description', ok: !!form.seoDescription },
    { label: 'OG image', ok: !!form.seoOgImage },
  ];
  const done = checks.filter((c) => c.ok).length;
  return { checks, score: Math.round((done / checks.length) * 100) };
}

export function DestinationEditor({ initialData, mode }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<DestinationFormData>(initialData || EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dirty, setDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const id = (initialData as { $id?: string })?.$id;

  function set<K extends keyof DestinationFormData>(key: K, value: DestinationFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
    setDirty(true);
  }

  // Unsaved changes warning
  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (dirty) { e.preventDefault(); }
    }
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [dirty]);

  // Keyboard shortcut: Ctrl+S
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Autosave (edit mode, 5s after last change)
  useEffect(() => {
    if (mode !== 'edit' || !id || !dirty) return;
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => { handleSave(true); }, 5000);
    return () => { if (autosaveTimer.current) clearTimeout(autosaveTimer.current); };
  }, [form]);

  const handleSave = useCallback(async (silent = false) => {
    if (loading) return;
    if (!silent) setLoading(true);
    setErrors({});
    try {
      if (mode === 'create') {
        const newId = await createDestination(form);
        setDirty(false);
        router.push(`/admin/destinations/${newId}`);
      } else if (id) {
        await updateDestination(id, form);
        setDirty(false);
        setLastSaved(new Date().toLocaleTimeString());
        if (!silent) router.refresh();
      }
    } catch (err) {
      if (!silent) {
        setErrors({ _form: err instanceof Error && err.message.includes('parse') ? 'Check required fields.' : 'Save failed.' });
      }
    } finally {
      if (!silent) setLoading(false);
    }
  }, [form, id, mode, loading, router]);

  async function handleStatusChange(status: ContentStatus) {
    if (!id) return;
    setLoading(true);
    try {
      await updateDestinationStatus(id, status);
      set('status', status);
      setDirty(false);
      router.refresh();
    } catch {
      setErrors({ _form: 'Status update failed.' });
    } finally {
      setLoading(false);
    }
  }

  function generateSlug(title: string) {
    return title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
  }

  const { checks, score } = getCompleteness(form);

  return (
    <div className="flex gap-8 max-w-6xl">
      {/* Main Form */}
      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="flex-1 space-y-6 min-w-0">
        {errors._form && <div className="p-3 rounded-xl bg-red-50 text-red-700 text-sm">{errors._form}</div>}

        {/* Save indicator */}
        {lastSaved && !dirty && (
          <p className="text-xs text-emerald-600 flex items-center gap-1"><CheckCircle2 size={12} /> Saved at {lastSaved}</p>
        )}
        {dirty && mode === 'edit' && (
          <p className="text-xs text-amber-600 flex items-center gap-1"><Save size={12} /> Unsaved changes (Ctrl+S to save)</p>
        )}

        {/* Status */}
        {mode === 'edit' && id && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-text-muted mr-2">Status:</span>
            {(['draft', 'published', 'featured', 'archived'] as ContentStatus[]).map((s) => (
              <button key={s} type="button" disabled={form.status === s || loading} onClick={() => handleStatusChange(s)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${form.status === s ? 'bg-deep-teal/10 text-deep-teal border-deep-teal/20' : 'border-border text-text-muted hover:text-text-primary hover:border-border-strong disabled:opacity-50'}`}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        )}

        {/* Basic Info */}
        <FormCard title="Basic Information">
          <div className="space-y-4">
            <Field label="Title" required error={errors.title}>
              <Input value={form.title} onChange={(e) => { set('title', e.target.value); if (mode === 'create' && !form.slug) set('slug', generateSlug(e.target.value)); }} placeholder="e.g. Mahi Dam" />
            </Field>
            <Field label="Slug" required error={errors.slug} hint="URL-friendly identifier">
              <Input value={form.slug} onChange={(e) => set('slug', e.target.value)} placeholder="mahi-dam" />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="District" required>
                <Select value={form.district} onChange={(e) => set('district', e.target.value as 'Banswara' | 'Dungarpur')}>
                  <option value="Banswara">Banswara</option>
                  <option value="Dungarpur">Dungarpur</option>
                </Select>
              </Field>
              <Field label="Best Time to Visit">
                <Input value={form.bestTime} onChange={(e) => set('bestTime', e.target.value)} placeholder="October to March" />
              </Field>
            </div>
            <Field label="Summary" required error={errors.summary} hint={`${form.summary.length}/512`}>
              <Textarea value={form.summary} onChange={(e) => set('summary', e.target.value)} maxLength={512} rows={3} placeholder="Brief overview..." />
            </Field>
          </div>
        </FormCard>

        <FormCard title="Story">
          <Field label="Full Story" hint="Rich narrative about this destination">
            <Textarea value={form.story} onChange={(e) => set('story', e.target.value)} rows={8} placeholder="Tell the story of this place..." />
          </Field>
        </FormCard>

        <FormCard title="Media">
          <Field label="Hero Image URL" hint="Main image for the destination">
            <Input value={form.heroImage} onChange={(e) => set('heroImage', e.target.value)} placeholder="https://..." />
          </Field>
        </FormCard>

        <FormCard title="Location">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Latitude">
              <Input type="number" step="any" value={form.lat || ''} onChange={(e) => set('lat', parseFloat(e.target.value) || 0)} />
            </Field>
            <Field label="Longitude">
              <Input type="number" step="any" value={form.lng || ''} onChange={(e) => set('lng', parseFloat(e.target.value) || 0)} />
            </Field>
          </div>
        </FormCard>

        <FormCard title="Options">
          <Toggle checked={form.featured} onChange={(v) => set('featured', v)} label="Featured destination" />
        </FormCard>

        <SeoSection
          values={{ seoTitle: form.seoTitle, seoDescription: form.seoDescription, seoKeywords: form.seoKeywords, seoOgImage: form.seoOgImage }}
          onChange={(field, value) => set(field as keyof DestinationFormData, value as never)}
          errors={errors}
          slug={form.slug}
        />

        <FormActions loading={loading} onCancel={() => router.push('/admin/destinations')} submitLabel={mode === 'create' ? 'Create Destination' : 'Save Changes'} />
      </form>

      {/* Completeness Sidebar */}
      <aside className="hidden xl:block w-64 shrink-0">
        <div className="sticky top-20 bg-surface border border-border rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text-primary">Completeness</h3>
            <span className={`text-sm font-bold ${score === 100 ? 'text-emerald-600' : score >= 50 ? 'text-amber-600' : 'text-red-600'}`}>{score}%</span>
          </div>
          <div className="w-full h-1.5 bg-surface-alt rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all ${score === 100 ? 'bg-emerald-500' : score >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${score}%` }} />
          </div>
          <ul className="space-y-2">
            {checks.map((c) => (
              <li key={c.label} className="flex items-center gap-2 text-xs">
                {c.ok ? <CheckCircle2 size={14} className="text-emerald-500 shrink-0" /> : <AlertCircle size={14} className="text-amber-500 shrink-0" />}
                <span className={c.ok ? 'text-text-secondary' : 'text-text-primary'}>{c.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
