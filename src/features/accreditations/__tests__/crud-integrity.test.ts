import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  canDeleteDepartment,
  canDeleteProgram,
  filterProgramsByDepartment,
  filterCoursesByProgram,
  filterAreasByCycle,
  filterParametersByArea,
} from '../calculations.ts';
import type {
  CollegeDepartment,
  DegreeProgram,
  AcademicCourse,
  AccreditationCycle,
  AccreditationArea,
  CriterionParameter,
} from '../../../types/domain/accreditation.ts';

describe('Accreditation CRUD Referential Integrity & Relational Guardrails', () => {
  const departments: CollegeDepartment[] = [
    { id: 'dept-cics', code: 'CICS', name: 'College of Information and Computing Sciences', deanName: 'Dr. Cruz', programCount: 1 },
    { id: 'dept-cet', code: 'CET', name: 'College of Engineering and Technology', deanName: 'Engr. Gomez', programCount: 0 },
  ];

  const programs: DegreeProgram[] = [
    {
      id: 'prog-bsit',
      code: 'BSIT',
      name: 'Bachelor of Science in Information Technology',
      college: 'College of Information and Computing Sciences',
      departmentId: 'dept-cics',
      currentLevel: 'Level II Re-accredited',
      targetLevel: 'Level III Phase 1',
      leadCoordinator: 'coordinator@oams.edu',
    },
  ];

  const courses: AcademicCourse[] = [
    {
      id: 'course-it101',
      code: 'IT 101',
      title: 'Introduction to Computing',
      programId: 'prog-bsit',
      departmentId: 'dept-cics',
      units: 3,
      yearLevel: 1,
      semester: '1st Semester',
    },
  ];

  const cycles: AccreditationCycle[] = [
    {
      id: 'cycle-1',
      name: 'AACCUP Survey 2026',
      body: 'AACCUP',
      academicYear: '2025-2026',
      startDate: '2026-03-01',
      endDate: '2026-05-30',
      status: 'Under Evaluation',
      programIds: ['prog-bsit'],
      targetLevel: 'Level III Phase 1',
      description: 'Formal audit',
      createdAt: '2026-01-01',
    },
  ];

  it('blocks deletion of a department that contains active programs', () => {
    const result = canDeleteDepartment('dept-cics', programs);
    assert.equal(result.canDelete, false);
    assert.match(result.reason || '', /active program/i);
  });

  it('allows deletion of a department with no programs', () => {
    const result = canDeleteDepartment('dept-cet', programs);
    assert.equal(result.canDelete, true);
    assert.equal(result.reason, undefined);
  });

  it('blocks deletion of a program referenced in active cycles or containing courses', () => {
    const result = canDeleteProgram('prog-bsit', cycles, courses);
    assert.equal(result.canDelete, false);
    assert.match(result.reason || '', /cycle|course/i);
  });

  it('allows deletion of an unreferenced program without courses or cycles', () => {
    const result = canDeleteProgram('prog-unused', cycles, courses);
    assert.equal(result.canDelete, true);
  });

  it('filters programs by department ID accurately', () => {
    const cicsProgs = filterProgramsByDepartment('dept-cics', programs);
    assert.equal(cicsProgs.length, 1);
    assert.equal(cicsProgs[0].code, 'BSIT');

    const cetProgs = filterProgramsByDepartment('dept-cet', programs);
    assert.equal(cetProgs.length, 0);
  });

  it('filters courses by program ID accurately', () => {
    const itCourses = filterCoursesByProgram('prog-bsit', courses);
    assert.equal(itCourses.length, 1);
    assert.equal(itCourses[0].code, 'IT 101');

    const emptyCourses = filterCoursesByProgram('prog-other', courses);
    assert.equal(emptyCourses.length, 0);
  });

  it('filters standard areas by cycle ID accurately', () => {
    const areas: AccreditationArea[] = [
      { id: 'a1', cycleId: 'cycle-1', programId: 'prog-bsit', areaNumber: 1, title: 'VMGO', chairName: 'Dr. Santos', chairEmail: 's@o.e', weight: 10, status: 'Audited' },
      { id: 'a2', cycleId: 'cycle-2', programId: 'prog-bsit', areaNumber: 2, title: 'Faculty', chairName: 'Dr. Diaz', chairEmail: 'd@o.e', weight: 10, status: 'Not Started' },
    ];
    const cycle1Areas = filterAreasByCycle('cycle-1', areas);
    assert.equal(cycle1Areas.length, 1);
    assert.equal(cycle1Areas[0].title, 'VMGO');
  });

  it('filters parameters by area ID accurately', () => {
    const params: CriterionParameter[] = [
      { id: 'p1', areaId: 'a1', code: 'Param A', title: 'VMGO Statement', description: 'Desc', selfSurveyRating: 4.5, evaluatorRating: 4.5, status: 'Audited', facultyRemarks: '', evidenceIds: [] },
      { id: 'p2', areaId: 'a2', code: 'Param B', title: 'Faculty Qualifications', description: 'Desc', selfSurveyRating: 4.0, evaluatorRating: null, status: 'Draft', facultyRemarks: '', evidenceIds: [] },
    ];
    const a1Params = filterParametersByArea('a1', params);
    assert.equal(a1Params.length, 1);
    assert.equal(a1Params[0].code, 'Param A');
  });
});
