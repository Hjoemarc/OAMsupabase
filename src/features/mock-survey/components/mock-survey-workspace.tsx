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
  AlertTriangle,
  Award,
  Plus,
  ArrowRight,
  TrendingUp,
  UserCheck,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';
import { calculateMockSessionMetrics } from '../calculations';
import type {
  MockSurveySession,
  MockAuditFinding,
  MockFindingType,
  AreaNumber,
} from '@/types/domain/accreditation';

export function MockSurveyWorkspace() {
  const {
    mockSessions,
    programs,
    cycles,
    createMockSession,
    addMockFinding,
    promoteMockFindingToCQI,
  } = useAccreditationStore();

  const [selectedSessionId, setSelectedSessionId] = useState<string>(
    mockSessions[0]?.id || ''
  );

  // Modal State for new mock session
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [newSessionTitle, setNewSessionTitle] = useState('');
  const [newProgramId, setNewProgramId] = useState('');
  const [newCycleId, setNewCycleId] = useState('');
  const [newAuditLead, setNewAuditLead] = useState('');
  const [newScheduledDate, setNewScheduledDate] = useState('');

  // Modal State for new mock finding
  const [isFindingModalOpen, setIsFindingModalOpen] = useState(false);
  const [newAreaNumber, setNewAreaNumber] = useState<number>(3);
  const [newParameterCode, setNewParameterCode] = useState('Parameter A');
  const [newMockScore, setNewMockScore] = useState<number>(3.0);
  const [newFindingType, setNewFindingType] = useState<MockFindingType>('Critical Gap');
  const [newObservation, setNewObservation] = useState('');
  const [newUrgentAction, setNewUrgentAction] = useState('');
  const [newAuditorName, setNewAuditorName] = useState('');

  // Toast / feedback message
  const [promotionNotice, setPromotionNotice] = useState<string | null>(null);

  const activeSession: MockSurveySession | undefined = useMemo(() => {
    return mockSessions.find((s) => s.id === selectedSessionId) || mockSessions[0];
  }, [mockSessions, selectedSessionId]);

  const metrics = useMemo(() => {
    if (!activeSession) {
      return {
        grandMeanScore: null,
        criticalGapCount: 0,
        minorDeficiencyCount: 0,
        strengthCount: 0,
        totalFindings: 0,
        riskLevel: 'Low Risk' as const,
      };
    }
    return calculateMockSessionMetrics(activeSession.findings);
  }, [activeSession]);

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    const prog = programs.find((p) => p.id === newProgramId) || programs[0];
    const cycle = cycles.find((c) => c.id === newCycleId) || cycles[0];
    if (!prog || !cycle) return;

    const created = createMockSession({
      cycleId: cycle.id,
      cycleName: cycle.name,
      programId: prog.id,
      programCode: prog.code,
      programName: prog.name,
      title: newSessionTitle,
      auditTeamLead: newAuditLead,
      scheduledDate: newScheduledDate || new Date().toISOString().split('T')[0]!,
      status: 'In Progress',
    });

    setSelectedSessionId(created.id);
    setIsSessionModalOpen(false);
    // Reset form
    setNewSessionTitle('');
    setNewAuditLead('');
  };

  const handleAddFinding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSession) return;

    addMockFinding(activeSession.id, {
      sessionId: activeSession.id,
      areaNumber: newAreaNumber as AreaNumber,
      parameterCode: newParameterCode,
      mockScore: Number(newMockScore),
      findingType: newFindingType,
      observation: newObservation,
      urgentActionNeeded: newUrgentAction,
      auditorName: newAuditorName || activeSession.auditTeamLead,
    });

    setIsFindingModalOpen(false);
    // Reset form
    setNewObservation('');
    setNewUrgentAction('');
  };

  const handlePromote = (findingId: string) => {
    if (!activeSession) return;
    const promotedPlan = promoteMockFindingToCQI(findingId, activeSession.id);
    if (promotedPlan) {
      setPromotionNotice(
        `Successfully promoted to formal CQI Action Plan (${promotedPlan.actionPlanTitle})! View under CQI Tracker.`
      );
      setTimeout(() => setPromotionNotice(null), 5000);
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'Critical Risk':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[var(--radius-control)] text-xs font-semibold bg-red-500/10 text-red-600 border border-red-200">
            <ShieldAlert className="w-4 h-4" /> Critical Risk (Accreditation Failure Likely)
          </span>
        );
      case 'Moderate Risk':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[var(--radius-control)] text-xs font-semibold bg-amber-500/10 text-amber-600 border border-amber-200">
            <AlertTriangle className="w-4 h-4" /> Moderate Risk (Remediation Needed Before Visit)
          </span>
        );
      case 'Low Risk':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[var(--radius-control)] text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" /> Low Risk (High Probability of Success)
          </span>
        );
    }
  };

  const getFindingTypeBadge = (type: MockFindingType) => {
    switch (type) {
      case 'Critical Gap':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[var(--radius-control)] text-[11px] font-medium bg-red-500/10 text-red-600 border border-red-200">
            <ShieldAlert className="w-3 h-3" /> Critical Gap
          </span>
        );
      case 'Minor Deficiency':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[var(--radius-control)] text-[11px] font-medium bg-amber-500/10 text-amber-600 border border-amber-200">
            <AlertTriangle className="w-3 h-3" /> Minor Deficiency
          </span>
        );
      case 'Commendable Strength':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[var(--radius-control)] text-[11px] font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-200">
            <Award className="w-3 h-3" /> Commendable Strength
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
            Mock Survey & Pre-Audit Simulation Workspace
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Sandboxed dry-run evaluations, internal mock audits, and one-click promotion of critical deficiencies directly into the CQI Action Plan tracker.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              if (programs.length > 0 && !newProgramId) setNewProgramId(programs[0]!.id);
              if (cycles.length > 0 && !newCycleId) setNewCycleId(cycles[0]!.id);
              setIsSessionModalOpen(true);
            }}
            variant="outline"
            className="text-xs font-medium px-3 py-2 border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] rounded-[var(--radius-control)]"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            <span>New Mock Session</span>
          </Button>

          <Button
            onClick={() => {
              if (activeSession) {
                setNewAuditorName(activeSession.auditTeamLead);
              }
              setIsFindingModalOpen(true);
            }}
            className="inline-flex items-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white text-xs font-medium px-3.5 py-2 rounded-[var(--radius-control)] shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4 stroke-[2]" />
            <span>Record Mock Finding</span>
          </Button>
        </div>
      </div>

      {/* Promotion Feedback Notification */}
      {promotionNotice && (
        <div className="bg-emerald-500/10 border border-emerald-300 text-emerald-800 text-xs px-4 py-3 rounded-[var(--radius-panel)] flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{promotionNotice}</span>
          </div>
          <button
            onClick={() => setPromotionNotice(null)}
            className="text-emerald-700 hover:text-emerald-900 font-semibold"
          >
            &times;
          </button>
        </div>
      )}

      {/* Session Selector Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[var(--surface)] p-3.5 rounded-[var(--radius-panel)] border border-[var(--border)] shadow-xs">
        <div className="flex items-center gap-2.5">
          <Layers className="w-4 h-4 text-[var(--text-muted)]" />
          <span className="text-xs font-medium text-[var(--text-secondary)]">Active Simulation:</span>
          <select
            value={selectedSessionId}
            onChange={(e) => setSelectedSessionId(e.target.value)}
            className="text-xs font-semibold h-8 px-3 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-hidden"
          >
            {mockSessions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.programCode} &bull; {s.title} ({s.scheduledDate})
              </option>
            ))}
          </select>
        </div>

        {activeSession && (
          <div className="flex items-center gap-3">
            <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5" />
              Lead: {activeSession.auditTeamLead}
            </span>
            <div>{getRiskBadge(metrics.riskLevel)}</div>
          </div>
        )}
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <Card className="border-[var(--border)] bg-[var(--surface)] shadow-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider">
                Simulation Mean Score
              </span>
              <TrendingUp className="w-4 h-4 text-[var(--accent)]" />
            </div>
            <div className="text-2xl font-semibold text-[var(--foreground)] mt-2">
              {metrics.grandMeanScore !== null ? `${metrics.grandMeanScore.toFixed(2)} / 5.0` : 'Pending'}
            </div>
            <span className="text-xs text-[var(--text-secondary)] mt-1 block">
              {metrics.grandMeanScore && metrics.grandMeanScore >= 4.0
                ? 'Targeting Level III benchmark'
                : 'Remediation required for passing'}
            </span>
          </CardContent>
        </Card>

        <Card className="border-[var(--border)] bg-[var(--surface)] shadow-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider">
                Critical Gaps
              </span>
              <ShieldAlert className="w-4 h-4 text-red-500" />
            </div>
            <div className="text-2xl font-semibold text-red-600 mt-2">
              {metrics.criticalGapCount}
            </div>
            <span className="text-xs text-red-500/80 mt-1 block">
              Must resolve prior to official visit
            </span>
          </CardContent>
        </Card>

        <Card className="border-[var(--border)] bg-[var(--surface)] shadow-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider">
                Minor Deficiencies
              </span>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-semibold text-amber-600 mt-2">
              {metrics.minorDeficiencyCount}
            </div>
            <span className="text-xs text-amber-600/80 mt-1 block">
              Recommend rapid action plans
            </span>
          </CardContent>
        </Card>

        <Card className="border-[var(--border)] bg-[var(--surface)] shadow-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider">
                Commendable Strengths
              </span>
              <Award className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-semibold text-emerald-600 mt-2">
              {metrics.strengthCount}
            </div>
            <span className="text-xs text-[var(--text-secondary)] mt-1 block">
              Exemplary institutional benchmarks
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Findings Table */}
      <Card className="border-[var(--border)] bg-[var(--surface)] shadow-xs overflow-hidden">
        <CardHeader className="p-4 border-b border-[var(--border)] bg-[var(--surface-muted)]/50 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xs font-semibold text-[var(--foreground)] uppercase tracking-wider">
              Internal Mock Audit Observations & Findings
            </CardTitle>
            <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
              Review findings logged by internal peer auditors during simulated inspection.
            </p>
          </div>
          <span className="text-xs text-[var(--text-muted)]">
            {activeSession?.findings.length || 0} findings recorded
          </span>
        </CardHeader>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-[var(--surface-muted)]">
              <TableRow className="border-b border-[var(--border)]">
                <TableHead className="text-xs font-semibold text-[var(--text-muted)] w-24">
                  Area & Code
                </TableHead>
                <TableHead className="text-xs font-semibold text-[var(--text-muted)] w-28">
                  Finding Type
                </TableHead>
                <TableHead className="text-xs font-semibold text-[var(--text-muted)] w-20">
                  Rating
                </TableHead>
                <TableHead className="text-xs font-semibold text-[var(--text-muted)] min-w-[280px]">
                  Observation & Required Urgent Action
                </TableHead>
                <TableHead className="text-xs font-semibold text-[var(--text-muted)] w-36">
                  Auditor
                </TableHead>
                <TableHead className="text-xs font-semibold text-[var(--text-muted)] w-40 text-right">
                  Closed-Loop Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!activeSession || activeSession.findings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-xs text-[var(--text-muted)]">
                    No findings recorded for this simulation session yet. Click &quot;Record Mock Finding&quot; to begin.
                  </TableCell>
                </TableRow>
              ) : (
                activeSession.findings.map((f) => (
                  <TableRow
                    key={f.id}
                    className="border-b border-[var(--border-subtle)] hover:bg-[var(--surface-muted)]/40 transition-colors"
                  >
                    <TableCell className="align-top py-3.5">
                      <span className="font-semibold text-xs text-[var(--foreground)] block">
                        Area {f.areaNumber}
                      </span>
                      <span className="text-[11px] text-[var(--text-muted)]">{f.parameterCode}</span>
                    </TableCell>

                    <TableCell className="align-top py-3.5">
                      {getFindingTypeBadge(f.findingType)}
                    </TableCell>

                    <TableCell className="align-top py-3.5">
                      <span className="font-semibold text-xs text-[var(--foreground)] tabular-nums">
                        {f.mockScore.toFixed(1)}
                      </span>
                    </TableCell>

                    <TableCell className="align-top py-3.5 space-y-1">
                      <p className="text-xs text-[var(--foreground)] font-medium">
                        {f.observation}
                      </p>
                      <p className="text-[11px] text-[var(--text-secondary)]">
                        <strong className="text-[var(--text-muted)]">Urgent Action:</strong>{' '}
                        {f.urgentActionNeeded}
                      </p>
                    </TableCell>

                    <TableCell className="align-top py-3.5 text-xs text-[var(--text-muted)]">
                      {f.auditorName}
                    </TableCell>

                    <TableCell className="align-top py-3.5 text-right">
                      {f.promotedToCQIId || f.isResolved ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-[var(--radius-control)]">
                          <CheckCircle2 className="w-3 h-3" /> Promoted to CQI
                        </span>
                      ) : f.findingType === 'Commendable Strength' ? (
                        <span className="text-[11px] text-[var(--text-muted)]">Verified</span>
                      ) : (
                        <Button
                          onClick={() => handlePromote(f.id)}
                          size="sm"
                          className="text-[11px] h-7 px-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium inline-flex items-center gap-1 rounded-[var(--radius-control)]"
                        >
                          <span>Promote to CQI</span>
                          <ArrowRight className="w-3 h-3" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Record Finding Dialog */}
      <Dialog open={isFindingModalOpen} onOpenChange={setIsFindingModalOpen}>
        <DialogContent title="Record Internal Mock Audit Finding" className="max-w-lg bg-[var(--surface)] border-[var(--border)] p-6">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
            <h2 className="text-sm font-semibold text-[var(--foreground)]">
              Record Internal Mock Audit Finding
            </h2>
          </div>

          <form onSubmit={handleAddFinding} className="space-y-4 pt-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Accreditation Area
                </label>
                <select
                  value={newAreaNumber}
                  onChange={(e) => setNewAreaNumber(Number(e.target.value))}
                  className="w-full text-xs h-9 px-3 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)]"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <option key={num} value={num}>
                      Area {num}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Parameter Code
                </label>
                <Input
                  type="text"
                  value={newParameterCode}
                  onChange={(e) => setNewParameterCode(e.target.value)}
                  placeholder="e.g. Parameter A"
                  className="text-xs h-9 bg-[var(--surface)] border-[var(--border)]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Finding Classification
                </label>
                <select
                  value={newFindingType}
                  onChange={(e) => setNewFindingType(e.target.value as MockFindingType)}
                  className="w-full text-xs h-9 px-3 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)]"
                >
                  <option value="Critical Gap">Critical Gap (Fatal Deficiency)</option>
                  <option value="Minor Deficiency">Minor Deficiency (Non-fatal Gap)</option>
                  <option value="Commendable Strength">Commendable Strength</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Mock Score (1.0 - 5.0)
                </label>
                <Input
                  type="number"
                  step="0.1"
                  min="1.0"
                  max="5.0"
                  value={newMockScore}
                  onChange={(e) => setNewMockScore(Number(e.target.value))}
                  className="text-xs h-9 bg-[var(--surface)] border-[var(--border)]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Auditor Observation
              </label>
              <textarea
                value={newObservation}
                onChange={(e) => setNewObservation(e.target.value)}
                placeholder="Detailed findings noted during simulated inspection or mock interviews..."
                rows={2}
                className="w-full text-xs p-2.5 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-hidden"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Urgent Action Needed
              </label>
              <textarea
                value={newUrgentAction}
                onChange={(e) => setNewUrgentAction(e.target.value)}
                placeholder="Specific recommendations and corrective steps before official accreditors convene..."
                rows={2}
                className="w-full text-xs p-2.5 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-hidden"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Auditor Name
              </label>
              <Input
                type="text"
                value={newAuditorName}
                onChange={(e) => setNewAuditorName(e.target.value)}
                placeholder="e.g. Dr. Evelyn Cruz"
                className="text-xs h-9 bg-[var(--surface)] border-[var(--border)]"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border)]">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFindingModalOpen(false)}
                className="text-xs h-9 px-3 border-[var(--border)]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="text-xs h-9 px-4 bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white font-medium"
              >
                Log Finding
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Schedule Mock Session Dialog */}
      <Dialog open={isSessionModalOpen} onOpenChange={setIsSessionModalOpen}>
        <DialogContent title="Schedule Mock Survey Simulation" className="max-w-md bg-[var(--surface)] border-[var(--border)] p-6">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
            <h2 className="text-sm font-semibold text-[var(--foreground)]">
              Schedule Mock Survey Simulation
            </h2>
          </div>

          <form onSubmit={handleCreateSession} className="space-y-4 pt-3">
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Session Title
              </label>
              <Input
                type="text"
                value={newSessionTitle}
                onChange={(e) => setNewSessionTitle(e.target.value)}
                placeholder="e.g. Pre-AACCUP BSIT Internal Mock Survey 2026"
                className="text-xs h-9 bg-[var(--surface)] border-[var(--border)]"
                required
              />
            </div>

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
                  Cycle
                </label>
                <select
                  value={newCycleId}
                  onChange={(e) => setNewCycleId(e.target.value)}
                  className="w-full text-xs h-9 px-3 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)]"
                  required
                >
                  {cycles.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Lead Internal Auditor
              </label>
              <Input
                type="text"
                value={newAuditLead}
                onChange={(e) => setNewAuditLead(e.target.value)}
                placeholder="e.g. Dr. Evelyn Cruz"
                className="text-xs h-9 bg-[var(--surface)] border-[var(--border)]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Simulation Date
              </label>
              <Input
                type="date"
                value={newScheduledDate}
                onChange={(e) => setNewScheduledDate(e.target.value)}
                className="text-xs h-9 bg-[var(--surface)] border-[var(--border)]"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border)]">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsSessionModalOpen(false)}
                className="text-xs h-9 px-3 border-[var(--border)]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="text-xs h-9 px-4 bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white font-medium"
              >
                Schedule Session
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
