import { requireRole } from '@/features/auth/guards';

export const instant = false;

export const metadata = {
  title: 'Evaluator Workspace | OAMS',
  description: 'Evidence verification, compliance auditing, scoring rubrics, and formal audit findings.',
};

export default async function EvaluatorDashboardPage() {
  const auth = await requireRole('evaluator');

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900/10 via-teal-900/10 to-transparent p-6 rounded-2xl border border-emerald-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 mb-2">
              Accreditation Evaluator / Auditor Workspace
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Evidence Audit & Formal Evaluation
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Audit submitted evidence, apply rubric ratings to parameters, and compile institutional audit findings.
            </p>
          </div>
          <div className="text-right text-xs text-slate-500">
            Auditor: <span className="font-semibold text-slate-700 dark:text-slate-300">{auth.profile?.full_name || auth.user.email}</span>
          </div>
        </div>
      </div>

      {/* Domain Responsibility Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            01
          </div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Assigned Areas & Documents
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Inspect the documentary evidence submitted by faculty area leads for each assigned parameter and benchmark.
          </p>
          <div className="pt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            Entity: <code>evidence_documents</code>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
            02
          </div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Rubric Scoring & Ratings
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Enter numerical scores (1.0 to 5.0) and compliance ratings based on verifiable criteria satisfaction.
          </p>
          <div className="pt-2 text-xs font-medium text-teal-600 dark:text-teal-400">
            Entity: <code>parameter_evaluations</code>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-slate-500/10 text-slate-600 dark:text-slate-400 flex items-center justify-center font-bold">
            03
          </div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Findings & Recommendations
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Record institutional strengths, compliance deficiencies, and actionable recommendations for the final accreditation report.
          </p>
          <div className="pt-2 text-xs font-medium text-slate-600 dark:text-slate-400">
            Status: Evaluation Queue Ready
          </div>
        </div>
      </div>
    </div>
  );
}
