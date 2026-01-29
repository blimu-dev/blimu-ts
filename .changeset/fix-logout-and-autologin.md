---
"@blimu/react": patch
---

Fix logout and auto-login authentication issues

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
