'use client';

import React, { useState } from 'react';
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
  ClipboardList,
  CheckCircle2,
  Clock,
  Search,
  FileText,
} from 'lucide-react';

export function AssignmentChecklist() {
  const { parameters, updateParameterSelfSurvey } = useAccreditationStore();
  const [searchTerm, setSearchTerm] = useState('');

  // Self Survey Modal State
  const [ratingParam, setRatingParam] = useState<{
    id: string;
    code: string;
    title: string;
    currentRating: number;
    remarks: string;
  } | null>(null);

  const totalAssigned = parameters.length;
  const submittedCount = parameters.filter((p) => p.status === 'Submitted' || p.status === 'Audited').length;
  const auditedCount = parameters.filter((p) => p.status === 'Audited').length;
  const pendingCount = totalAssigned - submittedCount;

  const filteredParams = parameters.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveSelfSurvey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ratingParam) return;
    updateParameterSelfSurvey({
      parameterId: ratingParam.id,
      rating: ratingParam.currentRating,
      remarks: ratingParam.remarks,
    });
    setRatingParam(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[var(--border)]">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-medium text-[var(--foreground)] tracking-tight flex items-center gap-2.5">
            <ClipboardList className="w-6 h-6 text-[var(--accent)] stroke-[1.75]" />
            Accreditation assignments
          </h1>
          <p className="font-[family-name:var(--font-body)] text-xs text-[var(--text-muted)] mt-1">
            Collect verification documents, perform self-survey scoring, and submit evidence for designated areas
          </p>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
        <SummaryMetricCard
          label="Total criteria"
          value={totalAssigned}
          subtext="Parameters assigned to your team"
          icon={ClipboardList}
          tone="default"
        />

        <SummaryMetricCard
          label="Pending survey"
          value={pendingCount}
          subtext="Require self-rating and evidence"
          icon={Clock}
          tone="amber"
        />

        <SummaryMetricCard
          label="Submitted"
          value={submittedCount}
          subtext="Awaiting QA auditor inspection"
          icon={FileText}
          tone="blue"
        />

        <SummaryMetricCard
          label="Audited benchmarks"
          value={auditedCount}
          subtext="Officially evaluated parameters"
          icon={CheckCircle2}
          tone="emerald"
        />
      </div>

      {/* Main Table Card */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-[var(--border)] flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="font-[family-name:var(--font-display)] text-sm font-medium text-[var(--foreground)]">
              Assigned parameters
            </h2>
            <Badge tone="neutral" size="sm">
              {filteredParams.length}
            </Badge>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] stroke-[1.75]" />
            <Input
              type="text"
              placeholder="Search parameter code or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 text-xs h-8"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table className="min-w-[700px]">
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Parameter title</TableHead>
                <TableHead>Standard description</TableHead>
                <TableHead>Self-survey rating</TableHead>
                <TableHead>Evaluator score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredParams.map((param) => (
                <TableRow key={param.id}>
                  <TableCell className="font-mono font-medium text-xs text-[var(--accent)]">{param.code}</TableCell>
                  <TableCell className="font-medium text-xs text-[var(--foreground)] max-w-xs">{param.title}</TableCell>
                  <TableCell className="text-xs text-[var(--text-muted)] line-clamp-1 max-w-sm" title={param.description}>{param.description}</TableCell>
                  <TableCell className="font-mono text-xs tabular-nums font-medium text-[var(--foreground)]">
                    {param.selfSurveyRating ? param.selfSurveyRating.toFixed(2) : '-'}
                  </TableCell>
                  <TableCell className="font-mono text-xs tabular-nums text-[var(--text-muted)]">
                    {param.evaluatorRating ? param.evaluatorRating.toFixed(2) : 'Pending'}
                  </TableCell>
                  <TableCell>
                    <Badge
                      tone={
                        param.status === 'Audited'
                          ? 'success'
                          : param.status === 'Submitted'
                          ? 'info'
                          : 'warning'
                      }
                      size="sm"
                    >
                      {param.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() =>
                        setRatingParam({
                          id: param.id,
                          code: param.code,
                          title: param.title,
                          currentRating: param.selfSurveyRating || 4.0,
                          remarks: param.facultyRemarks || '',
                        })
                      }
                      className="text-xs"
                    >
                      Rate and survey
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Self Survey Drawer */}
      <Drawer open={!!ratingParam} onOpenChange={(open) => !open && setRatingParam(null)}>
        {ratingParam && (
          <DrawerContent
            title={`Self-survey: ${ratingParam.code}`}
            description={ratingParam.title}
            size="lg"
          >
            <form onSubmit={handleSaveSelfSurvey} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Self-survey rating (1.0 to 5.0)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1.0"
                    max="5.0"
                    step="0.25"
                    value={ratingParam.currentRating}
                    onChange={(e) =>
                      setRatingParam({ ...ratingParam, currentRating: parseFloat(e.target.value) })
                    }
                    className="w-full accent-[var(--accent)]"
                  />
                  <span className="font-mono font-medium text-sm text-[var(--accent)] w-12 text-right tabular-nums">
                    {ratingParam.currentRating.toFixed(2)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Faculty narrative and benchmark compliance statement
                </label>
                <textarea
                  rows={4}
                  value={ratingParam.remarks}
                  onChange={(e) => setRatingParam({ ...ratingParam, remarks: e.target.value })}
                  placeholder="Detail institutional implementation, syllabus adherence, or student outcomes..."
                  required
                  className="w-full text-xs p-2.5 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border)]">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setRatingParam(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm">
                  Submit survey
                </Button>
              </div>
            </form>
          </DrawerContent>
        )}
      </Drawer>
    </div>
  );
}
