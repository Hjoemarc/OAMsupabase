import { requireRole } from '@/features/auth/guards';

export const instant = false;

export const metadata = {
  title: 'Coordinator Workspace | OAMS',
  description: 'Program accreditation management, cycle scheduling, and area lead assignments.',
};

export default async function CoordinatorDashboardPage() {
  const auth = await requireRole('coordinator');

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900/10 via-cyan-900/10 to-transparent p-6 rounded-2xl border border-blue-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 mb-2">
              Accreditation Coordinator Workspace
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Degree Program Accreditation Management
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Oversee active accreditation cycles, schedule evaluation deadlines, and assign faculty area chairs.
            </p>
          </div>
          <div className="text-right text-xs text-slate-500">
            Coordinator: <span className="font-semibold text-slate-700 dark:text-slate-300">{auth.profile?.full_name || auth.user.email}</span>
          </div>
        </div>
      </div>

      {/* Domain Responsibility Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            01
          </div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Accreditation Cycles
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Define institutional cycles (e.g., Level II Re-accreditation 2026-2027), set documentary submission deadlines, and track milestones.
          </p>
          <div className="pt-2 text-xs font-medium text-blue-600 dark:text-blue-400">
            Entity: <code>accreditation_cycles</code>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold">
            02
          </div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Degree Programs & Areas
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Map academic degree programs into 10 accreditation areas (Instruction, Faculty, Research, Extension, Facilities, etc.).
          </p>
          <div className="pt-2 text-xs font-medium text-cyan-600 dark:text-cyan-400">
            Entity: <code>programs</code> &bull; <code>areas</code>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-slate-500/10 text-slate-600 dark:text-slate-400 flex items-center justify-center font-bold">
            03
          </div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Area Chair Delegation
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Assign lead faculty members to each standard area to coordinate documentary evidence collection and self-survey scoring.
          </p>
          <div className="pt-2 text-xs font-medium text-slate-600 dark:text-slate-400">
            Status: Ready for Task Assignments
          </div>
        </div>
      </div>
    </div>
  );
}
