'use client';

import React, { useState, useActionState } from 'react';
import { mutateUserRole } from '../actions';
import { ALL_APP_ROLES, type AppRole, type UserRoleActionState } from '../schemas';
import { type UserWithRoles } from '../queries';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import SegmentedControl from '@/components/arc/segmented-control/segmented-control';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Check, Plus, Loader2 } from 'lucide-react';

const ROLE_ACTIVE_STYLES: Record<AppRole, string> = {
  admin: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
  coordinator: 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100',
  evaluator: 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100',
  faculty: 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100',
};

const ROLE_INACTIVE_STYLES =
  'bg-[var(--surface-muted)] text-[var(--text-muted)] border-[var(--border)] hover:bg-[var(--surface)] hover:text-[var(--foreground)]';

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
        className={`px-2.5 py-1 rounded-[var(--radius-control)] text-xs font-medium border transition-colors inline-flex items-center gap-1 ${
          hasRole ? ROLE_ACTIVE_STYLES[role] : ROLE_INACTIVE_STYLES
        } ${isProtectedSelfAdmin ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${
          isPending ? 'opacity-60' : ''
        }`}
      >
        {isPending ? (
          <Loader2 className="w-3 h-3 animate-spin text-[var(--text-muted)]" />
        ) : hasRole ? (
          <Check className="w-3 h-3 stroke-[2.25]" />
        ) : (
          <Plus className="w-3 h-3 stroke-[2] opacity-60" />
        )}
        <span className="capitalize">{role}</span>
      </button>
      {state?.error && (
        <span className="sr-only" role="alert">
          {state.error}
        </span>
      )}
    </form>
  );
}

export function UserDirectory({
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

  const filterOptions = [
    { value: 'all', label: `All personnel (${users.length})` },
    { value: 'pending', label: `Pending (${pendingCount})` },
    { value: 'active', label: `Active (${activeCount})` },
  ];

  return (
    <Card className="overflow-hidden">
      {/* Search and Filter Toolbar */}
      <div className="p-4 border-b border-[var(--border)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SegmentedControl
          options={filterOptions}
          value={filter}
          onValueChange={(val) => setFilter(val as 'all' | 'pending' | 'active')}
        />

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] stroke-[1.75]" />
          <Input
            type="search"
            placeholder="Search name, email, department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 text-xs"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <Table className="min-w-[680px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30%]">User</TableHead>
              <TableHead className="w-[20%]">Department</TableHead>
              <TableHead className="w-[18%]">Account status</TableHead>
              <TableHead className="w-[32%]">Operational role toggles</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-12 text-center text-[var(--text-muted)] text-xs">
                  No personnel match the selected filter or search query.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => {
                const isSelf = user.id === currentAdminId;
                return (
                  <TableRow
                    key={user.id}
                    className={user.isPending ? 'bg-amber-500/5' : undefined}
                  >
                    {/* User Identity */}
                    <TableCell>
                      <div className="font-medium text-[var(--foreground)] flex items-center gap-2">
                        <span>{user.fullName || 'No name provided'}</span>
                        {isSelf && (
                          <Badge tone="neutral" size="sm">
                            You
                          </Badge>
                        )}
                      </div>
                      <div className="text-[var(--text-muted)] text-xs font-mono mt-0.5">
                        {user.email}
                      </div>
                    </TableCell>

                    {/* Department */}
                    <TableCell className="text-[var(--text-secondary)]">
                      {user.department || 'None assigned'}
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell>
                      {user.isPending ? (
                        <Badge tone="warning">Pending approval</Badge>
                      ) : (
                        <Badge tone="success">Active</Badge>
                      )}
                    </TableCell>

                    {/* Interactive Role Toggles */}
                    <TableCell>
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
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
