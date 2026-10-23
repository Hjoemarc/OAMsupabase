# 10 Domain: Users & Personnel Directory

## 1. Domain Entities
* **Profile**: Core user data (`full_name`, `email`, `department`, `avatar_url`).
* **Department**: Academic or administrative unit (e.g. College of Computer Studies, College of Nursing).
* **Role Assignment**: Association in `user_roles`.

## 2. Invariants
* Deleting a user profile is soft-handled via an `is_active` flag to preserve historical audit trails on uploaded documents and evaluations.
* Department changes cascade to dependent program selections in UI forms.
