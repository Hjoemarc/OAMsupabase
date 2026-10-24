import type {
  CriterionParameter,
  AreaSummaryMetric,
  AreaNumber,
  DegreeProgram,
  AcademicCourse,
  AccreditationCycle,
  AccreditationArea,
} from '@/types/domain/accreditation';

/**
 * Calculates the arithmetic mean of an array of numeric scores, ignoring null or invalid values.
 * Returns null if no valid numeric scores exist.
 */
export function calculateMeanScore(scores: (number | null | undefined)[]): number | null {
  const validScores = scores.filter(
    (score): score is number => typeof score === 'number' && !isNaN(score) && score >= 1.0 && score <= 5.0
  );

  if (validScores.length === 0) {
    return null;
  }

  const sum = validScores.reduce((acc, curr) => acc + curr, 0);
  return Number((sum / validScores.length).toFixed(2));
}

/**
 * Calculates completion percentage between 0 and 100.
 */
export function calculateCompletionRate(completed: number, total: number): number {
  if (total <= 0 || completed <= 0) return 0;
  if (completed >= total) return 100;
  return Math.round((completed / total) * 100);
}

/**
 * Interprets AACCUP / CHED Grand Mean score into formal accreditation decision.
 */
export function interpretAccreditationRating(grandMean: number | null): {
  verdict: string;
  eligibleLevel: string;
  passed: boolean;
  colorClass: string;
} {
  if (grandMean === null) {
    return {
      verdict: 'Pending Evaluation',
      eligibleLevel: 'Incomplete Audit',
      passed: false,
      colorClass: 'text-slate-500 bg-slate-100 border-slate-200',
    };
  }

  if (grandMean >= 4.5) {
    return {
      verdict: 'Excellent',
      eligibleLevel: 'Candidate for Level IV',
      passed: true,
      colorClass: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    };
  }

  if (grandMean >= 4.0) {
    return {
      verdict: 'Very Satisfactory',
      eligibleLevel: 'Meets Level III Standards',
      passed: true,
      colorClass: 'text-[#800000] bg-[#800000]/10 border-[#800000]/30',
    };
  }

  if (grandMean >= 3.5) {
    return {
      verdict: 'Satisfactory',
      eligibleLevel: 'Meets Level II Standards',
      passed: true,
      colorClass: 'text-amber-700 bg-amber-50 border-amber-200',
    };
  }

  if (grandMean >= 3.0) {
    return {
      verdict: 'Fair (Conditional)',
      eligibleLevel: 'Meets Level I Standards',
      passed: true,
      colorClass: 'text-orange-700 bg-orange-50 border-orange-200',
    };
  }

  return {
    verdict: 'Deficient',
    eligibleLevel: 'Below Accreditation Benchmark',
    passed: false,
    colorClass: 'text-rose-700 bg-rose-50 border-rose-200',
  };
}

/**
 * Aggregates a list of parameters into an Area Summary Metric.
 */
export function summarizeArea(
  areaNumber: AreaNumber,
  title: string,
  parameters: CriterionParameter[]
): AreaSummaryMetric {
  const parameterCount = parameters.length;
  const submittedCount = parameters.filter((p) => p.status === 'Submitted' || p.status === 'Audited').length;
  const auditedCount = parameters.filter((p) => p.status === 'Audited').length;

  const selfScores = parameters.map((p) => p.selfSurveyRating);
  const evaluatorScores = parameters.map((p) => p.evaluatorRating);

  return {
    areaNumber,
    title,
    parameterCount,
    submittedCount,
    auditedCount,
    selfMeanScore: calculateMeanScore(selfScores),
    evaluatorMeanScore: calculateMeanScore(evaluatorScores),
    completionPercentage: calculateCompletionRate(auditedCount, parameterCount),
  };
}

/**
 * Checks whether a Department can be safely deleted without orphaning active Degree Programs.
 */
export function canDeleteDepartment(
  departmentId: string,
  programs: DegreeProgram[]
): { canDelete: boolean; reason?: string } {
  const matchingPrograms = programs.filter(
    (p) => p.departmentId === departmentId || p.college.toLowerCase().includes(departmentId.toLowerCase())
  );

  if (matchingPrograms.length > 0) {
    return {
      canDelete: false,
      reason: `Cannot delete department with ${matchingPrograms.length} active program(s) attached (${matchingPrograms.map((p) => p.code).join(', ')}). Reassign or remove programs first.`,
    };
  }

  return { canDelete: true };
}

/**
 * Checks whether a Degree Program can be safely deleted without orphaning active survey visits or academic courses.
 */
export function canDeleteProgram(
  programId: string,
  cycles: AccreditationCycle[],
  courses: AcademicCourse[]
): { canDelete: boolean; reason?: string } {
  const linkedCycles = cycles.filter((c) => c.programIds.includes(programId));
  if (linkedCycles.length > 0) {
    return {
      canDelete: false,
      reason: `Program is slated in ${linkedCycles.length} active accreditation cycle(s) (${linkedCycles.map((c) => c.name).join(', ')}). Remove program from cycles first.`,
    };
  }

  const linkedCourses = courses.filter((c) => c.programId === programId);
  if (linkedCourses.length > 0) {
    return {
      canDelete: false,
      reason: `Program has ${linkedCourses.length} active curriculum course(s) cataloged. Remove or migrate courses first.`,
    };
  }

  return { canDelete: true };
}

/**
 * Filters programs belonging to a selected department.
 */
export function filterProgramsByDepartment(
  departmentId: string,
  programs: DegreeProgram[]
): DegreeProgram[] {
  if (!departmentId || departmentId === 'all') return programs;
  return programs.filter(
    (p) => p.departmentId === departmentId || p.college.toLowerCase().includes(departmentId.toLowerCase())
  );
}

/**
 * Filters courses belonging to a selected program.
 */
export function filterCoursesByProgram(
  programId: string,
  courses: AcademicCourse[]
): AcademicCourse[] {
  if (!programId || programId === 'all') return courses;
  return courses.filter((c) => c.programId === programId);
}

/**
 * Filters standard areas belonging to a specific cycle.
 */
export function filterAreasByCycle(
  cycleId: string,
  areas: AccreditationArea[]
): AccreditationArea[] {
  if (!cycleId || cycleId === 'all') return areas;
  return areas.filter((a) => a.cycleId === cycleId);
}

/**
 * Filters parameters belonging to a specific standard area.
 */
export function filterParametersByArea(
  areaId: string,
  parameters: CriterionParameter[]
): CriterionParameter[] {
  if (!areaId || areaId === 'all') return parameters;
  return parameters.filter((p) => p.areaId === areaId);
}

