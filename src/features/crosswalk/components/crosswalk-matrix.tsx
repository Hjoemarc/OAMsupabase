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
  GitCompare,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Trash2,
  ExternalLink,
  Layers,
  FileCheck,
  Shield,
  Award,
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
    // Reset form
    setNewTargetCode('');
    setNewTargetTitle('');
    setNewNotes('');
  };

  const getConfidenceBadge = (confidence: EquivalenceConfidence) => {
    switch (confidence) {
      case 'Direct Match':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[var(--radius-control)] text-[11px] font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Direct Match
          </span>
        );
      case 'Partial Overlap':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[var(--radius-control)] text-[11px] font-medium bg-amber-500/10 text-amber-600 border border-amber-200">
            <AlertCircle className="w-3 h-3" /> Partial Overlap
          </span>
        );
      case 'Supporting Context':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[var(--radius-control)] text-[11px] font-medium bg-blue-500/10 text-blue-600 border border-blue-200">
            <HelpCircle className="w-3 h-3" /> Supporting Context
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
            Multi-Agency Cross-Walk & Shared Evidence Matrix
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Map once, comply everywhere. Cross-reference uploaded institutional evidence across AACCUP, CHED CMOs, ISO 9001:2015, and PTC without redundant file uploads.
          </p>
        </div>
        <Button
          onClick={() => {
            if (documents.length > 0 && !newDocumentId) {
              setNewDocumentId(documents[0]!.id);
            }
            setIsCreateOpen(true);
          }}
          className="inline-flex items-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white text-xs font-medium px-3.5 py-2 rounded-[var(--radius-control)] transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4 stroke-[2]" />
          <span>Map Evidence to Agency</span>
        </Button>
      </div>

      {/* Multi-Agency Readiness Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <Card className="border-[var(--border)] bg-[var(--surface)] shadow-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider block">
                  CHED CMO Compliance
                </span>
                <span className="text-xs text-[var(--text-secondary)]">
                  Higher Education Standards
                </span>
              </div>
              <Award className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex items-baseline gap-2 mt-3">
              <span className="text-2xl font-semibold text-[var(--foreground)]">
                {chedCoverage.coveragePercentage}%
              </span>
              <span className="text-xs text-[var(--text-muted)]">
                ({chedCoverage.coveredStandardsCount} of {chedCoverage.totalExpectedStandards} standards mapped)
              </span>
            </div>
            <div className="w-full bg-[var(--surface-muted)] h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${chedCoverage.coveragePercentage}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[var(--border)] bg-[var(--surface)] shadow-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider block">
                  ISO 9001:2015 Clauses
                </span>
                <span className="text-xs text-[var(--text-secondary)]">
                  Quality Management System
                </span>
              </div>
              <Shield className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-2 mt-3">
              <span className="text-2xl font-semibold text-[var(--foreground)]">
                {isoCoverage.coveragePercentage}%
              </span>
              <span className="text-xs text-[var(--text-muted)]">
                ({isoCoverage.coveredStandardsCount} of {isoCoverage.totalExpectedStandards} clauses covered)
              </span>
            </div>
            <div className="w-full bg-[var(--surface-muted)] h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${isoCoverage.coveragePercentage}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[var(--border)] bg-[var(--surface)] shadow-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider block">
                  PTC / Washington Accord
                </span>
                <span className="text-xs text-[var(--text-secondary)]">
                  Engineering & Tech Accreditation
                </span>
              </div>
              <Layers className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex items-baseline gap-2 mt-3">
              <span className="text-2xl font-semibold text-[var(--foreground)]">
                {ptcCoverage.coveragePercentage}%
              </span>
              <span className="text-xs text-[var(--text-muted)]">
                ({ptcCoverage.coveredStandardsCount} of {ptcCoverage.totalExpectedStandards} criteria mapped)
              </span>
            </div>
            <div className="w-full bg-[var(--surface-muted)] h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div
                className="bg-purple-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${ptcCoverage.coveragePercentage}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-[var(--surface)] p-3 rounded-[var(--radius-panel)] border border-[var(--border)] shadow-xs">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <div className="relative min-w-[220px] flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[var(--text-muted)]" />
            <Input
              type="text"
              placeholder="Search evidence file, target standard, or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs h-9 bg-[var(--surface)] border-[var(--border)]"
            />
          </div>

          <select
            value={targetAgencyFilter}
            onChange={(e) => setTargetAgencyFilter(e.target.value)}
            className="text-xs h-9 px-3 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-hidden"
          >
            <option value="All">All Target Agencies</option>
            <option value="CHED">CHED CMOs</option>
            <option value="ISO 9001">ISO 9001:2015</option>
            <option value="PTC">PTC (Engineering)</option>
            <option value="ALCUCOA">ALCUCOA</option>
            <option value="PAASCU">PAASCU</option>
          </select>

          <select
            value={confidenceFilter}
            onChange={(e) => setConfidenceFilter(e.target.value)}
            className="text-xs h-9 px-3 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-hidden"
          >
            <option value="All">All Equivalence Types</option>
            <option value="Direct Match">Direct Match</option>
            <option value="Partial Overlap">Partial Overlap</option>
            <option value="Supporting Context">Supporting Context</option>
          </select>
        </div>

        <span className="text-xs text-[var(--text-muted)] self-center px-1">
          Showing {filteredMappings.length} cross-walk links
        </span>
      </div>

      {/* Cross-Walk Matrix Table */}
      <Card className="border-[var(--border)] bg-[var(--surface)] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-[var(--surface-muted)]">
              <TableRow className="border-b border-[var(--border)]">
                <TableHead className="text-xs font-semibold text-[var(--text-muted)] min-w-[220px]">
                  Uploaded Evidence Artifact
                </TableHead>
                <TableHead className="text-xs font-semibold text-[var(--text-muted)] w-44">
                  Primary Standard (Source)
                </TableHead>
                <TableHead className="text-xs font-semibold text-[var(--text-muted)] min-w-[240px]">
                  Target Agency & Standard
                </TableHead>
                <TableHead className="text-xs font-semibold text-[var(--text-muted)] w-36">
                  Equivalence
                </TableHead>
                <TableHead className="text-xs font-semibold text-[var(--text-muted)] w-32">
                  Mapped By
                </TableHead>
                <TableHead className="text-xs font-semibold text-[var(--text-muted)] w-16 text-right">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMappings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-xs text-[var(--text-muted)]">
                    No cross-walk mappings match the current filter.
                  </TableCell>
                </TableRow>
              ) : (
                filteredMappings.map((item) => (
                  <TableRow
                    key={item.id}
                    className="border-b border-[var(--border-subtle)] hover:bg-[var(--surface-muted)]/50 transition-colors"
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
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium bg-[var(--surface-muted)] text-[var(--text-secondary)] border border-[var(--border)]">
                        {item.primaryAgency}
                      </span>
                      <span className="text-[11px] text-[var(--text-muted)] block mt-1">
                        {item.primaryCode}
                      </span>
                    </TableCell>

                    <TableCell className="py-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-[var(--foreground)]">
                          {item.targetAgency}: {item.targetCode}
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                        {item.targetStandardTitle}
                      </p>
                      {item.notes && (
                        <p className="text-[10px] text-blue-600 bg-blue-500/10 px-1.5 py-0.5 rounded mt-1 inline-block">
                          {item.notes}
                        </p>
                      )}
                    </TableCell>

                    <TableCell className="py-3.5">
                      {getConfidenceBadge(item.equivalenceConfidence)}
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
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Map Evidence Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent title="Map Existing Evidence to External Agency Standard" className="max-w-lg bg-[var(--surface)] border-[var(--border)] p-6">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
            <h2 className="text-sm font-semibold text-[var(--foreground)]">
              Map Existing Evidence to External Agency Standard
            </h2>
          </div>

          <form onSubmit={handleCreateSubmit} className="space-y-4 pt-3">
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
                  className="text-xs h-9 bg-[var(--surface)] border-[var(--border)]"
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
                  className="text-xs h-9 bg-[var(--surface)] border-[var(--border)]"
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
                className="text-xs h-9 bg-[var(--surface)] border-[var(--border)]"
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
                <option value="Direct Match">Direct Match (Fulfills exact benchmark criteria)</option>
                <option value="Partial Overlap">Partial Overlap (Fulfills component with supplementary info)</option>
                <option value="Supporting Context">Supporting Context (Provides institutional baseline evidence)</option>
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
                onClick={() => setIsCreateOpen(false)}
                className="text-xs h-9 px-3 border-[var(--border)]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="text-xs h-9 px-4 bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white font-medium"
              >
                Save Cross-Walk Link
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
