# blimu

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

## 1.1.1

### Patch Changes

- bff3f9e: Bugfix release: Fixed React library build configuration (Vite exports structure) and removed flaky test

## 1.1.0

### Minor Changes

- Bump all packages by minor version to keep them in sync

## 0.7.0

### Minor Changes

- Fix jwt localhost and cookies setting

## 0.6.3

### Patch Changes

- Fix dep versions

## 0.6.2

### Patch Changes

- Fix peerdeps

## 0.6.1

### Patch Changes

- Fix publishing

## 0.1.0

### Minor Changes

- bc59821: Support localhost auth for development envs
