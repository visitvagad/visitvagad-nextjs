import type { Metadata } from 'next';
import { AlertTriangle, CheckCircle, XCircle, Image as ImageIcon } from 'lucide-react';
import { runMediaQA, type MediaIssue } from '@/lib/media-qa';

export const metadata: Metadata = { title: 'Media QA' };

const SEVERITY_STYLES = {
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
};

const TYPE_LABELS: Record<MediaIssue['type'], string> = {
  'broken-image': 'Missing Image',
  'missing-alt': 'Missing Alt Text',
  'missing-og': 'Missing OG Image',
  'missing-seo': 'Missing SEO',
  'short-description': 'Short Description',
};

export default async function MediaQAPage() {
  const report = await runMediaQA();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Media QA Report</h1>
        <p className="mt-1 text-sm text-text-muted">
          Last run: {new Date(report.timestamp).toLocaleString('en-IN')}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={<ImageIcon className="w-5 h-5" />} label="Total Content" value={report.stats.total} />
        <StatCard icon={<XCircle className="w-5 h-5 text-red-500" />} label="Errors" value={report.stats.errors} />
        <StatCard icon={<AlertTriangle className="w-5 h-5 text-amber-500" />} label="Warnings" value={report.stats.warnings} />
        <StatCard icon={<CheckCircle className="w-5 h-5 text-green-500" />} label="Passed" value={report.stats.passed} />
      </div>

      {/* Issues */}
      {report.issues.length === 0 ? (
        <div className="text-center py-12 text-green-600">
          <CheckCircle className="w-12 h-12 mx-auto mb-3" />
          <p className="text-lg font-medium">All content passes QA checks</p>
        </div>
      ) : (
        <div className="space-y-3">
          <h2 className="text-lg font-medium text-text-primary">Issues ({report.issues.length})</h2>
          {report.issues.map((issue, i) => (
            <div key={i} className={`flex items-start gap-3 p-4 rounded-xl border ${SEVERITY_STYLES[issue.severity]}`}>
              {issue.severity === 'error' ? <XCircle className="w-4 h-4 mt-0.5 shrink-0" /> : <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />}
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-medium uppercase tracking-wider opacity-70">{issue.collection}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-black/5">{TYPE_LABELS[issue.type]}</span>
                </div>
                <p className="mt-0.5 text-sm font-medium">{issue.title}</p>
                <p className="text-xs opacity-80">{issue.message} — field: {issue.field}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="p-4 rounded-xl bg-surface-alt border border-border">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-xs text-text-muted uppercase tracking-wider">{label}</span>
      </div>
      <p className="mt-2 text-2xl font-semibold text-text-primary">{value}</p>
    </div>
  );
}
