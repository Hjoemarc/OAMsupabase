/**
 * Domain Models for Institutional Accreditation Management System (OAMS)
 * Aligned with ZPPSU / AACCUP / CHED accreditation terminology and standards.
 */

export type AccreditationLevel =
  | 'Candidate Status'
  | 'Level I'
  | 'Level II Re-accredited'
  | 'Level III Phase 1'
  | 'Level III Phase 2'
  | 'Level IV';

export type AccreditationBody = 'AACCUP' | 'CHED' | 'ALCUCOA' | 'PAASCU';

export type CycleStatus =
  | 'Planning'
  | 'Self-Survey'
  | 'Ready for Audit'
  | 'Under Evaluation'
  | 'Completed';

export interface AccreditationCycle {
  id: string;
  name: string;
  body: AccreditationBody;
  academicYear: string;
  startDate: string;
  endDate: string;
  status: CycleStatus;
  programIds: string[];
  targetLevel: AccreditationLevel;
  description: string;
  createdAt: string;
}

export interface DegreeProgram {
  id: string;
  code: string;
  name: string;
  college: string;
  departmentId?: string;
  currentLevel: AccreditationLevel;
  targetLevel: AccreditationLevel;
  leadCoordinator: string;
}

export interface AcademicCourse {
  id: string;
  code: string; // e.g. "IT 101"
  title: string; // e.g. "Introduction to Computing"
  programId: string;
  departmentId: string;
  units: number;
  yearLevel: number;
  semester: '1st Semester' | '2nd Semester' | 'Summer';
  description?: string;
}

export type AreaNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface AccreditationArea {
  id: string;
  cycleId: string;
  programId: string;
  areaNumber: AreaNumber;
  title: string;
  chairName: string;
  chairEmail: string;
  weight: number; // Percentage, e.g. 10 = 10%
  status: 'Not Started' | 'In Progress' | 'Submitted' | 'Audited';
}

export interface CriterionParameter {
  id: string;
  areaId: string;
  code: string; // e.g. "Parameter A"
  title: string;
  description: string;
  selfSurveyRating: number | null; // 1.0 to 5.0 scale
  evaluatorRating: number | null; // 1.0 to 5.0 scale
  status: 'Draft' | 'Submitted' | 'Audited';
  facultyRemarks: string;
  evidenceIds: string[];
}

export interface EvidenceDocument {
  id: string;
  parameterId: string;
  programId?: string;
  courseId?: string;
  title: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  category: 'Policy & Minutes' | 'Curriculum & Syllabi' | 'Faculty Credentials' | 'Student Outputs' | 'Equipment & Facilities';
  uploadedBy: string;
  uploadedAt: string;
  verificationStatus: 'Pending Review' | 'Accepted' | 'Needs Revision';
}

export interface ParameterEvaluation {
  id: string;
  parameterId: string;
  evaluatorEmail: string;
  evaluatorName: string;
  score: number; // 1.0 to 5.0
  strengths: string;
  weaknesses: string;
  recommendations: string;
  evaluatedAt: string;
}

export interface AreaSummaryMetric {
  areaNumber: AreaNumber;
  title: string;
  parameterCount: number;
  submittedCount: number;
  auditedCount: number;
  selfMeanScore: number | null;
  evaluatorMeanScore: number | null;
  completionPercentage: number;
}

export interface AccreditationIndicator {
  id: string;
  parameterId: string;
  code: string; // e.g. "S.1", "I.1"
  description: string;
  level: string; // e.g. "Benchmark", "Core", "Advanced"
  sortOrder: number;
}

export interface CollegeDepartment {
  id: string;
  code: string; // e.g. "CICS", "CET"
  name: string; // e.g. "College of Information and Computing Sciences"
  deanName: string;
  programCount: number;
}

export type ComplianceStatus = 'Compliant' | 'Partial' | 'Non-Compliant' | 'Not Assessed';

export interface ComplianceRecord {
  id: string;
  programId: string;
  programCode: string;
  programName: string;
  cycleId: string;
  cycleName: string;
  areaNumber: AreaNumber;
  areaName: string;
  parameterCode: string;
  indicatorCode: string;
  indicatorDescription: string;
  status: ComplianceStatus;
  reviewerName: string;
  evidenceCount: number;
  lastUpdated: string;
  notes?: string;
}

export type DocumentReviewStatus = 'Submitted' | 'Under Review' | 'Needs Revision' | 'Approved';

export interface DocumentReviewItem {
  id: string;
  documentId: string;
  fileName: string;
  uploadedBy: string;
  programName: string;
  indicatorCode: string;
  cycleName: string;
  status: DocumentReviewStatus;
  uploadedAt: string;
  reviewerFeedback?: string;
}

