'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import type {
  AccreditationCycle,
  DegreeProgram,
  AcademicCourse,
  AccreditationArea,
  CriterionParameter,
  EvidenceDocument,
  ParameterEvaluation,
  AreaSummaryMetric,
  CollegeDepartment,
  AccreditationIndicator,
  ComplianceRecord,
  ComplianceStatus,
  ProgramTimelineRecord,
  ReviewAssignmentItem,
  DocumentReviewItem,
  DocumentReviewStatus,
  CQIActionPlan,
  CrossWalkMapping,
  MockSurveySession,
  MockAuditFinding,
  SSRDossier,
} from '@/types/domain/accreditation';
import {
  INITIAL_CYCLES,
  INITIAL_PROGRAMS,
  INITIAL_COURSES,
  INITIAL_AREAS,
  INITIAL_PARAMETERS,
  INITIAL_DOCUMENTS,
  INITIAL_EVALUATIONS,
  INITIAL_DEPARTMENTS,
  INITIAL_INDICATORS,
  INITIAL_COMPLIANCE,
  INITIAL_TIMELINE,
  INITIAL_REVIEW_ASSIGNMENTS,
  INITIAL_DOCUMENT_REVIEWS,
  INITIAL_CQI_PLANS,
  INITIAL_CROSSWALK_MAPPINGS,
  INITIAL_MOCK_SESSIONS,
} from '../mock-data';
import {
  summarizeArea,
  calculateMeanScore,
  calculateCompletionRate,
  canDeleteDepartment,
  canDeleteProgram,
} from '../calculations';
import { compileSSRDossier } from '@/features/reports/compiler';
import { calculateMockSessionMetrics, convertFindingToCQIInput } from '@/features/mock-survey/calculations';

const STORAGE_KEY = 'oams_state_v1';

interface CreateCycleInput {
  name: string;
  body: AccreditationCycle['body'];
  academicYear: string;
  startDate: string;
  endDate: string;
  targetLevel: AccreditationCycle['targetLevel'];
  description: string;
  programIds: string[];
}

interface UpdateSelfSurveyInput {
  parameterId: string;
  rating: number;
  remarks: string;
}

interface UploadDocumentInput {
  parameterId: string;
  title: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  category: EvidenceDocument['category'];
  uploadedBy: string;
}

interface SubmitEvaluationInput {
  parameterId: string;
  evaluatorEmail: string;
  evaluatorName: string;
  score: number;
  strengths: string;
  weaknesses: string;
  recommendations: string;
}

