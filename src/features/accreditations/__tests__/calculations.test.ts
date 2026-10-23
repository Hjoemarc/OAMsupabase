import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateMeanScore,
  calculateCompletionRate,
  interpretAccreditationRating,
  summarizeArea,
} from '../calculations.ts';
import type { CriterionParameter } from '../../../types/domain/accreditation.ts';

describe('Accreditation Calculations', () => {
  describe('calculateMeanScore', () => {
    it('returns null for an empty array or all nulls', () => {
      assert.equal(calculateMeanScore([]), null);
      assert.equal(calculateMeanScore([null, null, undefined]), null);
    });

    it('calculates the exact arithmetic mean rounded to two decimal places', () => {
      assert.equal(calculateMeanScore([4.0, 4.5, 3.5]), 4.0);
      assert.equal(calculateMeanScore([4.1, 4.2, 4.3]), 4.2);
    });

    it('ignores null and out of range values', () => {
      assert.equal(calculateMeanScore([4.0, null, 5.0, 0.5, 6.0]), 4.5);
    });
  });

  describe('calculateCompletionRate', () => {
    it('returns 0 when total is zero or negative', () => {
      assert.equal(calculateCompletionRate(0, 0), 0);
      assert.equal(calculateCompletionRate(5, 0), 0);
    });

    it('returns percentage rounded to nearest integer', () => {
      assert.equal(calculateCompletionRate(3, 10), 30);
      assert.equal(calculateCompletionRate(7, 9), 78);
    });

    it('caps at 100%', () => {
      assert.equal(calculateCompletionRate(15, 10), 100);
    });
  });

  describe('interpretAccreditationRating', () => {
    it('returns pending evaluation if grand mean is null', () => {
      const res = interpretAccreditationRating(null);
      assert.equal(res.passed, false);
      assert.equal(res.verdict, 'Pending Evaluation');
    });

    it('identifies Level IV candidates for >= 4.5', () => {
      const res = interpretAccreditationRating(4.65);
      assert.equal(res.passed, true);
      assert.equal(res.eligibleLevel, 'Candidate for Level IV');
    });

    it('identifies Level III benchmark for 4.0 - 4.49', () => {
      const res = interpretAccreditationRating(4.25);
      assert.equal(res.passed, true);
      assert.equal(res.eligibleLevel, 'Meets Level III Standards');
    });

    it('identifies Deficient for < 3.0', () => {
      const res = interpretAccreditationRating(2.8);
      assert.equal(res.passed, false);
      assert.equal(res.verdict, 'Deficient');
    });
  });

  describe('summarizeArea', () => {
    it('aggregates parameters accurately', () => {
      const sampleParams: CriterionParameter[] = [
        {
          id: 'p1',
          areaId: 'a1',
          code: 'Param A',
          title: 'Curriculum',
          description: 'Desc A',
          selfSurveyRating: 4.0,
          evaluatorRating: 4.5,
          status: 'Audited',
          facultyRemarks: 'Complete',
          evidenceIds: ['e1'],
        },
        {
          id: 'p2',
          areaId: 'a1',
          code: 'Param B',
          title: 'Syllabi',
          description: 'Desc B',
          selfSurveyRating: 4.2,
          evaluatorRating: null,
          status: 'Submitted',
          facultyRemarks: 'Awaiting audit',
          evidenceIds: [],
        },
      ];

      const summary = summarizeArea(3, 'Area III: Curriculum', sampleParams);
      assert.equal(summary.areaNumber, 3);
      assert.equal(summary.parameterCount, 2);
      assert.equal(summary.submittedCount, 2);
      assert.equal(summary.auditedCount, 1);
      assert.equal(summary.selfMeanScore, 4.1);
      assert.equal(summary.evaluatorMeanScore, 4.5);
      assert.equal(summary.completionPercentage, 50);
    });
  });
});
