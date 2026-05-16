import type { Metadata } from 'next';
import { CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import { runEditorialAudit, type ContentScore } from '@/lib/editorial';

export const metadata: Metadata = { title: 'Editorial Standards' };

export default async function EditorialPage() {
  const report = await runEditorialAudit();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Editorial Standards</h1>
        <p className="mt-1 text-sm text-text-muted">Publish readiness scoring — content must score ≥70 to be launch-ready.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Average Score" value={`${report.averageScore}%`} />
        <StatCard label="Ready to Publish" value={report.readyCount} />
        <StatCard label="Needs Work" value={report.totalCount - report.readyCount} />
        <StatCard label="Total Content" value={report.totalCount} />
      </div>

      {/* Content list */}
      {report.items.length === 0 ? (
        <p className="text-text-muted py-8 text-center">No content to audit.</p>
      ) : (
        <div className="space-y-3">
          {report.items.map((item) => (
            <ScoreCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

function ScoreCard({ item }: { item: ContentScore }) {
  const barColor = item.score >= 70 ? 'bg-green-500' : item.score >= 40 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="p-4 rounded-xl border border-border bg-surface-alt">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {item.ready ? <CheckCircle className="w-4 h-4 text-green-500 shrink-0" /> : <XCircle className="w-4 h-4 text-red-400 shrink-0" />}
            <h3 className="text-sm font-medium text-text-primary truncate">{item.title}</h3>
          </div>
          <p className="mt-0.5 text-xs text-text-muted">{item.collection} · {item.status}</p>
        </div>
        <span className={`text-sm font-semibold ${item.score >= 70 ? 'text-green-600' : item.score >= 40 ? 'text-amber-600' : 'text-red-600'}`}>
          {item.score}%
        </span>
      </div>
      <div className="mt-3 h-1.5 rounded-full bg-border overflow-hidden">
        <div className={`h-full rounded-full ${barColor} transition-all`} style={{ width: `${item.score}%` }} />
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {item.checks.filter(c => !c.passed).map((c, i) => (
          <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-100">{c.label}</span>
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="p-4 rounded-xl bg-surface-alt border border-border">
      <TrendingUp className="w-4 h-4 text-text-muted" />
      <p className="mt-2 text-2xl font-semibold text-text-primary">{value}</p>
      <p className="text-xs text-text-muted">{label}</p>
    </div>
  );
}
