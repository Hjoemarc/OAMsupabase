# Domain Docs

How the engineering skills and AI agents should consume this repo's domain documentation when exploring the codebase.

## Before exploring, read these

- **`GLOSSARY.md`** at the repo root.
- **`docs/adr/`**: read ADRs that touch the area you are about to work in.

If any of these files don't exist, proceed silently. The `/domain-modeling` skill creates or updates them lazily when terms or decisions get resolved.

## File structure

Single-context repo:

```
/
├── GLOSSARY.md
├── docs/adr/
│   ├── 0001-record-architecture-decision.md
└── src/
```

## Use the glossary's vocabulary

When output names a domain concept (in an issue title, a refactor proposal, a hypothesis, a test name), use the term as defined in `GLOSSARY.md`. Don't drift to synonyms the glossary explicitly avoids.

## Flag ADR conflicts

If your proposal contradicts an existing ADR, surface it explicitly:
> _Contradicts ADR-XXXX, but worth reopening because…_
