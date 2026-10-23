'use client';

import React, { useState } from 'react';
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
  LineChart,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Search,
} from 'lucide-react';
import type { ComplianceStatus } from '@/types/domain/accreditation';

export function ComplianceTracker() {
  const { compliance, programs, updateComplianceStatus } = useAccreditationStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [programFilter, setProgramFilter] = useState<string>('all');

  // Modal State for updating compliance
  const [editingItem, setEditingItem] = useState<{
    id: string;
    indicatorCode: string;
    status: ComplianceStatus;
    notes: string;
  } | null>(null);

  const totalRecords = compliance.length;
  const compliantCount = compliance.filter((c) => c.status === 'Compliant').length;
  const partialCount = compliance.filter((c) => c.status === 'Partial').length;
  const nonCompliantCount = compliance.filter((c) => c.status === 'Non-Compliant').length;
  const notAssessedCount = compliance.filter((c) => c.status === 'Not Assessed').length;

  const compliancePercentage = totalRecords > 0 ? Math.round((compliantCount / totalRecords) * 100) : 0;

  const filteredCompliance = compliance.filter((c) => {
    const matchesSearch =
      c.indicatorDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.indicatorCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.programCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.areaName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesProgram = programFilter === 'all' || c.programCode === programFilter;

    return matchesSearch && matchesStatus && matchesProgram;
  });

  const handleSaveStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    updateComplianceStatus(editingItem.id, editingItem.status, editingItem.notes);
    setEditingItem(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[var(--border)]">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-medium text-[var(--foreground)] tracking-tight flex items-center gap-2.5">
            <LineChart className="w-6 h-6 text-[var(--accent)] stroke-[1.75]" />
            Compliance tracking dashboard
          </h1>
          <p className="font-[family-name:var(--font-body)] text-xs text-[var(--text-muted)] mt-1">
            Monitor institutional compliance percentages, deficiency remediation, and evidence readiness across programs
          </p>
        </div>

        <div className="text-left sm:text-right">
          <span className="text-xs font-medium text-[var(--text-secondary)]">Overall benchmark</span>
          <div className="font-[family-name:var(--font-display)] text-2xl font-medium text-[var(--accent)] tabular-nums">
            {compliancePercentage}% compliant
          </div>
        </div>
      </div>

      {/* Metric Cards & Breakdown Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
        <Card className="border-l-4 border-l-emerald-600">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-emerald-700">Compliant</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 stroke-[1.75]" />
            </div>
            <CardTitle className="text-2xl font-medium text-[var(--foreground)] tabular-nums">{compliantCount}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-[var(--text-muted)]">All evidence verified complete</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-amber-700">Partial compliance</span>
              <AlertTriangle className="w-4 h-4 text-amber-600 stroke-[1.75]" />
            </div>
            <CardTitle className="text-2xl font-medium text-[var(--foreground)] tabular-nums">{partialCount}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-[var(--text-muted)]">Minor deficiencies to remediate</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-rose-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-rose-700">Non-compliant</span>
              <XCircle className="w-4 h-4 text-rose-600 stroke-[1.75]" />
            </div>
            <CardTitle className="text-2xl font-medium text-[var(--foreground)] tabular-nums">{nonCompliantCount}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-[var(--text-muted)]">Urgent documentation missing</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[var(--border-strong)]">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--text-secondary)]">Not assessed</span>
              <HelpCircle className="w-4 h-4 text-[var(--text-muted)] stroke-[1.75]" />
            </div>
            <CardTitle className="text-2xl font-medium text-[var(--foreground)] tabular-nums">{notAssessedCount}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-[var(--text-muted)]">Pending evaluator audit review</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-[var(--border)] flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="font-[family-name:var(--font-display)] text-sm font-medium text-[var(--foreground)]">
              Compliance records
            </h2>
            <Badge tone="neutral" size="sm">
              {filteredCompliance.length}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter by Program */}
            <select
              value={programFilter}
              onChange={(e) => setProgramFilter(e.target.value)}
              className="text-xs p-1.5 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
            >
              <option value="all">All programs</option>
              {programs.map((p) => (
                <option key={p.id} value={p.code}>
                  {p.code}
                </option>
              ))}
            </select>

            {/* Filter by Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs p-1.5 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
            >
              <option value="all">All statuses</option>
              <option value="Compliant">Compliant</option>
              <option value="Partial">Partial</option>
              <option value="Non-Compliant">Non-compliant</option>
              <option value="Not Assessed">Not assessed</option>
            </select>

            {/* Search Input */}
            <div className="relative w-full sm:w-60">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] stroke-[1.75]" />
              <Input
                type="text"
                placeholder="Search indicator, area..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 text-xs h-8"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table className="min-w-[800px]">
            <TableHeader>
              <TableRow>
                <TableHead>Program</TableHead>
                <TableHead>Standard area</TableHead>
                <TableHead>Indicator</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Compliance status</TableHead>
                <TableHead>Evidence proofs</TableHead>
                <TableHead>Remarks</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompliance.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono font-medium text-xs text-[var(--accent)]">{item.programCode}</TableCell>
                  <TableCell className="text-xs text-[var(--foreground)] font-medium max-w-[140px] truncate" title={item.areaName}>{item.areaName}</TableCell>
                  <TableCell className="font-mono text-xs font-medium text-[var(--foreground)]">{item.indicatorCode}</TableCell>
                  <TableCell className="text-xs text-[var(--text-secondary)] max-w-xs">{item.indicatorDescription}</TableCell>
                  <TableCell>
                    <Badge
                      tone={
                        item.status === 'Compliant'
                          ? 'success'
                          : item.status === 'Partial'
                          ? 'warning'
                          : item.status === 'Non-Compliant'
                          ? 'danger'
                          : 'neutral'
                      }
                      size="sm"
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs tabular-nums text-[var(--text-muted)]">
                    {item.evidenceCount} documents
                  </TableCell>
                  <TableCell className="text-xs text-[var(--text-muted)] max-w-[150px] truncate" title={item.notes || undefined}>
                    {item.notes || '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        setEditingItem({
                          id: item.id,
                          indicatorCode: item.indicatorCode,
                          status: item.status,
                          notes: item.notes || '',
                        })
                      }
                      className="text-xs"
                    >
                      Update
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Edit Compliance Drawer */}
      <Drawer open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        {editingItem && (
          <DrawerContent
            title={`Update compliance: ${editingItem.indicatorCode}`}
            description="Record verified compliance status and auditor remediation remarks"
            size="lg"
          >
            <form onSubmit={handleSaveStatus} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Compliance tier
                </label>
                <select
                  value={editingItem.status}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, status: e.target.value as ComplianceStatus })
                  }
                  className="w-full text-xs p-2 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
                >
                  <option value="Compliant">Compliant</option>
                  <option value="Partial">Partial</option>
                  <option value="Non-Compliant">Non-compliant</option>
                  <option value="Not Assessed">Not assessed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Audit remediations and remarks
                </label>
                <textarea
                  rows={3}
                  value={editingItem.notes}
                  onChange={(e) => setEditingItem({ ...editingItem, notes: e.target.value })}
                  placeholder="Note specific deficiencies, verified files, or next steps..."
                  className="w-full text-xs p-2.5 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border)]">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setEditingItem(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm">
                  Save status
                </Button>
              </div>
            </form>
          </DrawerContent>
        )}
      </Drawer>
    </div>
  );
}
