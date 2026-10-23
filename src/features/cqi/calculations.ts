import type { CQIActionPlan, CQIActionPlanStatus, AreaNumber } from '@/types/domain/accreditation';

export interface CQIStats {
  totalPlans: number;
  verifiedCompliantCount: number;
  inProgressCount: number;
  evidenceSubmittedCount: number;
  notStartedCount: number;
  overdueCount: number;
  resolutionPercentage: number;
  totalAllocatedBudget: number;
}

export function evaluatePlanOverdue(
  targetDate: string,
  status: CQIActionPlanStatus,
  referenceDate: string = new Date().toISOString().split('T')[0]!
): boolean {
  if (status === 'Verified Compliant') {
    return false;
  }
  return targetDate < referenceDate;
}

export function calculateCQIStats(
  plans: CQIActionPlan[],
  referenceDate: string = new Date().toISOString().split('T')[0]!
): CQIStats {
  if (!plans || plans.length === 0) {
    return {
      totalPlans: 0,
      verifiedCompliantCount: 0,
      inProgressCount: 0,
      evidenceSubmittedCount: 0,
      notStartedCount: 0,
      overdueCount: 0,
      resolutionPercentage: 0,
      totalAllocatedBudget: 0,
    };
  }

  let verifiedCompliantCount = 0;
  let inProgressCount = 0;
  let evidenceSubmittedCount = 0;
  let notStartedCount = 0;
  let overdueCount = 0;
  let totalAllocatedBudget = 0;

  for (const plan of plans) {
    totalAllocatedBudget += plan.allocatedBudget || 0;

    const isOverdue = evaluatePlanOverdue(plan.targetCompletionDate, plan.status, referenceDate);
    if (isOverdue) {
      overdueCount++;
    }

    switch (plan.status) {
      case 'Verified Compliant':
        verifiedCompliantCount++;
        break;
      case 'Evidence Submitted':
        evidenceSubmittedCount++;
        break;
      case 'In Progress':
        inProgressCount++;
        break;
      case 'Not Started':
        notStartedCount++;
        break;
      case 'Overdue':
        // Overdue status explicitly set or calculated
        break;
    }
  }

  const resolutionPercentage = Math.round((verifiedCompliantCount / plans.length) * 100);

  return {
    totalPlans: plans.length,
    verifiedCompliantCount,
    inProgressCount,
    evidenceSubmittedCount,
    notStartedCount,
    overdueCount,
    resolutionPercentage,
    totalAllocatedBudget,
  };
}

export function filterCQIPlans(
  plans: CQIActionPlan[],
  filters: {
    programId?: string;
    areaNumber?: AreaNumber;
    status?: string;
    searchQuery?: string;
  }
): CQIActionPlan[] {
  return plans.filter((plan) => {
    if (filters.programId && plan.programId !== filters.programId) {
      return false;
    }
    if (filters.areaNumber && plan.areaNumber !== filters.areaNumber) {
      return false;
    }
    if (filters.status && filters.status !== 'All' && plan.status !== filters.status) {
      return false;
    }
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      const matchTitle = plan.actionPlanTitle.toLowerCase().includes(q);
      const matchDef = plan.deficiencyOrRecommendation.toLowerCase().includes(q);
      const matchLead = plan.responsiblePerson.toLowerCase().includes(q);
      const matchCode = plan.parameterCode.toLowerCase().includes(q);
      if (!matchTitle && !matchDef && !matchLead && !matchCode) {
        return false;
      }
    }
    return true;
  });
}
