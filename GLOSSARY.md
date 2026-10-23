# Domain Glossary (OAMS)

Canonical vocabulary for the Online Accreditation Management System (OAMS). Use these exact terms across code, issues, ADRs, and tests.

## Entities & Concepts

- **Accreditation Cycle**: A defined timeline during which an academic program or institution applies for, undergoes evaluation for, and receives an accreditation decision.
- **Accreditation Level**: The recognized tier awarded upon meeting accreditation criteria (e.g., Candidate Status, Level I, Level II, Level III, Level IV).
- **Accrediting Body**: The external agency or board establishing benchmarks and granting official accreditation (e.g., PAASCU, PACUCOA, AACCUP, CHED).
- **Department / College**: Academic organizational unit housing degree programs (e.g., College of Information and Computing Sciences, College of Engineering).
- **Program**: The academic degree or program undergoing accreditation (e.g., BS Information Technology, BS Nursing).
- **Area / Standard**: A core dimension of the accreditation evaluation (e.g., Area I: Vision, Mission, Goals, Area III: Curriculum & Instruction, Area IV: Support to Students).
- **Parameter**: A structured sub-standard under an Area (e.g., Parameter A: Statement of VMGO, Parameter B: Dissemination and Acceptability) containing specific indicators.
- **Indicator**: A granular, measurable verification item or sub-criterion under a Parameter against which compliance evidence is audited.
- **Assignment**: Delegation of a specific Area, Parameter, or Indicator to a Faculty Lead or Area Chair for evidence collection.
- **Evidence / Document**: Uploaded verification artifact (syllabi, faculty profiles, board exam records, minutes, facility photos) supporting a benchmark compliance claim.
- **Document Status**: Lifecycle state of submitted evidence (`Draft`, `Submitted`, `Under Review`, `Needs Revision`, `Approved`).
- **Evaluation / Audit**: The formal assessment process conducted by internal task forces or external accreditors.
- **Evaluator / Auditor**: The user role assigned to inspect evidence, record ratings, and write findings for assigned areas.
- **Rating / Score**: The quantified evaluation value assigned to a benchmark according to the standard scoring rubric (e.g., 1.0 to 5.0 scale).
- **Finding**: An evaluator's remark, observation, strength, or deficiency noted during an audit.
- **Compliance Status**: The state of a benchmark or area (`Compliant`, `Partial`, `Non-Compliant`, `Not Assessed`).
- **Compliance Tracking**: Aggregate dashboard monitoring percentage compliance and readiness breakdown across programs, cycles, and indicators.
- **Review Management**: Workflow for assigning internal QA reviewers, reviewing submitted evidence files, and delivering revision feedback.
- **Accreditation Timeline / Program History**: Historic and forward-looking schedule tracking survey dates, validity terms, and level transitions (Candidate to Level IV).
- **CQI (Continuous Quality Improvement) Action Plan**: Formal post-accreditation remediation commitment mapping evaluator deficiencies and recommendations to time-bound actions, responsible officers, budget allocations, and verification artifacts.
- **Self-Survey Report (SSR) Dossier**: Compiled institutional submission package comprising executive summary, parameter scorecards, area narratives, and indexed digital exhibits with checksum verification.
- **Digital Exhibit Index**: Cryptographically verifiable catalog of evidence artifacts cross-referenced to specific criteria parameters for external audit teams.
- **Multi-Agency Cross-Walk**: Matrix mapping a single evidence artifact across multiple accrediting bodies (e.g., AACCUP, CHED, ISO 9001, PTC) to eliminate redundant uploads.
- **Mock Survey / Simulation**: Sandboxed internal pre-audit inspection replicating external accreditor evaluation to detect evidence deficiencies and score risks prior to official survey visits.

## Roles

- **Super Admin**: System-wide configuration, institution management, user provisioning.
- **QA Director / Accreditation Coordinator**: Oversees institutional accreditation cycles, assigns areas to faculty leads, monitors submission deadlines.
- **Area Chair / Faculty Lead**: Submits evidence, narratives, and self-survey responses for assigned areas.
- **Evaluator / Accreditor**: Reviews submitted evidence, writes scores, generates evaluation reports.
- **Viewer / Stakeholder**: Read-only access to published status dashboards and finalized reports.
