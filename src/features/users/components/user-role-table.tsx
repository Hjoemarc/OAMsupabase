'use client';

import { useState, useActionState } from 'react';
import { mutateUserRole } from '../actions';
import { ALL_APP_ROLES, type AppRole, type UserRoleActionState } from '../schemas';
import { type UserWithRoles } from '../queries';

const ROLE_ACTIVE_STYLES: Record<AppRole, string> = {
  admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-300 dark:border-purple-700 hover:bg-purple-200',
  coordinator: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-300 dark:border-blue-700 hover:bg-blue-200',
  evaluator: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 hover:bg-emerald-200',
  faculty: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-300 dark:border-amber-700 hover:bg-amber-200',
};

const ROLE_INACTIVE_STYLES =
  'bg-slate-100 text-slate-500 dark:bg-slate-800/60 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200';

function RoleToggleButton({
  userId,
  role,
  hasRole,
  isSelfAdmin,
}: {
  userId: string;
  role: AppRole;
  hasRole: boolean;
  isSelfAdmin: boolean;
}) {
  const [state, formAction, isPending] = useActionState(mutateUserRole, {} as UserRoleActionState);
  const intent = hasRole ? 'revoke' : 'grant';
  const isProtectedSelfAdmin = isSelfAdmin && hasRole && role === 'admin';

  return (
    <form action={formAction} className="inline-block">
      <input type="hidden" name="targetUserId" value={userId} />
      <input type="hidden" name="role" value={role} />
      <input type="hidden" name="intent" value={intent} />
      <button
        type="submit"
        disabled={isPending || isProtectedSelfAdmin}
        title={
          isProtectedSelfAdmin
            ? 'Self-lockout protection: You cannot revoke your own admin role.'
            : hasRole
            ? `Click to revoke ${role}`
            : `Click to grant ${role}`
        }
        className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors inline-flex items-center gap-1 ${
          hasRole ? ROLE_ACTIVE_STYLES[role] : ROLE_INACTIVE_STYLES
        } ${isProtectedSelfAdmin ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${
          isPending ? 'opacity-60 animate-pulse' : ''
        }`}
      >
        {isPending ? (
          <span className="inline-block animate-spin">⟳</span>
        ) : hasRole ? (
          <span className="text-[11px]">✓</span>
        ) : (
          <span className="text-[11px] opacity-60">+</span>
        )}
        <span>{role}</span>
      </button>
      {state?.error && (
        <span className="sr-only" role="alert">
          {state.error}
        </span>
      )}
    </form>
  );
}

export function UserRoleTable({
  users,
  currentAdminId,
}: {
  users: UserWithRoles[];
  currentAdminId: string;
}) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'active'>('all');
  const [search, setSearch] = useState('');

  const filteredUsers = users.filter((u) => {
    const matchesFilter =
      filter === 'all'
        ? true
        : filter === 'pending'
        ? u.isPending
        : !u.isPending;

    const term = search.toLowerCase().trim();
    const matchesSearch =
      !term ||
      u.email.toLowerCase().includes(term) ||
      (u.fullName && u.fullName.toLowerCase().includes(term)) ||
      (u.department && u.department.toLowerCase().includes(term));

    return matchesFilter && matchesSearch;
  });

  const pendingCount = users.filter((u) => u.isPending).length;
  const activeCount = users.filter((u) => !u.isPending).length;

  return (
    <div className="space-y-4">
      {/* Search and Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
              filter === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            All Users ({users.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition flex items-center gap-1.5 ${
              filter === 'pending'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <span>Pending</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-white font-bold">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setFilter('active')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
              filter === 'active'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Active ({activeCount})
          </button>
        </div>

        {/* Search Bar */}
        <div className="w-full sm:w-72">
          <input
            type="search"
            placeholder="Search name, email, department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
              <th scope="col" className="py-3 px-4">User</th>
              <th scope="col" className="py-3 px-4">Department</th>
              <th scope="col" className="py-3 px-4">Account Status</th>
              <th scope="col" className="py-3 px-4">Operational Role Toggles</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-slate-400">
                  No users match the selected filter or search query.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => {
                const isSelf = user.id === currentAdminId;
                return (
                  <tr
                    key={user.id}
                    className={`hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition ${
                      user.isPending ? 'bg-amber-50/30 dark:bg-amber-950/10' : ''
                    }`}
                  >
                    {/* User Identity */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>{user.fullName || 'No Name Provided'}</span>
                        {isSelf && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                            You
                          </span>
                        )}
                      </div>
                      <div className="text-slate-500 text-[11px] font-mono mt-0.5">
                        {user.email}
                      </div>
                    </td>

                    {/* Department */}
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                      {user.department || '—'}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      {user.isPending ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                          Pending Approval
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          Active
                        </span>
                      )}
                    </td>

                    {/* Interactive Role Toggles */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {ALL_APP_ROLES.map((role) => {
                          const hasRole = user.roles.includes(role);
                          return (
                            <RoleToggleButton
                              key={role}
                              userId={user.id}
                              role={role}
                              hasRole={hasRole}
                              isSelfAdmin={isSelf}
                            />
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
