# 05 Domain: Accreditations

## 1. Domain Entities
* **Accreditation Cycle**: Time-bounded accreditation period for an academic institution or degree program.
* **Program**: Degree program undergoing evaluation (e.g. BS Information Technology, BS Nursing).
* **Accreditation Level**: Candidate Status, Level I, Level II, Level III, Level IV.
* **Accrediting Body**: External agency (e.g., PAASCU, PACUCOA, AACCUP, CHED).

## 2. Invariants
* An Accreditation Cycle contains multiple Program Accreditations.
* Program Accreditations link to specific standard areas and evaluation teams.
* Completed/Archived cycles are read-only and lock all associated criteria scores and evidence.