export interface ReviewAssignmentItem {
  id: string;
  facultyName: string;
  facultyEmail: string;
  programCode: string;
  programName: string;
  areaTitle: string;
  indicatorCode: string;
  assignedReviewer: string;
  deadline: string;
  status: 'Pending' | 'Under Review' | 'Completed';
}

export interface ProgramTimelineRecord {
  id: string;
  programId: string;
  programCode: string;
  programName: string;
  departmentCode: string;
  currentLevel: AccreditationLevel;
  surveyValidUntil: string;
  lastSurveyDate: string;
  nextSurveyDate: string;
  accreditingBody: AccreditationBody;
  status: 'Accredited' | 'Candidate' | 'Under Re-accreditation' | 'Expired';
}

export type CQIActionPlanStatus =
  | 'Not Started'
  | 'In Progress'
  | 'Evidence Submitted'
  | 'Verified Compliant'
  | 'Overdue';

export interface CQIActionPlan {
  id: string;
  cycleId: string;
  programId: string;
  programCode: string;
  areaNumber: AreaNumber;
  parameterCode: string;
  deficiencyOrRecommendation: string;
  actionPlanTitle: string;
  plannedActions: string;
  responsiblePerson: string;
  targetCompletionDate: string;
  allocatedBudget: number;
  status: CQIActionPlanStatus;
  evidenceIds: string[];
  complianceRemarks?: string;
  verificationLead?: string;
  lastAuditedAt?: string;
}

export type SSRDossierStatus = 'Draft' | 'Compiled' | 'Locked' | 'Published';

export interface SSRExhibitItem {
  id: string;
  exhibitCode: string; // e.g. "EX-A3-01"
  title: string;
  category: string;
  areaNumber: AreaNumber;
  parameterCode: string;
  documentId: string;
  fileName: string;
  fileSize: string;
  sha256Checksum: string;
  verificationStatus: 'Pending Review' | 'Accepted' | 'Needs Revision';
}

export interface SSRDossierSection {
  areaNumber: AreaNumber;
  areaTitle: string;
  chairName: string;
  selfMeanScore: number | null;
  evaluatorMeanScore: number | null;
  parameterCount: number;
  narrativeSummary: string;
  exhibits: SSRExhibitItem[];
}

export interface SSRDossier {
  id: string;
  cycleId: string;
  cycleName: string;
  programId: string;
  programName: string;
  programCode: string;
  academicYear: string;
  title: string;
  targetLevel: AccreditationLevel;
  executiveSummary: string;
  status: SSRDossierStatus;
  compiledAt: string;
  watermark: string;
  sections: SSRDossierSection[];
  totalExhibits: number;
}

export type CrossWalkAgency = 'AACCUP' | 'CHED' | 'ISO 9001' | 'PTC' | 'ALCUCOA' | 'PAASCU';
export type EquivalenceConfidence = 'Direct Match' | 'Partial Overlap' | 'Supporting Context';

export interface CrossWalkMapping {
  id: string;
  documentId: string;
  documentTitle: string;
  fileName: string;
  category: string;
  primaryAgency: CrossWalkAgency;
  primaryCode: string; // e.g. "Area III - Curriculum"
  targetAgency: CrossWalkAgency;
  targetCode: string; // e.g. "CHED CMO 25 Sec 8"
  targetStandardTitle: string;
  equivalenceConfidence: EquivalenceConfidence;
  mappedBy: string;
  mappedAt: string;
  notes?: string;
}

export type MockSurveyStatus = 'Scheduled' | 'In Progress' | 'Concluded';
export type MockSurveyRiskLevel = 'Low Risk' | 'Moderate Risk' | 'Critical Risk';
export type MockFindingType = 'Critical Gap' | 'Minor Deficiency' | 'Commendable Strength';

export interface MockAuditFinding {
  id: string;
  sessionId: string;
  areaNumber: AreaNumber;
  parameterCode: string;
  mockScore: number; // 1.0 to 5.0
  findingType: MockFindingType;
  observation: string;
  urgentActionNeeded: string;
  auditorName: string;
  isResolved: boolean;
  promotedToCQIId?: string;
}

export interface MockSurveySession {
  id: string;
  cycleId: string;
  cycleName: string;
  programId: string;
  programCode: string;
  programName: string;
  title: string;
  auditTeamLead: string;
  scheduledDate: string;
  status: MockSurveyStatus;
  grandMeanScore: number | null;
  riskLevel: MockSurveyRiskLevel;
  findings: MockAuditFinding[];
}

