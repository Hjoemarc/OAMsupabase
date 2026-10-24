'use client';

import React, { useState, useMemo } from 'react';
import { useAccreditationStore } from '@/features/accreditations/context/store-context';
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
import {
  GitCompare,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Trash2,
  Award,
  Shield,
  Layers,
  FileCheck2,
} from 'lucide-react';
import { calculateAgencyCoverage, filterCrossWalkMappings } from '../calculations';
import type { CrossWalkMapping, CrossWalkAgency, EquivalenceConfidence } from '@/types/domain/accreditation';

export function CrossWalkMatrix() {
  const { crosswalkMappings, documents, createCrossWalkMapping, deleteCrossWalkMapping } =
    useAccreditationStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [targetAgencyFilter, setTargetAgencyFilter] = useState<string>('All');
  const [confidenceFilter, setConfidenceFilter] = useState<string>('All');

  // Dialog State for creating a new crosswalk mapping
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newDocumentId, setNewDocumentId] = useState('');
  const [newPrimaryAgency, setNewPrimaryAgency] = useState<CrossWalkAgency>('AACCUP');
  const [newPrimaryCode, setNewPrimaryCode] = useState('Area III - Parameter A (Curriculum)');
  const [newTargetAgency, setNewTargetAgency] = useState<CrossWalkAgency>('CHED');
  const [newTargetCode, setNewTargetCode] = useState('');
  const [newTargetTitle, setNewTargetTitle] = useState('');
  const [newConfidence, setNewConfidence] = useState<EquivalenceConfidence>('Direct Match');
  const [newNotes, setNewNotes] = useState('');

  // Agency Coverage calculations
  const chedCoverage = useMemo(
    () => calculateAgencyCoverage(crosswalkMappings, 'CHED', 4),
    [crosswalkMappings]
  );
  const isoCoverage = useMemo(
    () => calculateAgencyCoverage(crosswalkMappings, 'ISO 9001', 3),
    [crosswalkMappings]
  );
  const ptcCoverage = useMemo(
    () => calculateAgencyCoverage(crosswalkMappings, 'PTC', 2),
    [crosswalkMappings]
  );

  const filteredMappings = useMemo(() => {
    return filterCrossWalkMappings(crosswalkMappings, {
      targetAgency: targetAgencyFilter !== 'All' ? targetAgencyFilter : undefined,
      confidence: confidenceFilter !== 'All' ? confidenceFilter : undefined,
      searchQuery: searchQuery.trim() || undefined,
    });
  }, [crosswalkMappings, targetAgencyFilter, confidenceFilter, searchQuery]);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const doc = documents.find((d) => d.id === newDocumentId) || documents[0];
    if (!doc) return;

    createCrossWalkMapping({
      documentId: doc.id,
      documentTitle: doc.title,
      fileName: doc.fileName,
      category: doc.category,
      primaryAgency: newPrimaryAgency,
      primaryCode: newPrimaryCode,
      targetAgency: newTargetAgency,
      targetCode: newTargetCode,
      targetStandardTitle: newTargetTitle,
      equivalenceConfidence: newConfidence,
      mappedBy: 'QA Cross-Walk Officer',
      mappedAt: new Date().toISOString().split('T')[0]!,
      notes: newNotes,
    });

    setIsCreateOpen(false);
    setNewTargetCode('');
    setNewTargetTitle('');
    setNewNotes('');
  };

  const renderConfidenceBadge = (confidence: EquivalenceConfidence) => {
    switch (confidence) {
      case 'Direct Match':
        return (
          <Badge tone="success" size="sm">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Direct match
          </Badge>
        );
      case 'Partial Overlap':
        return (
          <Badge tone="warning" size="sm">
            <AlertCircle className="w-3 h-3 mr-1" />
            Partial overlap
          </Badge>
        );
      case 'Supporting Context':
      default:
        return (
          <Badge tone="info" size="sm">
            <HelpCircle className="w-3 h-3 mr-1" />
            Supporting context
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
            <GitCompare className="w-6 h-6 text-[var(--accent)] stroke-[1.75]" />
            Multi-agency crosswalk matrix
          </h1>
          <p className="font-[family-name:var(--font-body)] text-xs text-[var(--text-muted)] mt-1">
            Map once, comply everywhere. Cross-reference uploaded institutional evidence across AACCUP, CHED, ISO 9001, and PTC
          </p>
        </div>

        <Button
          onClick={() => {
            if (documents.length > 0 && !newDocumentId) {
              setNewDocumentId(documents[0]!.id);
            }
            setIsCreateOpen(true);
          }}
          size="sm"
          className="gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[1.75]" />
          <span>New standard mapping</span>
        </Button>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
        <SummaryMetricCard
          label="CHED CMO compliance"
          value={`${chedCoverage.coveragePercentage}%`}
          subtext={`${chedCoverage.coveredStandardsCount} of ${chedCoverage.totalExpectedStandards} standards mapped`}
          icon={Award}
          tone="blue"
        />

        <SummaryMetricCard
          label="ISO 9001:2015 clauses"
          value={`${isoCoverage.coveragePercentage}%`}
          subtext={`${isoCoverage.coveredStandardsCount} of ${isoCoverage.totalExpectedStandards} QMS clauses covered`}
          icon={Shield}
          tone="emerald"
        />

        <SummaryMetricCard
          label="PTC engineering criteria"
          value={`${ptcCoverage.coveragePercentage}%`}
          subtext={`${ptcCoverage.coveredStandardsCount} of ${ptcCoverage.totalExpectedStandards} criteria fulfilled`}
          icon={Layers}
          tone="purple"
        />

        <SummaryMetricCard
          label="Active mappings"
          value={crosswalkMappings.length}
          subtext="Inter-agency evidence linkages"
          icon={FileCheck2}
          tone="accent"
        />
      </div>

      {/* Main Table Card */}
      <Card className="overflow-hidden">
        {/* Toolbar Header */}
        <div className="p-4 border-b border-[var(--border)] flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-[var(--accent)] stroke-[1.75]" />
            <h2 className="font-[family-name:var(--font-display)] text-sm font-medium text-[var(--foreground)]">
              Cross-framework evidence links
            </h2>
            <Badge tone="neutral" size="sm">
              {filteredMappings.length}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] stroke-[1.75]" />
              <Input
                type="text"
                placeholder="Search mapped evidence..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 text-xs h-8"
              />
            </div>

            <select
              value={targetAgencyFilter}
              onChange={(e) => setTargetAgencyFilter(e.target.value)}
              className="text-xs h-8 px-2.5 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-hidden"
            >
              <option value="All">All target agencies</option>
              <option value="CHED">CHED CMOs</option>
              <option value="ISO 9001">ISO 9001:2015</option>
              <option value="PTC">PTC (Engineering)</option>
              <option value="ALCUCOA">ALCUCOA</option>
              <option value="PAASCU">PAASCU</option>
            </select>

            <select
              value={confidenceFilter}
              onChange={(e) => setConfidenceFilter(e.target.value)}
              className="text-xs h-8 px-2.5 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-hidden"
            >
              <option value="All">All equivalence types</option>
              <option value="Direct Match">Direct match</option>
              <option value="Partial Overlap">Partial overlap</option>
              <option value="Supporting Context">Supporting context</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-[var(--surface-muted)]">
              <TableRow className="border-b border-[var(--border)]">
                <TableHead className="font-[family-name:var(--font-display)] text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider min-w-[220px]">
                  Uploaded Evidence Artifact
                </TableHead>
                <TableHead className="font-[family-name:var(--font-display)] text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider w-44">
                  Primary Standard (Source)
                </TableHead>
                <TableHead className="font-[family-name:var(--font-display)] text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider min-w-[240px]">
                  Target Agency & Standard
                </TableHead>
                <TableHead className="font-[family-name:var(--font-display)] text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider w-36">
                  Equivalence
                </TableHead>
                <TableHead className="font-[family-name:var(--font-display)] text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider w-32">
                  Mapped By
                </TableHead>
                <TableHead className="font-[family-name:var(--font-display)] text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider w-16 text-right">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMappings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 font-[family-name:var(--font-body)] text-xs text-[var(--text-muted)]">
                    No cross-walk mappings matching the current filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredMappings.map((item) => (
                  <TableRow
                    key={item.id}
                    className="border-b border-[var(--border)] hover:bg-[var(--surface-muted)]/50 transition-colors"
                  >
                    <TableCell className="py-3.5">
                      <span className="font-medium text-xs text-[var(--foreground)] block">
                        {item.documentTitle}
                      </span>
                      <span className="text-[11px] text-[var(--text-muted)] block mt-0.5">
                        {item.fileName} &bull; {item.category}
                      </span>
                    </TableCell>

                    <TableCell className="py-3.5">
                      <Badge tone="neutral" size="sm">
                        {item.primaryAgency}
                      </Badge>
                      <span className="text-[11px] text-[var(--text-muted)] block mt-1">
                        {item.primaryCode}
                      </span>
                    </TableCell>

                    <TableCell className="py-3.5">
                      <span className="text-xs font-semibold text-[var(--foreground)]">
                        {item.targetAgency}: {item.targetCode}
                      </span>
                      <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                        {item.targetStandardTitle}
                      </p>
                      {item.notes && (
                        <p className="text-[10px] text-[var(--text-secondary)] bg-[var(--surface-muted)] border border-[var(--border)] px-1.5 py-0.5 rounded mt-1 inline-block">
                          {item.notes}
                        </p>
                      )}
                    </TableCell>

                    <TableCell className="py-3.5">
                      {renderConfidenceBadge(item.equivalenceConfidence)}
                    </TableCell>

                    <TableCell className="py-3.5 text-xs text-[var(--text-muted)]">
                      <span>{item.mappedBy}</span>
                      <span className="block text-[10px]">{item.mappedAt}</span>
                    </TableCell>

                    <TableCell className="py-3.5 text-right">
                      <button
                        onClick={() => deleteCrossWalkMapping(item.id)}
                        title="Delete cross-walk mapping"
                        className="p-1 rounded-[var(--radius-control)] text-[var(--text-muted)] hover:text-red-600 hover:bg-red-500/10 transition-colors inline-flex items-center justify-center"
                      >
                        <Trash2 className="w-3.5 h-3.5 stroke-[1.75]" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Map Evidence Drawer */}
      <Drawer open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DrawerContent
          title="Map Evidence to External Standard"
          description="Establish an authenticated equivalence link between an uploaded evidence artifact and external agency benchmarks."
          size="xl"
        >
          <form onSubmit={handleCreateSubmit} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Select Uploaded Evidence Artifact
              </label>
              <select
                value={newDocumentId}
                onChange={(e) => setNewDocumentId(e.target.value)}
                className="w-full text-xs h-9 px-3 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)]"
                required
              >
                {documents.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.title} ({d.fileName})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Primary Agency (Source)
                </label>
                <select
                  value={newPrimaryAgency}
                  onChange={(e) => setNewPrimaryAgency(e.target.value as CrossWalkAgency)}
                  className="w-full text-xs h-9 px-3 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)]"
                >
                  <option value="AACCUP">AACCUP</option>
                  <option value="CHED">CHED</option>
                  <option value="ISO 9001">ISO 9001</option>
                  <option value="PTC">PTC</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Primary Standard Code
                </label>
                <Input
                  type="text"
                  value={newPrimaryCode}
                  onChange={(e) => setNewPrimaryCode(e.target.value)}
                  placeholder="e.g. Area III - Parameter A"
                  className="text-xs h-9"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Target Regulatory Agency
                </label>
                <select
                  value={newTargetAgency}
                  onChange={(e) => setNewTargetAgency(e.target.value as CrossWalkAgency)}
                  className="w-full text-xs h-9 px-3 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)]"
                >
                  <option value="CHED">CHED</option>
                  <option value="ISO 9001">ISO 9001</option>
                  <option value="PTC">PTC</option>
                  <option value="ALCUCOA">ALCUCOA</option>
                  <option value="PAASCU">PAASCU</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Target Standard / Clause Code
                </label>
                <Input
                  type="text"
                  value={newTargetCode}
                  onChange={(e) => setNewTargetCode(e.target.value)}
                  placeholder="e.g. CMO 25 Sec 8 or Clause 7.1.3"
                  className="text-xs h-9"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Target Standard Requirement Description
              </label>
              <Input
                type="text"
                value={newTargetTitle}
                onChange={(e) => setNewTargetTitle(e.target.value)}
                placeholder="e.g. Laboratory Infrastructure and Preventive Maintenance Protocol"
                className="text-xs h-9"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Equivalence Confidence Level
              </label>
              <select
                value={newConfidence}
                onChange={(e) => setNewConfidence(e.target.value as EquivalenceConfidence)}
                className="w-full text-xs h-9 px-3 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)]"
              >
                <option value="Direct Match">Direct match (Fulfills exact benchmark criteria)</option>
                <option value="Partial Overlap">Partial overlap (Fulfills component with supplementary info)</option>
                <option value="Supporting Context">Supporting context (Provides institutional baseline evidence)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Compliance Justification Notes
              </label>
              <textarea
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                placeholder="Explain why this document fulfills the target standard..."
                rows={2}
                className="w-full text-xs p-2.5 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-hidden"
              />
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
                Save crosswalk link
              </Button>
            </div>
          </form>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
