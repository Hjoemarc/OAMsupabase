import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { calculateCQIStats, evaluatePlanOverdue, filterCQIPlans } from '../calculations.ts';
import type { CQIActionPlan } from '@/types/domain/accreditation';

describe('CQI Action Plan Logic & Relational Filtering', () => {
  const samplePlans: CQIActionPlan[] = [
    {
      id: 'cqi-1',
      cycleId: 'cycle-1',
      programId: 'prog-1',
      programCode: 'BSIT',
      areaNumber: 3,
      parameterCode: 'Parameter A',
      deficiencyOrRecommendation: 'Lack of industry immersion hours in curriculum syllabi.',
      actionPlanTitle: 'Syllabus Enhancement & Industry Review',
      plannedActions: 'Convene curriculum advisory committee with DICT partners.',
      responsiblePerson: 'Prof. Juan Santos',
      targetCompletionDate: '2026-05-01',
      allocatedBudget: 50000,
      status: 'Verified Compliant',
      evidenceIds: ['doc-1'],
    },
    {
      id: 'cqi-2',
      cycleId: 'cycle-1',
      programId: 'prog-1',
      programCode: 'BSIT',
      areaNumber: 5,
      parameterCode: 'Parameter B',
      deficiencyOrRecommendation: 'Inadequate laboratory workstations for AI/ML subjects.',
      actionPlanTitle: 'Procurement of GPU-enabled High-End PCs',
      plannedActions: 'Submit PPMP for 40 units RTX workstation computers.',
      responsiblePerson: 'Engr. Maria Clara',
      targetCompletionDate: '2026-11-01',
      allocatedBudget: 1200000,
      status: 'In Progress',
      evidenceIds: [],
    },
    {
      id: 'cqi-3',
      cycleId: 'cycle-1',
      programId: 'prog-2',
      programCode: 'BSCS',
      areaNumber: 6,
      parameterCode: 'Parameter A',
      deficiencyOrRecommendation: 'Low SCOPUS publication rate among core faculty.',
      actionPlanTitle: 'Faculty Research Incentive Scheme',
      plannedActions: 'Provide PHP 30,000 research grant per indexed publication.',
      responsiblePerson: 'Dr. Rizal Mercado',
      targetCompletionDate: '2026-01-15',
      allocatedBudget: 300000,
      status: 'Overdue',
      evidenceIds: [],
    },
  ];

  describe('evaluatePlanOverdue', () => {
    it('identifies an overdue plan if target date is in the past and not compliant', () => {
      const isOverdue = evaluatePlanOverdue('2026-01-15', 'In Progress', '2026-10-23');
      assert.strictEqual(isOverdue, true);
    });

    it('does not mark a plan as overdue if it is verified compliant', () => {
      const isOverdue = evaluatePlanOverdue('2026-01-15', 'Verified Compliant', '2026-10-23');
      assert.strictEqual(isOverdue, false);
    });

    it('does not mark a plan as overdue if target date is in the future', () => {
      const isOverdue = evaluatePlanOverdue('2026-12-31', 'In Progress', '2026-10-23');
      assert.strictEqual(isOverdue, false);
    });
  });

  describe('calculateCQIStats', () => {
    it('computes compliance rate, overdue count, and total budget correctly', () => {
      const stats = calculateCQIStats(samplePlans, '2026-10-23');
      assert.strictEqual(stats.totalPlans, 3);
      assert.strictEqual(stats.verifiedCompliantCount, 1);
      assert.strictEqual(stats.overdueCount, 1);
      assert.strictEqual(stats.inProgressCount, 1);
      assert.strictEqual(stats.resolutionPercentage, 33);
      assert.strictEqual(stats.totalAllocatedBudget, 1550000);
    });

    it('handles empty plans gracefully', () => {
      const stats = calculateCQIStats([], '2026-10-23');
      assert.strictEqual(stats.totalPlans, 0);
      assert.strictEqual(stats.resolutionPercentage, 0);
      assert.strictEqual(stats.totalAllocatedBudget, 0);
    });
  });

  describe('filterCQIPlans', () => {
    it('filters by program accurately', () => {
      const filtered = filterCQIPlans(samplePlans, { programId: 'prog-2' });
      assert.strictEqual(filtered.length, 1);
      assert.strictEqual(filtered[0]?.programCode, 'BSCS');
    });

    it('filters by area number accurately', () => {
      const filtered = filterCQIPlans(samplePlans, { areaNumber: 3 });
      assert.strictEqual(filtered.length, 1);
      assert.strictEqual(filtered[0]?.id, 'cqi-1');
    });

    it('filters by status accurately', () => {
      const filtered = filterCQIPlans(samplePlans, { status: 'In Progress' });
      assert.strictEqual(filtered.length, 1);
      assert.strictEqual(filtered[0]?.id, 'cqi-2');
    });
  });
});
