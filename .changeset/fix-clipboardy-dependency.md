---
'blimu': patch
---

Add missing `clipboardy` dependency so the CLI runs when installed from npm. The package is externalized in the build (cannot be bundled) but was not listed in dependencies, causing ERR_MODULE_NOT_FOUND at runtime.
