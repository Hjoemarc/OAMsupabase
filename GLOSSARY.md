# Domain Glossary (OAMS)

Canonical vocabulary for the Online Accreditation Management System (OAMS). Use these exact terms across code, issues, ADRs, and tests.

## Entities & Concepts

- **Accreditation Cycle**: A defined timeline during which an academic program or institution applies for, undergoes evaluation for, and receives an accreditation decision.
- **Accreditation Level**: The recognized tier awarded upon meeting accreditation criteria (e.g., Candidate Status, Level I, Level II, Level III, Level IV).
- **Accrediting Body**: The external agency or board establishing benchmarks and granting official accreditation (e.g., PAASCU, PACUCOA, AACCUP, CHED).
- **Program**: The academic degree or program undergoing accreditation (e.g., BS Information Technology, BS Nursing).
- **Area / Standard**: A core dimension of the accreditation evaluation (e.g., Curriculum & Instruction, Faculty, Facilities, Community Extension, Laboratories, Administration).
- **Benchmark / Parameter**: A specific, measurable requirement under an Area against which compliance is audited.
- **Evidence / Document**: Uploaded verification artifact (syllabi, faculty profiles, board exam records, minutes, facility photos) supporting a benchmark compliance claim.
- **Evaluation / Audit**: The formal assessment process conducted by internal task forces or external accreditors.
- **Evaluator / Auditor**: The user role assigned to inspect evidence, record ratings, and write findings for assigned areas.
- **Rating / Score**: The quantified evaluation value assigned to a benchmark according to the standard scoring rubric.
- **Finding**: An evaluator's remark, observation, strength, or deficiency noted during an audit.
- **Compliance Status**: The state of a benchmark or area (e.g., `Draft`, `Submitted`, `Under Review`, `Compliant`, `Non-Compliant`, `Needs Improvement`).

## Roles

- **Super Admin**: System-wide configuration, institution management, user provisioning.
- **QA Director / Accreditation Coordinator**: Oversees institutional accreditation cycles, assigns areas to faculty leads, monitors submission deadlines.
- **Area Chair / Faculty Lead**: Submits evidence, narratives, and self-survey responses for assigned areas.
- **Evaluator / Accreditor**: Reviews submitted evidence, writes scores, generates evaluation reports.
- **Viewer / Stakeholder**: Read-only access to published status dashboards and finalized reports.