interface AccreditationStoreContextType {
  cycles: AccreditationCycle[];
  programs: DegreeProgram[];
  courses: AcademicCourse[];
  areas: AccreditationArea[];
  parameters: CriterionParameter[];
  documents: EvidenceDocument[];
  evaluations: ParameterEvaluation[];
  departments: CollegeDepartment[];
  indicators: AccreditationIndicator[];
  compliance: ComplianceRecord[];
  timeline: ProgramTimelineRecord[];
  reviewAssignments: ReviewAssignmentItem[];
  documentReviews: DocumentReviewItem[];
  cqiPlans: CQIActionPlan[];
  crosswalkMappings: CrossWalkMapping[];
  mockSessions: MockSurveySession[];
  dossiers: SSRDossier[];
  isHydrated: boolean;
  createCycle: (input: CreateCycleInput) => AccreditationCycle;
  updateCycle: (id: string, updates: Partial<AccreditationCycle>) => void;
  deleteCycle: (id: string) => { success: boolean; error?: string };
  updateAreaChair: (areaId: string, chairName: string, chairEmail: string) => void;
  addParameter: (param: Omit<CriterionParameter, 'id'>) => CriterionParameter;
  updateParameter: (id: string, updates: Partial<CriterionParameter>) => void;
  deleteParameter: (id: string) => { success: boolean; error?: string };
  updateParameterSelfSurvey: (input: UpdateSelfSurveyInput) => void;
  addEvidenceDocument: (input: UploadDocumentInput) => EvidenceDocument;
  updateEvidenceDocument: (id: string, updates: Partial<EvidenceDocument>) => void;
  deleteEvidenceDocument: (documentId: string) => void;
  submitEvaluation: (input: SubmitEvaluationInput) => ParameterEvaluation;
  addDepartment: (dept: Omit<CollegeDepartment, 'id'>) => CollegeDepartment;
  updateDepartment: (id: string, updates: Partial<CollegeDepartment>) => void;
  deleteDepartment: (id: string) => { success: boolean; error?: string };
  addProgram: (prog: Omit<DegreeProgram, 'id'>) => DegreeProgram;
  updateProgram: (id: string, updates: Partial<DegreeProgram>) => void;
  deleteProgram: (id: string) => { success: boolean; error?: string };
  addCourse: (course: Omit<AcademicCourse, 'id'>) => AcademicCourse;
  updateCourse: (id: string, updates: Partial<AcademicCourse>) => void;
  deleteCourse: (id: string) => { success: boolean; error?: string };
  addIndicator: (ind: Omit<AccreditationIndicator, 'id'>) => AccreditationIndicator;
  updateIndicator: (id: string, updates: Partial<AccreditationIndicator>) => void;
  deleteIndicator: (id: string) => { success: boolean; error?: string };
  updateComplianceStatus: (id: string, status: ComplianceStatus, notes?: string) => void;
  deleteComplianceRecord: (id: string) => void;
  addTimelineRecord: (rec: Omit<ProgramTimelineRecord, 'id'>) => ProgramTimelineRecord;
  assignReviewer: (assignmentId: string, reviewerName: string) => void;
  updateDocumentReviewStatus: (id: string, status: DocumentReviewStatus, feedback?: string) => void;
  // CQI Actions
  createCQIPlan: (plan: Omit<CQIActionPlan, 'id'>) => CQIActionPlan;
  updateCQIPlan: (id: string, updates: Partial<CQIActionPlan>) => void;
  deleteCQIPlan: (id: string) => void;
  // CrossWalk Actions
  createCrossWalkMapping: (mapping: Omit<CrossWalkMapping, 'id'>) => CrossWalkMapping;
  deleteCrossWalkMapping: (id: string) => void;
  // Mock Survey Actions
  createMockSession: (session: Omit<MockSurveySession, 'id' | 'findings' | 'grandMeanScore' | 'riskLevel'>) => MockSurveySession;
  addMockFinding: (sessionId: string, finding: Omit<MockAuditFinding, 'id' | 'isResolved'>) => void;
  promoteMockFindingToCQI: (findingId: string, sessionId: string) => CQIActionPlan | null;
  // Dossier Actions
  generateDossier: (cycleId: string, programId: string, executiveSummary?: string) => SSRDossier;
  resetToDefaults: () => void;
  getAreaParameters: (areaId: string) => CriterionParameter[];
  getParameterDocuments: (paramId: string) => EvidenceDocument[];
  getParameterEvaluation: (paramId: string) => ParameterEvaluation | undefined;
  getAreaSummaryMetric: (area: AccreditationArea) => AreaSummaryMetric;
}

const AccreditationStoreContext = createContext<AccreditationStoreContextType | null>(null);

