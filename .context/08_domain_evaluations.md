# 08 Domain: Evaluations & Audits

## 1. Domain Entities
* **Evaluation**: Formal audit session for an area/program.
* **Rating / Score**: Numeric assessment assigned to a benchmark.
* **Finding**: Qualitative remark (Strength, Weakness, Compliance Gap, Recommendation).

## 2. Invariants
* Only users with the `evaluator` role can submit ratings.
* Ratings require supporting findings or notes if scored below compliance threshold.
