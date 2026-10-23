import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateMockSessionMetrics,
  convertFindingToCQIInput,
} from '../calculations.ts';
import type { MockAuditFinding, MockSurveySession } from '@/types/domain/accreditation';

describe('Mock Survey Simulation & Risk Engine', () => {
  const sampleFindings: MockAuditFinding[] = [
    {
      id: 'find-1',
      sessionId: 'mock-1',
      areaNumber: 3,
      parameterCode: 'Parameter B',
      mockScore: 2.5,
      findingType: 'Critical Gap',
      observation: 'Incomplete syllabus alignment for 3 major computing subjects.',
      urgentActionNeeded: 'Revise course outcomes according to ACM/IEEE guidelines.',
      auditorName: 'Dr. Evelyn Cruz',
      isResolved: false,
    },
    {
      id: 'find-2',
      sessionId: 'mock-1',
      areaNumber: 5,
      parameterCode: 'Parameter A',
      mockScore: 3.2,
      findingType: 'Minor Deficiency',
      observation: 'Equipment calibration logs lack Dean verification signature.',
      urgentActionNeeded: 'Countersign laboratory inspection records for AY 2025.',
      auditorName: 'Engr. Paul Lim',
      isResolved: false,
    },
    {
      id: 'find-3',
      sessionId: 'mock-1',
      areaNumber: 1,
      parameterCode: 'Parameter A',
      mockScore: 4.8,
      findingType: 'Commendable Strength',
      observation: 'Extensive stakeholder involvement in VMGO dissemination.',
      urgentActionNeeded: 'Maintain benchmark practices.',
      auditorName: 'Dr. Evelyn Cruz',
      isResolved: true,
    },
  ];

  const sampleSession: MockSurveySession = {
    id: 'mock-1',
    cycleId: 'cycle-1',
    cycleName: '2026 Institutional Accreditation',
    programId: 'prog-1',
    programCode: 'BSIT',
    programName: 'Bachelor of Science in Information Technology',
    title: 'Pre-AACCUP Mock Survey Simulation',
    auditTeamLead: 'Dr. Evelyn Cruz',
    scheduledDate: '2026-04-10',
    status: 'In Progress',
    grandMeanScore: null,
    riskLevel: 'Moderate Risk',
    findings: sampleFindings,
  };

  describe('calculateMockSessionMetrics', () => {
    it('computes arithmetic mean score and risk classification correctly', () => {
      const metrics = calculateMockSessionMetrics(sampleFindings);
      // (2.5 + 3.2 + 4.8) / 3 = 10.5 / 3 = 3.5
      assert.strictEqual(metrics.grandMeanScore, 3.5);
      assert.strictEqual(metrics.criticalGapCount, 1);
      assert.strictEqual(metrics.minorDeficiencyCount, 1);
      assert.strictEqual(metrics.strengthCount, 1);
      assert.strictEqual(metrics.riskLevel, 'Moderate Risk');
    });

    it('classifies as Critical Risk if critical gaps exceed 2', () => {
      const heavyFindings: MockAuditFinding[] = [
        ...sampleFindings,
        {
          id: 'find-4',
          sessionId: 'mock-1',
          areaNumber: 4,
          parameterCode: 'Parameter C',
          mockScore: 2.0,
          findingType: 'Critical Gap',
          observation: 'No guidance counselor assigned to college.',
          urgentActionNeeded: 'Hire certified psychometrician.',
          auditorName: 'Dr. Evelyn Cruz',
          isResolved: false,
        },
        {
          id: 'find-5',
          sessionId: 'mock-1',
          areaNumber: 6,
          parameterCode: 'Parameter A',
          mockScore: 2.1,
          findingType: 'Critical Gap',
          observation: 'Zero research funding released this academic term.',
          urgentActionNeeded: 'Allocate minimum 5% institutional budget to R&D.',
          auditorName: 'Dr. Evelyn Cruz',
          isResolved: false,
        },
      ];

      const metrics = calculateMockSessionMetrics(heavyFindings);
      assert.strictEqual(metrics.criticalGapCount, 3);
      assert.strictEqual(metrics.riskLevel, 'Critical Risk');
    });
  });

  describe('convertFindingToCQIInput', () => {
    it('transforms a mock deficiency finding into a pre-filled CQI Action Plan', () => {
      const finding = sampleFindings[0]!;
      const cqiPlan = convertFindingToCQIInput(finding, sampleSession);

      assert.strictEqual(cqiPlan.cycleId, 'cycle-1');
      assert.strictEqual(cqiPlan.programId, 'prog-1');
      assert.strictEqual(cqiPlan.programCode, 'BSIT');
      assert.strictEqual(cqiPlan.areaNumber, 3);
      assert.strictEqual(cqiPlan.parameterCode, 'Parameter B');
      assert.strictEqual(cqiPlan.status, 'In Progress');
      assert.ok(cqiPlan.deficiencyOrRecommendation.includes('Incomplete syllabus alignment'));
      assert.ok(cqiPlan.plannedActions.includes('ACM/IEEE guidelines'));
    });
  });
});
