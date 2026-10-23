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
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Award,
  Plus,
  ArrowRight,
  UserCheck,
  Layers,
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

  // Feedback notification
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
    setNewObservation('');
    setNewUrgentAction('');
  };

  const handlePromote = (findingId: string) => {
    if (!activeSession) return;
    const promotedPlan = promoteMockFindingToCQI(findingId, activeSession.id);
    if (promotedPlan) {
      setPromotionNotice(
        `Promoted finding to formal CQI Action Plan (${promotedPlan.actionPlanTitle}). You can track remediation under CQI Action Tracker.`
      );
      setTimeout(() => setPromotionNotice(null), 5000);
    }
  };

  const renderRiskBadge = (risk: string) => {
    switch (risk) {
      case 'Critical Risk':
        return (
          <Badge tone="danger" size="sm">
            <ShieldAlert className="w-3 h-3 mr-1" />
            Critical risk: Remediation mandatory
          </Badge>
        );
      case 'Moderate Risk':
        return (
          <Badge tone="warning" size="sm">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Moderate risk: Gaps require attention
          </Badge>
        );
      case 'Low Risk':
      default:
        return (
          <Badge tone="success" size="sm">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Low risk: Audit-ready posture
          </Badge>
        );
    }
  };

  const renderFindingTypeBadge = (type: MockFindingType) => {
    switch (type) {
      case 'Critical Gap':
        return (
          <Badge tone="danger" size="sm">
            <ShieldAlert className="w-3 h-3 mr-1" />
            Critical gap
          </Badge>
        );
      case 'Minor Deficiency':
        return (
          <Badge tone="warning" size="sm">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Minor deficiency
          </Badge>
        );
      case 'Commendable Strength':
      default:
        return (
          <Badge tone="success" size="sm">
            <Award className="w-3 h-3 mr-1" />
            Commendable strength
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
            <Sparkles className="w-6 h-6 text-[var(--accent)] stroke-[1.75]" />
            Mock survey simulation workspace
          </h1>
          <p className="font-[family-name:var(--font-body)] text-xs text-[var(--text-muted)] mt-1">
            Sandboxed dry-run evaluations, internal peer audits, and one-click promotion of critical deficiencies into the CQI tracker
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            onClick={() => {
              if (programs.length > 0 && !newProgramId) setNewProgramId(programs[0]!.id);
              if (cycles.length > 0 && !newCycleId) setNewCycleId(cycles[0]!.id);
              setIsSessionModalOpen(true);
            }}
            variant="outline"
            size="sm"
            className="gap-1.5"
          >
            <Plus className="w-4 h-4 stroke-[1.75]" />
            <span>New mock session</span>
          </Button>

          <Button
            onClick={() => {
              if (activeSession) {
                setNewAuditorName(activeSession.auditTeamLead);
              }
              setIsFindingModalOpen(true);
            }}
            size="sm"
            className="gap-1.5"
          >
            <Plus className="w-4 h-4 stroke-[1.75]" />
            <span>Record mock finding</span>
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

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
        <Card>
          <CardHeader className="pb-2">
            <span className="text-xs font-medium text-[var(--text-secondary)]">Simulation grand mean</span>
            <CardTitle className="text-2xl font-medium text-[var(--accent)] tabular-nums">
              {metrics.grandMeanScore !== null ? `${metrics.grandMeanScore.toFixed(2)} / 5.0` : 'Pending'}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-[var(--text-muted)]">
              {metrics.grandMeanScore && metrics.grandMeanScore >= 4.0
                ? 'On track for Level III benchmark'
                : 'Deficiencies need remediation'}
            </p>
          </CardContent>
        </Card>

        <Card className={metrics.criticalGapCount > 0 ? 'border-l-4 border-l-red-500' : ''}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className={`text-xs font-medium ${metrics.criticalGapCount > 0 ? 'text-red-600' : 'text-[var(--text-secondary)]'}`}>
                Critical gaps
              </span>
              <ShieldAlert className="w-4 h-4 text-red-500 stroke-[1.75]" />
            </div>
            <CardTitle className={`text-2xl font-medium tabular-nums ${metrics.criticalGapCount > 0 ? 'text-red-600' : 'text-[var(--foreground)]'}`}>
              {metrics.criticalGapCount}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-[var(--text-muted)]">Fatal issues requiring rapid resolution</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-amber-700">Minor deficiencies</span>
              <AlertTriangle className="w-4 h-4 text-amber-600 stroke-[1.75]" />
            </div>
            <CardTitle className="text-2xl font-medium text-amber-700 tabular-nums">
              {metrics.minorDeficiencyCount}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-[var(--text-muted)]">Non-fatal compliance recommendations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-emerald-700">Commendable strengths</span>
              <Award className="w-4 h-4 text-emerald-600 stroke-[1.75]" />
            </div>
            <CardTitle className="text-2xl font-medium text-emerald-700 tabular-nums">
              {metrics.strengthCount}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-[var(--text-muted)]">Verified exemplary benchmarks</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="overflow-hidden">
        {/* Toolbar Header */}
        <div className="p-4 border-b border-[var(--border)] flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[var(--accent)] stroke-[1.75]" />
            <h2 className="font-[family-name:var(--font-display)] text-sm font-medium text-[var(--foreground)]">
              Simulation session findings
            </h2>
            <Badge tone="neutral" size="sm">
              {activeSession?.findings.length || 0}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-[var(--text-secondary)]">Simulation:</span>
              <select
                value={selectedSessionId}
                onChange={(e) => setSelectedSessionId(e.target.value)}
                className="text-xs font-semibold h-8 px-2.5 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-hidden"
              >
                {mockSessions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.programCode} &bull; {s.title} ({s.scheduledDate})
                  </option>
                ))}
              </select>
            </div>

            {activeSession && renderRiskBadge(metrics.riskLevel)}
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-[var(--surface-muted)]">
              <TableRow className="border-b border-[var(--border)]">
                <TableHead className="font-[family-name:var(--font-display)] text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider w-24">
                  Area & Code
                </TableHead>
                <TableHead className="font-[family-name:var(--font-display)] text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider w-32">
                  Finding Type
                </TableHead>
                <TableHead className="font-[family-name:var(--font-display)] text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider w-20">
                  Rating
                </TableHead>
                <TableHead className="font-[family-name:var(--font-display)] text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider min-w-[280px]">
                  Observation & Required Urgent Action
                </TableHead>
                <TableHead className="font-[family-name:var(--font-display)] text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider w-36">
                  Auditor
                </TableHead>
                <TableHead className="font-[family-name:var(--font-display)] text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider w-36 text-right">
                  Closed-Loop Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!activeSession || activeSession.findings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 font-[family-name:var(--font-body)] text-xs text-[var(--text-muted)]">
                    No findings recorded for this simulation session yet. Click &quot;Record mock finding&quot; to begin.
                  </TableCell>
                </TableRow>
              ) : (
                activeSession.findings.map((f) => (
                  <TableRow
                    key={f.id}
                    className="border-b border-[var(--border)] hover:bg-[var(--surface-muted)]/50 transition-colors"
                  >
                    <TableCell className="align-top py-3.5">
                      <span className="font-semibold text-xs text-[var(--foreground)] block">
                        Area {f.areaNumber}
                      </span>
                      <span className="text-[11px] text-[var(--text-muted)]">{f.parameterCode}</span>
                    </TableCell>

                    <TableCell className="align-top py-3.5">
                      {renderFindingTypeBadge(f.findingType)}
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
                        <strong className="text-[var(--text-muted)] font-normal">Urgent action:</strong>{' '}
                        {f.urgentActionNeeded}
                      </p>
                    </TableCell>

                    <TableCell className="align-top py-3.5 text-xs text-[var(--text-muted)]">
                      {f.auditorName}
                    </TableCell>

                    <TableCell className="align-top py-3.5 text-right">
                      {f.promotedToCQIId || f.isResolved ? (
                        <Badge tone="success" size="sm">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Promoted to CQI
                        </Badge>
                      ) : f.findingType === 'Commendable Strength' ? (
                        <span className="text-[11px] text-[var(--text-muted)]">Benchmark</span>
                      ) : (
                        <Button
                          onClick={() => handlePromote(f.id)}
                          size="sm"
                          variant="outline"
                          className="text-[11px] h-7 px-2.5 gap-1"
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
        <DialogContent
          title="Record Internal Mock Audit Finding"
          description="Log an observation, score, and urgent remedial intervention identified during mock inspection."
          className="max-w-lg"
        >
          <form onSubmit={handleAddFinding} className="space-y-4 pt-2">
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
                  className="text-xs h-9"
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
                  className="text-xs h-9"
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
                className="text-xs h-9"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border)]">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsFindingModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="gap-1.5"
              >
                Log finding
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Schedule Mock Session Dialog */}
      <Dialog open={isSessionModalOpen} onOpenChange={setIsSessionModalOpen}>
        <DialogContent
          title="Schedule Mock Survey Simulation"
          description="Initialize a new pre-audit simulation session to stress-test program readiness."
          className="max-w-md"
        >
          <form onSubmit={handleCreateSession} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Session Title
              </label>
              <Input
                type="text"
                value={newSessionTitle}
                onChange={(e) => setNewSessionTitle(e.target.value)}
                placeholder="e.g. Pre-AACCUP BSIT Internal Mock Survey 2026"
                className="text-xs h-9"
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
                className="text-xs h-9"
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
                className="text-xs h-9"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border)]">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsSessionModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="gap-1.5"
              >
                Schedule session
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
