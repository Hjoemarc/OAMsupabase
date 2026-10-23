'use client';

import React, { useState } from 'react';
import { useAccreditationStore } from '@/features/accreditations/context/store-context';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import SegmentedControl from '@/components/arc/segmented-control/segmented-control';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ShieldCheck,
  FileCheck2,
  AlertCircle,
  CheckCircle2,
  Clock,
  Search,
} from 'lucide-react';
import type { DocumentReviewStatus } from '@/types/domain/accreditation';

export function ReviewWorkbench() {
  const {
    documentReviews,
    reviewAssignments,
    updateDocumentReviewStatus,
    assignReviewer,
  } = useAccreditationStore();

  const [activeTab, setActiveTab] = useState<'documents' | 'assignments'>('documents');
  const [searchTerm, setSearchTerm] = useState('');

  // Review Modal State
  const [reviewingDoc, setReviewingDoc] = useState<{
    id: string;
    fileName: string;
    status: DocumentReviewStatus;
    feedback: string;
  } | null>(null);

  // Assign Reviewer Modal State
  const [assigningItem, setAssigningItem] = useState<{
    id: string;
    facultyName: string;
    assignedReviewer: string;
  } | null>(null);

  const pendingAssignmentsCount = reviewAssignments.filter((a) => a.status === 'Pending').length;
  const docsForReviewCount = documentReviews.filter(
    (d) => d.status === 'Submitted' || d.status === 'Under Review'
  ).length;
  const needsRevisionCount = documentReviews.filter((d) => d.status === 'Needs Revision').length;
  const approvedCount = documentReviews.filter((d) => d.status === 'Approved').length;

  const filteredDocs = documentReviews.filter(
    (d) =>
      d.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.indicatorCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.programName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAssignments = reviewAssignments.filter(
    (a) =>
      a.facultyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.programCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.areaTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingDoc) return;
    updateDocumentReviewStatus(reviewingDoc.id, reviewingDoc.status, reviewingDoc.feedback);
    setReviewingDoc(null);
  };

  const handleSaveAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningItem) return;
    assignReviewer(assigningItem.id, assigningItem.assignedReviewer);
    setAssigningItem(null);
  };

  const tabSegments = [
    { value: 'documents', label: `Artifact review queue (${documentReviews.length})` },
    { value: 'assignments', label: `Faculty review assignments (${reviewAssignments.length})` },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[var(--border)]">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-medium text-[var(--foreground)] tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-[var(--accent)] stroke-[1.75]" />
            Review management
          </h1>
          <p className="font-[family-name:var(--font-body)] text-xs text-[var(--text-muted)] mt-1">
            Vet uploaded faculty evidence, assign QA reviewers, and deliver formal revision requests before auditor visits
          </p>
        </div>
      </div>

      {/* 4 Status Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-amber-700">Documents for review</span>
              <Clock className="w-4 h-4 text-amber-600 stroke-[1.75]" />
            </div>
            <CardTitle className="text-2xl font-medium text-[var(--foreground)] tabular-nums">{docsForReviewCount}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-[var(--text-muted)]">Awaiting internal QA vetting</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-rose-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-rose-700">Needs revision</span>
              <AlertCircle className="w-4 h-4 text-rose-600 stroke-[1.75]" />
            </div>
            <CardTitle className="text-2xl font-medium text-[var(--foreground)] tabular-nums">{needsRevisionCount}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-[var(--text-muted)]">Sent back for additional proof</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-600">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-emerald-700">Approved artifacts</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 stroke-[1.75]" />
            </div>
            <CardTitle className="text-2xl font-medium text-[var(--foreground)] tabular-nums">{approvedCount}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-[var(--text-muted)]">Ready for accreditor inspection</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[var(--border-strong)]">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--text-secondary)]">Pending assignments</span>
              <FileCheck2 className="w-4 h-4 text-[var(--text-muted)] stroke-[1.75]" />
            </div>
            <CardTitle className="text-2xl font-medium text-[var(--foreground)] tabular-nums">{pendingAssignmentsCount}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-[var(--text-muted)]">Faculty tasks without submissions</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-[var(--border)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="overflow-x-auto max-w-full pb-1">
            <SegmentedControl
              options={tabSegments}
              value={activeTab}
              onValueChange={(val) => setActiveTab(val as 'documents' | 'assignments')}
            />
          </div>

          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] stroke-[1.75]" />
            <Input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 text-xs h-8"
            />
          </div>
        </div>

        {/* Tab 1: Documents Review Table */}
        {activeTab === 'documents' && (
          <div className="overflow-x-auto">
            <Table className="min-w-[720px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Document / artifact name</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead>Criterion</TableHead>
                  <TableHead>Submitted by</TableHead>
                  <TableHead>Review status</TableHead>
                  <TableHead>QA feedback</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocs.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>
                      <div className="font-medium text-xs text-[var(--foreground)]">{doc.fileName}</div>
                      <div className="text-[11px] font-mono text-[var(--text-muted)]">{doc.cycleName}</div>
                    </TableCell>
                    <TableCell className="font-mono font-medium text-xs text-[var(--accent)]">{doc.programName}</TableCell>
                    <TableCell>
                      <Badge tone="neutral" size="sm">
                        {doc.indicatorCode}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-[var(--text-secondary)]">{doc.uploadedBy}</TableCell>
                    <TableCell>
                      <Badge
                        tone={
                          doc.status === 'Approved'
                            ? 'success'
                            : doc.status === 'Needs Revision'
                            ? 'danger'
                            : doc.status === 'Under Review'
                            ? 'info'
                            : 'warning'
                        }
                        size="sm"
                      >
                        {doc.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[11px] text-[var(--text-muted)] max-w-xs truncate" title={doc.reviewerFeedback || undefined}>
                      {doc.reviewerFeedback || 'No remarks recorded'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                          setReviewingDoc({
                            id: doc.id,
                            fileName: doc.fileName,
                            status: doc.status,
                            feedback: doc.reviewerFeedback || '',
                          })
                        }
                        className="text-xs"
                      >
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Tab 2: Assignments Table */}
        {activeTab === 'assignments' && (
          <div className="overflow-x-auto">
            <Table className="min-w-[720px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Assigned faculty</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead>Standard area / criterion</TableHead>
                  <TableHead>QA reviewer</TableHead>
                  <TableHead>Submission deadline</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssignments.map((asgn) => (
                  <TableRow key={asgn.id}>
                    <TableCell className="font-medium text-xs text-[var(--foreground)]">{asgn.facultyName}</TableCell>
                    <TableCell className="font-mono font-medium text-xs text-[var(--accent)]">{asgn.programCode}</TableCell>
                    <TableCell>
                      <div className="text-xs text-[var(--foreground)]">{asgn.areaTitle}</div>
                      <div className="text-[10px] text-[var(--text-muted)] font-mono">{asgn.indicatorCode}</div>
                    </TableCell>
                    <TableCell className="text-xs text-[var(--text-secondary)] font-medium">{asgn.assignedReviewer}</TableCell>
                    <TableCell className="font-mono text-xs tabular-nums text-[var(--text-muted)]">{asgn.deadline}</TableCell>
                    <TableCell>
                      <Badge
                        tone={
                          asgn.status === 'Completed'
                            ? 'success'
                            : asgn.status === 'Under Review'
                            ? 'info'
                            : 'warning'
                        }
                        size="sm"
                      >
                        {asgn.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                          setAssigningItem({
                            id: asgn.id,
                            facultyName: asgn.facultyName,
                            assignedReviewer: asgn.assignedReviewer,
                          })
                        }
                        className="text-xs"
                      >
                        Assign reviewer
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* Review Document Dialog */}
      <Dialog open={!!reviewingDoc} onOpenChange={(open) => !open && setReviewingDoc(null)}>
        {reviewingDoc && (
          <DialogContent
            title={`Review artifact: ${reviewingDoc.fileName}`}
            description="Examine evidence suitability and record audit decisions"
            className="max-w-md"
          >
            <form onSubmit={handleSaveReview} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Audit decision
                </label>
                <select
                  value={reviewingDoc.status}
                  onChange={(e) =>
                    setReviewingDoc({
                      ...reviewingDoc,
                      status: e.target.value as DocumentReviewStatus,
                    })
                  }
                  className="w-full text-xs p-2 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
                >
                  <option value="Approved">Approved (ready for external audit)</option>
                  <option value="Needs Revision">Needs revision (insufficient evidence)</option>
                  <option value="Under Review">Under review</option>
                  <option value="Submitted">Submitted (pending check)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Audit remarks and reviewer feedback
                </label>
                <textarea
                  rows={3}
                  value={reviewingDoc.feedback}
                  onChange={(e) => setReviewingDoc({ ...reviewingDoc, feedback: e.target.value })}
                  placeholder="Detail specific omissions, required signatures, or commendations..."
                  className="w-full text-xs p-2.5 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border)]">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setReviewingDoc(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm">
                  Save evaluation
                </Button>
              </div>
            </form>
          </DialogContent>
        )}
      </Dialog>

      {/* Assign Reviewer Dialog */}
      <Dialog open={!!assigningItem} onOpenChange={(open) => !open && setAssigningItem(null)}>
        {assigningItem && (
          <DialogContent
            title={`Assign QA reviewer: ${assigningItem.facultyName}`}
            description="Delegate responsibility for inspecting this faculty member's evidence submission"
            className="max-w-md"
          >
            <form onSubmit={handleSaveAssignment} className="space-y-4 pt-2">
              <div>
                <Input
                  label="QA reviewer email / name"
                  type="email"
                  value={assigningItem.assignedReviewer}
                  onChange={(e) =>
                    setAssigningItem({ ...assigningItem, assignedReviewer: e.target.value })
                  }
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border)]">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setAssigningItem(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm">
                  Update assignment
                </Button>
              </div>
            </form>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
