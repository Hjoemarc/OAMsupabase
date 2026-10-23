'use client';

import React, { useState } from 'react';
import { useAccreditationStore } from '@/features/accreditations/context/store-context';
import {
  filterProgramsByDepartment,
  filterCoursesByProgram,
  filterParametersByArea,
} from '@/features/accreditations/calculations';
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
import { RowActionMenu } from '@/components/ui/row-action-menu';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { DependentSelect } from '@/components/ui/dependent-select';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Search,
  Edit2,
  Trash2,
  Eye,
} from 'lucide-react';
import type { EvidenceDocument } from '@/types/domain/accreditation';

export function EvidenceVault() {
  const {
    documents,
    parameters,
    areas,
    departments,
    programs,
    courses,
    addEvidenceDocument,
    updateEvidenceDocument,
    deleteEvidenceDocument,
  } = useAccreditationStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Cascading Form State for Upload
  const [areaId, setAreaId] = useState(areas[0]?.id || '');
  const [paramId, setParamId] = useState(parameters[0]?.id || '');
  const [deptId, setDeptId] = useState(departments[0]?.id || '');
  const [progId, setProgId] = useState(programs[0]?.id || '');
  const [courseId, setCourseId] = useState('');
  const [title, setTitle] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, _setFileSize] = useState('1.2 MB');
  const [fileType, _setFileType] = useState('PDF Document');
  const [category, setCategory] = useState<EvidenceDocument['category']>('Curriculum & Syllabi');

  // Edit Metadata Modal State
  const [editingDoc, setEditingDoc] = useState<EvidenceDocument | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editFileName, setEditFileName] = useState('');
  const [editCategory, setEditCategory] = useState<EvidenceDocument['category']>('Curriculum & Syllabi');

  // Delete Safeguard State
  const [deleteTarget, setDeleteTarget] = useState<EvidenceDocument | null>(null);

  const totalDocs = documents.length;
  const approvedDocs = documents.filter((d) => d.verificationStatus === 'Accepted').length;
  const inReviewDocs = documents.filter((d) => d.verificationStatus === 'Pending Review').length;
  const needsRevisionDocs = documents.filter((d) => d.verificationStatus === 'Needs Revision').length;

  const filteredDocs = documents.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || d.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Cascading selection handlers
  const handleAreaChange = (selectedAreaId: string) => {
    setAreaId(selectedAreaId);
    const matchingParams = filterParametersByArea(selectedAreaId, parameters);
    if (matchingParams.length > 0) {
      setParamId(matchingParams[0].id);
    } else {
      setParamId('');
    }
  };

  const handleDeptChange = (selectedDeptId: string) => {
    setDeptId(selectedDeptId);
    const matchingProgs = filterProgramsByDepartment(selectedDeptId, programs);
    if (matchingProgs.length > 0) {
      setProgId(matchingProgs[0].id);
      const matchingCourses = filterCoursesByProgram(matchingProgs[0].id, courses);
      setCourseId(matchingCourses[0]?.id || '');
    } else {
      setProgId('');
      setCourseId('');
    }
  };

  const handleProgChange = (selectedProgId: string) => {
    setProgId(selectedProgId);
    const matchingCourses = filterCoursesByProgram(selectedProgId, courses);
    setCourseId(matchingCourses[0]?.id || '');
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !fileName || !paramId) return;
    addEvidenceDocument({
      parameterId: paramId,
      title,
      fileName,
      fileSize,
      fileType,
      category,
      uploadedBy: 'faculty@oams.edu',
    });
    setTitle('');
    setFileName('');
    setIsUploadOpen(false);
  };

  const openEdit = (doc: EvidenceDocument) => {
    setEditingDoc(doc);
    setEditTitle(doc.title);
    setEditFileName(doc.fileName);
    setEditCategory(doc.category);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoc || !editTitle || !editFileName) return;
    updateEvidenceDocument(editingDoc.id, {
      title: editTitle,
      fileName: editFileName,
      category: editCategory,
    });
    setEditingDoc(null);
  };

  const availableParams = filterParametersByArea(areaId, parameters);
  const availableProgs = filterProgramsByDepartment(deptId, programs);
  const availableCourses = filterCoursesByProgram(progId, courses);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[var(--border)]">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-medium text-[var(--foreground)] tracking-tight flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-[var(--accent)] stroke-[1.75]" />
            Document vault
          </h1>
          <p className="font-[family-name:var(--font-body)] text-xs text-[var(--text-muted)] mt-1">
            Upload institutional evidence, maintain version histories, and track verification feedback from QA
          </p>
        </div>

        <Button
          onClick={() => {
            setAreaId(areas[0]?.id || '');
            const paramsInArea = filterParametersByArea(areas[0]?.id || '', parameters);
            setParamId(paramsInArea[0]?.id || '');
            setDeptId(departments[0]?.id || '');
            const progsInDept = filterProgramsByDepartment(departments[0]?.id || '', programs);
            setProgId(progsInDept[0]?.id || '');
            const crsInProg = filterCoursesByProgram(progsInDept[0]?.id || '', courses);
            setCourseId(crsInProg[0]?.id || '');
            setTitle('');
            setFileName('');
            setIsUploadOpen(true);
          }}
          size="sm"
          className="gap-1.5 shrink-0"
        >
          <UploadCloud className="w-4 h-4 stroke-[1.75]" />
          <span>Upload artifact</span>
        </Button>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--text-secondary)]">Total artifacts</span>
              <FileText className="w-4 h-4 text-[var(--text-muted)] stroke-[1.75]" />
            </div>
            <CardTitle className="text-2xl font-medium text-[var(--foreground)] tabular-nums">{totalDocs}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-[var(--text-muted)]">Verified evidence files</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-600">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-emerald-700">Accepted by QA</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 stroke-[1.75]" />
            </div>
            <CardTitle className="text-2xl font-medium text-[var(--foreground)] tabular-nums">{approvedDocs}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-[var(--text-muted)]">Satisfies audit standards</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-amber-700">Under QA review</span>
              <Clock className="w-4 h-4 text-amber-600 stroke-[1.75]" />
            </div>
            <CardTitle className="text-2xl font-medium text-[var(--foreground)] tabular-nums">{inReviewDocs}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-[var(--text-muted)]">Pending verification</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-rose-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-rose-700">Needs revision</span>
              <AlertTriangle className="w-4 h-4 text-rose-600 stroke-[1.75]" />
            </div>
            <CardTitle className="text-2xl font-medium text-[var(--foreground)] tabular-nums">{needsRevisionDocs}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-[var(--text-muted)]">Requires updated submission</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-[var(--border)] flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="font-[family-name:var(--font-display)] text-sm font-medium text-[var(--foreground)]">
              Document repository
            </h2>
            <Badge tone="neutral" size="sm">
              {filteredDocs.length} files
            </Badge>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="relative w-full sm:w-60">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] stroke-[1.75]" />
              <Input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 text-xs h-8"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs p-1.5 h-8 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
            >
              <option value="all">All categories</option>
              <option value="Curriculum & Syllabi">Curriculum and syllabi</option>
              <option value="Policy & Minutes">Policy and minutes</option>
              <option value="Faculty Credentials">Faculty credentials</option>
              <option value="Student Outputs">Student outputs</option>
              <option value="Equipment & Facilities">Equipment and facilities</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table className="min-w-[760px]">
            <TableHeader>
              <TableRow>
                <TableHead>Artifact title</TableHead>
                <TableHead>File name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Uploaded by</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead className="w-10 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocs.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>
                    <div className="font-medium text-xs text-[var(--foreground)]">{doc.title}</div>
                    <div className="text-[11px] text-[var(--text-muted)] font-mono">{doc.fileType}</div>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-[var(--accent)] max-w-xs truncate" title={doc.fileName}>
                    {doc.fileName}
                  </TableCell>
                  <TableCell className="text-xs text-[var(--text-secondary)]">{doc.category}</TableCell>
                  <TableCell className="font-mono text-xs tabular-nums text-[var(--text-muted)]">{doc.fileSize}</TableCell>
                  <TableCell className="text-xs text-[var(--text-secondary)]">{doc.uploadedBy}</TableCell>
                  <TableCell>
                    <Badge
                      tone={
                        doc.verificationStatus === 'Accepted'
                          ? 'success'
                          : doc.verificationStatus === 'Needs Revision'
                          ? 'danger'
                          : 'warning'
                      }
                      size="sm"
                    >
                      {doc.verificationStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <RowActionMenu
                      ariaLabel={`Actions for ${doc.title}`}
                      items={[
                        {
                          id: 'view',
                          label: 'View details',
                          icon: <Eye className="w-3.5 h-3.5" />,
                          onClick: () =>
                            alert(
                              `Evidence Artifact Details:\n\nTitle: ${doc.title}\nFile: ${doc.fileName}\nCategory: ${doc.category}\nStatus: ${doc.verificationStatus}`
                            ),
                        },
                        {
                          id: 'edit',
                          label: 'Edit metadata',
                          icon: <Edit2 className="w-3.5 h-3.5" />,
                          onClick: () => openEdit(doc),
                        },
                        {
                          id: 'delete',
                          label: 'Delete artifact',
                          icon: <Trash2 className="w-3.5 h-3.5" />,
                          destructive: true,
                          separatorBefore: true,
                          onClick: () => setDeleteTarget(doc),
                        },
                      ]}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Upload Dialog with Dependent Cascading Selection */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent
          title="Upload verification document"
          description="Attach documentary evidence to satisfy specific accreditation benchmark requirements"
          className="max-w-lg"
        >
          <form onSubmit={handleUpload} className="space-y-4 pt-2">
            {/* Cascading Area -> Parameter */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <DependentSelect
                label="Standard Area"
                value={areaId}
                onChange={handleAreaChange}
                options={areas.map((a) => ({
                  value: a.id,
                  label: `Area ${a.areaNumber}: ${a.title.slice(0, 24)}...`,
                }))}
                required
              />

              <DependentSelect
                label="Benchmark Criterion"
                value={paramId}
                onChange={setParamId}
                options={availableParams.map((p) => ({
                  value: p.id,
                  label: `${p.code}: ${p.title.slice(0, 20)}...`,
                }))}
                disabled={!areaId}
                disabledReason="Select an area first"
                emptyMessage="No parameters in this area"
                required
              />
            </div>

            {/* Cascading Department -> Program -> Course */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <DependentSelect
                label="College Department"
                value={deptId}
                onChange={handleDeptChange}
                options={departments.map((d) => ({
                  value: d.id,
                  label: `${d.code} - ${d.name.slice(0, 22)}...`,
                }))}
                required
              />

              <DependentSelect
                label="Degree Program"
                value={progId}
                onChange={handleProgChange}
                options={availableProgs.map((p) => ({
                  value: p.id,
                  label: `${p.code} - ${p.name.slice(0, 20)}...`,
                }))}
                disabled={!deptId}
                disabledReason="Select a department first"
                emptyMessage="No programs in this department"
                required
              />
            </div>

            {availableCourses.length > 0 && (
              <div>
                <DependentSelect
                  label="Associated Course (Optional)"
                  value={courseId}
                  onChange={setCourseId}
                  options={availableCourses.map((c) => ({
                    value: c.id,
                    label: `${c.code}: ${c.title}`,
                  }))}
                  placeholder="Select optional related course..."
                />
              </div>
            )}

            <div>
              <Input
                label="Document title"
                placeholder="e.g. CMO 25 s.2015 Compliance Mapping"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <Input
                label="File name"
                placeholder="e.g. BSIT_CMO25_Mapping_Verified.pdf"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Evidence category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EvidenceDocument['category'])}
                className="w-full text-xs p-2 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
              >
                <option value="Curriculum & Syllabi">Curriculum and syllabi</option>
                <option value="Policy & Minutes">Policy and minutes</option>
                <option value="Faculty Credentials">Faculty credentials</option>
                <option value="Student Outputs">Student outputs</option>
                <option value="Equipment & Facilities">Equipment and facilities</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border)]">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setIsUploadOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={!paramId}>
                Save artifact
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Metadata Dialog */}
      <Dialog open={Boolean(editingDoc)} onOpenChange={(open) => !open && setEditingDoc(null)}>
        <DialogContent
          title="Edit evidence metadata"
          description="Update artifact name, filing title, and document classification"
          className="max-w-md"
        >
          <form onSubmit={handleUpdate} className="space-y-4 pt-2">
            <div>
              <Input
                label="Document title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <Input
                label="File name"
                value={editFileName}
                onChange={(e) => setEditFileName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Evidence category
              </label>
              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value as EvidenceDocument['category'])}
                className="w-full text-xs p-2 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
              >
                <option value="Curriculum & Syllabi">Curriculum and syllabi</option>
                <option value="Policy & Minutes">Policy and minutes</option>
                <option value="Faculty Credentials">Faculty credentials</option>
                <option value="Student Outputs">Student outputs</option>
                <option value="Equipment & Facilities">Equipment and facilities</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border)]">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setEditingDoc(null)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Save changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Safeguard Dialog */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Evidence Artifact"
        description={`Are you sure you want to delete "${deleteTarget?.title}" (${deleteTarget?.fileName})? This file will be removed from institutional accreditation records.`}
        confirmLabel="Delete artifact"
        tone="danger"
        onConfirm={() => {
          if (deleteTarget) {
            deleteEvidenceDocument(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
      />
    </div>
  );
}
