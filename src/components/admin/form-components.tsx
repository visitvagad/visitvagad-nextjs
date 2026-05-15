'use client';

import { forwardRef } from 'react';
import type { ContentStatus } from '@/types/admin';
import { STATUS_CONFIG } from '@/types/admin';

/* ============================================
   FIELD WRAPPER
   ============================================ */
export function Field({
  label,
  error,
  hint,
  required,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-text-primary">
        {label}
        {required && <span className="text-terracotta ml-0.5">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-text-muted">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

/* ============================================
   INPUT
   ============================================ */
export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', ...props }, ref) => (
    <input
      ref={ref}
      className={`w-full px-3 py-2.5 rounded-xl border border-border bg-surface text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-deep-teal/20 focus:border-deep-teal disabled:opacity-50 ${className}`}
      {...props}
    />
  ),
);
Input.displayName = 'Input';

/* ============================================
   TEXTAREA
   ============================================ */
export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className = '', ...props }, ref) => (
    <textarea
      ref={ref}
      className={`w-full px-3 py-2.5 rounded-xl border border-border bg-surface text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-deep-teal/20 focus:border-deep-teal disabled:opacity-50 resize-y min-h-[100px] ${className}`}
      {...props}
    />
  ),
);
Textarea.displayName = 'Textarea';

/* ============================================
   SELECT
   ============================================ */
export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className = '', children, ...props }, ref) => (
    <select
      ref={ref}
      className={`w-full px-3 py-2.5 rounded-xl border border-border bg-surface text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-deep-teal/20 focus:border-deep-teal disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </select>
  ),
);
Select.displayName = 'Select';

/* ============================================
   TOGGLE
   ============================================ */
export function Toggle({
  checked,
  onChange,
  label,
  disabled,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-6 rounded-full transition-colors ${
          checked ? 'bg-deep-teal' : 'bg-border-strong'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span
          className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
            checked ? 'translate-x-4' : ''
          }`}
        />
      </button>
      {label && <span className="text-sm text-text-primary">{label}</span>}
    </label>
  );
}

/* ============================================
   STATUS BADGE
   ============================================ */
export function StatusBadge({ status }: { status: ContentStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}

/* ============================================
   FORM ACTIONS BAR
   ============================================ */
export function FormActions({
  loading,
  onCancel,
  submitLabel = 'Save',
}: {
  loading?: boolean;
  onCancel?: () => void;
  submitLabel?: string;
}) {
  return (
    <div className="flex items-center gap-3 pt-6 border-t border-border">
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary rounded-xl border border-border hover:border-border-strong transition-colors"
        >
          Cancel
        </button>
      )}
      <button
        type="submit"
        disabled={loading}
        className="px-5 py-2.5 bg-deep-teal text-white text-sm font-medium rounded-xl hover:bg-deep-teal/90 transition-colors disabled:opacity-50"
      >
        {loading ? 'Saving…' : submitLabel}
      </button>
    </div>
  );
}

/* ============================================
   CARD WRAPPER
   ============================================ */
export function FormCard({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-6">
      {title && <h3 className="text-sm font-semibold text-text-primary mb-4">{title}</h3>}
      {children}
    </div>
  );
}

/* ============================================
   SEO SECTION — Enhanced with previews & validators
   ============================================ */
