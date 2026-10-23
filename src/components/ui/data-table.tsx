'use client';

import React, { useState } from 'react';
import { useAccreditationStore } from '@/features/accreditations/context/store-context';
import {
  GripVertical,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Plus,
  FileText,
  Trash2,
  UploadCloud,
  FileCheck,
  Eye,
  Copy,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import SegmentedControl from '@/components/arc/segmented-control/segmented-control';
import { ColumnCustomizer, type ColumnOption } from './column-customizer';
import { RowActionMenu } from './row-action-menu';
import { ConfirmDialog } from './confirm-dialog';

export type TableTab = 'areas' | 'parameters' | 'evidence' | 'evaluations';

interface DataTableProps {
  initialTab?: TableTab;
  onOpenCreateCycle?: () => void;
  onOpenUploadEvidence?: (paramId: string) => void;
  onOpenAuditModal?: (paramId: string) => void;
}

const TABLE_COLUMNS: ColumnOption[] = [
  { id: 'select', label: 'Row Selector', locked: true },
  { id: 'title', label: 'Primary Item / Title', locked: true },
  { id: 'classification', label: 'Category / Classification' },
  { id: 'status', label: 'Progress Status' },
  { id: 'weight', label: 'Weight / Target' },
  { id: 'score', label: 'Rating / Score' },
  { id: 'chair', label: 'Lead / Reviewer' },
  { id: 'actions', label: 'Row Actions', locked: true },
];

const DEFAULT_VISIBLE = ['select', 'title', 'classification', 'status', 'weight', 'score', 'chair', 'actions'];

export function DataTable({
  initialTab = 'areas',
  onOpenCreateCycle,
  onOpenUploadEvidence,
  onOpenAuditModal,
}: DataTableProps) {
  const {
    areas,
    parameters,
    documents,
    evaluations,
    getAreaSummaryMetric,
    addParameter,
    deleteParameter,
    deleteEvidenceDocument,
  } = useAccreditationStore();

  const [activeTab, setActiveTab] = useState<TableTab>(initialTab);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(DEFAULT_VISIBLE);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'parameter' | 'evidence';
    id: string;
    title: string;
  } | null>(null);

  // Add Parameter modal state
  const [isAddParamOpen, setIsAddParamOpen] = useState(false);
  const [paramAreaId, setParamAreaId] = useState(areas[0]?.id || '');
  const [paramCode, setParamCode] = useState('');
  const [paramTitle, setParamTitle] = useState('');
  const [paramDesc, setParamDesc] = useState('');
  const [paramType, setParamType] = useState<'Core' | 'Support'>('Core');

  const toggleSelectAll = (allIds: string[]) => {
    if (selectedIds.length === allIds.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(allIds);
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAddParam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paramCode || !paramTitle) return;
    addParameter({
      areaId: paramAreaId || areas[0]?.id || '',
      code: paramCode.toUpperCase(),
      title: paramTitle,
      description: paramDesc,
      selfSurveyRating: null,
      evaluatorRating: null,
      status: 'Draft',
      facultyRemarks: '',
      evidenceIds: [],
    });
    setParamCode('');
    setParamTitle('');
    setParamDesc('');
    setIsAddParamOpen(false);
  };

  const tabSegments = [
    { value: 'areas', label: 'Standard Areas', accessory: <span className="opacity-75 text-[11px] font-mono tabular-nums ml-1">{areas.length}</span> },
    { value: 'parameters', label: 'Criteria Benchmarks', accessory: <span className="opacity-75 text-[11px] font-mono tabular-nums ml-1">{parameters.length}</span> },
    { value: 'evidence', label: 'Evidence Vault', accessory: <span className="opacity-75 text-[11px] font-mono tabular-nums ml-1">{documents.length}</span> },
    { value: 'evaluations', label: 'Audit Findings', accessory: <span className="opacity-75 text-[11px] font-mono tabular-nums ml-1">{evaluations.length}</span> },
  ];

  return (
    <div className="rounded-[var(--radius-surface)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-resting)] overflow-hidden">
      {/* Top Tab Bar & Actions */}
      <div className="px-5 py-4 border-b border-[var(--border)] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Arc Segmented Control */}
        <div className="min-w-0 max-w-full overflow-x-auto pb-1">
          <SegmentedControl
            options={tabSegments}
            value={activeTab}
            onValueChange={(val) => {
              setActiveTab(val as TableTab);
              setSelectedIds([]);
            }}
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 self-end lg:self-auto shrink-0">
          <ColumnCustomizer
            columns={TABLE_COLUMNS}
            visibleColumnIds={visibleColumns}
            onChange={setVisibleColumns}
            storageKey="main_table"
            defaultVisibleIds={DEFAULT_VISIBLE}
          />

          <Button
            size="sm"
            onClick={() => {
              if (activeTab === 'parameters') {
                setIsAddParamOpen(true);
              } else if (onOpenCreateCycle) {
                onOpenCreateCycle();
              } else {
                setIsAddParamOpen(true);
              }
            }}
            className="gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Section</span>
          </Button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <Table className="min-w-[760px]">
          <TableHeader>
            <TableRow>
              {visibleColumns.includes('select') && (
                <TableHead className="w-10">
                  <input
                    type="checkbox"
                    aria-label="Select all rows"
                    onChange={() => {
                      const allIds =
                        activeTab === 'areas'
                          ? areas.map((a) => a.id)
                          : activeTab === 'parameters'
                            ? parameters.map((p) => p.id)
                            : activeTab === 'evidence'
                              ? documents.map((d) => d.id)
                              : evaluations.map((e) => e.id);
                      toggleSelectAll(allIds);
                    }}
                    checked={
                      selectedIds.length > 0 &&
                      selectedIds.length ===
                        (activeTab === 'areas'
                          ? areas.length
                          : activeTab === 'parameters'
                            ? parameters.length
                            : activeTab === 'evidence'
                              ? documents.length
                              : evaluations.length)
                    }
                    className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                  />
                </TableHead>
              )}

              {visibleColumns.includes('title') && (
                <TableHead>
                  {activeTab === 'areas'
                    ? 'Standard Area'
                    : activeTab === 'parameters'
                      ? 'Benchmark Criterion'
                      : activeTab === 'evidence'
                        ? 'Document / Evidence'
                        : 'Audit Finding'}
                </TableHead>
              )}

              {visibleColumns.includes('classification') && (
                <TableHead>
                  {activeTab === 'areas'
                    ? 'Classification'
                    : activeTab === 'parameters'
                      ? 'Type'
                      : activeTab === 'evidence'
                        ? 'Category'
                        : 'Rubric'}
                </TableHead>
              )}

              {visibleColumns.includes('status') && <TableHead>Status</TableHead>}

              {visibleColumns.includes('weight') && (
                <TableHead>
                  {activeTab === 'areas'
                    ? 'Weight'
                    : activeTab === 'evidence'
                      ? 'Required'
                      : 'Target'}
                </TableHead>
              )}

              {visibleColumns.includes('score') && (
                <TableHead>
                  {activeTab === 'evidence' ? 'File Size' : 'Rating / Score'}
                </TableHead>
              )}

              {visibleColumns.includes('chair') && (
                <TableHead>
                  {activeTab === 'areas'
                    ? 'Area Chair'
                    : activeTab === 'evidence'
                      ? 'Uploaded By'
                      : 'Reviewer'}
                </TableHead>
              )}

              {visibleColumns.includes('actions') && (
                <TableHead className="w-10 text-right">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {activeTab === 'areas' &&
              areas.map((area) => {
                const isSelected = selectedIds.includes(area.id);
                const isDone = area.status === 'Audited';
                const summary = getAreaSummaryMetric(area);
                const scoreDisplay =
                  summary.evaluatorMeanScore != null
                    ? summary.evaluatorMeanScore.toFixed(2)
                    : summary.selfMeanScore != null
                      ? summary.selfMeanScore.toFixed(2)
                      : '—';
                return (
                  <TableRow key={area.id} data-state={isSelected ? 'selected' : undefined}>
                    {visibleColumns.includes('select') && (
                      <TableCell>
                        <input
                          type="checkbox"
                          aria-label={`Select ${area.title}`}
                          checked={isSelected}
                          onChange={() => toggleSelectRow(area.id)}
                          className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                        />
                      </TableCell>
                    )}

                    {visibleColumns.includes('title') && (
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <GripVertical className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="font-semibold text-slate-900 truncate max-w-sm" title={area.title}>
                            {area.title}
                          </span>
                        </div>
                      </TableCell>
                    )}

                    {visibleColumns.includes('classification') && (
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-[10px]">
                          AACCUP Area {area.areaNumber}
                        </Badge>
                      </TableCell>
                    )}

                    {visibleColumns.includes('status') && (
                      <TableCell>
                        {isDone ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>Done</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3 h-3 text-amber-500" />
                            <span>In Process</span>
                          </span>
                        )}
                      </TableCell>
                    )}

                    {visibleColumns.includes('weight') && (
                      <TableCell className="font-mono text-slate-700">
                        {area.weight}%
                      </TableCell>
                    )}

                    {visibleColumns.includes('score') && (
                      <TableCell className="font-mono font-bold text-slate-900">
                        {scoreDisplay}
                      </TableCell>
                    )}

                    {visibleColumns.includes('chair') && (
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-xs text-slate-700">
                          <div className="w-5 h-5 rounded-full bg-slate-100 text-[10px] flex items-center justify-center font-bold text-slate-700 border border-slate-200">
                            {area.chairName.charAt(0)}
                          </div>
                          <span className="truncate max-w-[130px]">{area.chairName}</span>
                        </div>
                      </TableCell>
                    )}

                    {visibleColumns.includes('actions') && (
                      <TableCell className="text-right">
                        <RowActionMenu
                          ariaLabel={`Actions for ${area.title}`}
                          items={[
                            {
                              id: 'view',
                              label: 'View benchmarks',
                              icon: <Eye className="w-3.5 h-3.5" />,
                              onClick: () => setActiveTab('parameters'),
                            },
                            {
                              id: 'copy',
                              label: 'Copy area title',
                              icon: <Copy className="w-3.5 h-3.5" />,
                              onClick: () => navigator.clipboard?.writeText(area.title),
                            },
                          ]}
                        />
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}

            {activeTab === 'parameters' &&
              parameters.map((param) => {
                const isSelected = selectedIds.includes(param.id);
                const isDone = param.status === 'Audited';
                return (
                  <TableRow key={param.id} data-state={isSelected ? 'selected' : undefined}>
                    {visibleColumns.includes('select') && (
                      <TableCell>
                        <input
                          type="checkbox"
                          aria-label={`Select ${param.code}`}
                          checked={isSelected}
                          onChange={() => toggleSelectRow(param.id)}
                          className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                        />
                      </TableCell>
                    )}

                    {visibleColumns.includes('title') && (
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <GripVertical className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <div>
                            <span className="font-bold text-slate-900 block">
                              {param.code}: {param.title}
                            </span>
                            <span className="text-[11px] text-slate-500 line-clamp-1">
                              {param.description}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                    )}

                    {visibleColumns.includes('classification') && (
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-[10px]">
                          Criterion
                        </Badge>
                      </TableCell>
                    )}

                    {visibleColumns.includes('status') && (
                      <TableCell>
                        {isDone ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>Done</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3 h-3 text-amber-500" />
                            <span>In Process</span>
                          </span>
                        )}
                      </TableCell>
                    )}

                    {visibleColumns.includes('weight') && (
                      <TableCell className="font-mono text-slate-700">
                        5.00
                      </TableCell>
                    )}

                    {visibleColumns.includes('score') && (
                      <TableCell className="font-mono font-bold text-slate-900">
                        {param.evaluatorRating ? param.evaluatorRating.toFixed(2) : param.selfSurveyRating ? param.selfSurveyRating.toFixed(2) : '—'}
                      </TableCell>
                    )}

                    {visibleColumns.includes('chair') && (
                      <TableCell>
                        {isDone ? (
                          <span className="text-xs font-medium text-slate-700">Dr. H. Hernandez</span>
                        ) : (
                          <button
                            onClick={() => onOpenAuditModal?.(param.id)}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-slate-200 bg-white text-[11px] text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-2xs"
                          >
                            <span>Assign Reviewer</span>
                          </button>
                        )}
                      </TableCell>
                    )}

                    {visibleColumns.includes('actions') && (
                      <TableCell className="text-right">
                        <RowActionMenu
                          ariaLabel={`Actions for ${param.code}`}
                          items={[
                            {
                              id: 'upload',
                              label: 'Upload evidence',
                              icon: <UploadCloud className="w-3.5 h-3.5" />,
                              onClick: () => onOpenUploadEvidence?.(param.id),
                            },
                            {
                              id: 'audit',
                              label: 'Audit & evaluate',
                              icon: <FileCheck className="w-3.5 h-3.5" />,
                              onClick: () => onOpenAuditModal?.(param.id),
                            },
                            {
                              id: 'delete',
                              label: 'Delete parameter',
                              icon: <Trash2 className="w-3.5 h-3.5" />,
                              destructive: true,
                              separatorBefore: true,
                              onClick: () => {
                                setDeleteTarget({
                                  type: 'parameter',
                                  id: param.id,
                                  title: `${param.code}: ${param.title}`,
                                });
                              },
                            },
                          ]}
                        />
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}

            {activeTab === 'evidence' &&
              documents.map((doc) => {
                const isSelected = selectedIds.includes(doc.id);
                const isDone = doc.verificationStatus === 'Accepted';
                return (
                  <TableRow key={doc.id} data-state={isSelected ? 'selected' : undefined}>
                    {visibleColumns.includes('select') && (
                      <TableCell>
                        <input
                          type="checkbox"
                          aria-label={`Select ${doc.title}`}
                          checked={isSelected}
                          onChange={() => toggleSelectRow(doc.id)}
                          className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                        />
                      </TableCell>
                    )}

                    {visibleColumns.includes('title') && (
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <div>
                            <span className="font-semibold text-slate-900 block truncate max-w-sm">
                              {doc.title}
                            </span>
                            <span className="font-mono text-[10px] text-slate-500">
                              {doc.fileName} ({doc.fileSize})
                            </span>
                          </div>
                        </div>
                      </TableCell>
                    )}

                    {visibleColumns.includes('classification') && (
                      <TableCell>
                        <Badge variant="outline" className="text-[10px]">
                          {doc.category}
                        </Badge>
                      </TableCell>
                    )}

                    {visibleColumns.includes('status') && (
                      <TableCell>
                        {isDone ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>Done</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3 h-3 text-amber-500" />
                            <span>In Process</span>
                          </span>
                        )}
                      </TableCell>
                    )}

                    {visibleColumns.includes('weight') && (
                      <TableCell className="font-mono text-slate-700">
                        100%
                      </TableCell>
                    )}

                    {visibleColumns.includes('score') && (
                      <TableCell className="font-mono text-slate-700">
                        {doc.fileSize}
                      </TableCell>
                    )}

                    {visibleColumns.includes('chair') && (
                      <TableCell>
                        <span className="text-xs text-slate-600">{doc.uploadedBy}</span>
                      </TableCell>
                    )}

                    {visibleColumns.includes('actions') && (
                      <TableCell className="text-right">
                        <RowActionMenu
                          ariaLabel={`Actions for ${doc.title}`}
                          items={[
                            {
                              id: 'view',
                              label: 'View details',
                              icon: <Eye className="w-3.5 h-3.5" />,
                              onClick: () => alert(`Artifact details:\n${doc.title}\n${doc.fileName} (${doc.fileSize})`),
                            },
                            {
                              id: 'delete',
                              label: 'Delete artifact',
                              icon: <Trash2 className="w-3.5 h-3.5" />,
                              destructive: true,
                              separatorBefore: true,
                              onClick: () => {
                                setDeleteTarget({
                                  type: 'evidence',
                                  id: doc.id,
                                  title: doc.title,
                                });
                              },
                            },
                          ]}
                        />
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}

            {activeTab === 'evaluations' &&
              evaluations.map((ev) => {
                const isSelected = selectedIds.includes(ev.id);
                return (
                  <TableRow key={ev.id} data-state={isSelected ? 'selected' : undefined}>
                    {visibleColumns.includes('select') && (
                      <TableCell>
                        <input
                          type="checkbox"
                          aria-label={`Select evaluation ${ev.id}`}
                          checked={isSelected}
                          onChange={() => toggleSelectRow(ev.id)}
                          className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                        />
                      </TableCell>
                    )}

                    {visibleColumns.includes('title') && (
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <div>
                            <span className="font-semibold text-slate-900 block">
                              Audit Finding & Evaluation
                            </span>
                            <span className="text-[11px] text-slate-600 line-clamp-1">
                              {ev.strengths}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                    )}

                    {visibleColumns.includes('classification') && (
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-[10px]">
                          Rubric
                        </Badge>
                      </TableCell>
                    )}

                    {visibleColumns.includes('status') && (
                      <TableCell>
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>Done</span>
                        </span>
                      </TableCell>
                    )}

                    {visibleColumns.includes('weight') && (
                      <TableCell className="font-mono text-slate-700">
                        5.00
                      </TableCell>
                    )}

                    {visibleColumns.includes('score') && (
                      <TableCell className="font-mono font-black text-emerald-700">
                        {ev.score.toFixed(2)}
                      </TableCell>
                    )}

                    {visibleColumns.includes('chair') && (
                      <TableCell>
                        <span className="text-xs text-slate-700">{ev.evaluatorName}</span>
                      </TableCell>
                    )}

                    {visibleColumns.includes('actions') && (
                      <TableCell className="text-right">
                        <RowActionMenu
                          ariaLabel={`Actions for evaluation ${ev.id}`}
                          items={[
                            {
                              id: 'audit',
                              label: 'Review evaluation',
                              icon: <FileCheck className="w-3.5 h-3.5" />,
                              onClick: () => onOpenAuditModal?.(ev.parameterId),
                            },
                          ]}
                        />
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>

      {/* Table Footer */}
      <div className="px-4 py-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 bg-slate-50/50">
        <div>
          <span>
            {selectedIds.length} of{' '}
            {activeTab === 'areas'
              ? areas.length
              : activeTab === 'parameters'
                ? parameters.length
                : activeTab === 'evidence'
                  ? documents.length
                  : evaluations.length}{' '}
            row(s) selected.
          </span>
        </div>

        <div className="flex items-center gap-4 self-end sm:self-auto">
          <div className="flex items-center gap-2">
            <span>Rows per page</span>
            <select
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
              className="px-2 py-1 rounded-md border border-slate-200 bg-white text-slate-800 text-xs font-semibold focus:outline-hidden"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          <span className="font-mono text-slate-600">Page 1 of 1</span>

          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="h-7 w-7" disabled>
              <ChevronsLeft className="w-3.5 h-3.5" />
            </Button>
            <Button variant="outline" size="icon" className="h-7 w-7" disabled>
              <ChevronLeft className="w-3.5 h-3.5" />
            </Button>
            <Button variant="outline" size="icon" className="h-7 w-7" disabled>
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
            <Button variant="outline" size="icon" className="h-7 w-7" disabled>
              <ChevronsRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={deleteTarget?.type === 'parameter' ? 'Delete Criterion Parameter' : 'Delete Evidence Artifact'}
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This item will be permanently removed.`}
        confirmLabel="Delete"
        tone="danger"
        onConfirm={() => {
          if (!deleteTarget) return;
          if (deleteTarget.type === 'parameter') {
            deleteParameter(deleteTarget.id);
          } else if (deleteTarget.type === 'evidence') {
            deleteEvidenceDocument(deleteTarget.id);
          }
          setDeleteTarget(null);
        }}
      />

      {/* Add Parameter Dialog */}
      <Dialog open={isAddParamOpen} onOpenChange={setIsAddParamOpen}>
        <DialogContent
          title="Add Benchmark Criterion"
          description="Create a new parameter requirement under an accredited standard area"
          className="max-w-md"
        >
          <form onSubmit={handleAddParam} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Standard Area
              </label>
              <select
                value={paramAreaId}
                onChange={(e) => setParamAreaId(e.target.value)}
                className="w-full text-xs p-2 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
              >
                {areas.map((a) => (
                  <option key={a.id} value={a.id}>
                    Area {a.areaNumber}: {a.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Input
                  label="Criterion Code"
                  placeholder="e.g. P.1.4"
                  value={paramCode}
                  onChange={(e) => setParamCode(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Benchmark Type
                </label>
                <select
                  value={paramType}
                  onChange={(e) => setParamType(e.target.value as 'Core' | 'Support')}
                  className="w-full text-xs p-2 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
                >
                  <option value="Core">Core</option>
                  <option value="Support">Support</option>
                </select>
              </div>
            </div>

            <div>
              <Input
                label="Benchmark Title"
                placeholder="e.g. Faculty development and retention rate"
                value={paramTitle}
                onChange={(e) => setParamTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Description & Guidance
              </label>
              <textarea
                rows={3}
                placeholder="Detailed guidance on evidence and compliance verification"
                value={paramDesc}
                onChange={(e) => setParamDesc(e.target.value)}
                className="w-full text-xs p-2 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border)]">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setIsAddParamOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Add Criterion
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
