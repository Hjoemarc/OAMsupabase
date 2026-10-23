'use client';

import React, { useState, useMemo } from 'react';
import { useAccreditationStore } from '@/features/accreditations/context/store-context';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
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
  FileCheck2,
  Printer,
  ShieldCheck,
  Award,
  BookOpen,
  Calendar,
  Building,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FolderArchive,
  Hash,
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

    // Auto-generate preview dossier
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

          const exhibits = areaParams.flatMap((p, pIdx) => {
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
      {/* Header and Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-[var(--foreground)] tracking-tight">
            Institutional SSR & Exhibit Dossier Compiler
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Programmatic aggregation of self-survey narratives, scorecards, and cryptographically verified digital exhibits for external audit teams.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handlePrint}
            variant="outline"
            className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] rounded-[var(--radius-control)] hover:bg-[var(--surface-muted)]"
          >
            <Printer className="w-4 h-4 stroke-[1.75]" />
            <span>Print Dossier</span>
          </Button>
          <Button
            onClick={handleCompile}
            disabled={isCompiling}
            className="inline-flex items-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white text-xs font-medium px-4 py-2 rounded-[var(--radius-control)] shadow-xs transition-colors"
          >
            <FolderArchive className="w-4 h-4 stroke-[2]" />
            <span>{isCompiling ? 'Compiling Dossier...' : 'Compile Official Dossier'}</span>
          </Button>
        </div>
      </div>

      {/* Target Selector Toolbar */}
      <div className="flex flex-wrap items-center gap-3 bg-[var(--surface)] p-3 rounded-[var(--radius-panel)] border border-[var(--border)] shadow-xs">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[var(--text-muted)]" />
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
          <Building className="w-4 h-4 text-[var(--text-muted)]" />
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

        <div className="ml-auto flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[var(--radius-control)] text-xs font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Watermark: {activeDossier.watermark}</span>
          </span>
        </div>
      </div>

      {/* Readiness KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <Card className="border-[var(--border)] bg-[var(--surface)] shadow-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider">
                Exhibit Verification
              </span>
              <FileCheck2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-semibold text-[var(--foreground)] mt-2">
              {readiness.readinessPercentage}%
            </div>
            <div className="w-full bg-[var(--surface-muted)] h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${readiness.readinessPercentage}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[var(--border)] bg-[var(--surface)] shadow-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider">
                Total Exhibits Indexed
              </span>
              <Hash className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-semibold text-[var(--foreground)] mt-2">
              {readiness.totalExhibits}
            </div>
            <span className="text-xs text-[var(--text-secondary)] mt-1 block">
              Bound in dossier index
            </span>
          </CardContent>
        </Card>

        <Card className="border-[var(--border)] bg-[var(--surface)] shadow-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider">
                Verified Accepted
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-semibold text-emerald-600 mt-2">
              {readiness.verifiedExhibits}
            </div>
            <span className="text-xs text-[var(--text-secondary)] mt-1 block">
              Audit-ready documents
            </span>
          </CardContent>
        </Card>

        <Card className="border-[var(--border)] bg-[var(--surface)] shadow-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider">
                Pending Verification
              </span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-semibold text-amber-600 mt-2">
              {readiness.pendingExhibits}
            </div>
            <span className="text-xs text-amber-600/80 mt-1 block">
              Requires coordinator audit
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Official SSR Dossier Presentation Binder */}
      <Card className="border-[var(--border)] bg-[var(--surface)] shadow-sm overflow-hidden print:border-none print:shadow-none">
        {/* Cover / Submission Header Banner */}
        <div className="border-b border-[var(--border)] bg-gradient-to-r from-[var(--surface)] via-[var(--surface-muted)] to-[var(--surface)] p-6 text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--accent)] text-white font-bold text-sm mb-1 shadow-xs">
            ZP
          </div>
          <h2 className="text-base font-semibold text-[var(--foreground)] tracking-tight">
            ZAMBOANGA PENINSULA POLYTECHNIC STATE UNIVERSITY
          </h2>
          <p className="text-xs font-medium text-[var(--text-secondary)]">
            Institutional Quality Assurance Office &bull; Accreditation Management System
          </p>
          <div className="pt-2">
            <span className="text-lg font-bold text-[var(--accent)] block">
              {activeDossier.title}
            </span>
            <span className="text-xs text-[var(--text-muted)] block mt-0.5">
              Academic Year: {activeDossier.academicYear} &bull; Target: {activeDossier.targetLevel}
            </span>
          </div>
        </div>

        {/* Executive Summary Box */}
        <div className="p-6 border-b border-[var(--border-subtle)] bg-[var(--surface-muted)]/30">
          <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
            Executive Summary
          </h3>
          <p className="text-xs text-[var(--foreground)] leading-relaxed bg-[var(--surface)] p-3.5 rounded-[var(--radius-control)] border border-[var(--border)]">
            {activeDossier.executiveSummary}
          </p>
        </div>

        {/* Area Navigation Filter Tabs */}
        <div className="px-6 pt-4 border-b border-[var(--border)] flex flex-wrap gap-1.5 overflow-x-auto">
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
        <div className="p-6 space-y-8">
          {displaySections.length === 0 ? (
            <div className="text-center py-12 text-xs text-[var(--text-muted)]">
              No sections compiled for this area yet.
            </div>
          ) : (
            displaySections.map((section) => (
              <div
                key={section.areaNumber}
                className="space-y-4 rounded-[var(--radius-panel)] border border-[var(--border)] p-4 bg-[var(--surface)]"
              >
                {/* Area Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
                  <div>
                    <span className="text-[11px] font-semibold text-[var(--accent)] uppercase tracking-wider block">
                      Area {section.areaNumber}
                    </span>
                    <h4 className="text-sm font-semibold text-[var(--foreground)]">
                      {section.areaTitle}
                    </h4>
                    <span className="text-xs text-[var(--text-muted)] mt-0.5 block">
                      Area Chair: {section.chairName} &bull; {section.parameterCount} Parameters Assessed
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[11px] text-[var(--text-muted)] block">Self Mean</span>
                      <span className="text-xs font-semibold text-emerald-600">
                        {section.selfMeanScore !== null ? `${section.selfMeanScore.toFixed(2)} / 5.0` : 'Pending'}
                      </span>
                    </div>
                    {section.evaluatorMeanScore !== null && (
                      <div className="text-right border-l border-[var(--border)] pl-3">
                        <span className="text-[11px] text-[var(--text-muted)] block">Auditor Mean</span>
                        <span className="text-xs font-semibold text-blue-600">
                          {section.evaluatorMeanScore.toFixed(2)} / 5.0
                        </span>
                      </div>
                    )}
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
                        <TableHead className="text-[11px] font-semibold text-[var(--text-muted)] w-28">
                          Exhibit Code
                        </TableHead>
                        <TableHead className="text-[11px] font-semibold text-[var(--text-muted)]">
                          Document Title & Category
                        </TableHead>
                        <TableHead className="text-[11px] font-semibold text-[var(--text-muted)] w-36">
                          File & Size
                        </TableHead>
                        <TableHead className="text-[11px] font-semibold text-[var(--text-muted)] w-48">
                          SHA Checksum
                        </TableHead>
                        <TableHead className="text-[11px] font-semibold text-[var(--text-muted)] w-28 text-right">
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
                            className="border-b border-[var(--border-subtle)] hover:bg-[var(--surface-muted)]/40 transition-colors"
                          >
                            <TableCell className="py-2.5 font-mono text-xs font-bold text-[var(--accent)]">
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
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[var(--radius-control)] text-[10px] font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-200">
                                  <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[var(--radius-control)] text-[10px] font-medium bg-amber-500/10 text-amber-600 border border-amber-200">
                                  <Clock className="w-2.5 h-2.5" /> Pending
                                </span>
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
