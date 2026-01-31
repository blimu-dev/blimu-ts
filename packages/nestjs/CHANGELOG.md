# @blimu/nestjs

## 1.2.2

### Patch Changes

- 6a79cc2: JWKS support, CLI auth preferences and UI improvements: backend auth_jwks service and token verifier updates; CLI login/logout/whoami/push with preferences, interactive prompts and copyable output; nestjs jwk.service updates; client README.
- Updated dependencies [6a79cc2]
  - @blimu/backend@1.2.2

## 1.2.1

### Patch Changes

- cad47dc: Authentication improvements and type safety updates

  **Client Package (@blimu/client):**
  - Added support for `__lh_jwt` query parameter in logout endpoint
  - Made `sessionToken` optional in `RefreshResponse` type for better type safety
  - Updated auth service to handle query parameters in logout calls

  **React Package (@blimu/react):**
  - Added guard to check `sessionToken` exists before setting cookie in refresh flow
  - Prevents runtime errors when session token is not returned

  **CLI Package (blimu):**
  - Added new utility modules for formatting, JWT handling, and logging
  - Improved command implementations for codegen, login, logout, push, and whoami
  - Better error handling and user feedback

  **Backend & NestJS Packages:**
  - Updated dependencies and configurations for better type compatibility
  - README documentation improvements

  **Other:**
  - Disabled TypeScript project service and type-checked rules for test files in ESLint config
  - Updated various dependencies to latest versions

- Updated dependencies [c60cf4f]
- Updated dependencies [cad47dc]
  - @blimu/backend@1.2.1

## 1.2.0

### Minor Changes

- 4969dbf: Enhanced NestJS integration with improved entitlement decorator and guard functionality, added comprehensive test coverage, and updated build configurations.

### Patch Changes

- Updated dependencies [4969dbf]
  - @blimu/backend@1.2.0
  - @blimu/types@1.2.0

## 1.1.4

### Patch Changes

- a1b1bd3: Fix package publishing issues
  - Fix CLI bin path to use correct .cjs extension
  - Fix React build warnings with exports configuration
  - Resolve npm permission issues for blimu package

- Updated dependencies [a1b1bd3]
  - @blimu/backend@1.1.4
  - @blimu/types@1.1.4

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
  - @blimu/backend@1.1.3
  - @blimu/types@1.1.3

## 1.1.2

### Patch Changes

- 39ef3b3: Fix publish workflow to check if git tags and releases exist before creating them to prevent errors when re-running workflows
- Updated dependencies [39ef3b3]
  - @blimu/backend@1.1.2
  - @blimu/types@1.1.2

## 1.1.1

### Patch Changes

- bff3f9e: Bugfix release: Fixed React library build configuration (Vite exports structure) and removed flaky test
- Updated dependencies [bff3f9e]
  - @blimu/backend@1.1.1
  - @blimu/types@1.1.1

## 1.1.0

### Minor Changes

- Bump all packages by minor version to keep them in sync

### Patch Changes

- Updated dependencies
  - @blimu/backend@1.1.0

## 1.0.0

### Minor Changes

- Fix jwt localhost and cookies setting

### Patch Changes

- Updated dependencies
  - @blimu/backend@0.7.0

## 0.6.3

### Patch Changes

- Fix dep versions
- Updated dependencies
  - @blimu/backend@0.6.3

## 0.6.2

### Patch Changes

- Fix peerdeps
- Updated dependencies
  - @blimu/backend@0.6.2

## 0.6.1

### Patch Changes

- Fix publishing
- Updated dependencies
  - @blimu/backend@0.6.1

## 1.0.0

### Minor Changes

- bc59821: Support localhost auth for development envs

### Patch Changes

- Updated dependencies [bc59821]
  - @blimu/backend@0.6.0

## 0.5.0

### Minor Changes

- Implemented authentication flow
- add new endpoints

### Patch Changes

- Updated dependencies
- Updated dependencies
  - @blimu/backend@0.5.0
