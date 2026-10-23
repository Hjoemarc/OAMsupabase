import type { CrossWalkMapping, CrossWalkAgency, EquivalenceConfidence } from '@/types/domain/accreditation';

export interface AgencyCoverageStats {
  agency: CrossWalkAgency;
  coveredStandardsCount: number;
  totalExpectedStandards: number;
  coveragePercentage: number;
  directMatches: number;
  partialOverlaps: number;
  supportingContexts: number;
}

export function calculateAgencyCoverage(
  mappings: CrossWalkMapping[],
  agency: CrossWalkAgency,
  totalExpectedStandards: number
): AgencyCoverageStats {
  const agencyMappings = mappings.filter((m) => m.targetAgency === agency);

  // Set of distinct target standard codes covered
  const distinctCoveredCodes = new Set<string>();
  let directMatches = 0;
  let partialOverlaps = 0;
  let supportingContexts = 0;

  for (const m of agencyMappings) {
    distinctCoveredCodes.add(m.targetCode);
    if (m.equivalenceConfidence === 'Direct Match') {
      directMatches++;
    } else if (m.equivalenceConfidence === 'Partial Overlap') {
      partialOverlaps++;
    } else if (m.equivalenceConfidence === 'Supporting Context') {
      supportingContexts++;
    }
  }

  const coveredStandardsCount = distinctCoveredCodes.size;
  const coveragePercentage =
    totalExpectedStandards > 0
      ? Math.round((coveredStandardsCount / totalExpectedStandards) * 100)
      : 0;

  return {
    agency,
    coveredStandardsCount,
    totalExpectedStandards,
    coveragePercentage,
    directMatches,
    partialOverlaps,
    supportingContexts,
  };
}

export function filterCrossWalkMappings(
  mappings: CrossWalkMapping[],
  filters: {
    primaryAgency?: string;
    targetAgency?: string;
    confidence?: string;
    searchQuery?: string;
  }
): CrossWalkMapping[] {
  return mappings.filter((item) => {
    if (filters.primaryAgency && filters.primaryAgency !== 'All' && item.primaryAgency !== filters.primaryAgency) {
      return false;
    }
    if (filters.targetAgency && filters.targetAgency !== 'All' && item.targetAgency !== filters.targetAgency) {
      return false;
    }
    if (filters.confidence && filters.confidence !== 'All' && item.equivalenceConfidence !== filters.confidence) {
      return false;
    }
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      const matchDoc = item.documentTitle.toLowerCase().includes(q);
      const matchFile = item.fileName.toLowerCase().includes(q);
      const matchPrimary = item.primaryCode.toLowerCase().includes(q);
      const matchTarget = item.targetCode.toLowerCase().includes(q);
      const matchStd = item.targetStandardTitle.toLowerCase().includes(q);
      if (!matchDoc && !matchFile && !matchPrimary && !matchTarget && !matchStd) {
        return false;
      }
    }
    return true;
  });
}
