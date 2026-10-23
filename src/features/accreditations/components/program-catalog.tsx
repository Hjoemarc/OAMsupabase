'use client';

import React, { useState } from 'react';
import { useAccreditationStore } from '../context/store-context';
import { canDeleteDepartment, canDeleteProgram, filterProgramsByDepartment } from '../calculations';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
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
import { DependentSelect } from '@/components/ui/dependent-select';
import {
  GraduationCap,
  Building2,
  Plus,
  Search,
  BookOpen,
  Edit2,
  Trash2,
} from 'lucide-react';
import type {
  AccreditationLevel,
  CollegeDepartment,
  DegreeProgram,
  AcademicCourse,
} from '@/types/domain/accreditation';

export function ProgramCatalog() {
  const {
    departments,
    programs,
    courses,
    cycles,
    addDepartment,
    updateDepartment,
    deleteDepartment,
    addProgram,
    updateProgram,
    deleteProgram,
    addCourse,
    updateCourse,
    deleteCourse,
  } = useAccreditationStore();

  const [activeTab, setActiveTab] = useState<'programs' | 'colleges' | 'courses'>('programs');
  const [searchTerm, setSearchTerm] = useState('');

  // Add College Modal State
  const [isAddDeptOpen, setIsAddDeptOpen] = useState(false);
  const [newDeptCode, setNewDeptCode] = useState('');
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptDean, setNewDeptDean] = useState('');

  // Edit College Modal State
  const [editingDept, setEditingDept] = useState<CollegeDepartment | null>(null);
  const [editDeptCode, setEditDeptCode] = useState('');
  const [editDeptName, setEditDeptName] = useState('');
  const [editDeptDean, setEditDeptDean] = useState('');

  // Add Program Modal State
  const [isAddProgOpen, setIsAddProgOpen] = useState(false);
  const [newProgCode, setNewProgCode] = useState('');
  const [newProgName, setNewProgName] = useState('');
  const [newProgDeptId, setNewProgDeptId] = useState(departments[0]?.id || '');
  const [newProgLevel, setNewProgLevel] = useState<AccreditationLevel>('Level I');
  const [newProgTarget, setNewProgTarget] = useState<AccreditationLevel>('Level II Re-accredited');
  const [newProgLead, setNewProgLead] = useState('coordinator@oams.edu');

  // Edit Program Modal State
  const [editingProg, setEditingProg] = useState<DegreeProgram | null>(null);
  const [editProgCode, setEditProgCode] = useState('');
  const [editProgName, setEditProgName] = useState('');
  const [editProgDeptId, setEditProgDeptId] = useState('');
  const [editProgLevel, setEditProgLevel] = useState<AccreditationLevel>('Level I');
  const [editProgTarget, setEditProgTarget] = useState<AccreditationLevel>('Level II Re-accredited');
  const [editProgLead, setEditProgLead] = useState('');

  // Course Modal State
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const [courseDeptId, setCourseDeptId] = useState(departments[0]?.id || '');
  const [courseProgId, setCourseProgId] = useState(programs[0]?.id || '');
  const [courseCode, setCourseCode] = useState('');
  const [courseTitle, setCourseTitle] = useState('');
  const [courseUnits, setCourseUnits] = useState(3);
  const [courseYear, setCourseYear] = useState<number>(1);
  const [courseSemester, setCourseSemester] = useState<'1st Semester' | '2nd Semester' | 'Summer'>('1st Semester');

  // Edit Course Modal State
  const [editingCourse, setEditingCourse] = useState<AcademicCourse | null>(null);

  // Delete Safeguard Dialog State
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    type: 'department' | 'program' | 'course';
    id: string;
    name: string;
    blocked?: boolean;
    blockReason?: string;
  } | null>(null);

  // Filtered queries
  const filteredDepts = departments.filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProgs = programs.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.college.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCourses = courses.filter((c) => {
    const prog = programs.find((p) => p.id === c.programId);
    return (
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (prog?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (prog?.code || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Department Handlers
  const handleCreateDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptCode || !newDeptName) return;
    addDepartment({
      code: newDeptCode.toUpperCase(),
      name: newDeptName,
      deanName: newDeptDean || 'Dr. Assigned Dean',
      programCount: 0,
    });
    setNewDeptCode('');
    setNewDeptName('');
    setNewDeptDean('');
    setIsAddDeptOpen(false);
  };

  const openEditDept = (dept: CollegeDepartment) => {
    setEditingDept(dept);
    setEditDeptCode(dept.code);
    setEditDeptName(dept.name);
    setEditDeptDean(dept.deanName);
  };

  const handleUpdateDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDept || !editDeptCode || !editDeptName) return;
    updateDepartment(editingDept.id, {
      code: editDeptCode.toUpperCase(),
      name: editDeptName,
      deanName: editDeptDean,
    });
    setEditingDept(null);
  };

  const initiateDeleteDept = (dept: CollegeDepartment) => {
    const res = canDeleteDepartment(dept.id, programs);
    if (!res.canDelete) {
      setDeleteConfirmation({
        type: 'department',
        id: dept.id,
        name: `${dept.code} - ${dept.name}`,
        blocked: true,
        blockReason: res.reason || 'Cannot delete department with active programs.',
      });
    } else {
      setDeleteConfirmation({
        type: 'department',
        id: dept.id,
        name: `${dept.code} - ${dept.name}`,
        blocked: false,
      });
    }
  };

  // Program Handlers
  const handleCreateProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProgCode || !newProgName) return;
    const dept = departments.find((d) => d.id === newProgDeptId) || departments[0];
    addProgram({
      code: newProgCode.toUpperCase(),
      name: newProgName,
      college: dept?.name || 'College of Science',
      departmentId: dept?.id,
      currentLevel: newProgLevel,
      targetLevel: newProgTarget,
      leadCoordinator: newProgLead,
    });
    setNewProgCode('');
    setNewProgName('');
    setIsAddProgOpen(false);
  };

  const openEditProg = (prog: DegreeProgram) => {
    setEditingProg(prog);
    setEditProgCode(prog.code);
    setEditProgName(prog.name);
    const matchedDept =
      departments.find((d) => d.id === prog.departmentId || d.name === prog.college) ||
      departments[0];
    setEditProgDeptId(matchedDept?.id || '');
    setEditProgLevel(prog.currentLevel);
    setEditProgTarget(prog.targetLevel);
    setEditProgLead(prog.leadCoordinator);
  };

  const handleUpdateProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProg || !editProgCode || !editProgName) return;
    const dept = departments.find((d) => d.id === editProgDeptId) || departments[0];
    updateProgram(editingProg.id, {
      code: editProgCode.toUpperCase(),
      name: editProgName,
      college: dept?.name || editingProg.college,
      departmentId: dept?.id,
      currentLevel: editProgLevel,
      targetLevel: editProgTarget,
      leadCoordinator: editProgLead,
    });
    setEditingProg(null);
  };

  const initiateDeleteProgram = (prog: DegreeProgram) => {
    const res = canDeleteProgram(prog.id, cycles, courses);
    if (!res.canDelete) {
      setDeleteConfirmation({
        type: 'program',
        id: prog.id,
        name: `${prog.code} - ${prog.name}`,
        blocked: true,
        blockReason: res.reason || 'Cannot delete program linked to active cycles or courses.',
      });
    } else {
      setDeleteConfirmation({
        type: 'program',
        id: prog.id,
        name: `${prog.code} - ${prog.name}`,
        blocked: false,
      });
    }
  };

  // Course Handlers
  const handleDeptSelectForCourse = (selectedDeptId: string) => {
    setCourseDeptId(selectedDeptId);
    const matchingProgs = filterProgramsByDepartment(selectedDeptId, programs);
    if (matchingProgs.length > 0) {
      setCourseProgId(matchingProgs[0].id);
    } else {
      setCourseProgId('');
    }
  };

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseCode || !courseTitle || !courseProgId) return;
    addCourse({
      programId: courseProgId,
      departmentId: courseDeptId || departments[0]?.id || '',
      code: courseCode.toUpperCase(),
      title: courseTitle,
      units: Number(courseUnits),
      yearLevel: courseYear,
      semester: courseSemester,
    });
    setCourseCode('');
    setCourseTitle('');
    setIsAddCourseOpen(false);
  };

  const openEditCourse = (course: AcademicCourse) => {
    setEditingCourse(course);
    const prog = programs.find((p) => p.id === course.programId);
    setCourseDeptId(prog?.departmentId || departments[0]?.id || '');
    setCourseProgId(course.programId);
    setCourseCode(course.code);
    setCourseTitle(course.title);
    setCourseUnits(course.units);
    setCourseYear(course.yearLevel);
    setCourseSemester(course.semester);
  };

  const handleUpdateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse || !courseCode || !courseTitle || !courseProgId) return;
    updateCourse(editingCourse.id, {
      programId: courseProgId,
      departmentId: courseDeptId || editingCourse.departmentId,
      code: courseCode.toUpperCase(),
      title: courseTitle,
      units: Number(courseUnits),
      yearLevel: courseYear,
      semester: courseSemester,
    });
    setEditingCourse(null);
  };

  const tabSegments = [
    { value: 'programs', label: `Degree programs (${programs.length})` },
    { value: 'colleges', label: `Colleges and departments (${departments.length})` },
    { value: 'courses', label: `Academic courses (${courses.length})` },
  ];

  const availableProgramsForCourse = filterProgramsByDepartment(courseDeptId, programs);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[var(--border)]">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-medium text-[var(--foreground)] tracking-tight flex items-center gap-2.5">
            <GraduationCap className="w-6 h-6 text-[var(--accent)] stroke-[1.75]" />
            Program, department, and course management
          </h1>
          <p className="font-[family-name:var(--font-body)] text-xs text-[var(--text-muted)] mt-1">
            Configure academic degree programs, college affiliations, curricular courses, and accreditation tiers
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="secondary"
            onClick={() => setIsAddDeptOpen(true)}
            size="sm"
            className="gap-1.5"
          >
            <Building2 className="w-3.5 h-3.5 stroke-[1.75]" />
            <span>Add college</span>
          </Button>

          <Button
            variant="secondary"
            onClick={() => {
              setCourseDeptId(departments[0]?.id || '');
              const progs = filterProgramsByDepartment(departments[0]?.id || '', programs);
              setCourseProgId(progs[0]?.id || '');
              setCourseCode('');
              setCourseTitle('');
              setIsAddCourseOpen(true);
            }}
            size="sm"
            className="gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 stroke-[1.75]" />
            <span>Add course</span>
          </Button>

          <Button
            onClick={() => setIsAddProgOpen(true)}
            size="sm"
            className="gap-1.5"
          >
            <Plus className="w-4 h-4 stroke-[1.75]" />
            <span>Add program</span>
          </Button>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
        <Card>
          <CardHeader className="pb-2">
            <span className="text-xs font-medium text-[var(--text-secondary)]">Academic colleges</span>
            <CardTitle className="text-2xl font-medium text-[var(--foreground)] tabular-nums">{departments.length}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-[var(--text-muted)]">Active constituent departments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <span className="text-xs font-medium text-[var(--text-secondary)]">Degree programs</span>
            <CardTitle className="text-2xl font-medium text-[var(--accent)] tabular-nums">{programs.length}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-[var(--text-muted)]">Undergraduate curricula</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <span className="text-xs font-medium text-[var(--text-secondary)]">Academic courses</span>
            <CardTitle className="text-2xl font-medium text-emerald-700 tabular-nums">
              {courses.length}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-[var(--text-muted)]">Active subjects in catalog</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <span className="text-xs font-medium text-[var(--text-secondary)]">Level III and above</span>
            <CardTitle className="text-2xl font-medium text-amber-700 tabular-nums">
              {
                programs.filter(
                  (p) =>
                    p.currentLevel.includes('Level III') || p.currentLevel === 'Level IV'
                ).length
              }
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-[var(--text-muted)]">Higher accreditation benchmarks</p>
          </CardContent>
        </Card>
      </div>

      {/* Tab Controls & Filter Bar */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-[var(--border)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="overflow-x-auto max-w-full pb-1">
            <SegmentedControl
              options={tabSegments}
              value={activeTab}
              onValueChange={(val) => setActiveTab(val as 'programs' | 'colleges' | 'courses')}
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

        {/* Tab 1: Programs Table */}
        {activeTab === 'programs' && (
          <div className="overflow-x-auto">
            <Table className="min-w-[680px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Program code</TableHead>
                  <TableHead>Degree title</TableHead>
                  <TableHead>College department</TableHead>
                  <TableHead>Current level</TableHead>
                  <TableHead>Target benchmark</TableHead>
                  <TableHead>Lead coordinator</TableHead>
                  <TableHead className="w-10 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProgs.map((prog) => (
                  <TableRow key={prog.id}>
                    <TableCell className="font-mono font-medium text-[var(--accent)]">{prog.code}</TableCell>
                    <TableCell className="font-medium text-xs text-[var(--foreground)]">{prog.name}</TableCell>
                    <TableCell className="text-xs text-[var(--text-secondary)]">{prog.college}</TableCell>
                    <TableCell>
                      <Badge
                        tone={
                          prog.currentLevel.includes('Level III') || prog.currentLevel === 'Level IV'
                            ? 'success'
                            : 'info'
                        }
                        size="sm"
                      >
                        {prog.currentLevel}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-xs text-[var(--text-secondary)]">{prog.targetLevel}</TableCell>
                    <TableCell className="text-xs text-[var(--text-muted)]">{prog.leadCoordinator}</TableCell>
                    <TableCell className="text-right">
                      <RowActionMenu
                        ariaLabel={`Actions for ${prog.code}`}
                        items={[
                          {
                            id: 'edit',
                            label: 'Edit program',
                            icon: <Edit2 className="w-3.5 h-3.5" />,
                            onClick: () => openEditProg(prog),
                          },
                          {
                            id: 'delete',
                            label: 'Delete program',
                            icon: <Trash2 className="w-3.5 h-3.5" />,
                            destructive: true,
                            separatorBefore: true,
                            onClick: () => initiateDeleteProgram(prog),
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

        {/* Tab 2: Colleges Table */}
        {activeTab === 'colleges' && (
          <div className="overflow-x-auto">
            <Table className="min-w-[550px]">
              <TableHeader>
                <TableRow>
                  <TableHead>College code</TableHead>
                  <TableHead>College / department name</TableHead>
                  <TableHead>Dean / department head</TableHead>
                  <TableHead>Programs offered</TableHead>
                  <TableHead className="w-10 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDepts.map((dept) => {
                  const associatedCount = programs.filter(
                    (p) => p.departmentId === dept.id || p.college === dept.name
                  ).length;

                  return (
                    <TableRow key={dept.id}>
                      <TableCell className="font-mono font-medium text-[var(--accent)]">{dept.code}</TableCell>
                      <TableCell className="font-medium text-xs text-[var(--foreground)]">{dept.name}</TableCell>
                      <TableCell className="text-xs text-[var(--text-secondary)]">{dept.deanName}</TableCell>
                      <TableCell>
                        <Badge tone="neutral" size="sm">
                          {associatedCount} program{associatedCount === 1 ? '' : 's'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <RowActionMenu
                          ariaLabel={`Actions for ${dept.code}`}
                          items={[
                            {
                              id: 'edit',
                              label: 'Edit college',
                              icon: <Edit2 className="w-3.5 h-3.5" />,
                              onClick: () => openEditDept(dept),
                            },
                            {
                              id: 'delete',
                              label: 'Delete college',
                              icon: <Trash2 className="w-3.5 h-3.5" />,
                              destructive: true,
                              separatorBefore: true,
                              onClick: () => initiateDeleteDept(dept),
                            },
                          ]}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Tab 3: Courses Table */}
        {activeTab === 'courses' && (
          <div className="overflow-x-auto">
            <Table className="min-w-[650px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Course code</TableHead>
                  <TableHead>Course title</TableHead>
                  <TableHead>Degree program</TableHead>
                  <TableHead>Units</TableHead>
                  <TableHead>Year & semester</TableHead>
                  <TableHead className="w-10 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-xs text-[var(--text-muted)]">
                      No academic courses registered yet. Click &quot;Add course&quot; above to create one.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCourses.map((crs) => {
                    const prog = programs.find((p) => p.id === crs.programId);

                    return (
                      <TableRow key={crs.id}>
                        <TableCell className="font-mono font-medium text-[var(--accent)]">{crs.code}</TableCell>
                        <TableCell className="font-medium text-xs text-[var(--foreground)]">{crs.title}</TableCell>
                        <TableCell className="text-xs text-[var(--text-secondary)]">
                          {prog ? `${prog.code} (${prog.name})` : '—'}
                        </TableCell>
                        <TableCell className="text-xs font-mono">{crs.units} units</TableCell>
                        <TableCell className="text-xs text-[var(--text-muted)]">
                          Year {crs.yearLevel}, Sem {crs.semester}
                        </TableCell>
                        <TableCell className="text-right">
                          <RowActionMenu
                            ariaLabel={`Actions for ${crs.code}`}
                            items={[
                              {
                                id: 'edit',
                                label: 'Edit course',
                                icon: <Edit2 className="w-3.5 h-3.5" />,
                                onClick: () => openEditCourse(crs),
                              },
                              {
                                id: 'delete',
                                label: 'Delete course',
                                icon: <Trash2 className="w-3.5 h-3.5" />,
                                destructive: true,
                                separatorBefore: true,
                                onClick: () => {
                                  setDeleteConfirmation({
                                    type: 'course',
                                    id: crs.id,
                                    name: `${crs.code} - ${crs.title}`,
                                    blocked: false,
                                  });
                                },
                              },
                            ]}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* Delete / Safeguard Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(deleteConfirmation)}
        onOpenChange={(open) => !open && setDeleteConfirmation(null)}
        title={
          deleteConfirmation?.blocked
            ? 'Action Blocked by System Safeguards'
            : `Delete ${deleteConfirmation?.type}`
        }
        description={
          deleteConfirmation?.blocked
            ? deleteConfirmation.blockReason || 'Referential integrity checks blocked this deletion.'
            : `Are you sure you want to delete "${deleteConfirmation?.name}"? This action cannot be undone.`
        }
        confirmLabel={deleteConfirmation?.blocked ? 'Understood' : 'Delete'}
        tone={deleteConfirmation?.blocked ? 'warning' : 'danger'}
        onConfirm={() => {
          if (!deleteConfirmation) return;
          if (deleteConfirmation.blocked) {
            setDeleteConfirmation(null);
            return;
          }
          if (deleteConfirmation.type === 'department') {
            deleteDepartment(deleteConfirmation.id);
          } else if (deleteConfirmation.type === 'program') {
            deleteProgram(deleteConfirmation.id);
          } else if (deleteConfirmation.type === 'course') {
            deleteCourse(deleteConfirmation.id);
          }
          setDeleteConfirmation(null);
        }}
      />

      {/* Add College Drawer */}
      <Drawer open={isAddDeptOpen} onOpenChange={setIsAddDeptOpen}>
        <DrawerContent
          title="Add academic college"
          description="Register a new academic department or college within the institution"
          size="lg"
        >
          <form onSubmit={handleCreateDept} className="space-y-4 pt-2">
            <div>
              <Input
                label="College code"
                placeholder="e.g. CCS"
                value={newDeptCode}
                onChange={(e) => setNewDeptCode(e.target.value)}
                required
              />
            </div>

            <div>
              <Input
                label="College / department name"
                placeholder="e.g. College of Computer Studies"
                value={newDeptName}
                onChange={(e) => setNewDeptName(e.target.value)}
                required
              />
            </div>

            <div>
              <Input
                label="Dean / Department head"
                placeholder="e.g. Dr. Maria Elena Santos"
                value={newDeptDean}
                onChange={(e) => setNewDeptDean(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border)]">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setIsAddDeptOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Add college
              </Button>
            </div>
          </form>
        </DrawerContent>
      </Drawer>

      {/* Edit College Drawer */}
      <Drawer open={Boolean(editingDept)} onOpenChange={(open) => !open && setEditingDept(null)}>
        <DrawerContent
          title="Edit academic college"
          description="Update details and leadership for this constituent college"
          size="lg"
        >
          <form onSubmit={handleUpdateDept} className="space-y-4 pt-2">
            <div>
              <Input
                label="College code"
                value={editDeptCode}
                onChange={(e) => setEditDeptCode(e.target.value)}
                required
              />
            </div>

            <div>
              <Input
                label="College / department name"
                value={editDeptName}
                onChange={(e) => setEditDeptName(e.target.value)}
                required
              />
            </div>

            <div>
              <Input
                label="Dean / Department head"
                value={editDeptDean}
                onChange={(e) => setEditDeptDean(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border)]">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setEditingDept(null)}
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

      {/* Add Program Drawer */}
      <Drawer open={isAddProgOpen} onOpenChange={setIsAddProgOpen}>
        <DrawerContent
          title="Add degree program"
          description="Enroll a new curriculum into institutional accreditation tracking"
          size="lg"
        >
          <form onSubmit={handleCreateProgram} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Input
                  label="Program code"
                  placeholder="e.g. BSIT"
                  value={newProgCode}
                  onChange={(e) => setNewProgCode(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  College department
                </label>
                <select
                  value={newProgDeptId}
                  onChange={(e) => setNewProgDeptId(e.target.value)}
                  className="w-full text-xs p-2 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.code} - {d.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <Input
                label="Degree title"
                placeholder="e.g. Bachelor of Science in Information Technology"
                value={newProgName}
                onChange={(e) => setNewProgName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Current level
                </label>
                <select
                  value={newProgLevel}
                  onChange={(e) => setNewProgLevel(e.target.value as AccreditationLevel)}
                  className="w-full text-xs p-2 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
                >
                  <option value="Candidate">Candidate</option>
                  <option value="Level I">Level I</option>
                  <option value="Level II Re-accredited">Level II Re-accredited</option>
                  <option value="Level III Phase 1">Level III Phase 1</option>
                  <option value="Level III Phase 2">Level III Phase 2</option>
                  <option value="Level IV">Level IV</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Target benchmark
                </label>
                <select
                  value={newProgTarget}
                  onChange={(e) => setNewProgTarget(e.target.value as AccreditationLevel)}
                  className="w-full text-xs p-2 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
                >
                  <option value="Level I">Level I</option>
                  <option value="Level II Re-accredited">Level II Re-accredited</option>
                  <option value="Level III Phase 1">Level III Phase 1</option>
                  <option value="Level III Phase 2">Level III Phase 2</option>
                  <option value="Level IV">Level IV</option>
                </select>
              </div>
            </div>

            <div>
              <Input
                label="Lead QA coordinator"
                type="email"
                placeholder="coordinator@oams.edu"
                value={newProgLead}
                onChange={(e) => setNewProgLead(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border)]">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setIsAddProgOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Add program
              </Button>
            </div>
          </form>
        </DrawerContent>
      </Drawer>

      {/* Edit Program Drawer */}
      <Drawer open={Boolean(editingProg)} onOpenChange={(open) => !open && setEditingProg(null)}>
        <DrawerContent
          title="Edit degree program"
          description="Update accreditation tier, lead coordinator, and program information"
          size="lg"
        >
          <form onSubmit={handleUpdateProgram} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Input
                  label="Program code"
                  value={editProgCode}
                  onChange={(e) => setEditProgCode(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  College department
                </label>
                <select
                  value={editProgDeptId}
                  onChange={(e) => setEditProgDeptId(e.target.value)}
                  className="w-full text-xs p-2 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.code} - {d.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <Input
                label="Degree title"
                value={editProgName}
                onChange={(e) => setEditProgName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Current level
                </label>
                <select
                  value={editProgLevel}
                  onChange={(e) => setEditProgLevel(e.target.value as AccreditationLevel)}
                  className="w-full text-xs p-2 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
                >
                  <option value="Candidate">Candidate</option>
                  <option value="Level I">Level I</option>
                  <option value="Level II Re-accredited">Level II Re-accredited</option>
                  <option value="Level III Phase 1">Level III Phase 1</option>
                  <option value="Level III Phase 2">Level III Phase 2</option>
                  <option value="Level IV">Level IV</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Target benchmark
                </label>
                <select
                  value={editProgTarget}
                  onChange={(e) => setEditProgTarget(e.target.value as AccreditationLevel)}
                  className="w-full text-xs p-2 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
                >
                  <option value="Level I">Level I</option>
                  <option value="Level II Re-accredited">Level II Re-accredited</option>
                  <option value="Level III Phase 1">Level III Phase 1</option>
                  <option value="Level III Phase 2">Level III Phase 2</option>
                  <option value="Level IV">Level IV</option>
                </select>
              </div>
            </div>

            <div>
              <Input
                label="Lead QA coordinator"
                type="email"
                value={editProgLead}
                onChange={(e) => setEditProgLead(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border)]">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setEditingProg(null)}
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

      {/* Add Course Drawer (Cascading Dependent Selection) */}
      <Drawer open={isAddCourseOpen} onOpenChange={setIsAddCourseOpen}>
        <DrawerContent
          title="Add academic course"
          description="Register a subject course under a specific college and degree program"
          size="lg"
        >
          <form onSubmit={handleCreateCourse} className="space-y-4 pt-2">
            <DependentSelect
              label="College Department"
              value={courseDeptId}
              onChange={handleDeptSelectForCourse}
              options={departments.map((d) => ({
                value: d.id,
                label: `${d.code} - ${d.name}`,
              }))}
              required
            />

            <DependentSelect
              label="Degree Program (Filtered by College)"
              value={courseProgId}
              onChange={setCourseProgId}
              options={availableProgramsForCourse.map((p) => ({
                value: p.id,
                label: `${p.code} - ${p.name}`,
              }))}
              disabled={!courseDeptId}
              disabledReason="Select a college department first"
              emptyMessage="No degree programs found for this department"
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Input
                  label="Course code"
                  placeholder="e.g. IT211"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  required
                />
              </div>
              <div>
                <Input
                  label="Credit units"
                  type="number"
                  min={1}
                  max={6}
                  value={courseUnits}
                  onChange={(e) => setCourseUnits(Number(e.target.value))}
                  required
                />
              </div>
            </div>

            <div>
              <Input
                label="Course title"
                placeholder="e.g. Data Structures and Algorithms"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Year level
                </label>
                <select
                  value={courseYear}
                  onChange={(e) => setCourseYear(Number(e.target.value) as 1 | 2 | 3 | 4)}
                  className="w-full text-xs p-2 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
                >
                  <option value={1}>1st Year</option>
                  <option value={2}>2nd Year</option>
                  <option value={3}>3rd Year</option>
                  <option value={4}>4th Year</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Semester
                </label>
                <select
                  value={courseSemester}
                  onChange={(e) => setCourseSemester(e.target.value as '1st Semester' | '2nd Semester' | 'Summer')}
                  className="w-full text-xs p-2 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
                >
                  <option value="1st Semester">1st Semester</option>
                  <option value="2nd Semester">2nd Semester</option>
                  <option value="Summer">Summer Term</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border)]">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setIsAddCourseOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={!courseProgId}>
                Add course
              </Button>
            </div>
          </form>
        </DrawerContent>
      </Drawer>

      {/* Edit Course Drawer */}
      <Drawer open={Boolean(editingCourse)} onOpenChange={(open) => !open && setEditingCourse(null)}>
        <DrawerContent
          title="Edit academic course"
          description="Update course specifications, program link, and credit units"
          size="lg"
        >
          <form onSubmit={handleUpdateCourse} className="space-y-4 pt-2">
            <DependentSelect
              label="College Department"
              value={courseDeptId}
              onChange={handleDeptSelectForCourse}
              options={departments.map((d) => ({
                value: d.id,
                label: `${d.code} - ${d.name}`,
              }))}
              required
            />

            <DependentSelect
              label="Degree Program (Filtered by College)"
              value={courseProgId}
              onChange={setCourseProgId}
              options={availableProgramsForCourse.map((p) => ({
                value: p.id,
                label: `${p.code} - ${p.name}`,
              }))}
              disabled={!courseDeptId}
              disabledReason="Select a college department first"
              emptyMessage="No degree programs found for this department"
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Input
                  label="Course code"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  required
                />
              </div>
              <div>
                <Input
                  label="Credit units"
                  type="number"
                  min={1}
                  max={6}
                  value={courseUnits}
                  onChange={(e) => setCourseUnits(Number(e.target.value))}
                  required
                />
              </div>
            </div>

            <div>
              <Input
                label="Course title"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Year level
                </label>
                <select
                  value={courseYear}
                  onChange={(e) => setCourseYear(Number(e.target.value) as 1 | 2 | 3 | 4)}
                  className="w-full text-xs p-2 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
                >
                  <option value={1}>1st Year</option>
                  <option value={2}>2nd Year</option>
                  <option value={3}>3rd Year</option>
                  <option value={4}>4th Year</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Semester
                </label>
                <select
                  value={courseSemester}
                  onChange={(e) => setCourseSemester(e.target.value as '1st Semester' | '2nd Semester' | 'Summer')}
                  className="w-full text-xs p-2 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
                >
                  <option value="1st Semester">1st Semester</option>
                  <option value="2nd Semester">2nd Semester</option>
                  <option value="Summer">Summer Term</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border)]">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setEditingCourse(null)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={!courseProgId}>
                Save changes
              </Button>
            </div>
          </form>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
