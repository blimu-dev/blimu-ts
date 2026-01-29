# @blimu/react

## 1.2.1

### Patch Changes

- 1985a86: Fix logout and auto-login authentication issues

  **Logout Fixes:**
  - Added `credentials: 'include'` to SDK client to ensure cookies are sent with logout requests
  - Fixed session cookie clearing for LIVE environments with correct domain (`.dev-blimu.dev`)
  - Session is now properly deleted from database on logout, preventing auto-login
  - Cookies are cleared even when logout API call fails

  **Auto-login Fixes:**
  - Fixed double-encoded redirect URL handling in auth flow
  - Users are now properly redirected after auto-login with encoded `redirect_url` parameters

  **Tests Added:**
  - Added comprehensive unit tests for logout cookie clearing
  - Added tests for SDK credentials configuration
  - Added unit tests for redirect URL decoding (double-encoded, single-encoded, invalid URLs)

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
  - @blimu/client@1.2.1

## 1.2.0

### Minor Changes

- 4969dbf: Enhanced NestJS integration with improved entitlement decorator and guard functionality, added comprehensive test coverage, and updated build configurations.

### Patch Changes

- Updated dependencies [4969dbf]
  - @blimu/client@1.2.0

## 1.1.4

### Patch Changes

- a1b1bd3: Fix package publishing issues
  - Fix CLI bin path to use correct .cjs extension
  - Fix React build warnings with exports configuration
  - Resolve npm permission issues for blimu package

- Updated dependencies [a1b1bd3]
  - @blimu/client@1.1.4

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
  - @blimu/client@1.1.3

## 1.1.2

### Patch Changes

- 39ef3b3: Fix publish workflow to check if git tags and releases exist before creating them to prevent errors when re-running workflows
- Updated dependencies [39ef3b3]
  - @blimu/client@1.1.2

## 1.1.1

### Patch Changes

- bff3f9e: Bugfix release: Fixed React library build configuration (Vite exports structure) and removed flaky test
- Updated dependencies [bff3f9e]
  - @blimu/client@1.1.1

## 1.1.0

### Minor Changes

- Bump all packages by minor version to keep them in sync

### Patch Changes

- Updated dependencies
  - @blimu/client@1.1.0

## 0.7.0

### Minor Changes

- Fix jwt localhost and cookies setting

### Patch Changes

- Updated dependencies
  - @blimu/client@0.7.0

## 0.6.3

### Patch Changes

- Fix dep versions
- Updated dependencies
  - @blimu/client@0.6.3

## 0.6.2

### Patch Changes

- Fix peerdeps
- Updated dependencies
  - @blimu/client@0.6.2

## 0.6.1

### Patch Changes

- Fix publishing

## 0.6.0

### Minor Changes

- bc59821: Support localhost auth for development envs