export function SeoSection({
  values,
  onChange,
  errors,
  slug,
}: {
  values: { seoTitle: string; seoDescription: string; seoKeywords: string; seoOgImage: string };
  onChange: (field: string, value: string) => void;
  errors?: Record<string, string>;
  slug?: string;
}) {
  const titleLen = values.seoTitle.length;
  const descLen = values.seoDescription.length;
  const titleOk = titleLen > 0 && titleLen <= 60;
  const descOk = descLen > 0 && descLen <= 160;

  // Schema readiness
  const schemaChecks = [
    { label: 'Meta title', ok: !!values.seoTitle },
    { label: 'Meta description', ok: !!values.seoDescription },
    { label: 'OG image', ok: !!values.seoOgImage },
    { label: 'Keywords', ok: !!values.seoKeywords },
  ];
  const schemaScore = schemaChecks.filter((c) => c.ok).length;

  return (
    <FormCard title="SEO & Metadata">
      <div className="space-y-5">
        {/* Title */}
        <Field label="Meta Title" error={errors?.seoTitle}>
          <Input
            value={values.seoTitle}
            onChange={(e) => onChange('seoTitle', e.target.value)}
            maxLength={256}
            placeholder="Page title for search engines"
          />
          <div className="flex items-center justify-between mt-1">
            <span className={`text-xs ${titleLen === 0 ? 'text-text-muted' : titleOk ? 'text-emerald-600' : 'text-amber-600'}`}>
              {titleLen}/60 {titleLen > 60 && '⚠ Too long'}
            </span>
          </div>
        </Field>

        {/* Description */}
        <Field label="Meta Description" error={errors?.seoDescription}>
          <Textarea
            value={values.seoDescription}
            onChange={(e) => onChange('seoDescription', e.target.value)}
            maxLength={512}
            rows={3}
            placeholder="Brief description for search results"
          />
          <div className="flex items-center justify-between mt-1">
            <span className={`text-xs ${descLen === 0 ? 'text-text-muted' : descOk ? 'text-emerald-600' : 'text-amber-600'}`}>
              {descLen}/160 {descLen > 160 && '⚠ May be truncated'}
            </span>
          </div>
        </Field>

        <Field label="Keywords" error={errors?.seoKeywords} hint="Comma-separated">
          <Input value={values.seoKeywords} onChange={(e) => onChange('seoKeywords', e.target.value)} placeholder="tourism, vagad, banswara" />
        </Field>

        <Field label="OG Image URL" error={errors?.seoOgImage} hint="1200×630px recommended">
          <Input value={values.seoOgImage} onChange={(e) => onChange('seoOgImage', e.target.value)} placeholder="https://..." />
        </Field>

        {/* Google Snippet Preview */}
        <div className="p-4 bg-surface-alt rounded-xl border border-border">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-2">Google Preview</p>
          <p className="text-[#1a0dab] text-sm font-medium truncate">
            {values.seoTitle || 'Page Title — VisitVagad'}
          </p>
          <p className="text-xs text-[#006621] truncate">
            visitvagad.com{slug ? `/${slug}` : '/...'}
          </p>
          <p className="text-xs text-[#545454] mt-0.5 line-clamp-2">
            {values.seoDescription || 'Add a meta description to control how this page appears in search results.'}
          </p>
        </div>

        {/* OG Preview */}
        {values.seoOgImage && (
          <div className="p-4 bg-surface-alt rounded-xl border border-border">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-2">Social Preview</p>
            <div className="border border-border rounded-lg overflow-hidden bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={values.seoOgImage} alt="OG preview" className="w-full h-32 object-cover" />
              <div className="p-3">
                <p className="text-xs text-text-muted uppercase">visitvagad.com</p>
                <p className="text-sm font-medium text-text-primary truncate">{values.seoTitle || 'Page Title'}</p>
                <p className="text-xs text-text-secondary line-clamp-1">{values.seoDescription || ''}</p>
              </div>
            </div>
          </div>
        )}

        {/* Schema Readiness */}
        <div className="p-4 bg-surface-alt rounded-xl border border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">SEO Readiness</p>
            <span className={`text-xs font-bold ${schemaScore === 4 ? 'text-emerald-600' : 'text-amber-600'}`}>
              {schemaScore}/4
            </span>
          </div>
          <ul className="space-y-1">
            {schemaChecks.map((c) => (
              <li key={c.label} className={`text-xs flex items-center gap-1.5 ${c.ok ? 'text-emerald-600' : 'text-amber-600'}`}>
                <span>{c.ok ? '✓' : '○'}</span> {c.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </FormCard>
  );
}
