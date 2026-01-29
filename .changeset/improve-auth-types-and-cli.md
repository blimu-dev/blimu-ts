---
'@blimu/client': patch
'@blimu/react': patch
'blimu': patch
'@blimu/backend': patch
'@blimu/nestjs': patch
---

Authentication improvements and type safety updates

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
