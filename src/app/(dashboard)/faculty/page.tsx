import { requireRole } from '@/features/auth/guards';

export const instant = false;

export const metadata = {
  title: 'Faculty Workspace | OAMS',
  description: 'Evidence submission, self-survey narration, and parameter compliance documentation.',
};

export default async function FacultyDashboardPage() {
  const auth = await requireRole('faculty');

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-900/10 via-orange-900/10 to-transparent p-6 rounded-2xl border border-amber-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 mb-2">
              Area Lead / Faculty Member Workspace
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Documentary Evidence Submission
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Upload compliance evidence, write area self-survey narratives, and track parameter submission readiness.
            </p>
          </div>
          <div className="text-right text-xs text-slate-500">
            Faculty Lead: <span className="font-semibold text-slate-700 dark:text-slate-300">{auth.profile?.full_name || auth.user.email}</span>
          </div>
        </div>
      </div>

      {/* Domain Responsibility Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            01
          </div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Assigned Parameters
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Review the specific benchmarks and criteria assigned to your department (syllabi, faculty credentials, research outputs).
          </p>
          <div className="pt-2 text-xs font-medium text-amber-600 dark:text-amber-400">
            Entity: <code>criteria_parameters</code>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
            02
          </div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Evidence Vault Uploads
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Upload institutional verification files (PDFs, images, reports) and attach them directly to parameter compliance claims.
          </p>
          <div className="pt-2 text-xs font-medium text-orange-600 dark:text-orange-400">
            Integration: <code>evidence_storage</code>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-slate-500/10 text-slate-600 dark:text-slate-400 flex items-center justify-center font-bold">
            03
          </div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Submission Status
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Track parameter readiness across <code>Draft</code>, <code>Submitted</code>, and <code>Under Review</code> states before the coordinator audit deadline.
          </p>
          <div className="pt-2 text-xs font-medium text-slate-600 dark:text-slate-400">
            Status: Ready for Evidence Upload
          </div>
        </div>
      </div>
    </div>
  );
}
