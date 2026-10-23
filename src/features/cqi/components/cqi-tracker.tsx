'use client';

import React, { useState, useMemo } from 'react';
import { useAccreditationStore } from '@/features/accreditations/context/store-context';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
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
import {
  TrendingUp,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
  User,
  Trash2,
  DollarSign,
  ShieldAlert,
  ClipboardList,
} from 'lucide-react';
import { calculateCQIStats, filterCQIPlans, evaluatePlanOverdue } from '../calculations';
import type { CQIActionPlan, CQIActionPlanStatus, AreaNumber } from '@/types/domain/accreditation';

export function CQITracker() {
  const { cqiPlans, programs, createCQIPlan, updateCQIPlan, deleteCQIPlan } =
    useAccreditationStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProgram, setSelectedProgram] = useState<string>('All');
  const [selectedArea, setSelectedArea] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // Dialog State for creating a new action plan
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newProgramId, setNewProgramId] = useState('');
  const [newAreaNumber, setNewAreaNumber] = useState<number>(1);
  const [newParameterCode, setNewParameterCode] = useState('Parameter A');
  const [newDeficiency, setNewDeficiency] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newActions, setNewActions] = useState('');
  const [newLead, setNewLead] = useState('');
  const [newTargetDate, setNewTargetDate] = useState('');
  const [newBudget, setNewBudget] = useState<number>(0);

  const stats = useMemo(() => calculateCQIStats(cqiPlans), [cqiPlans]);

  const filteredPlans = useMemo(() => {
    return filterCQIPlans(cqiPlans, {
      programId: selectedProgram !== 'All' ? selectedProgram : undefined,
      areaNumber: selectedArea !== 'All' ? (Number(selectedArea) as AreaNumber) : undefined,
      status: selectedStatus !== 'All' ? selectedStatus : undefined,
      searchQuery: searchQuery.trim() || undefined,
    });
  }, [cqiPlans, selectedProgram, selectedArea, selectedStatus, searchQuery]);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prog = programs.find((p) => p.id === newProgramId) || programs[0];
    if (!prog) return;

    createCQIPlan({
      cycleId: 'cycle-zppsu-4th',
      programId: prog.id,
      programCode: prog.code,
      areaNumber: newAreaNumber as AreaNumber,
      parameterCode: newParameterCode,
      deficiencyOrRecommendation: newDeficiency,
      actionPlanTitle: newTitle,
      plannedActions: newActions,
      responsiblePerson: newLead,
      targetCompletionDate: newTargetDate || new Date().toISOString().split('T')[0]!,
      allocatedBudget: Number(newBudget) || 0,
      status: 'In Progress',
      evidenceIds: [],
      complianceRemarks: 'Initiated through CQI Quality Action tracker.',
    });

    setIsCreateOpen(false);
    setNewTitle('');
    setNewDeficiency('');
    setNewActions('');
    setNewLead('');
    setNewBudget(0);
  };

  const renderStatusBadge = (plan: CQIActionPlan) => {
    const isOverdue = evaluatePlanOverdue(plan.targetCompletionDate, plan.status);
    if (isOverdue || plan.status === 'Overdue') {
      return (
        <Badge tone="danger" size="sm">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Overdue
        </Badge>
      );
    }

    switch (plan.status) {
      case 'Verified Compliant':
        return (
          <Badge tone="success" size="sm">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Verified compliant
          </Badge>
        );
      case 'Evidence Submitted':
        return (
          <Badge tone="info" size="sm">
            <Clock className="w-3 h-3 mr-1" />
            Evidence submitted
          </Badge>
        );
      case 'In Progress':
        return (
          <Badge tone="warning" size="sm">
            <Clock className="w-3 h-3 mr-1" />
            In progress
          </Badge>
        );
      case 'Not Started':
      default:
        return (
          <Badge tone="neutral" size="sm">
            Not started
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[var(--border)]">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-medium text-[var(--foreground)] tracking-tight flex items-center gap-2.5">
            <TrendingUp className="w-6 h-6 text-[var(--accent)] stroke-[1.75]" />
            Continuous quality improvement
          </h1>
          <p className="font-[family-name:var(--font-body)] text-xs text-[var(--text-muted)] mt-1">
            Post-accreditation action plan tracking, evaluator deficiency remediation, and compliance evidence linkage
          </p>
        </div>

        <Button
          onClick={() => {
            if (programs.length > 0 && !newProgramId) {
              setNewProgramId(programs[0]!.id);
            }
            setIsCreateOpen(true);
          }}
          size="sm"
          className="gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[1.75]" />
          <span>New action plan</span>
        </Button>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
        <Card>
          <CardHeader className="pb-2">
            <span className="text-xs font-medium text-[var(--text-secondary)]">Total action plans</span>
            <CardTitle className="text-2xl font-medium text-[var(--foreground)] tabular-nums">
              {stats.totalPlans}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-[var(--text-muted)]">Across all evaluated standard areas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <span className="text-xs font-medium text-[var(--text-secondary)]">Resolution progress</span>
            <CardTitle className="text-2xl font-medium text-emerald-700 tabular-nums">
              {stats.resolutionPercentage}%
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-[var(--text-muted)]">
              {stats.verifiedCompliantCount} of {stats.totalPlans} deficiencies verified
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <span className="text-xs font-medium text-[var(--text-secondary)]">Remediation budget</span>
            <CardTitle className="text-2xl font-medium text-[var(--accent)] tabular-nums">
              PHP {(stats.totalAllocatedBudget / 1000).toFixed(0)}k
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-[var(--text-muted)]">Committed institutional funds</p>
          </CardContent>
        </Card>

        <Card className={stats.overdueCount > 0 ? 'border-l-4 border-l-red-500' : ''}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className={`text-xs font-medium ${stats.overdueCount > 0 ? 'text-red-600' : 'text-[var(--text-secondary)]'}`}>
                Overdue milestones
              </span>
              {stats.overdueCount > 0 && <ShieldAlert className="w-4 h-4 text-red-500 stroke-[1.75]" />}
            </div>
            <CardTitle className={`text-2xl font-medium tabular-nums ${stats.overdueCount > 0 ? 'text-red-600' : 'text-[var(--foreground)]'}`}>
              {stats.overdueCount}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-[var(--text-muted)]">Past scheduled target completion</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="overflow-hidden">
        {/* Toolbar Header */}
        <div className="p-4 border-b border-[var(--border)] flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-[var(--accent)] stroke-[1.75]" />
            <h2 className="font-[family-name:var(--font-display)] text-sm font-medium text-[var(--foreground)]">
              Action plan registry
            </h2>
            <Badge tone="neutral" size="sm">
              {filteredPlans.length}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] stroke-[1.75]" />
              <Input
                type="text"
                placeholder="Search action plans..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 text-xs h-8"
              />
            </div>

            <select
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              className="text-xs h-8 px-2.5 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-hidden"
            >
              <option value="All">All programs</option>
              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.code}
                </option>
              ))}
            </select>

            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="text-xs h-8 px-2.5 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-hidden"
            >
              <option value="All">All areas (1-10)</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <option key={num} value={num}>
                  Area {num}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs h-8 px-2.5 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-hidden"
            >
              <option value="All">All statuses</option>
              <option value="In Progress">In progress</option>
              <option value="Evidence Submitted">Evidence submitted</option>
              <option value="Verified Compliant">Verified compliant</option>
              <option value="Overdue">Overdue</option>
              <option value="Not Started">Not started</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-[var(--surface-muted)]">
              <TableRow className="border-b border-[var(--border)]">
                <TableHead className="font-[family-name:var(--font-display)] text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider w-28">
                  Program & Area
                </TableHead>
                <TableHead className="font-[family-name:var(--font-display)] text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider min-w-[260px]">
                  Deficiency & Action Plan
                </TableHead>
                <TableHead className="font-[family-name:var(--font-display)] text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider w-44">
                  Lead & Target Date
                </TableHead>
                <TableHead className="font-[family-name:var(--font-display)] text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider w-32">
                  Budget
                </TableHead>
                <TableHead className="font-[family-name:var(--font-display)] text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider w-36">
                  Status
                </TableHead>
                <TableHead className="font-[family-name:var(--font-display)] text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider w-36 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 font-[family-name:var(--font-body)] text-xs text-[var(--text-muted)]">
                    No CQI action plans matching the current filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPlans.map((plan) => {
                  const isOverdue = evaluatePlanOverdue(plan.targetCompletionDate, plan.status);
                  return (
                    <TableRow
                      key={plan.id}
                      className="border-b border-[var(--border)] hover:bg-[var(--surface-muted)]/50 transition-colors"
                    >
                      <TableCell className="align-top py-3.5">
                        <span className="font-semibold text-xs text-[var(--foreground)] block">
                          {plan.programCode}
                        </span>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Badge tone="neutral" size="sm">
                            Area {plan.areaNumber}
                          </Badge>
                          <span className="text-[11px] text-[var(--text-muted)]">
                            {plan.parameterCode}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="align-top py-3.5 space-y-1">
                        <div className="text-xs font-medium text-[var(--foreground)]">
                          {plan.actionPlanTitle}
                        </div>
                        <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2">
                          <strong className="text-[var(--text-muted)] font-normal">Finding:</strong>{' '}
                          {plan.deficiencyOrRecommendation}
                        </p>
                        <p className="text-[11px] text-[var(--text-muted)] line-clamp-2">
                          <strong className="text-[var(--text-muted)] font-normal">Intervention:</strong>{' '}
                          {plan.plannedActions}
                        </p>
                        {plan.complianceRemarks && (
                          <span className="inline-block text-[10px] text-blue-700 bg-blue-500/10 px-1.5 py-0.5 rounded mt-1">
                            {plan.complianceRemarks}
                          </span>
                        )}
                      </TableCell>

                      <TableCell className="align-top py-3.5">
                        <div className="flex items-center gap-1.5 text-xs text-[var(--foreground)]">
                          <User className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
                          <span className="truncate">{plan.responsiblePerson}</span>
                        </div>
                        <div
                          className={`flex items-center gap-1.5 text-[11px] mt-1.5 ${
                            isOverdue ? 'text-red-600 font-medium' : 'text-[var(--text-muted)]'
                          }`}
                        >
                          <Calendar className="w-3.5 h-3.5 shrink-0" />
                          <span>{plan.targetCompletionDate}</span>
                        </div>
                      </TableCell>

                      <TableCell className="align-top py-3.5">
                        <span className="text-xs font-medium text-[var(--foreground)] tabular-nums">
                          PHP {plan.allocatedBudget.toLocaleString()}
                        </span>
                      </TableCell>

                      <TableCell className="align-top py-3.5">
                        {renderStatusBadge(plan)}
                      </TableCell>

                      <TableCell className="align-top py-3.5 text-right space-x-1.5">
                        <select
                          value={plan.status}
                          onChange={(e) =>
                            updateCQIPlan(plan.id, {
                              status: e.target.value as CQIActionPlanStatus,
                              lastAuditedAt:
                                e.target.value === 'Verified Compliant'
                                  ? new Date().toISOString().split('T')[0]!
                                  : plan.lastAuditedAt,
                            })
                          }
                          className="text-[11px] py-1 px-2 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-hidden"
                        >
                          <option value="Not Started">Not started</option>
                          <option value="In Progress">In progress</option>
                          <option value="Evidence Submitted">Evidence submitted</option>
                          <option value="Verified Compliant">Verified compliant</option>
                          <option value="Overdue">Overdue</option>
                        </select>

                        <button
                          onClick={() => deleteCQIPlan(plan.id)}
                          title="Delete action plan"
                          className="p-1 rounded-[var(--radius-control)] text-[var(--text-muted)] hover:text-red-600 hover:bg-red-500/10 transition-colors inline-flex items-center justify-center"
                        >
                          <Trash2 className="w-3.5 h-3.5 stroke-[1.75]" />
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Create New CQI Action Plan Drawer */}
      <Drawer open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DrawerContent
          title="Create New CQI Action Plan"
          description="Register a new post-accreditation institutional action plan to address specific evaluator recommendations or benchmark deficiencies."
          size="xl"
        >
          <form onSubmit={handleCreateSubmit} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Program
                </label>
                <select
                  value={newProgramId}
                  onChange={(e) => setNewProgramId(e.target.value)}
                  className="w-full text-xs h-9 px-3 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)]"
                  required
                >
                  {programs.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.code} - {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Area & Parameter
                </label>
                <div className="flex gap-2">
                  <select
                    value={newAreaNumber}
                    onChange={(e) => setNewAreaNumber(Number(e.target.value))}
                    className="w-1/2 text-xs h-9 px-3 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)]"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <option key={num} value={num}>
                        Area {num}
                      </option>
                    ))}
                  </select>
                  <Input
                    type="text"
                    value={newParameterCode}
                    onChange={(e) => setNewParameterCode(e.target.value)}
                    placeholder="e.g. Parameter A"
                    className="w-1/2 text-xs h-9"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Action Plan Title
              </label>
              <Input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Capstone Industry Advisory Review Formalization"
                className="text-xs h-9"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Evaluator Recommendation / Deficient Benchmark
              </label>
              <textarea
                value={newDeficiency}
                onChange={(e) => setNewDeficiency(e.target.value)}
                placeholder="Describe the evaluator finding or deficient benchmark..."
                rows={2}
                className="w-full text-xs p-2.5 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-hidden"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Planned Remedial Interventions
              </label>
              <textarea
                value={newActions}
                onChange={(e) => setNewActions(e.target.value)}
                placeholder="Specific steps and deliverables to close the compliance gap..."
                rows={2}
                className="w-full text-xs p-2.5 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-hidden"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Responsible Lead
                </label>
                <Input
                  type="text"
                  value={newLead}
                  onChange={(e) => setNewLead(e.target.value)}
                  placeholder="e.g. Dean, CICS"
                  className="text-xs h-9"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Target Date
                </label>
                <Input
                  type="date"
                  value={newTargetDate}
                  onChange={(e) => setNewTargetDate(e.target.value)}
                  className="text-xs h-9"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Allocated Budget (PHP)
                </label>
                <Input
                  type="number"
                  value={newBudget}
                  onChange={(e) => setNewBudget(Number(e.target.value))}
                  placeholder="0"
                  className="text-xs h-9"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border)]">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsCreateOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="gap-1.5"
              >
                Create action plan
              </Button>
            </div>
          </form>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
