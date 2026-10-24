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
  Award,
  CheckCircle2,
  Clock,
  Search,
  FileCheck2,
  FileText,
} from 'lucide-react';

export function RubricEvaluator() {
  const { parameters, submitEvaluation } = useAccreditationStore();
  const [searchTerm, setSearchTerm] = useState('');

  // Evaluation Modal State
  const [evaluatingParam, setEvaluatingParam] = useState<{
    id: string;
    code: string;
    title: string;
    selfRating: number | null;
    score: number;
    strengths: string;
    weaknesses: string;
    recommendations: string;
  } | null>(null);

  const totalAssigned = parameters.length;
  const auditedCount = parameters.filter((p) => p.status === 'Audited').length;
  const pendingCount = totalAssigned - auditedCount;

  // Calculate evaluator mean
  const scores = parameters.map((p) => p.evaluatorRating).filter((s): s is number => s !== null);
  const meanScore = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2) : '-';

  const filteredParams = parameters.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evaluatingParam) return;
    submitEvaluation({
      parameterId: evaluatingParam.id,
      evaluatorEmail: 'evaluator@oams.edu',
      evaluatorName: 'Dr. Horacio Hernandez (Lead Accreditor)',
      score: evaluatingParam.score,
      strengths: evaluatingParam.strengths,
      weaknesses: evaluatingParam.weaknesses,
      recommendations: evaluatingParam.recommendations,
    });
    setEvaluatingParam(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[var(--border)]">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-medium text-[var(--foreground)] tracking-tight flex items-center gap-2.5">
            <Award className="w-6 h-6 text-[var(--accent)] stroke-[1.75]" />
            Review documents and audit rubrics
          </h1>
          <p className="font-[family-name:var(--font-body)] text-xs text-[var(--text-muted)] mt-1">
            Audit submitted institutional evidence artifacts, score benchmarks against rubric standards, and record findings
          </p>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
        <SummaryMetricCard
          label="Assigned criteria"
          value={totalAssigned}
          subtext="Parameters slated for audit"
          icon={FileText}
          tone="default"
        />

        <SummaryMetricCard
          label="Audited benchmarks"
          value={auditedCount}
          subtext="Rubric scores committed"
          icon={CheckCircle2}
          tone="emerald"
        />

        <SummaryMetricCard
          label="Pending audit"
          value={pendingCount}
          subtext="Awaiting inspection"
          icon={Clock}
          tone="amber"
        />

        <SummaryMetricCard
          label="Auditor grand mean"
          value={`${meanScore} / 5.0`}
          subtext="Current evaluation standing"
          icon={FileCheck2}
          tone="accent"
        />
      </div>

      {/* Main Table Card */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-[var(--border)] flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="font-[family-name:var(--font-display)] text-sm font-medium text-[var(--foreground)]">
              Auditor rubric parameters
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
                <TableHead>Benchmark title</TableHead>
                <TableHead>Standard description</TableHead>
                <TableHead>Self-survey</TableHead>
                <TableHead>Evaluator score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredParams.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono font-medium text-xs text-[var(--accent)]">{p.code}</TableCell>
                  <TableCell className="font-medium text-xs text-[var(--foreground)] max-w-xs">{p.title}</TableCell>
                  <TableCell className="text-xs text-[var(--text-muted)] line-clamp-1 max-w-sm" title={p.description}>{p.description}</TableCell>
                  <TableCell className="font-mono text-xs tabular-nums text-[var(--text-secondary)]">
                    {p.selfSurveyRating ? p.selfSurveyRating.toFixed(2) : '-'}
                  </TableCell>
                  <TableCell className="font-mono text-xs tabular-nums font-medium text-[var(--accent)]">
                    {p.evaluatorRating ? p.evaluatorRating.toFixed(2) : 'Pending'}
                  </TableCell>
                  <TableCell>
                    <Badge
                      tone={
                        p.status === 'Audited'
                          ? 'success'
                          : p.status === 'Submitted'
                          ? 'info'
                          : 'warning'
                      }
                      size="sm"
                    >
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() =>
                        setEvaluatingParam({
                          id: p.id,
                          code: p.code,
                          title: p.title,
                          selfRating: p.selfSurveyRating,
                          score: p.evaluatorRating || 4.0,
                          strengths: '',
                          weaknesses: '',
                          recommendations: '',
                        })
                      }
                      className="text-xs"
                    >
                      Score rubric
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Evaluator Rubric Drawer */}
      <Drawer open={!!evaluatingParam} onOpenChange={(open) => !open && setEvaluatingParam(null)}>
        {evaluatingParam && (
          <DrawerContent
            title={`Audit rubric: ${evaluatingParam.code}`}
            description={evaluatingParam.title}
            size="xl"
          >
            <form onSubmit={handleSaveEvaluation} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Accreditation rating (1.00 to 5.00)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1.0"
                    max="5.0"
                    step="0.05"
                    value={evaluatingParam.score}
                    onChange={(e) =>
                      setEvaluatingParam({
                        ...evaluatingParam,
                        score: parseFloat(e.target.value),
                      })
                    }
                    className="w-full accent-[var(--accent)]"
                  />
                  <span className="font-mono font-medium text-base text-[var(--accent)] w-14 text-right tabular-nums">
                    {evaluatingParam.score.toFixed(2)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Institutional strengths noted
                </label>
                <textarea
                  rows={2}
                  value={evaluatingParam.strengths}
                  onChange={(e) =>
                    setEvaluatingParam({ ...evaluatingParam, strengths: e.target.value })
                  }
                  placeholder="e.g. Robust faculty qualifications, active industry MOAs..."
                  required
                  className="w-full text-xs p-2.5 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Deficiencies and weaknesses observed
                </label>
                <textarea
                  rows={2}
                  value={evaluatingParam.weaknesses}
                  onChange={(e) =>
                    setEvaluatingParam({ ...evaluatingParam, weaknesses: e.target.value })
                  }
                  placeholder="e.g. Lack of recent textbook acquisitions, missing meeting minutes..."
                  required
                  className="w-full text-xs p-2.5 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Accreditation recommendations for re-survey
                </label>
                <textarea
                  rows={2}
                  value={evaluatingParam.recommendations}
                  onChange={(e) =>
                    setEvaluatingParam({ ...evaluatingParam, recommendations: e.target.value })
                  }
                  placeholder="e.g. Procure digital journal subscriptions, formalize advisory council..."
                  required
                  className="w-full text-xs p-2.5 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border)]">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setEvaluatingParam(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm">
                  Record official rating
                </Button>
              </div>
            </form>
          </DrawerContent>
        )}
      </Drawer>
    </div>
  );
}
