---
'@blimu/backend': patch
'blimu': patch
'@blimu/client': patch
---

- **@blimu/backend**: Include `OAuthAccessTokenPayload` in generated schema (from runtime-api OpenAPI). Re-export token verifier types.
- **blimu** (CLI): Fix `login --exec-env=local-dev` (accept self-signed certs for API client; improve 401 handling and config).
- **@blimu/client**: README updates.
