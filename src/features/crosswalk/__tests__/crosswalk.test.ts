import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { calculateAgencyCoverage, filterCrossWalkMappings } from '../calculations.ts';
import type { CrossWalkMapping } from '@/types/domain/accreditation';

describe('Multi-Agency Cross-Walk Matrix & Coverage Calculations', () => {
  const sampleMappings: CrossWalkMapping[] = [
    {
      id: 'cw-1',
      documentId: 'doc-1',
      documentTitle: 'OBE Curriculum Matrix',
      fileName: 'obe_curriculum.pdf',
      category: 'Curriculum & Syllabi',
      primaryAgency: 'AACCUP',
      primaryCode: 'Area III - Parameter A',
      targetAgency: 'CHED',
      targetCode: 'CMO 25 s.2015 Sec 8',
      targetStandardTitle: 'Curriculum Specification & Course Mapping',
      equivalenceConfidence: 'Direct Match',
      mappedBy: 'QA Office',
      mappedAt: '2026-03-01',
    },
    {
      id: 'cw-2',
      documentId: 'doc-2',
      documentTitle: 'Faculty Development Plan',
      fileName: 'faculty_dev.pdf',
      category: 'Faculty Credentials',
      primaryAgency: 'AACCUP',
      primaryCode: 'Area II - Parameter B',
      targetAgency: 'CHED',
      targetCode: 'CMO 25 s.2015 Sec 12',
      targetStandardTitle: 'Faculty Qualification & Mentorship',
      equivalenceConfidence: 'Direct Match',
      mappedBy: 'QA Office',
      mappedAt: '2026-03-01',
    },
    {
      id: 'cw-3',
      documentId: 'doc-3',
      documentTitle: 'Laboratory Maintenance Protocol',
      fileName: 'lab_protocol.pdf',
      category: 'Equipment & Facilities',
      primaryAgency: 'AACCUP',
      primaryCode: 'Area V - Parameter C',
      targetAgency: 'ISO 9001',
      targetCode: 'Clause 7.1.3',
      targetStandardTitle: 'Infrastructure Maintenance & Calibration',
      equivalenceConfidence: 'Partial Overlap',
      mappedBy: 'Dr. Santos',
      mappedAt: '2026-03-02',
    },
  ];

  describe('calculateAgencyCoverage', () => {
    it('computes coverage percentage and distinct standard counts for target agency', () => {
      // CHED has 2 distinct target codes in sample mappings
      const coverage = calculateAgencyCoverage(sampleMappings, 'CHED', 4);
      assert.strictEqual(coverage.agency, 'CHED');
      assert.strictEqual(coverage.coveredStandardsCount, 2);
      assert.strictEqual(coverage.totalExpectedStandards, 4);
      assert.strictEqual(coverage.coveragePercentage, 50);
      assert.strictEqual(coverage.directMatches, 2);
      assert.strictEqual(coverage.partialOverlaps, 0);
    });

    it('computes ISO 9001 coverage accurately', () => {
      const coverage = calculateAgencyCoverage(sampleMappings, 'ISO 9001', 2);
      assert.strictEqual(coverage.coveredStandardsCount, 1);
      assert.strictEqual(coverage.coveragePercentage, 50);
      assert.strictEqual(coverage.partialOverlaps, 1);
    });
  });

  describe('filterCrossWalkMappings', () => {
    it('filters strictly by target agency', () => {
      const results = filterCrossWalkMappings(sampleMappings, { targetAgency: 'CHED' });
      assert.strictEqual(results.length, 2);
      assert.strictEqual(results[0]?.targetAgency, 'CHED');
      assert.strictEqual(results[1]?.targetAgency, 'CHED');
    });

    it('filters strictly by equivalence confidence', () => {
      const results = filterCrossWalkMappings(sampleMappings, { confidence: 'Partial Overlap' });
      assert.strictEqual(results.length, 1);
      assert.strictEqual(results[0]?.id, 'cw-3');
    });

    it('filters by search term in document title or target code', () => {
      const results = filterCrossWalkMappings(sampleMappings, { searchQuery: 'Clause 7.1.3' });
      assert.strictEqual(results.length, 1);
      assert.strictEqual(results[0]?.targetCode, 'Clause 7.1.3');
    });
  });
});
