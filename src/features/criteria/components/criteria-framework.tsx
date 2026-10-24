'use client';

import React, { useState } from 'react';
import { useAccreditationStore } from '@/features/accreditations/context/store-context';
import { Card } from '@/components/ui/card';
import { SummaryMetricCard } from '@/components/ui/summary-metric-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import SegmentedControl from '@/components/arc/segmented-control/segmented-control';
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
import {
  Layers,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  BookOpen,
  Edit2,
  Trash2,
} from 'lucide-react';
import type { CriterionParameter, AccreditationIndicator } from '@/types/domain/accreditation';

export function CriteriaFramework() {
  const {
    areas,
    parameters,
    indicators,
    addParameter,
    updateParameter,
    deleteParameter,
    addIndicator,
    updateIndicator,
    deleteIndicator,
  } = useAccreditationStore();

  const [activeTab, setActiveTab] = useState<'areas' | 'parameters' | 'indicators'>('areas');
  const [searchTerm, setSearchTerm] = useState('');

  // Add Parameter State
  const [isAddParamOpen, setIsAddParamOpen] = useState(false);
  const [paramAreaId, setParamAreaId] = useState(areas[0]?.id || '');
  const [paramCode, setParamCode] = useState('');
  const [paramTitle, setParamTitle] = useState('');
  const [paramDesc, setParamDesc] = useState('');

  // Edit Parameter State
  const [editingParam, setEditingParam] = useState<CriterionParameter | null>(null);
  const [editParamAreaId, setEditParamAreaId] = useState('');
  const [editParamCode, setEditParamCode] = useState('');
  const [editParamTitle, setEditParamTitle] = useState('');
  const [editParamDesc, setEditParamDesc] = useState('');

  // Add Indicator State
  const [isAddIndicatorOpen, setIsAddIndicatorOpen] = useState(false);
  const [newIndParamId, setNewIndParamId] = useState(parameters[0]?.id || '');
  const [newIndCode, setNewIndCode] = useState('');
  const [newIndDesc, setNewIndDesc] = useState('');
  const [newIndLevel, setNewIndLevel] = useState('Core Benchmark');

  // Edit Indicator State
  const [editingInd, setEditingInd] = useState<AccreditationIndicator | null>(null);
  const [editIndParamId, setEditIndParamId] = useState('');
  const [editIndCode, setEditIndCode] = useState('');
  const [editIndDesc, setEditIndDesc] = useState('');
  const [editIndLevel, setEditIndLevel] = useState('');

  // Delete Confirmation State
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    type: 'parameter' | 'indicator';
    id: string;
    title: string;
  } | null>(null);

  const filteredAreas = areas.filter(
    (a) =>
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.chairName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredParams = parameters.filter(
    (p) =>
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredIndicators = indicators.filter(
    (i) =>
      i.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Parameter CRUD Handlers
  const handleCreateParam = (e: React.FormEvent) => {
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

  const openEditParam = (param: CriterionParameter) => {
    setEditingParam(param);
    setEditParamAreaId(param.areaId);
    setEditParamCode(param.code);
    setEditParamTitle(param.title);
    setEditParamDesc(param.description);
  };

  const handleUpdateParam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingParam || !editParamCode || !editParamTitle) return;
    updateParameter(editingParam.id, {
      areaId: editParamAreaId,
      code: editParamCode.toUpperCase(),
      title: editParamTitle,
      description: editParamDesc,
    });
    setEditingParam(null);
  };

  // Indicator CRUD Handlers
  const handleCreateIndicator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIndCode || !newIndDesc) return;
    addIndicator({
      parameterId: newIndParamId,
      code: newIndCode.toUpperCase(),
      description: newIndDesc,
      level: newIndLevel,
      sortOrder: indicators.length + 1,
    });
    setNewIndCode('');
    setNewIndDesc('');
    setIsAddIndicatorOpen(false);
  };

  const openEditInd = (ind: AccreditationIndicator) => {
    setEditingInd(ind);
    setEditIndParamId(ind.parameterId);
    setEditIndCode(ind.code);
    setEditIndDesc(ind.description);
    setEditIndLevel(ind.level);
  };

  const handleUpdateInd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInd || !editIndCode || !editIndDesc) return;
    updateIndicator(editingInd.id, {
      parameterId: editIndParamId,
      code: editIndCode.toUpperCase(),
      description: editIndDesc,
      level: editIndLevel,
    });
    setEditingInd(null);
  };

  const tabSegments = [
    { value: 'areas', label: `Standard areas (${areas.length})` },
    { value: 'parameters', label: `Parameters (${parameters.length})` },
    { value: 'indicators', label: `Indicators (${indicators.length})` },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[var(--border)]">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-medium text-[var(--foreground)] tracking-tight flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-[var(--accent)] stroke-[1.75]" />
            Criteria framework
          </h1>
          <p className="font-[family-name:var(--font-body)] text-xs text-[var(--text-muted)] mt-1">
            Hierarchical criteria mapping across 10 AACCUP standard areas, parameters, and core indicators
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {activeTab === 'parameters' && (
            <Button
              onClick={() => {
                setParamAreaId(areas[0]?.id || '');
                setIsAddParamOpen(true);
              }}
              size="sm"
              className="gap-1.5"
            >
              <Plus className="w-4 h-4 stroke-[1.75]" />
              <span>Add parameter</span>
            </Button>
          )}

          {activeTab === 'indicators' && (
            <Button
              onClick={() => {
                setNewIndParamId(parameters[0]?.id || '');
                setIsAddIndicatorOpen(true);
              }}
              size="sm"
              className="gap-1.5"
            >
              <Plus className="w-4 h-4 stroke-[1.75]" />
              <span>Add indicator</span>
            </Button>
          )}
        </div>
      </div>

      {/* 3 Metric Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
        <SummaryMetricCard
          label="10 standard areas"
          value={areas.length}
          subtext="Core areas with assigned faculty leads"
          icon={Layers}
          tone="default"
        />

        <SummaryMetricCard
          label="Evaluation benchmarks"
          value={parameters.length}
          subtext="Granular rubric evaluation items"
          icon={BookOpen}
          tone="accent"
        />

        <SummaryMetricCard
          label="Verification indicators"
          value={indicators.length}
          subtext="Specific documentary proof standards"
          icon={CheckCircle2}
          tone="emerald"
        />
      </div>

      {/* Tab Controls & Table */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-[var(--border)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="overflow-x-auto max-w-full pb-1">
            <SegmentedControl
              options={tabSegments}
              value={activeTab}
              onValueChange={(val) => setActiveTab(val as 'areas' | 'parameters' | 'indicators')}
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

        {/* Tab 1: Areas Table */}
        {activeTab === 'areas' && (
          <div className="overflow-x-auto">
            <Table className="min-w-[640px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Area</TableHead>
                  <TableHead>Standard area title</TableHead>
                  <TableHead>Institutional weight</TableHead>
                  <TableHead>Faculty area chair</TableHead>
                  <TableHead>Parameters</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAreas.map((area) => (
                  <TableRow key={area.id}>
                    <TableCell className="font-mono font-medium text-xs text-[var(--accent)]">
                      Area {area.areaNumber}
                    </TableCell>
                    <TableCell className="font-medium text-xs text-[var(--foreground)]">{area.title}</TableCell>
                    <TableCell className="font-mono text-xs tabular-nums text-[var(--text-secondary)]">
                      {area.weight}%
                    </TableCell>
                    <TableCell className="text-xs text-[var(--foreground)]">{area.chairName}</TableCell>
                    <TableCell>
                      <Badge tone="neutral" size="sm">
                        {parameters.filter((p) => p.areaId === area.id).length} benchmarks
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Tab 2: Parameters Table */}
        {activeTab === 'parameters' && (
          <div className="overflow-x-auto">
            <Table className="min-w-[720px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Parameter title</TableHead>
                  <TableHead>Standard scope</TableHead>
                  <TableHead>Self-survey rating</TableHead>
                  <TableHead>Evaluator score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-10 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredParams.map((param) => (
                  <TableRow key={param.id}>
                    <TableCell className="font-mono font-medium text-xs text-[var(--accent)]">{param.code}</TableCell>
                    <TableCell className="font-medium text-xs text-[var(--foreground)] max-w-xs">{param.title}</TableCell>
                    <TableCell className="text-xs text-[var(--text-muted)] line-clamp-1 max-w-sm" title={param.description}>{param.description}</TableCell>
                    <TableCell className="font-mono text-xs tabular-nums text-[var(--text-secondary)]">
                      {param.selfSurveyRating ? param.selfSurveyRating.toFixed(2) : '-'}
                    </TableCell>
                    <TableCell className="font-mono text-xs tabular-nums font-medium text-[var(--accent)]">
                      {param.evaluatorRating ? param.evaluatorRating.toFixed(2) : 'Pending'}
                    </TableCell>
                    <TableCell>
                      <Badge
                        tone={
                          param.status === 'Audited'
                            ? 'success'
                            : param.status === 'Submitted'
                            ? 'info'
                            : 'neutral'
                        }
                        size="sm"
                      >
                        {param.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <RowActionMenu
                        ariaLabel={`Actions for ${param.code}`}
                        items={[
                          {
                            id: 'edit',
                            label: 'Edit parameter',
                            icon: <Edit2 className="w-3.5 h-3.5" />,
                            onClick: () => openEditParam(param),
                          },
                          {
                            id: 'delete',
                            label: 'Delete parameter',
                            icon: <Trash2 className="w-3.5 h-3.5" />,
                            destructive: true,
                            separatorBefore: true,
                            onClick: () =>
                              setDeleteConfirmation({
                                type: 'parameter',
                                id: param.id,
                                title: `${param.code}: ${param.title}`,
                              }),
                          },
                        ]}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Tab 3: Indicators Table */}
        {activeTab === 'indicators' && (
          <div className="overflow-x-auto">
            <Table className="min-w-[680px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Indicator code</TableHead>
                  <TableHead>Verification description</TableHead>
                  <TableHead>Benchmark tier</TableHead>
                  <TableHead>Target level</TableHead>
                  <TableHead className="w-10 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIndicators.map((ind) => (
                  <TableRow key={ind.id}>
                    <TableCell className="font-mono font-medium text-xs text-[var(--accent)]">{ind.code}</TableCell>
                    <TableCell className="text-xs text-[var(--foreground)] font-medium">{ind.description}</TableCell>
                    <TableCell>
                      <Badge tone="neutral" size="sm">
                        {ind.level}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-[var(--text-muted)]">AACCUP standard</TableCell>
                    <TableCell className="text-right">
                      <RowActionMenu
                        ariaLabel={`Actions for ${ind.code}`}
                        items={[
                          {
                            id: 'edit',
                            label: 'Edit indicator',
                            icon: <Edit2 className="w-3.5 h-3.5" />,
                            onClick: () => openEditInd(ind),
                          },
                          {
                            id: 'delete',
                            label: 'Delete indicator',
                            icon: <Trash2 className="w-3.5 h-3.5" />,
                            destructive: true,
                            separatorBefore: true,
                            onClick: () =>
                              setDeleteConfirmation({
                                type: 'indicator',
                                id: ind.id,
                                title: `${ind.code}: ${ind.description.slice(0, 30)}...`,
                              }),
                          },
                        ]}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* Delete Confirmation Safeguard Dialog */}
      <ConfirmDialog
        open={Boolean(deleteConfirmation)}
        onOpenChange={(open) => !open && setDeleteConfirmation(null)}
        title={`Delete ${deleteConfirmation?.type === 'parameter' ? 'Parameter Criterion' : 'Verification Indicator'}`}
        description={`Are you sure you want to delete "${deleteConfirmation?.title}"? This item will be permanently removed from the criteria catalog.`}
        confirmLabel="Delete"
        tone="danger"
        onConfirm={() => {
          if (!deleteConfirmation) return;
          if (deleteConfirmation.type === 'parameter') {
            deleteParameter(deleteConfirmation.id);
          } else if (deleteConfirmation.type === 'indicator') {
            deleteIndicator(deleteConfirmation.id);
          }
          setDeleteConfirmation(null);
        }}
      />

      {/* Add Parameter Drawer */}
      <Drawer open={isAddParamOpen} onOpenChange={setIsAddParamOpen}>
        <DrawerContent
          title="Add Criterion Parameter"
          description="Create a benchmark parameter under an accredited standard area"
          size="lg"
        >
          <form onSubmit={handleCreateParam} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Parent standard area
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

            <div>
              <Input
                label="Parameter code"
                placeholder="e.g. P.1.3"
                value={paramCode}
                onChange={(e) => setParamCode(e.target.value)}
                required
              />
            </div>

            <div>
              <Input
                label="Parameter title"
                placeholder="e.g. Faculty retention and progression"
                value={paramTitle}
                onChange={(e) => setParamTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Standard scope / description
              </label>
              <textarea
                rows={3}
                placeholder="Describe the rubric scope and evaluation expectations..."
                value={paramDesc}
                onChange={(e) => setParamDesc(e.target.value)}
                className="w-full text-xs p-2.5 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
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
                Create parameter
              </Button>
            </div>
          </form>
        </DrawerContent>
      </Drawer>

      {/* Edit Parameter Drawer */}
      <Drawer open={Boolean(editingParam)} onOpenChange={(open) => !open && setEditingParam(null)}>
        <DrawerContent
          title="Edit Criterion Parameter"
          description="Update parameter code, scope, and parent area association"
          size="lg"
        >
          <form onSubmit={handleUpdateParam} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Parent standard area
              </label>
              <select
                value={editParamAreaId}
                onChange={(e) => setEditParamAreaId(e.target.value)}
                className="w-full text-xs p-2 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
              >
                {areas.map((a) => (
                  <option key={a.id} value={a.id}>
                    Area {a.areaNumber}: {a.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Input
                label="Parameter code"
                value={editParamCode}
                onChange={(e) => setEditParamCode(e.target.value)}
                required
              />
            </div>

            <div>
              <Input
                label="Parameter title"
                value={editParamTitle}
                onChange={(e) => setEditParamTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Standard scope / description
              </label>
              <textarea
                rows={3}
                value={editParamDesc}
                onChange={(e) => setEditParamDesc(e.target.value)}
                className="w-full text-xs p-2.5 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border)]">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setEditingParam(null)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Save changes
              </Button>
            </div>
          </form>
        </DrawerContent>
      </Drawer>

      {/* Add Indicator Drawer */}
      <Drawer open={isAddIndicatorOpen} onOpenChange={setIsAddIndicatorOpen}>
        <DrawerContent
          title="Add verification indicator"
          description="Register a verifiable documentary requirement under a specific criteria parameter"
          size="lg"
        >
          <form onSubmit={handleCreateIndicator} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Parent parameter
              </label>
              <select
                value={newIndParamId}
                onChange={(e) => setNewIndParamId(e.target.value)}
                className="w-full text-xs p-2 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
              >
                {parameters.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.code} - {p.title.slice(0, 40)}...
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Input
                label="Indicator code"
                placeholder="e.g. I.3, S.2"
                value={newIndCode}
                onChange={(e) => setNewIndCode(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Benchmark tier
              </label>
              <select
                value={newIndLevel}
                onChange={(e) => setNewIndLevel(e.target.value)}
                className="w-full text-xs p-2 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
              >
                <option value="Core Benchmark">Core Benchmark</option>
                <option value="Advanced Indicator">Advanced Indicator</option>
                <option value="Best Practice Standard">Best Practice Standard</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Verification description
              </label>
              <textarea
                rows={3}
                placeholder="Specify the tangible documentation required for proof..."
                value={newIndDesc}
                onChange={(e) => setNewIndDesc(e.target.value)}
                required
                className="w-full text-xs p-2.5 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border)]">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setIsAddIndicatorOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Save indicator
              </Button>
            </div>
          </form>
        </DrawerContent>
      </Drawer>

      {/* Edit Indicator Drawer */}
      <Drawer open={Boolean(editingInd)} onOpenChange={(open) => !open && setEditingInd(null)}>
        <DrawerContent
          title="Edit verification indicator"
          description="Update indicator specifications and parent benchmark assignment"
          size="lg"
        >
          <form onSubmit={handleUpdateInd} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Parent parameter
              </label>
              <select
                value={editIndParamId}
                onChange={(e) => setEditIndParamId(e.target.value)}
                className="w-full text-xs p-2 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
              >
                {parameters.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.code} - {p.title.slice(0, 40)}...
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Input
                label="Indicator code"
                value={editIndCode}
                onChange={(e) => setEditIndCode(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Benchmark tier
              </label>
              <select
                value={editIndLevel}
                onChange={(e) => setEditIndLevel(e.target.value)}
                className="w-full text-xs p-2 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
              >
                <option value="Core Benchmark">Core Benchmark</option>
                <option value="Advanced Indicator">Advanced Indicator</option>
                <option value="Best Practice Standard">Best Practice Standard</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Verification description
              </label>
              <textarea
                rows={3}
                value={editIndDesc}
                onChange={(e) => setEditIndDesc(e.target.value)}
                required
                className="w-full text-xs p-2.5 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border)]">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setEditingInd(null)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Save changes
              </Button>
            </div>
          </form>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
