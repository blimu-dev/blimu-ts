---
"@blimu/backend": patch
"@blimu/client": patch
"@blimu/nestjs": patch
"@blimu/react": patch
"@blimu/types": patch
"blimu": patch
---

### Infrastructure Improvements

- Add pre-commit hooks with husky and lint-staged for code quality
- Simplify link-packages script to only modify root package.json resolutions
- Add portal validation to prevent committing with linked packages
- Improve development workflow with automated linting, formatting, and type checking
- Consolidate release workflow to match packages repo pattern
- Add lockfile updates to changeset version script
- Ensure all linked packages publish with the same version
