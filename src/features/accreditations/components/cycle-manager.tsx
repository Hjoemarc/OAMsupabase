'use client';

import React, { useState } from 'react';
import { useAccreditationStore } from '../context/store-context';
import { Card } from '@/components/ui/card';
import { SummaryMetricCard } from '@/components/ui/summary-metric-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { RowActionMenu } from '@/components/ui/row-action-menu';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import {
  CalendarDays,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Layers,
  Calendar,
  Edit2,
  Trash2,
  CheckSquare,
} from 'lucide-react';
import type { AccreditationBody, AccreditationLevel, AccreditationCycle } from '@/types/domain/accreditation';

export function CycleManager() {
  const { cycles, programs, createCycle, updateCycle, deleteCycle } = useAccreditationStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form State for Add
  const [name, setName] = useState('');
  const [body, setBody] = useState<AccreditationBody>('AACCUP');
  const [academicYear, setAcademicYear] = useState('2026-2027');
  const [startDate, setStartDate] = useState('2026-06-01');
  const [endDate, setEndDate] = useState('2026-10-31');
  const [targetLevel, setTargetLevel] = useState<AccreditationLevel>('Level III Phase 1');
  const [description, setDescription] = useState('');
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([programs[0]?.id || '']);

  // Edit State
  const [editingCycle, setEditingCycle] = useState<AccreditationCycle | null>(null);
  const [editName, setEditName] = useState('');
  const [editBody, setEditBody] = useState<AccreditationBody>('AACCUP');
  const [editAcademicYear, setEditAcademicYear] = useState('');
  const [editStartDate, setEditStartDate] = useState('');
  const [editEndDate, setEditEndDate] = useState('');
  const [editTargetLevel, setEditTargetLevel] = useState<AccreditationLevel>('Level I');
  const [editDescription, setEditDescription] = useState('');
  const [editSelectedPrograms, setEditSelectedPrograms] = useState<string[]>([]);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<AccreditationCycle | null>(null);

  const filteredCycles = cycles.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.academicYear.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.body.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCount = cycles.filter(
    (c) => c.status === 'Self-Survey' || c.status === 'Under Evaluation'
  ).length;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || selectedPrograms.length === 0) return;
    createCycle({
      name,
      body,
      academicYear,
      startDate,
      endDate,
      targetLevel,
      description,
      programIds: selectedPrograms,
    });
    setName('');
    setDescription('');
    setIsAddOpen(false);
  };

  const openEdit = (c: AccreditationCycle) => {
    setEditingCycle(c);
    setEditName(c.name);
    setEditBody(c.body);
    setEditAcademicYear(c.academicYear);
    setEditStartDate(c.startDate);
    setEditEndDate(c.endDate);
    setEditTargetLevel(c.targetLevel);
    setEditDescription(c.description);
    setEditSelectedPrograms(c.programIds);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCycle || !editName || editSelectedPrograms.length === 0) return;
    updateCycle(editingCycle.id, {
      name: editName,
      body: editBody,
      academicYear: editAcademicYear,
      startDate: editStartDate,
      endDate: editEndDate,
      targetLevel: editTargetLevel,
      description: editDescription,
      programIds: editSelectedPrograms,
    });
    setEditingCycle(null);
  };

  const toggleProgram = (progId: string) => {
    setSelectedPrograms((prev) =>
      prev.includes(progId) ? prev.filter((id) => id !== progId) : [...prev, progId]
    );
  };

  const toggleEditProgram = (progId: string) => {
    setEditSelectedPrograms((prev) =>
      prev.includes(progId) ? prev.filter((id) => id !== progId) : [...prev, progId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[var(--border)]">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-medium text-[var(--foreground)] tracking-tight flex items-center gap-2.5">
            <CalendarDays className="w-6 h-6 text-[var(--accent)] stroke-[1.75]" />
            Accreditation cycles
          </h1>
          <p className="font-[family-name:var(--font-body)] text-xs text-[var(--text-muted)] mt-1">
            Manage formal survey visits, self-survey phases, and multi-program evaluation schedules
          </p>
        </div>

        <Button
          onClick={() => setIsAddOpen(true)}
          size="sm"
          className="gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[1.75]" />
          <span>New cycle</span>
        </Button>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
        <SummaryMetricCard
          label="Total cycles"
          value={cycles.length}
          subtext="Historical and scheduled surveys"
          icon={CalendarDays}
          tone="default"
        />

        <SummaryMetricCard
          label="Active survey visits"
          value={activeCount}
          subtext="Self-survey and audit phases"
          icon={Clock}
          tone="accent"
        />

        <SummaryMetricCard
          label="Completed cycles"
          value={cycles.filter((c) => c.status === 'Completed').length}
          subtext="Final audit reports submitted"
          icon={CheckCircle2}
          tone="emerald"
        />

        <SummaryMetricCard
          label="Agency compliance"
          value="100%"
          subtext="AACCUP and CHED timeline aligned"
          icon={Layers}
          tone="blue"
        />
      </div>

      {/* Main Table Card */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-[var(--border)] flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[var(--accent)] stroke-[1.75]" />
            <h2 className="font-[family-name:var(--font-display)] text-sm font-medium text-[var(--foreground)]">
              Scheduled survey visits
            </h2>
            <Badge tone="neutral" size="sm">
              {filteredCycles.length}
            </Badge>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] stroke-[1.75]" />
            <Input
              type="text"
              placeholder="Search by cycle name, AY, agency..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 text-xs h-8"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table className="min-w-[760px]">
            <TableHeader>
              <TableRow>
                <TableHead>Cycle name</TableHead>
                <TableHead>Agency</TableHead>
                <TableHead>Academic year</TableHead>
                <TableHead>Target level</TableHead>
                <TableHead>Date window</TableHead>
                <TableHead>Programs</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-10 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCycles.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="font-medium text-xs text-[var(--foreground)]">{c.name}</div>
                    <div className="text-[11px] text-[var(--text-muted)] truncate max-w-xs" title={c.description}>{c.description}</div>
                  </TableCell>
                  <TableCell>
                    <Badge tone={c.body === 'AACCUP' ? 'info' : 'neutral'} size="sm">
                      {c.body}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs tabular-nums text-[var(--text-secondary)]">
                    {c.academicYear}
                  </TableCell>
                  <TableCell className="font-medium text-xs text-[var(--foreground)]">
                    {c.targetLevel}
                  </TableCell>
                  <TableCell className="text-xs text-[var(--text-secondary)] font-mono tabular-nums">
                    {c.startDate} to {c.endDate}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {c.programIds.map((pId) => {
                        const prog = programs.find((p) => p.id === pId);
                        return (
                          <span
                            key={pId}
                            className="text-[10px] font-medium bg-[var(--surface-muted)] text-[var(--foreground)] px-1.5 py-0.5 rounded-[var(--radius-pill)] border border-[var(--border)]"
                          >
                            {prog?.code || pId}
                          </span>
                        );
                      })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      tone={
                        c.status === 'Completed'
                          ? 'success'
                          : c.status === 'Under Evaluation'
                          ? 'warning'
                          : 'info'
                      }
                      size="sm"
                    >
                      {c.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <RowActionMenu
                      ariaLabel={`Actions for ${c.name}`}
                      items={[
                        {
                          id: 'edit',
                          label: 'Edit cycle',
                          icon: <Edit2 className="w-3.5 h-3.5" />,
                          onClick: () => openEdit(c),
                        },
                        {
                          id: 'status',
                          label: c.status === 'Completed' ? 'Reopen cycle' : 'Mark completed',
                          icon: <CheckSquare className="w-3.5 h-3.5" />,
                          onClick: () =>
                            updateCycle(c.id, {
                              status: c.status === 'Completed' ? 'Under Evaluation' : 'Completed',
                            }),
                        },
                        {
                          id: 'delete',
                          label: 'Delete cycle',
                          icon: <Trash2 className="w-3.5 h-3.5" />,
                          destructive: true,
                          separatorBefore: true,
                          onClick: () => setDeleteTarget(c),
                        },
                      ]}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Add Cycle Drawer */}
      <Drawer open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DrawerContent
          title="Add accreditation cycle"
          description="Create a new institutional survey window for AACCUP or CHED review"
          size="lg"
        >
          <form onSubmit={handleCreate} className="space-y-4 pt-2">
            <div>
              <Input
                label="Cycle name"
                placeholder="e.g. ZPPSU AACCUP 5th Survey Visit (2026)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Accrediting agency
                </label>
                <select
                  value={body}
                  onChange={(e) => setBody(e.target.value as AccreditationBody)}
                  className="w-full text-xs p-2 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
                >
                  <option value="AACCUP">AACCUP</option>
                  <option value="CHED">CHED</option>
                  <option value="ALCUCOA">ALCUCOA</option>
                  <option value="PAASCU">PAASCU</option>
                </select>
              </div>
              <div>
                <Input
                  label="Academic year"
                  placeholder="2026-2027"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Input
                  label="Start date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <Input
                  label="End / audit date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Target accreditation level
              </label>
              <select
                value={targetLevel}
                onChange={(e) => setTargetLevel(e.target.value as AccreditationLevel)}
                className="w-full text-xs p-2 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
              >
                <option value="Level I">Level I</option>
                <option value="Level II Re-accredited">Level II Re-accredited</option>
                <option value="Level III Phase 1">Level III Phase 1</option>
                <option value="Level III Phase 2">Level III Phase 2</option>
                <option value="Level IV">Level IV</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Select participating programs
              </label>
              <div className="border border-[var(--border)] rounded-[var(--radius-control)] p-2.5 max-h-36 overflow-y-auto space-y-1.5 bg-[var(--surface-muted)]">
                {programs.map((p) => {
                  const isChecked = selectedPrograms.includes(p.id);
                  return (
                    <label
                      key={p.id}
                      className="flex items-center gap-2 text-xs text-[var(--foreground)] cursor-pointer hover:bg-[var(--surface)] p-1 rounded transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleProgram(p.id)}
                        className="rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]"
                      />
                      <span className="font-medium text-[var(--accent)]">{p.code}</span>
                      <span className="truncate">{p.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Description / visit objectives
              </label>
              <textarea
                rows={2}
                placeholder="State the visit purpose and survey scope..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-xs p-2.5 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border)]">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setIsAddOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Create cycle
              </Button>
            </div>
          </form>
        </DrawerContent>
      </Drawer>

      {/* Edit Cycle Drawer */}
      <Drawer open={Boolean(editingCycle)} onOpenChange={(open) => !open && setEditingCycle(null)}>
        <DrawerContent
          title="Edit accreditation cycle"
          description="Update schedule, target level, and participating programs"
          size="lg"
        >
          <form onSubmit={handleUpdate} className="space-y-4 pt-2">
            <div>
              <Input
                label="Cycle name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Accrediting agency
                </label>
                <select
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value as AccreditationBody)}
                  className="w-full text-xs p-2 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
                >
                  <option value="AACCUP">AACCUP</option>
                  <option value="CHED">CHED</option>
                  <option value="ALCUCOA">ALCUCOA</option>
                  <option value="PAASCU">PAASCU</option>
                </select>
              </div>
              <div>
                <Input
                  label="Academic year"
                  value={editAcademicYear}
                  onChange={(e) => setEditAcademicYear(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Input
                  label="Start date"
                  type="date"
                  value={editStartDate}
                  onChange={(e) => setEditStartDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <Input
                  label="End / audit date"
                  type="date"
                  value={editEndDate}
                  onChange={(e) => setEditEndDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Target accreditation level
              </label>
              <select
                value={editTargetLevel}
                onChange={(e) => setEditTargetLevel(e.target.value as AccreditationLevel)}
                className="w-full text-xs p-2 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
              >
                <option value="Level I">Level I</option>
                <option value="Level II Re-accredited">Level II Re-accredited</option>
                <option value="Level III Phase 1">Level III Phase 1</option>
                <option value="Level III Phase 2">Level III Phase 2</option>
                <option value="Level IV">Level IV</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Select participating programs
              </label>
              <div className="border border-[var(--border)] rounded-[var(--radius-control)] p-2.5 max-h-36 overflow-y-auto space-y-1.5 bg-[var(--surface-muted)]">
                {programs.map((p) => {
                  const isChecked = editSelectedPrograms.includes(p.id);
                  return (
                    <label
                      key={p.id}
                      className="flex items-center gap-2 text-xs text-[var(--foreground)] cursor-pointer hover:bg-[var(--surface)] p-1 rounded transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleEditProgram(p.id)}
                        className="rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]"
                      />
                      <span className="font-medium text-[var(--accent)]">{p.code}</span>
                      <span className="truncate">{p.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Description / visit objectives
              </label>
              <textarea
                rows={2}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full text-xs p-2.5 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border)]">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setEditingCycle(null)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Save changes
              </Button>
            </div>
          </form>
        </DrawerContent>
      </Drawer>

      {/* Delete Cycle Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Accreditation Cycle"
        description={`Are you sure you want to delete cycle "${deleteTarget?.name}"? All schedule timelines associated with this cycle will be removed.`}
        confirmLabel="Delete cycle"
        tone="danger"
        onConfirm={() => {
          if (deleteTarget) {
            deleteCycle(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
      />
    </div>
  );
}
