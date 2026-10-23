# 09 Domain: Evidence Vault & Storage

## 1. Domain Entities
* **Evidence Document**: File upload (PDF, DOCX, image) stored in Supabase Storage (`evidence-vault` bucket).
* **Metadata**: Uploader ID, Benchmark ID, upload timestamp, verification status.
* **Document Status**: `Draft`, `Submitted`, `Approved`, `Flagged`.

## 2. Invariants
* Storage bucket files are secured via Storage RLS policies linked to program assignments.
* Files cannot be overwritten directly; versioning or unique file keys (`${cycleId}/${areaId}/${uuid}-${filename}`) are enforced.
