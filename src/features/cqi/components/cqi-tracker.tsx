'use client';

import React, { useState, useMemo } from 'react';
import { useAccreditationStore } from '@/features/accreditations/context/store-context';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ShieldAlert,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  Search,
  FileText,
  DollarSign,
  TrendingUp,
  Trash2,
  Calendar,
  User,
  ArrowRight,
} from 'lucide-react';
import { calculateCQIStats, filterCQIPlans, evaluatePlanOverdue } from '../calculations';
import type { CQIActionPlan, CQIActionPlanStatus, AreaNumber } from '@/types/domain/accreditation';

export function CQITracker() {
  const { cqiPlans, programs, documents, createCQIPlan, updateCQIPlan, deleteCQIPlan } =
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

  // Dialog State for linking evidence
  const [activePlanForEvidence, setActivePlanForEvidence] = useState<CQIActionPlan | null>(null);

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
    // Reset form
    setNewTitle('');
    setNewDeficiency('');
    setNewActions('');
    setNewLead('');
    setNewBudget(0);
  };

  const getStatusBadge = (plan: CQIActionPlan) => {
    const isOverdue = evaluatePlanOverdue(plan.targetCompletionDate, plan.status);
    if (isOverdue || plan.status === 'Overdue') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[var(--radius-control)] text-xs font-medium bg-red-500/10 text-red-600 border border-red-200">
          <AlertTriangle className="w-3 h-3" /> Overdue
        </span>
      );
    }

    switch (plan.status) {
      case 'Verified Compliant':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[var(--radius-control)] text-xs font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Verified Compliant
          </span>
        );
      case 'Evidence Submitted':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[var(--radius-control)] text-xs font-medium bg-blue-500/10 text-blue-600 border border-blue-200">
            <Clock className="w-3 h-3" /> Evidence Submitted
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[var(--radius-control)] text-xs font-medium bg-amber-500/10 text-amber-600 border border-amber-200">
            <Clock className="w-3 h-3" /> In Progress
          </span>
        );
      case 'Not Started':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[var(--radius-control)] text-xs font-medium bg-[var(--surface-muted)] text-[var(--text-muted)] border border-[var(--border)]">
            Not Started
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-[var(--foreground)] tracking-tight">
            Continuous Quality Improvement (CQI) Tracker
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Post-accreditation closed-loop action plan management, deficiency remediation, and compliance evidence linkage.
          </p>
        </div>
        <Button
          onClick={() => {
            if (programs.length > 0 && !newProgramId) {
              setNewProgramId(programs[0]!.id);
            }
            setIsCreateOpen(true);
          }}
          className="inline-flex items-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white text-xs font-medium px-3 py-2 rounded-[var(--radius-control)] transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4 stroke-[2]" />
          <span>New CQI Action Plan</span>
        </Button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <Card className="border-[var(--border)] bg-[var(--surface)] shadow-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider">
                Resolution Rate
              </span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-semibold text-[var(--foreground)] mt-2">
              {stats.resolutionPercentage}%
            </div>
            <div className="w-full bg-[var(--surface-muted)] h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${stats.resolutionPercentage}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[var(--border)] bg-[var(--surface)] shadow-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider">
                Total Action Plans
              </span>
              <FileText className="w-4 h-4 text-[var(--text-muted)]" />
            </div>
            <div className="text-2xl font-semibold text-[var(--foreground)] mt-2">
              {stats.totalPlans}
            </div>
            <span className="text-xs text-[var(--text-secondary)] mt-1 block">
              Across all assigned areas
            </span>
          </CardContent>
        </Card>

        <Card className="border-[var(--border)] bg-[var(--surface)] shadow-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider">
                Verified Compliant
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-semibold text-emerald-600 mt-2">
              {stats.verifiedCompliantCount}
            </div>
            <span className="text-xs text-[var(--text-secondary)] mt-1 block">
              Auditor sign-off achieved
            </span>
          </CardContent>
        </Card>

        <Card className="border-[var(--border)] bg-[var(--surface)] shadow-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider">
                Overdue Commitments
              </span>
              <ShieldAlert className="w-4 h-4 text-red-500" />
            </div>
            <div className="text-2xl font-semibold text-red-600 mt-2">
              {stats.overdueCount}
            </div>
            <span className="text-xs text-red-500/80 mt-1 block">
              Past scheduled milestone
            </span>
          </CardContent>
        </Card>

        <Card className="border-[var(--border)] bg-[var(--surface)] shadow-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider">
                Remediation Budget
              </span>
              <DollarSign className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-semibold text-[var(--foreground)] mt-2">
              PHP {(stats.totalAllocatedBudget / 1000).toFixed(0)}k
            </div>
            <span className="text-xs text-[var(--text-secondary)] mt-1 block">
              Committed quality funds
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-[var(--surface)] p-3 rounded-[var(--radius-panel)] border border-[var(--border)] shadow-xs">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <div className="relative min-w-[200px] flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[var(--text-muted)]" />
            <Input
              type="text"
              placeholder="Search deficiency, plan title, or lead..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs h-9 bg-[var(--surface)] border-[var(--border)]"
            />
          </div>

          <select
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value)}
            className="text-xs h-9 px-3 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-hidden"
          >
            <option value="All">All Programs</option>
            {programs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code} - {p.name}
              </option>
            ))}
          </select>

          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="text-xs h-9 px-3 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-hidden"
          >
            <option value="All">All Areas (1-10)</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <option key={num} value={num}>
                Area {num}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs h-9 px-3 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-hidden"
          >
            <option value="All">All Statuses</option>
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Evidence Submitted">Evidence Submitted</option>
            <option value="Verified Compliant">Verified Compliant</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>

        <span className="text-xs text-[var(--text-muted)] self-center px-1">
          Showing {filteredPlans.length} of {cqiPlans.length} plans
        </span>
      </div>

      {/* Action Plans Table */}
      <Card className="border-[var(--border)] bg-[var(--surface)] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-[var(--surface-muted)]">
              <TableRow className="border-b border-[var(--border)]">
                <TableHead className="text-xs font-semibold text-[var(--text-muted)] w-28">
                  Program & Area
                </TableHead>
                <TableHead className="text-xs font-semibold text-[var(--text-muted)] min-w-[240px]">
                  Deficiency & Action Plan
                </TableHead>
                <TableHead className="text-xs font-semibold text-[var(--text-muted)] w-44">
                  Lead & Target Date
                </TableHead>
                <TableHead className="text-xs font-semibold text-[var(--text-muted)] w-28">
                  Budget
                </TableHead>
                <TableHead className="text-xs font-semibold text-[var(--text-muted)] w-36">
                  Status
                </TableHead>
                <TableHead className="text-xs font-semibold text-[var(--text-muted)] w-32 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-xs text-[var(--text-muted)]">
                    No CQI action plans matching the selected criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPlans.map((plan) => {
                  const isOverdue = evaluatePlanOverdue(plan.targetCompletionDate, plan.status);
                  return (
                    <TableRow
                      key={plan.id}
                      className="border-b border-[var(--border-subtle)] hover:bg-[var(--surface-muted)]/50 transition-colors"
                    >
                      <TableCell className="align-top py-3.5">
                        <span className="font-semibold text-xs text-[var(--foreground)] block">
                          {plan.programCode}
                        </span>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[11px] font-medium px-1.5 py-0.5 rounded bg-[var(--surface-muted)] text-[var(--text-secondary)] border border-[var(--border)]">
                            Area {plan.areaNumber}
                          </span>
                          <span className="text-[11px] text-[var(--text-muted)]">
                            {plan.parameterCode}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="align-top py-3.5">
                        <div className="text-xs font-medium text-[var(--foreground)]">
                          {plan.actionPlanTitle}
                        </div>
                        <p className="text-[11px] text-[var(--text-secondary)] mt-1 line-clamp-2">
                          <strong className="text-[var(--text-muted)]">Deficiency:</strong>{' '}
                          {plan.deficiencyOrRecommendation}
                        </p>
                        <p className="text-[11px] text-[var(--text-muted)] mt-1 line-clamp-2">
                          <strong className="text-[var(--text-muted)]">Intervention:</strong>{' '}
                          {plan.plannedActions}
                        </p>
                        {plan.complianceRemarks && (
                          <span className="inline-block text-[10px] text-blue-600 bg-blue-500/10 px-1.5 py-0.5 rounded mt-1.5">
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
                        <span className="text-xs font-semibold text-[var(--foreground)] tabular-nums">
                          PHP {plan.allocatedBudget.toLocaleString()}
                        </span>
                      </TableCell>

                      <TableCell className="align-top py-3.5">
                        {getStatusBadge(plan)}
                      </TableCell>

                      <TableCell className="align-top py-3.5 text-right space-x-1">
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
                          <option value="Not Started">Not Started</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Evidence Submitted">Evidence Submitted</option>
                          <option value="Verified Compliant">Verified Compliant</option>
                          <option value="Overdue">Overdue</option>
                        </select>

                        <button
                          onClick={() => deleteCQIPlan(plan.id)}
                          title="Delete plan"
                          className="p-1 rounded-[var(--radius-control)] text-[var(--text-muted)] hover:text-red-600 hover:bg-red-500/10 transition-colors inline-flex items-center justify-center"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* Create New CQI Action Plan Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent title="Create New CQI Action Plan" className="max-w-xl bg-[var(--surface)] border-[var(--border)] p-6">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
            <h2 className="text-sm font-semibold text-[var(--foreground)]">
              Create New CQI Action Plan
            </h2>
          </div>

          <form onSubmit={handleCreateSubmit} className="space-y-4 pt-3">
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
                    className="w-1/2 text-xs h-9 bg-[var(--surface)] border-[var(--border)]"
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
                className="text-xs h-9 bg-[var(--surface)] border-[var(--border)]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Accreditation Deficiency / Evaluator Recommendation
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
                  className="text-xs h-9 bg-[var(--surface)] border-[var(--border)]"
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
                  className="text-xs h-9 bg-[var(--surface)] border-[var(--border)]"
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
                  className="text-xs h-9 bg-[var(--surface)] border-[var(--border)]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border)]">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
                className="text-xs h-9 px-3 border-[var(--border)]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="text-xs h-9 px-4 bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white font-medium"
              >
                Create Action Plan
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
