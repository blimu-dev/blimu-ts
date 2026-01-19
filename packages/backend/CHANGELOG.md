# @blimu/backend

## 1.1.3

### Patch Changes

- 5c76bf1: ### Infrastructure Improvements
  - Add pre-commit hooks with husky and lint-staged for code quality
  - Simplify link-packages script to only modify root package.json resolutions
  - Add portal validation to prevent committing with linked packages
  - Improve development workflow with automated linting, formatting, and type checking
  - Consolidate release workflow to match packages repo pattern
  - Add lockfile updates to changeset version script
  - Ensure all linked packages publish with the same version

- Updated dependencies [5c76bf1]
  - @blimu/types@1.1.3

## 1.1.2

### Patch Changes

- 39ef3b3: Fix publish workflow to check if git tags and releases exist before creating them to prevent errors when re-running workflows
- Updated dependencies [39ef3b3]
  - @blimu/types@1.1.2

## 1.1.1

### Patch Changes

- bff3f9e: Bugfix release: Fixed React library build configuration (Vite exports structure) and removed flaky test
- Updated dependencies [bff3f9e]
  - @blimu/types@1.1.1

## 1.1.0

### Minor Changes

- Bump all packages by minor version to keep them in sync

### Patch Changes

- Updated dependencies
  - @blimu/types@1.1.0
