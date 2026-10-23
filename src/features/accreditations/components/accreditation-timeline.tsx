'use client';

import React, { useState } from 'react';
import { useAccreditationStore } from '../context/store-context';
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
  CalendarCheck,
  Award,
  Plus,
  Search,
} from 'lucide-react';
import type { AccreditationLevel, AccreditationBody } from '@/types/domain/accreditation';

export function AccreditationTimeline() {
  const { timeline, programs, addTimelineRecord } = useAccreditationStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form State
  const [selectedProgId, setSelectedProgId] = useState(programs[0]?.id || '');
  const [body, setBody] = useState<AccreditationBody>('AACCUP');
  const [level, setLevel] = useState<AccreditationLevel>('Level II Re-accredited');
  const [validUntil, setValidUntil] = useState('2027-12-31');
  const [lastSurvey, setLastSurvey] = useState('2023-11-15');
  const [nextSurvey, setNextSurvey] = useState('2027-10-15');
  const [status, setStatus] = useState<'Accredited' | 'Candidate' | 'Under Re-accreditation' | 'Expired'>('Accredited');

  const filteredTimeline = timeline.filter(
    (t) =>
      t.programName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.programCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.departmentCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const level4Count = timeline.filter((t) => t.currentLevel === 'Level IV').length;
  const level3Count = timeline.filter((t) => t.currentLevel.includes('Level III')).length;
  const level2Count = timeline.filter((t) => t.currentLevel.includes('Level II')).length;
  const level1Count = timeline.filter((t) => t.currentLevel.includes('Level I') || t.currentLevel === 'Candidate Status').length;

  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const prog = programs.find((p) => p.id === selectedProgId) || programs[0];
    addTimelineRecord({
      programId: prog.id,
      programCode: prog.code,
      programName: prog.name,
      departmentCode: prog.college.includes('(') ? prog.college.split('(')[1].replace(')', '') : 'CICS',
      currentLevel: level,
      surveyValidUntil: validUntil,
      lastSurveyDate: lastSurvey,
      nextSurveyDate: nextSurvey,
      accreditingBody: body,
      status,
    });
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[var(--border)]">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-medium text-[var(--foreground)] tracking-tight flex items-center gap-2.5">
            <CalendarCheck className="w-6 h-6 text-[var(--accent)] stroke-[1.75]" />
            Accreditation timeline
          </h1>
          <p className="font-[family-name:var(--font-body)] text-xs text-[var(--text-muted)] mt-1">
            Track certified validity periods, upcoming AACCUP survey visits, and institutional tier progression
          </p>
        </div>

        <Button
          onClick={() => setIsAddOpen(true)}
          size="sm"
          className="gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[1.75]" />
          <span>Add accreditation survey</span>
        </Button>
      </div>

      {/* 4 Summary Level Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
        <Card className="border-l-4 border-l-emerald-600">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-emerald-700">Level IV</span>
              <Award className="w-4 h-4 text-emerald-600 stroke-[1.75]" />
            </div>
            <CardTitle className="text-2xl font-medium text-[var(--foreground)] tabular-nums">{level4Count}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-[var(--text-muted)]">Institutional excellence</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-600">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-blue-700">Level III</span>
              <Award className="w-4 h-4 text-blue-600 stroke-[1.75]" />
            </div>
            <CardTitle className="text-2xl font-medium text-[var(--foreground)] tabular-nums">{level3Count}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-[var(--text-muted)]">Phases 1 and 2 re-accredited</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-amber-700">Level II</span>
              <Award className="w-4 h-4 text-amber-600 stroke-[1.75]" />
            </div>
            <CardTitle className="text-2xl font-medium text-[var(--foreground)] tabular-nums">{level2Count}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-[var(--text-muted)]">Full re-accreditation status</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[var(--border-strong)]">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--text-secondary)]">Level I and candidate</span>
              <Award className="w-4 h-4 text-[var(--text-muted)] stroke-[1.75]" />
            </div>
            <CardTitle className="text-2xl font-medium text-[var(--foreground)] tabular-nums">{level1Count}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-[var(--text-muted)]">Initial qualifying programs</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Timeline Table */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-[var(--border)] flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-[var(--accent)] stroke-[1.75]" />
            <h2 className="font-[family-name:var(--font-display)] text-sm font-medium text-[var(--foreground)]">
              Accreditation survey schedule
            </h2>
            <Badge tone="neutral" size="sm">
              {filteredTimeline.length}
            </Badge>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] stroke-[1.75]" />
            <Input
              type="text"
              placeholder="Search by program or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 text-xs h-8"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table className="min-w-[760px]">
            <TableHeader>
              <TableRow>
                <TableHead>Program</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Conferred level</TableHead>
                <TableHead>Last survey date</TableHead>
                <TableHead>Valid until</TableHead>
                <TableHead>Next survey window</TableHead>
                <TableHead>Agency</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTimeline.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="font-medium text-xs text-[var(--accent)]">{item.programCode}</div>
                    <div className="text-[11px] text-[var(--text-muted)] truncate max-w-xs" title={item.programName}>{item.programName}</div>
                  </TableCell>
                  <TableCell className="font-mono text-xs tabular-nums text-[var(--text-secondary)]">
                    {item.departmentCode}
                  </TableCell>
                  <TableCell>
                    <Badge
                      tone={
                        item.currentLevel.includes('Level IV')
                          ? 'success'
                          : item.currentLevel.includes('Level III')
                          ? 'info'
                          : item.currentLevel.includes('Level II')
                          ? 'warning'
                          : 'neutral'
                      }
                      size="sm"
                    >
                      {item.currentLevel}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs tabular-nums text-[var(--text-muted)]">
                    {item.lastSurveyDate}
                  </TableCell>
                  <TableCell className="font-mono text-xs tabular-nums font-medium text-[var(--foreground)]">
                    {item.surveyValidUntil}
                  </TableCell>
                  <TableCell className="font-mono text-xs tabular-nums text-amber-700">
                    {item.nextSurveyDate}
                  </TableCell>
                  <TableCell>
                    <Badge tone="neutral" size="sm">
                      {item.accreditingBody}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      tone={
                        item.status === 'Accredited'
                          ? 'success'
                          : item.status === 'Under Re-accreditation'
                          ? 'warning'
                          : 'danger'
                      }
                      size="sm"
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Add Survey Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent
          title="Add accreditation survey record"
          description="Register an accreditation validity period and schedule upcoming visits"
          className="max-w-md"
        >
          <form onSubmit={handleCreateRecord} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Target program
              </label>
              <select
                value={selectedProgId}
                onChange={(e) => setSelectedProgId(e.target.value)}
                className="w-full text-xs p-2 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
              >
                {programs.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.code} - {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Accrediting agency
                </label>
                <select
                  value={body}
                  onChange={(e) => setBody(e.target.value as AccreditationBody)}
                  className="w-full text-xs p-2 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
                >
                  <option value="AACCUP">AACCUP</option>
                  <option value="CHED">CHED</option>
                  <option value="ALCUCOA">ALCUCOA</option>
                  <option value="PAASCU">PAASCU</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Conferred level
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as AccreditationLevel)}
                  className="w-full text-xs p-2 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
                >
                  <option value="Candidate Status">Candidate Status</option>
                  <option value="Level I">Level I</option>
                  <option value="Level II Re-accredited">Level II Re-accredited</option>
                  <option value="Level III Phase 1">Level III Phase 1</option>
                  <option value="Level III Phase 2">Level III Phase 2</option>
                  <option value="Level IV">Level IV</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Input
                  label="Valid until"
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  required
                />
              </div>

              <div>
                <Input
                  label="Next survey date"
                  type="date"
                  value={nextSurvey}
                  onChange={(e) => setNextSurvey(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Survey status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full text-xs p-2 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
              >
                <option value="Accredited">Accredited</option>
                <option value="Under Re-accreditation">Under Re-accreditation</option>
                <option value="Candidate">Candidate</option>
                <option value="Expired">Expired</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border)]">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setIsAddOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Save record
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
