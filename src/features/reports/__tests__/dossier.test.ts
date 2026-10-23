import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { compileSSRDossier, calculateDossierReadiness } from '../compiler.ts';
import type {
  AccreditationCycle,
  DegreeProgram,
  AccreditationArea,
  CriterionParameter,
  EvidenceDocument,
} from '@/types/domain/accreditation';

describe('SSR Dossier Compiler & Exhibit Indexing', () => {
  const sampleCycle: AccreditationCycle = {
    id: 'cycle-1',
    name: '2026 Institutional Accreditation',
    body: 'AACCUP',
    academicYear: 'AY 2025-2026',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    status: 'Self-Survey',
    programIds: ['prog-1'],
    targetLevel: 'Level III Phase 1',
    description: 'AACCUP Level III Survey',
    createdAt: '2026-01-01',
  };

  const sampleProgram: DegreeProgram = {
    id: 'prog-1',
    code: 'BSIT',
    name: 'Bachelor of Science in Information Technology',
    college: 'College of Information and Computing Sciences',
    currentLevel: 'Level II Re-accredited',
    targetLevel: 'Level III Phase 1',
    leadCoordinator: 'Prof. Juan Santos',
  };

  const sampleAreas: AccreditationArea[] = [
    {
      id: 'area-1',
      cycleId: 'cycle-1',
      programId: 'prog-1',
      areaNumber: 1,
      title: 'Vision, Mission, Goals, and Objectives',
      chairName: 'Dr. Maria Santos',
      chairEmail: 'maria@zppsu.edu.ph',
      weight: 10,
      status: 'Audited',
    },
    {
      id: 'area-3',
      cycleId: 'cycle-1',
      programId: 'prog-1',
      areaNumber: 3,
      title: 'Curriculum and Instruction',
      chairName: 'Prof. Jose Rizal',
      chairEmail: 'jose@zppsu.edu.ph',
      weight: 15,
      status: 'Audited',
    },
  ];

  const sampleParameters: CriterionParameter[] = [
    {
      id: 'param-1',
      areaId: 'area-1',
      code: 'Parameter A',
      title: 'Statement of VMGO',
      description: 'System of formulation and approval',
      selfSurveyRating: 4.5,
      evaluatorRating: 4.4,
      status: 'Audited',
      facultyRemarks: 'Published on board resolution',
      evidenceIds: ['doc-1'],
    },
    {
      id: 'param-2',
      areaId: 'area-3',
      code: 'Parameter A',
      title: 'Curricular Design',
      description: 'OBE syllabus alignment',
      selfSurveyRating: 4.2,
      evaluatorRating: 4.1,
      status: 'Audited',
      facultyRemarks: 'Aligned with CMO 25',
      evidenceIds: ['doc-2', 'doc-3'],
    },
  ];

  const sampleDocuments: EvidenceDocument[] = [
    {
      id: 'doc-1',
      parameterId: 'param-1',
      title: 'Board of Regents Resolution No. 42',
      fileName: 'bor_res_42.pdf',
      fileSize: '2.4 MB',
      fileType: 'application/pdf',
      category: 'Policy & Minutes',
      uploadedBy: 'Dr. Maria Santos',
      uploadedAt: '2026-02-10',
      verificationStatus: 'Accepted',
    },
    {
      id: 'doc-2',
      parameterId: 'param-2',
      title: 'BSIT OBE Curriculum Matrix',
      fileName: 'cmo_matrix.pdf',
      fileSize: '5.1 MB',
      fileType: 'application/pdf',
      category: 'Curriculum & Syllabi',
      uploadedBy: 'Prof. Jose Rizal',
      uploadedAt: '2026-02-12',
      verificationStatus: 'Accepted',
    },
    {
      id: 'doc-3',
      parameterId: 'param-2',
      title: 'Industry Advisory Council Minutes',
      fileName: 'iac_minutes.pdf',
      fileSize: '1.8 MB',
      fileType: 'application/pdf',
      category: 'Policy & Minutes',
      uploadedBy: 'Prof. Jose Rizal',
      uploadedAt: '2026-02-15',
      verificationStatus: 'Pending Review',
    },
  ];

  describe('compileSSRDossier', () => {
    it('compiles a complete dossier with automatic deterministic exhibit codes', () => {
      const dossier = compileSSRDossier({
        cycle: sampleCycle,
        program: sampleProgram,
        areas: sampleAreas,
        parameters: sampleParameters,
        documents: sampleDocuments,
        executiveSummary: 'Executive summary for BSIT accreditation.',
      });

      assert.strictEqual(dossier.programCode, 'BSIT');
      assert.strictEqual(dossier.targetLevel, 'Level III Phase 1');
      assert.strictEqual(dossier.sections.length, 2);
      assert.strictEqual(dossier.totalExhibits, 3);

      // Verify Area 1 exhibit code
      const area1Section = dossier.sections.find((s) => s.areaNumber === 1);
      assert.ok(area1Section);
      assert.strictEqual(area1Section.exhibits.length, 1);
      assert.strictEqual(area1Section.exhibits[0]?.exhibitCode, 'EX-A1-01');
      assert.ok(area1Section.exhibits[0]?.sha256Checksum.length > 0);

      // Verify Area 3 exhibit codes
      const area3Section = dossier.sections.find((s) => s.areaNumber === 3);
      assert.ok(area3Section);
      assert.strictEqual(area3Section.exhibits.length, 2);
      assert.strictEqual(area3Section.exhibits[0]?.exhibitCode, 'EX-A3-01');
      assert.strictEqual(area3Section.exhibits[1]?.exhibitCode, 'EX-A3-02');
    });
  });

  describe('calculateDossierReadiness', () => {
    it('computes verified percentage and readiness status', () => {
      const dossier = compileSSRDossier({
        cycle: sampleCycle,
        program: sampleProgram,
        areas: sampleAreas,
        parameters: sampleParameters,
        documents: sampleDocuments,
      });

      const readiness = calculateDossierReadiness(dossier);
      assert.strictEqual(readiness.totalExhibits, 3);
      assert.strictEqual(readiness.verifiedExhibits, 2);
      assert.strictEqual(readiness.pendingExhibits, 1);
      assert.strictEqual(readiness.readinessPercentage, 67);
      assert.strictEqual(readiness.isSubmissionReady, false);
    });
  });
});
