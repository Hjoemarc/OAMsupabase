import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  filterProgramsByDepartment,
  filterCoursesByProgram,
  filterAreasByCycle,
  filterParametersByArea,
} from '../calculations.ts';
import type {
  DegreeProgram,
  AcademicCourse,
  AccreditationArea,
  CriterionParameter,
} from '@/types/domain/accreditation';

describe('Dependent Cascading Filters - Unit Tests', () => {
  const samplePrograms: DegreeProgram[] = [
    {
      id: 'prog-1',
      code: 'BSIT',
      name: 'BS Information Technology',
      college: 'College of Computer Studies',
      departmentId: 'dept-ccs',
      currentLevel: 'Level II Re-accredited',
      targetLevel: 'Level III Phase 1',
      leadCoordinator: 'coord1@oams.edu',
    },
    {
      id: 'prog-2',
      code: 'BSCS',
      name: 'BS Computer Science',
      college: 'College of Computer Studies',
      departmentId: 'dept-ccs',
      currentLevel: 'Level I',
      targetLevel: 'Level II Re-accredited',
      leadCoordinator: 'coord2@oams.edu',
    },
    {
      id: 'prog-3',
      code: 'BSEE',
      name: 'BS Electrical Engineering',
      college: 'College of Engineering',
      departmentId: 'dept-coe',
      currentLevel: 'Candidate Status',
      targetLevel: 'Level I',
      leadCoordinator: 'coord3@oams.edu',
    },
  ];

  const sampleCourses: AcademicCourse[] = [
    {
      id: 'course-1',
      programId: 'prog-1',
      departmentId: 'dept-ccs',
      code: 'IT101',
      title: 'Introduction to Computing',
      units: 3,
      yearLevel: 1,
      semester: '1st Semester',
    },
    {
      id: 'course-2',
      programId: 'prog-1',
      departmentId: 'dept-ccs',
      code: 'IT201',
      title: 'Data Structures',
      units: 3,
      yearLevel: 2,
      semester: '1st Semester',
    },
    {
      id: 'course-3',
      programId: 'prog-2',
      departmentId: 'dept-ccs',
      code: 'CS101',
      title: 'Discrete Structures',
      units: 3,
      yearLevel: 1,
      semester: '1st Semester',
    },
  ];

  const sampleAreas: AccreditationArea[] = [
    {
      id: 'area-1',
      cycleId: 'cycle-2026',
      programId: 'prog-1',
      areaNumber: 1,
      title: 'Vision, Mission, Goals and Objectives',
      weight: 10,
      chairName: 'Dr. Santos',
      chairEmail: 'santos@oams.edu',
      status: 'Audited',
    },
    {
      id: 'area-2',
      cycleId: 'cycle-2026',
      programId: 'prog-1',
      areaNumber: 2,
      title: 'Faculty',
      weight: 15,
      chairName: 'Dr. Cruz',
      chairEmail: 'cruz@oams.edu',
      status: 'In Progress',
    },
    {
      id: 'area-3',
      cycleId: 'cycle-other',
      programId: 'prog-2',
      areaNumber: 1,
      title: 'Curriculum and Instruction',
      weight: 20,
      chairName: 'Dr. Reyes',
      chairEmail: 'reyes@oams.edu',
      status: 'Not Started',
    },
  ];

  const sampleParams: CriterionParameter[] = [
    {
      id: 'param-1',
      areaId: 'area-1',
      code: 'P.1.1',
      title: 'System of statement and review',
      description: 'Clear VMGO process',
      selfSurveyRating: 4.5,
      evaluatorRating: 4.5,
      status: 'Audited',
      facultyRemarks: '',
      evidenceIds: [],
    },
    {
      id: 'param-2',
      areaId: 'area-1',
      code: 'P.1.2',
      title: 'Dissemination to stakeholders',
      description: 'Distribution to all levels',
      selfSurveyRating: 4.0,
      evaluatorRating: 4.2,
      status: 'Audited',
      facultyRemarks: '',
      evidenceIds: [],
    },
    {
      id: 'param-3',
      areaId: 'area-2',
      code: 'P.2.1',
      title: 'Faculty profile and credentials',
      description: 'Masteral alignment',
      selfSurveyRating: null,
      evaluatorRating: null,
      status: 'Draft',
      facultyRemarks: '',
      evidenceIds: [],
    },
  ];

  describe('filterProgramsByDepartment', () => {
    it('returns all programs if no departmentId provided', () => {
      assert.deepEqual(filterProgramsByDepartment('', samplePrograms), samplePrograms);
    });

    it('filters programs strictly by departmentId', () => {
      const ccsProgs = filterProgramsByDepartment('dept-ccs', samplePrograms);
      assert.equal(ccsProgs.length, 2);
      assert.deepEqual(ccsProgs.map((p) => p.code), ['BSIT', 'BSCS']);
    });

    it('returns single program when department has one program', () => {
      const coeProgs = filterProgramsByDepartment('dept-coe', samplePrograms);
      assert.equal(coeProgs.length, 1);
      assert.equal(coeProgs[0].code, 'BSEE');
    });

    it('returns empty array when department has no programs', () => {
      const emptyProgs = filterProgramsByDepartment('dept-nonexistent', samplePrograms);
      assert.equal(emptyProgs.length, 0);
    });
  });

  describe('filterCoursesByProgram', () => {
    it('returns all courses if no programId provided', () => {
      assert.deepEqual(filterCoursesByProgram('', sampleCourses), sampleCourses);
    });

    it('filters courses strictly by programId', () => {
      const bsitCourses = filterCoursesByProgram('prog-1', sampleCourses);
      assert.equal(bsitCourses.length, 2);
      assert.deepEqual(bsitCourses.map((c) => c.code), ['IT101', 'IT201']);
    });

    it('returns empty array when program has no registered courses', () => {
      const bseeCourses = filterCoursesByProgram('prog-3', sampleCourses);
      assert.equal(bseeCourses.length, 0);
    });
  });

  describe('filterAreasByCycle', () => {
    it('returns all areas if no cycleId provided', () => {
      assert.deepEqual(filterAreasByCycle('', sampleAreas), sampleAreas);
    });

    it('filters areas by cycleId', () => {
      const cycleAreas = filterAreasByCycle('cycle-2026', sampleAreas);
      assert.equal(cycleAreas.length, 2);
      assert.deepEqual(cycleAreas.map((a) => a.areaNumber), [1, 2]);
    });
  });

  describe('filterParametersByArea', () => {
    it('returns all parameters if no areaId provided', () => {
      assert.deepEqual(filterParametersByArea('', sampleParams), sampleParams);
    });

    it('filters parameters by areaId', () => {
      const area1Params = filterParametersByArea('area-1', sampleParams);
      assert.equal(area1Params.length, 2);
      assert.deepEqual(area1Params.map((p) => p.code), ['P.1.1', 'P.1.2']);
    });

    it('returns empty array when area has no parameters', () => {
      const area3Params = filterParametersByArea('area-3', sampleParams);
      assert.equal(area3Params.length, 0);
    });
  });
});
