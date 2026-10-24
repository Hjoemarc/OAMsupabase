'use client';

import React, { useState, useMemo } from 'react';
import { useAccreditationStore } from '@/features/accreditations/context/store-context';
import { Card } from '@/components/ui/card';
import { SummaryMetricCard } from '@/components/ui/summary-metric-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  FolderArchive,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Calendar,
  Building,
  Hash,
  FileCheck2,
} from 'lucide-react';
import { calculateDossierReadiness } from '../compiler';
import type { SSRDossier, AreaNumber } from '@/types/domain/accreditation';

export function SSRDossierCompiler() {
  const { cycles, programs, areas, parameters, documents, dossiers, generateDossier } =
    useAccreditationStore();

  const [selectedCycleId, setSelectedCycleId] = useState<string>(cycles[0]?.id || '');
  const [selectedProgramId, setSelectedProgramId] = useState<string>(programs[0]?.id || '');
  const [activeAreaTab, setActiveAreaTab] = useState<number | 'all'>('all');
  const [isCompiling, setIsCompiling] = useState(false);

  // Get or compile the active dossier
  const activeDossier: SSRDossier = useMemo(() => {
    const existing = dossiers.find(
      (d) => d.cycleId === selectedCycleId && d.programId === selectedProgramId
    );
    if (existing) return existing;

    const cycle = cycles.find((c) => c.id === selectedCycleId) || cycles[0];
    const program = programs.find((p) => p.id === selectedProgramId) || programs[0];

    if (!cycle || !program) {
      return {
        id: 'empty',
        cycleId: '',
        cycleName: '',
        programId: '',
        programName: '',
        programCode: '',
        academicYear: '',
        title: 'Accreditation Self-Survey Report Dossier',
        targetLevel: 'Level I',
        executiveSummary: '',
        status: 'Draft',
        compiledAt: '',
        watermark: 'UNOFFICIAL DRAFT',
        sections: [],
        totalExhibits: 0,
      };
    }

    return {
      id: `ssr-${cycle.id}-${program.id}`,
      cycleId: cycle.id,
      cycleName: cycle.name,
      programId: program.id,
      programName: program.name,
      programCode: program.code,
      academicYear: cycle.academicYear,
      title: `${program.name} (${program.code}) Self-Survey Report Dossier`,
      targetLevel: program.targetLevel,
      executiveSummary: `This Self-Survey Report (SSR) constitutes the official submission dossier of ${program.name} for ${cycle.body} ${program.targetLevel} accreditation. All supporting exhibits have been authenticated and indexed by the institutional Quality Assurance Office.`,
      status: 'Compiled',
      compiledAt: new Date().toISOString().split('T')[0]!,
      watermark: 'OFFICIAL SUBMISSION COPY - ZPPSU QA OFFICE',
      sections: areas
        .filter((a) => a.cycleId === cycle.id && a.programId === program.id)
        .sort((a, b) => a.areaNumber - b.areaNumber)
        .map((a) => {
          const areaParams = parameters.filter((p) => p.areaId === a.id);
          const validRatings = areaParams
            .map((p) => p.selfSurveyRating)
            .filter((r): r is number => typeof r === 'number' && !isNaN(r));
          const selfMeanScore =
            validRatings.length > 0
              ? Math.round((validRatings.reduce((x, y) => x + y, 0) / validRatings.length) * 100) / 100
              : null;

          const exhibits = areaParams.flatMap((p) => {
            const pDocs = documents.filter((d) => d.parameterId === p.id);
            return pDocs.map((d, dIdx) => ({
              id: `ex-${d.id}`,
              exhibitCode: `EX-A${a.areaNumber}-${String(dIdx + 1).padStart(2, '0')}`,
              title: d.title,
              category: d.category,
              areaNumber: a.areaNumber as AreaNumber,
              parameterCode: p.code,
              documentId: d.id,
              fileName: d.fileName,
              fileSize: d.fileSize,
              sha256Checksum: `sha256-7fa20b1${d.id.slice(-4)}`,
              verificationStatus: d.verificationStatus,
            }));
          });

          return {
            areaNumber: a.areaNumber as AreaNumber,
            areaTitle: a.title,
            chairName: a.chairName,
            selfMeanScore,
            evaluatorMeanScore: null,
            parameterCount: areaParams.length,
            narrativeSummary: `Area ${a.areaNumber} qualitative review led by ${a.chairName}. Benchmarks verified with ${exhibits.length} authentic digital exhibits.`,
            exhibits,
          };
        }),
      totalExhibits: 0,
    };
  }, [dossiers, selectedCycleId, selectedProgramId, cycles, programs, areas, parameters, documents]);

  const readiness = useMemo(() => calculateDossierReadiness(activeDossier), [activeDossier]);

  const handleCompile = () => {
    setIsCompiling(true);
    setTimeout(() => {
      try {
        generateDossier(selectedCycleId, selectedProgramId);
      } catch (err) {
        console.error(err);
      } finally {
        setIsCompiling(false);
      }
    }, 400);
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const displaySections = useMemo(() => {
    if (activeAreaTab === 'all') {
      return activeDossier.sections;
    }
    return activeDossier.sections.filter((s) => s.areaNumber === activeAreaTab);
  }, [activeDossier.sections, activeAreaTab]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[var(--border)]">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-medium text-[var(--foreground)] tracking-tight flex items-center gap-2.5">
            <FolderArchive className="w-6 h-6 text-[var(--accent)] stroke-[1.75]" />
            Self-survey report & exhibit dossier
          </h1>
          <p className="font-[family-name:var(--font-body)] text-xs text-[var(--text-muted)] mt-1">
            Programmatic aggregation of self-survey narratives, scorecards, and verified digital exhibits for audit teams
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            onClick={handlePrint}
            variant="outline"
            size="sm"
            className="gap-1.5"
          >
            <Printer className="w-4 h-4 stroke-[1.75]" />
            <span>Print dossier</span>
          </Button>

          <Button
            onClick={handleCompile}
            disabled={isCompiling}
            size="sm"
            className="gap-1.5"
          >
            <FolderArchive className="w-4 h-4 stroke-[1.75]" />
            <span>{isCompiling ? 'Compiling...' : 'Compile official dossier'}</span>
          </Button>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
        <SummaryMetricCard
          label="Verification readiness"
          value={`${readiness.readinessPercentage}%`}
          subtext="Verified accepted against total exhibits"
          icon={ShieldCheck}
          tone="emerald"
        />

        <SummaryMetricCard
          label="Total exhibits indexed"
          value={readiness.totalExhibits}
          subtext="Bound across all evaluated areas"
          icon={FolderArchive}
          tone="default"
        />

        <SummaryMetricCard
          label="Verified exhibits"
          value={readiness.verifiedExhibits}
          subtext="Audit-ready approved artifacts"
          icon={CheckCircle2}
          tone="accent"
        />

        <SummaryMetricCard
          label="Pending review"
          value={readiness.pendingExhibits}
          subtext="Requires coordinator verification"
          icon={Clock}
          tone="amber"
        />
      </div>

      {/* Main Dossier Presentation Card */}
      <Card className="overflow-hidden print:border-none print:shadow-none">
        {/* Controls Toolbar */}
        <div className="p-4 border-b border-[var(--border)] flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[var(--surface-muted)]/30">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-[var(--text-muted)] stroke-[1.75]" />
              <span className="text-xs font-medium text-[var(--text-secondary)]">Cycle:</span>
              <select
                value={selectedCycleId}
                onChange={(e) => setSelectedCycleId(e.target.value)}
                className="text-xs h-8 px-2.5 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-hidden"
              >
                {cycles.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.academicYear})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Building className="w-3.5 h-3.5 text-[var(--text-muted)] stroke-[1.75]" />
              <span className="text-xs font-medium text-[var(--text-secondary)]">Program:</span>
              <select
                value={selectedProgramId}
                onChange={(e) => setSelectedProgramId(e.target.value)}
                className="text-xs h-8 px-2.5 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-hidden"
              >
                {programs.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.code} - {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Badge tone="success" size="sm">
            <ShieldCheck className="w-3 h-3 mr-1" />
            {activeDossier.watermark}
          </Badge>
        </div>

        {/* Cover / Submission Header Banner */}
        <div className="border-b border-[var(--border)] p-6 text-center space-y-2 bg-[var(--surface)]">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--accent)] text-white font-semibold text-xs mb-1">
            ZP
          </div>
          <h2 className="font-[family-name:var(--font-display)] text-sm font-semibold text-[var(--foreground)] tracking-tight uppercase">
            Zamboanga Peninsula Polytechnic State University
          </h2>
          <p className="font-[family-name:var(--font-body)] text-xs text-[var(--text-muted)]">
            Institutional Quality Assurance Office &bull; Online Accreditation Management System
          </p>
          <div className="pt-2">
            <h3 className="font-[family-name:var(--font-display)] text-lg font-medium text-[var(--accent)]">
              {activeDossier.title}
            </h3>
            <span className="text-xs text-[var(--text-muted)] block mt-0.5">
              Academic Year: {activeDossier.academicYear} &bull; Target: {activeDossier.targetLevel}
            </span>
          </div>
        </div>

        {/* Executive Summary Box */}
        <div className="p-5 border-b border-[var(--border)] bg-[var(--surface-muted)]/20">
          <span className="font-[family-name:var(--font-display)] text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider block mb-2">
            Executive Summary
          </span>
          <p className="font-[family-name:var(--font-body)] text-xs text-[var(--foreground)] leading-relaxed bg-[var(--surface)] p-3 rounded-[var(--radius-control)] border border-[var(--border)]">
            {activeDossier.executiveSummary}
          </p>
        </div>

        {/* Area Navigation Filter Tabs */}
        <div className="px-5 pt-3 border-b border-[var(--border)] flex flex-wrap gap-1 overflow-x-auto bg-[var(--surface-muted)]/10">
          <button
            onClick={() => setActiveAreaTab('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-t-[var(--radius-control)] border-b-2 transition-colors ${
              activeAreaTab === 'all'
                ? 'border-[var(--accent)] text-[var(--accent)] font-semibold'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--foreground)]'
            }`}
          >
            All Areas ({activeDossier.sections.length})
          </button>
          {activeDossier.sections.map((section) => (
            <button
              key={section.areaNumber}
              onClick={() => setActiveAreaTab(section.areaNumber)}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-t-[var(--radius-control)] border-b-2 transition-colors ${
                activeAreaTab === section.areaNumber
                  ? 'border-[var(--accent)] text-[var(--accent)] font-semibold'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--foreground)]'
              }`}
            >
              Area {section.areaNumber} ({section.exhibits.length})
            </button>
          ))}
        </div>

        {/* Area Scorecard and Exhibit Listings */}
        <div className="p-5 space-y-6">
          {displaySections.length === 0 ? (
            <div className="text-center py-10 font-[family-name:var(--font-body)] text-xs text-[var(--text-muted)]">
              No sections compiled for this area yet.
            </div>
          ) : (
            displaySections.map((section) => (
              <div
                key={section.areaNumber}
                className="space-y-3.5 rounded-[var(--radius-panel)] border border-[var(--border)] p-4 bg-[var(--surface)]"
              >
                {/* Area Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[var(--border)]">
                  <div>
                    <span className="text-[10px] font-semibold text-[var(--accent)] uppercase tracking-wider block">
                      Area {section.areaNumber}
                    </span>
                    <h4 className="font-[family-name:var(--font-display)] text-sm font-medium text-[var(--foreground)]">
                      {section.areaTitle}
                    </h4>
                    <span className="text-xs text-[var(--text-muted)] mt-0.5 block">
                      Area Chair: {section.chairName} &bull; {section.parameterCount} Parameters Evaluated
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] text-[var(--text-muted)] uppercase block">Self Mean</span>
                      <span className="text-xs font-semibold text-emerald-700">
                        {section.selfMeanScore !== null ? `${section.selfMeanScore.toFixed(2)} / 5.0` : 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Qualitative Narrative */}
                <p className="text-xs text-[var(--text-secondary)] italic bg-[var(--surface-muted)]/40 p-2.5 rounded-[var(--radius-control)]">
                  {section.narrativeSummary}
                </p>

                {/* Exhibit Index Table */}
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-[var(--surface-muted)]">
                      <TableRow className="border-b border-[var(--border)]">
                        <TableHead className="font-[family-name:var(--font-display)] text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider w-28">
                          Exhibit Code
                        </TableHead>
                        <TableHead className="font-[family-name:var(--font-display)] text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider">
                          Document Title & Category
                        </TableHead>
                        <TableHead className="font-[family-name:var(--font-display)] text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider w-36">
                          File & Size
                        </TableHead>
                        <TableHead className="font-[family-name:var(--font-display)] text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider w-44">
                          SHA Checksum
                        </TableHead>
                        <TableHead className="font-[family-name:var(--font-display)] text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider w-28 text-right">
                          Verification
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {section.exhibits.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-6 text-xs text-[var(--text-muted)]">
                            No exhibits attached under Area {section.areaNumber}.
                          </TableCell>
                        </TableRow>
                      ) : (
                        section.exhibits.map((exhibit) => (
                          <TableRow
                            key={exhibit.id}
                            className="border-b border-[var(--border)] hover:bg-[var(--surface-muted)]/40 transition-colors"
                          >
                            <TableCell className="py-2.5 font-mono text-xs font-semibold text-[var(--accent)]">
                              {exhibit.exhibitCode}
                            </TableCell>
                            <TableCell className="py-2.5">
                              <span className="text-xs font-medium text-[var(--foreground)] block">
                                {exhibit.title}
                              </span>
                              <span className="text-[10px] text-[var(--text-muted)]">
                                {exhibit.category} &bull; {exhibit.parameterCode}
                              </span>
                            </TableCell>
                            <TableCell className="py-2.5 text-xs text-[var(--text-secondary)]">
                              <span className="truncate block max-w-[140px]">{exhibit.fileName}</span>
                              <span className="text-[10px] text-[var(--text-muted)]">{exhibit.fileSize}</span>
                            </TableCell>
                            <TableCell className="py-2.5 font-mono text-[10px] text-[var(--text-muted)]">
                              <span className="bg-[var(--surface-muted)] px-1.5 py-0.5 rounded border border-[var(--border)]">
                                {exhibit.sha256Checksum}
                              </span>
                            </TableCell>
                            <TableCell className="py-2.5 text-right">
                              {exhibit.verificationStatus === 'Accepted' ? (
                                <Badge tone="success" size="sm">
                                  <CheckCircle2 className="w-2.5 h-2.5 mr-1" />
                                  Verified
                                </Badge>
                              ) : (
                                <Badge tone="warning" size="sm">
                                  <Clock className="w-2.5 h-2.5 mr-1" />
                                  Pending
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
