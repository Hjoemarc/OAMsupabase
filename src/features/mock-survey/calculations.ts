import type {
  MockAuditFinding,
  MockSurveySession,
  MockSurveyRiskLevel,
  CQIActionPlan,
} from '@/types/domain/accreditation';

export interface MockSessionMetrics {
  grandMeanScore: number | null;
  criticalGapCount: number;
  minorDeficiencyCount: number;
  strengthCount: number;
  totalFindings: number;
  riskLevel: MockSurveyRiskLevel;
}

export function calculateMockSessionMetrics(findings: MockAuditFinding[]): MockSessionMetrics {
  if (!findings || findings.length === 0) {
    return {
      grandMeanScore: null,
      criticalGapCount: 0,
      minorDeficiencyCount: 0,
      strengthCount: 0,
      totalFindings: 0,
      riskLevel: 'Low Risk',
    };
  }

  let totalScore = 0;
  let scoreCount = 0;
  let criticalGapCount = 0;
  let minorDeficiencyCount = 0;
  let strengthCount = 0;

  for (const f of findings) {
    if (typeof f.mockScore === 'number' && !isNaN(f.mockScore)) {
      totalScore += f.mockScore;
      scoreCount++;
    }

    if (f.findingType === 'Critical Gap') {
      criticalGapCount++;
    } else if (f.findingType === 'Minor Deficiency') {
      minorDeficiencyCount++;
    } else if (f.findingType === 'Commendable Strength') {
      strengthCount++;
    }
  }

  const grandMeanScore =
    scoreCount > 0 ? Math.round((totalScore / scoreCount) * 100) / 100 : null;

  let riskLevel: MockSurveyRiskLevel = 'Low Risk';

  if (criticalGapCount > 2 || (grandMeanScore !== null && grandMeanScore < 3.0)) {
    riskLevel = 'Critical Risk';
  } else if (criticalGapCount > 0 || (grandMeanScore !== null && grandMeanScore < 4.0)) {
    riskLevel = 'Moderate Risk';
  }

  return {
    grandMeanScore,
    criticalGapCount,
    minorDeficiencyCount,
    strengthCount,
    totalFindings: findings.length,
    riskLevel,
  };
}

export function convertFindingToCQIInput(
  finding: MockAuditFinding,
  session: MockSurveySession
): Omit<CQIActionPlan, 'id'> {
  return {
    cycleId: session.cycleId,
    programId: session.programId,
    programCode: session.programCode,
    areaNumber: finding.areaNumber,
    parameterCode: finding.parameterCode,
    deficiencyOrRecommendation: `[Mock Survey Finding] ${finding.observation}`,
    actionPlanTitle: `Remediation for ${finding.parameterCode} (Area ${finding.areaNumber})`,
    plannedActions: finding.urgentActionNeeded,
    responsiblePerson: 'Area Lead / Department Chair',
    targetCompletionDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0]!,
    allocatedBudget: 0,
    status: 'In Progress',
    evidenceIds: [],
    complianceRemarks: `Promoted from Internal Mock Survey conducted by ${finding.auditorName}`,
  };
}