export function AccreditationStoreProvider({ children }: { children: React.ReactNode }) {
  const [cycles, setCycles] = useState<AccreditationCycle[]>(INITIAL_CYCLES);
  const [programs, setPrograms] = useState<DegreeProgram[]>(INITIAL_PROGRAMS);
  const [courses, setCourses] = useState<AcademicCourse[]>(INITIAL_COURSES);
  const [areas, setAreas] = useState<AccreditationArea[]>(INITIAL_AREAS);
  const [parameters, setParameters] = useState<CriterionParameter[]>(INITIAL_PARAMETERS);
  const [documents, setDocuments] = useState<EvidenceDocument[]>(INITIAL_DOCUMENTS);
  const [evaluations, setEvaluations] = useState<ParameterEvaluation[]>(INITIAL_EVALUATIONS);
  const [departments, setDepartments] = useState<CollegeDepartment[]>(INITIAL_DEPARTMENTS);
  const [indicators, setIndicators] = useState<AccreditationIndicator[]>(INITIAL_INDICATORS);
  const [compliance, setCompliance] = useState<ComplianceRecord[]>(INITIAL_COMPLIANCE);
  const [timeline, setTimeline] = useState<ProgramTimelineRecord[]>(INITIAL_TIMELINE);
  const [reviewAssignments, setReviewAssignments] = useState<ReviewAssignmentItem[]>(INITIAL_REVIEW_ASSIGNMENTS);
  const [documentReviews, setDocumentReviews] = useState<DocumentReviewItem[]>(INITIAL_DOCUMENT_REVIEWS);
  const [cqiPlans, setCqiPlans] = useState<CQIActionPlan[]>(INITIAL_CQI_PLANS);
  const [crosswalkMappings, setCrosswalkMappings] = useState<CrossWalkMapping[]>(INITIAL_CROSSWALK_MAPPINGS);
  const [mockSessions, setMockSessions] = useState<MockSurveySession[]>(INITIAL_MOCK_SESSIONS);
  const [dossiers, setDossiers] = useState<SSRDossier[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.cycles) setCycles(parsed.cycles);
        if (parsed.programs) setPrograms(parsed.programs);
        if (parsed.courses) setCourses(parsed.courses);
        if (parsed.areas) setAreas(parsed.areas);
        if (parsed.parameters) setParameters(parsed.parameters);
        if (parsed.documents) setDocuments(parsed.documents);
        if (parsed.evaluations) setEvaluations(parsed.evaluations);
        if (parsed.departments) setDepartments(parsed.departments);
        if (parsed.indicators) setIndicators(parsed.indicators);
        if (parsed.compliance) setCompliance(parsed.compliance);
        if (parsed.timeline) setTimeline(parsed.timeline);
        if (parsed.reviewAssignments) setReviewAssignments(parsed.reviewAssignments);
        if (parsed.documentReviews) setDocumentReviews(parsed.documentReviews);
        if (parsed.cqiPlans) setCqiPlans(parsed.cqiPlans);
        if (parsed.crosswalkMappings) setCrosswalkMappings(parsed.crosswalkMappings);
        if (parsed.mockSessions) setMockSessions(parsed.mockSessions);
        if (parsed.dossiers) setDossiers(parsed.dossiers);
      }
    } catch {
      // Ignore parse errors, fallback to defaults
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (!isHydrated) return;
    try {
      const payload = {
        cycles,
        programs,
        courses,
        areas,
        parameters,
        documents,
        evaluations,
        departments,
        indicators,
        compliance,
        timeline,
        reviewAssignments,
        documentReviews,
        cqiPlans,
        crosswalkMappings,
        mockSessions,
        dossiers,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Quota exceeded or private browsing
    }
  }, [
    cycles,
    programs,
    courses,
    areas,
    parameters,
    documents,
    evaluations,
    departments,
    indicators,
    compliance,
    timeline,
    reviewAssignments,
    documentReviews,
    cqiPlans,
    crosswalkMappings,
    mockSessions,
    dossiers,
    isHydrated,
  ]);

  const createCycle = useCallback((input: CreateCycleInput) => {
    const newCycle: AccreditationCycle = {
      id: `cycle-${Date.now()}`,
      name: input.name,
      body: input.body,
      academicYear: input.academicYear,
      startDate: input.startDate,
      endDate: input.endDate,
      status: 'Self-Survey',
      programIds: input.programIds,
      targetLevel: input.targetLevel,
      description: input.description,
      createdAt: new Date().toISOString(),
    };

    setCycles((prev) => [newCycle, ...prev]);

    // Generate standard 10 areas for each program linked to this cycle
    const generatedAreas: AccreditationArea[] = [];
    const areaTitles = [
      'Vision, Mission, Goals & Objectives',
      'Faculty Credentials & Development',
      'Curriculum & Instruction',
      'Support to Students',
      'Research & Development',
      'Extension & Community Involvement',
      'Library Resources',
      'Physical Plant & Facilities',
      'Specialized Laboratories',
      'Administration & Financial Management',
    ];

    input.programIds.forEach((progId) => {
      areaTitles.forEach((title, idx) => {
        generatedAreas.push({
          id: `area-${Date.now()}-${progId}-${idx + 1}`,
          cycleId: newCycle.id,
          programId: progId,
          areaNumber: (idx + 1) as AccreditationArea['areaNumber'],
          title: `Area ${idx + 1}: ${title}`,
          chairName: 'Unassigned Faculty',
          chairEmail: 'faculty@oams.edu',
          weight: 10,
          status: 'Not Started',
        });
      });
    });

    setAreas((prev) => [...generatedAreas, ...prev]);
    return newCycle;
  }, []);

  const updateCycle = useCallback((id: string, updates: Partial<AccreditationCycle>) => {
    setCycles((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  }, []);

  const deleteCycle = useCallback((id: string): { success: boolean; error?: string } => {
    setCycles((prev) => prev.filter((c) => c.id !== id));
    setAreas((prev) => prev.filter((a) => a.cycleId !== id));
    return { success: true };
  }, []);

  const updateAreaChair = useCallback((areaId: string, chairName: string, chairEmail: string) => {
    setAreas((prev) =>
      prev.map((a) => (a.id === areaId ? { ...a, chairName, chairEmail } : a))
    );
  }, []);

  const updateParameterSelfSurvey = useCallback((input: UpdateSelfSurveyInput) => {
    setParameters((prev) =>
      prev.map((p) =>
        p.id === input.parameterId
          ? {
              ...p,
              selfSurveyRating: input.rating,
              facultyRemarks: input.remarks,
              status: p.status === 'Draft' ? 'Submitted' : p.status,
            }
          : p
      )
    );
  }, []);

  const addEvidenceDocument = useCallback((input: UploadDocumentInput) => {
    const newDoc: EvidenceDocument = {
      id: `doc-${Date.now()}`,
      parameterId: input.parameterId,
      title: input.title,
      fileName: input.fileName,
      fileSize: input.fileSize,
      fileType: input.fileType,
      category: input.category,
      uploadedBy: input.uploadedBy,
      uploadedAt: new Date().toLocaleString('en-US', {
        dateStyle: 'short',
        timeStyle: 'short',
      }),
      verificationStatus: 'Pending Review',
    };

    setDocuments((prev) => [newDoc, ...prev]);

    // Attach document id to parameter
    setParameters((prev) =>
      prev.map((p) =>
        p.id === input.parameterId
          ? {
              ...p,
              evidenceIds: [...p.evidenceIds, newDoc.id],
              status: p.status === 'Draft' ? 'Submitted' : p.status,
            }
          : p
      )
    );

    return newDoc;
  }, []);

  const deleteEvidenceDocument = useCallback((documentId: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== documentId));
    setParameters((prev) =>
      prev.map((p) => ({
        ...p,
        evidenceIds: p.evidenceIds.filter((id) => id !== documentId),
      }))
    );
  }, []);

  const updateEvidenceDocument = useCallback((id: string, updates: Partial<EvidenceDocument>) => {
    setDocuments((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)));
  }, []);

  const addParameter = useCallback((param: Omit<CriterionParameter, 'id'>) => {
    const newParam: CriterionParameter = {
      ...param,
      id: `param-${Date.now()}`,
    };
    setParameters((prev) => [...prev, newParam]);
    return newParam;
  }, []);

  const updateParameter = useCallback((id: string, updates: Partial<CriterionParameter>) => {
    setParameters((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  }, []);

  const deleteParameter = useCallback((id: string): { success: boolean; error?: string } => {
    setParameters((prev) => prev.filter((p) => p.id !== id));
    setIndicators((prev) => prev.filter((i) => i.parameterId !== id));
    setDocuments((prev) => prev.filter((d) => d.parameterId !== id));
    return { success: true };
  }, []);

  const submitEvaluation = useCallback((input: SubmitEvaluationInput) => {
    const newEval: ParameterEvaluation = {
      id: `eval-${Date.now()}`,
      parameterId: input.parameterId,
      evaluatorEmail: input.evaluatorEmail,
      evaluatorName: input.evaluatorName,
      score: input.score,
      strengths: input.strengths,
      weaknesses: input.weaknesses,
      recommendations: input.recommendations,
      evaluatedAt: new Date().toLocaleString('en-US', {
        dateStyle: 'short',
        timeStyle: 'short',
      }),
    };

    setEvaluations((prev) => {
      const filtered = prev.filter((e) => e.parameterId !== input.parameterId);
      return [newEval, ...filtered];
    });

    // Mark parameter as audited and set evaluator rating
    setParameters((prev) =>
      prev.map((p) =>
        p.id === input.parameterId
          ? {
              ...p,
              evaluatorRating: input.score,
              status: 'Audited',
            }
          : p
      )
    );

    return newEval;
  }, []);

  const addDepartment = useCallback((dept: Omit<CollegeDepartment, 'id'>) => {
    const newDept: CollegeDepartment = {
      ...dept,
      id: `dept-${Date.now()}`,
    };
    setDepartments((prev) => [newDept, ...prev]);
    return newDept;
  }, []);

  const updateDepartment = useCallback((id: string, updates: Partial<CollegeDepartment>) => {
    setDepartments((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)));
  }, []);

  const deleteDepartment = useCallback((id: string): { success: boolean; error?: string } => {
    const check = canDeleteDepartment(id, programs);
    if (!check.canDelete) {
      return { success: false, error: check.reason };
    }
    setDepartments((prev) => prev.filter((d) => d.id !== id));
    return { success: true };
  }, [programs]);

  const addProgram = useCallback((prog: Omit<DegreeProgram, 'id'>) => {
    const newProg: DegreeProgram = {
      ...prog,
      id: `prog-${Date.now()}`,
    };
    setPrograms((prev) => [newProg, ...prev]);
    return newProg;
  }, []);

  const updateProgram = useCallback((id: string, updates: Partial<DegreeProgram>) => {
    setPrograms((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  }, []);

  const deleteProgram = useCallback((id: string): { success: boolean; error?: string } => {
    const check = canDeleteProgram(id, cycles, courses);
    if (!check.canDelete) {
      return { success: false, error: check.reason };
    }
    setPrograms((prev) => prev.filter((p) => p.id !== id));
    return { success: true };
  }, [cycles, courses]);

  const addCourse = useCallback((course: Omit<AcademicCourse, 'id'>) => {
    const newCourse: AcademicCourse = {
      ...course,
      id: `course-${Date.now()}`,
    };
    setCourses((prev) => [newCourse, ...prev]);
    return newCourse;
  }, []);

  const updateCourse = useCallback((id: string, updates: Partial<AcademicCourse>) => {
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  }, []);

  const deleteCourse = useCallback((id: string): { success: boolean; error?: string } => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
    return { success: true };
  }, []);

  const addIndicator = useCallback((ind: Omit<AccreditationIndicator, 'id'>) => {
    const newInd: AccreditationIndicator = {
      ...ind,
      id: `ind-${Date.now()}`,
    };
    setIndicators((prev) => [...prev, newInd]);
    return newInd;
  }, []);

  const updateIndicator = useCallback((id: string, updates: Partial<AccreditationIndicator>) => {
    setIndicators((prev) => prev.map((i) => (i.id === id ? { ...i, ...updates } : i)));
  }, []);

  const deleteIndicator = useCallback((id: string): { success: boolean; error?: string } => {
    setIndicators((prev) => prev.filter((i) => i.id !== id));
    return { success: true };
  }, []);

  const deleteComplianceRecord = useCallback((id: string) => {
    setCompliance((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const updateComplianceStatus = useCallback((id: string, status: ComplianceStatus, notes?: string) => {
    setCompliance((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status,
              notes: notes ?? c.notes,
              lastUpdated: new Date().toISOString().split('T')[0],
            }
          : c
      )
    );
  }, []);

  const addTimelineRecord = useCallback((rec: Omit<ProgramTimelineRecord, 'id'>) => {
    const newRec: ProgramTimelineRecord = {
      ...rec,
      id: `time-${Date.now()}`,
    };
    setTimeline((prev) => [newRec, ...prev]);
    return newRec;
  }, []);

  const assignReviewer = useCallback((assignmentId: string, reviewerName: string) => {
    setReviewAssignments((prev) =>
      prev.map((a) => (a.id === assignmentId ? { ...a, assignedReviewer: reviewerName } : a))
    );
  }, []);

  const updateDocumentReviewStatus = useCallback(
    (id: string, status: DocumentReviewStatus, feedback?: string) => {
      setDocumentReviews((prev) =>
        prev.map((d) =>
          d.id === id
            ? {
                ...d,
                status,
                reviewerFeedback: feedback ?? d.reviewerFeedback,
              }
            : d
        )
      );
    },
    []
  );

  // CQI Actions
  const createCQIPlan = useCallback(
    (input: Omit<CQIActionPlan, 'id'>): CQIActionPlan => {
      const newPlan: CQIActionPlan = {
        ...input,
        id: `cqi-${Date.now()}`,
      };
      setCqiPlans((prev) => [newPlan, ...prev]);
      return newPlan;
    },
    []
  );

  const updateCQIPlan = useCallback((id: string, updates: Partial<CQIActionPlan>) => {
    setCqiPlans((prev) =>
      prev.map((plan) => (plan.id === id ? { ...plan, ...updates } : plan))
    );
  }, []);

  const deleteCQIPlan = useCallback((id: string) => {
    setCqiPlans((prev) => prev.filter((p) => p.id !== id));
  }, []);

  // CrossWalk Actions
  const createCrossWalkMapping = useCallback(
    (input: Omit<CrossWalkMapping, 'id'>): CrossWalkMapping => {
      const newMapping: CrossWalkMapping = {
        ...input,
        id: `cw-${Date.now()}`,
      };
      setCrosswalkMappings((prev) => [newMapping, ...prev]);
      return newMapping;
    },
    []
  );

  const deleteCrossWalkMapping = useCallback((id: string) => {
    setCrosswalkMappings((prev) => prev.filter((m) => m.id !== id));
  }, []);

  // Mock Survey Actions
  const createMockSession = useCallback(
    (
      input: Omit<
        MockSurveySession,
        'id' | 'findings' | 'grandMeanScore' | 'riskLevel'
      >
    ): MockSurveySession => {
      const newSession: MockSurveySession = {
        ...input,
        id: `mock-${Date.now()}`,
        grandMeanScore: null,
        riskLevel: 'Low Risk',
        findings: [],
      };
      setMockSessions((prev) => [newSession, ...prev]);
      return newSession;
    },
    []
  );

  const addMockFinding = useCallback(
    (
      sessionId: string,
      findingInput: Omit<MockAuditFinding, 'id' | 'isResolved'>
    ) => {
      setMockSessions((prev) =>
        prev.map((session) => {
          if (session.id !== sessionId) return session;
          const newFinding: MockAuditFinding = {
            ...findingInput,
            id: `mock-f-${Date.now()}`,
            isResolved: false,
          };
          const updatedFindings = [...session.findings, newFinding];
          const metrics = calculateMockSessionMetrics(updatedFindings);
          return {
            ...session,
            findings: updatedFindings,
            grandMeanScore: metrics.grandMeanScore,
            riskLevel: metrics.riskLevel,
          };
        })
      );
    },
    []
  );

  const promoteMockFindingToCQI = useCallback(
    (findingId: string, sessionId: string): CQIActionPlan | null => {
      const session = mockSessions.find((s) => s.id === sessionId);
      if (!session) return null;
      const finding = session.findings.find((f) => f.id === findingId);
      if (!finding) return null;

      const cqiInput = convertFindingToCQIInput(finding, session);
      const newPlan = createCQIPlan(cqiInput);

      // Mark finding as promoted and resolved
      setMockSessions((prev) =>
        prev.map((s) => {
          if (s.id !== sessionId) return s;
          return {
            ...s,
            findings: s.findings.map((f) =>
              f.id === findingId
                ? { ...f, isResolved: true, promotedToCQIId: newPlan.id }
                : f
            ),
          };
        })
      );

      return newPlan;
    },
    [mockSessions, createCQIPlan]
  );

  // Dossier Actions
  const generateDossier = useCallback(
    (cycleId: string, programId: string, executiveSummary?: string): SSRDossier => {
      const cycle = cycles.find((c) => c.id === cycleId);
      const program = programs.find((p) => p.id === programId);
      if (!cycle || !program) {
        throw new Error('Cycle or program not found for dossier compilation');
      }

      const newDossier = compileSSRDossier({
        cycle,
        program,
        areas,
        parameters,
        documents,
        executiveSummary,
      });

      setDossiers((prev) => [newDossier, ...prev.filter((d) => d.id !== newDossier.id)]);
      return newDossier;
    },
    [cycles, programs, areas, parameters, documents]
  );

  const resetToDefaults = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setCycles(INITIAL_CYCLES);
    setPrograms(INITIAL_PROGRAMS);
    setCourses(INITIAL_COURSES);
    setAreas(INITIAL_AREAS);
    setParameters(INITIAL_PARAMETERS);
    setDocuments(INITIAL_DOCUMENTS);
    setEvaluations(INITIAL_EVALUATIONS);
    setDepartments(INITIAL_DEPARTMENTS);
    setIndicators(INITIAL_INDICATORS);
    setCompliance(INITIAL_COMPLIANCE);
    setTimeline(INITIAL_TIMELINE);
    setReviewAssignments(INITIAL_REVIEW_ASSIGNMENTS);
    setDocumentReviews(INITIAL_DOCUMENT_REVIEWS);
    setCqiPlans(INITIAL_CQI_PLANS);
    setCrosswalkMappings(INITIAL_CROSSWALK_MAPPINGS);
    setMockSessions(INITIAL_MOCK_SESSIONS);
    setDossiers([]);
  }, []);

  const getAreaParameters = useCallback(
    (areaId: string) => parameters.filter((p) => p.areaId === areaId),
    [parameters]
  );

  const getParameterDocuments = useCallback(
    (paramId: string) => documents.filter((d) => d.parameterId === paramId),
    [documents]
  );

  const getParameterEvaluation = useCallback(
    (paramId: string) => evaluations.find((e) => e.parameterId === paramId),
    [evaluations]
  );

  const getAreaSummaryMetric = useCallback(
    (area: AccreditationArea): AreaSummaryMetric => {
      const areaParams = parameters.filter((p) => p.areaId === area.id);
      return summarizeArea(area.areaNumber, area.title, areaParams);
    },
    [parameters]
  );

  const value = useMemo(
    () => ({
      cycles,
      programs,
      courses,
      areas,
      parameters,
      documents,
      evaluations,
      departments,
      indicators,
      compliance,
      timeline,
      reviewAssignments,
      documentReviews,
      cqiPlans,
      crosswalkMappings,
      mockSessions,
      dossiers,
      isHydrated,
      createCycle,
      updateCycle,
      deleteCycle,
      updateAreaChair,
      addParameter,
      updateParameter,
      deleteParameter,
      updateParameterSelfSurvey,
      addEvidenceDocument,
      updateEvidenceDocument,
      deleteEvidenceDocument,
      submitEvaluation,
      addDepartment,
      updateDepartment,
      deleteDepartment,
      addProgram,
      updateProgram,
      deleteProgram,
      addCourse,
      updateCourse,
      deleteCourse,
      addIndicator,
      updateIndicator,
      deleteIndicator,
      updateComplianceStatus,
      deleteComplianceRecord,
      addTimelineRecord,
      assignReviewer,
      updateDocumentReviewStatus,
      createCQIPlan,
      updateCQIPlan,
      deleteCQIPlan,
      createCrossWalkMapping,
      deleteCrossWalkMapping,
      createMockSession,
      addMockFinding,
      promoteMockFindingToCQI,
      generateDossier,
      resetToDefaults,
      getAreaParameters,
      getParameterDocuments,
      getParameterEvaluation,
      getAreaSummaryMetric,
    }),
    [
      cycles,
      programs,
      courses,
      areas,
      parameters,
      documents,
      evaluations,
      departments,
      indicators,
      compliance,
      timeline,
      reviewAssignments,
      documentReviews,
      cqiPlans,
      crosswalkMappings,
      mockSessions,
      dossiers,
      isHydrated,
      createCycle,
      updateCycle,
      deleteCycle,
      updateAreaChair,
      addParameter,
      updateParameter,
      deleteParameter,
      updateParameterSelfSurvey,
      addEvidenceDocument,
      updateEvidenceDocument,
      deleteEvidenceDocument,
      submitEvaluation,
      addDepartment,
      updateDepartment,
      deleteDepartment,
      addProgram,
      updateProgram,
      deleteProgram,
      addCourse,
      updateCourse,
      deleteCourse,
      addIndicator,
      updateIndicator,
      deleteIndicator,
      updateComplianceStatus,
      deleteComplianceRecord,
      addTimelineRecord,
      assignReviewer,
      updateDocumentReviewStatus,
      createCQIPlan,
      updateCQIPlan,
      deleteCQIPlan,
      createCrossWalkMapping,
      deleteCrossWalkMapping,
      createMockSession,
      addMockFinding,
      promoteMockFindingToCQI,
      generateDossier,
      resetToDefaults,
      getAreaParameters,
      getParameterDocuments,
      getParameterEvaluation,
      getAreaSummaryMetric,
    ]
  );

  return (
    <AccreditationStoreContext.Provider value={value}>
      {children}
    </AccreditationStoreContext.Provider>
  );
}

export function useAccreditationStore(): AccreditationStoreContextType {
  const context = useContext(AccreditationStoreContext);
  if (!context) {
    throw new Error('useAccreditationStore must be used within an AccreditationStoreProvider');
  }
  return context;
}
