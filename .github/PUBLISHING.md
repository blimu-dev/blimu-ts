# Publishing Guide

This document describes how to publish new versions of `@blimu/backend`, `@blimu/client`, and `@blimu/nestjs` to npm.

## Automated Publishing

Publishing is automated via GitHub Actions. When you create a new git tag, the workflow will:

1. Extract the version from the tag (e.g., `v0.4.5` → `0.4.5`)
2. Update all package.json files with the new version
3. Replace `workspace:*` dependency in `@blimu/nestjs` with the actual version
4. Build all packages
5. Publish `@blimu/backend` to npm first
6. Wait for npm propagation
7. Publish `@blimu/client` to npm
8. Wait for npm propagation
9. Publish `@blimu/nestjs` to npm

## How to Release

1. **Create and push a git tag:**

   ```bash
   git tag v0.4.5
   git push origin v0.4.5
   ```

2. **Or use workflow_dispatch:**
   - Go to GitHub Actions
   - Select "Publish to npm" workflow
   - Click "Run workflow"
   - Enter the version tag (e.g., `v0.4.5`)

## Prerequisites

- `NPM_TOKEN` secret must be configured in GitHub repository settings
- The token must have publish permissions for `@blimu` scope
- **CLI release must exist** before publishing npm packages (workflow will fail otherwise)

## Version Format

- Tags should follow semantic versioning: `v0.4.5`, `v1.0.0`, etc.
- The `v` prefix is optional but recommended
- Both npm packages and CLI binary must use the **exact same version number**
- Version format: `v{major}.{minor}.{patch}` (e.g., `v0.4.5`)

## Version Consistency

When a user installs `@blimu/backend@0.4.5`:

- The `postinstall` script reads the package version (`0.4.5`)
- It downloads the CLI binary from `blimu-cli` release `v0.4.5`
- If the CLI release doesn't exist, installation fails with a clear error
- This ensures all users get the same CLI version for the same npm package version

## Manual Publishing (if needed)

If you need to publish manually:

**First, ensure CLI release exists:**

```bash
# Verify CLI release exists
curl -s -o /dev/null -w "%{http_code}" \
  https://api.github.com/repos/blimu-dev/blimu-cli/releases/tags/v0.4.5
# Should return 200
```

Then proceed with npm publishing:

```bash
# 1. Update versions in all packages
cd packages/backend
npm version 0.4.5 --no-git-tag-version

cd ../client
npm version 0.4.5 --no-git-tag-version

cd ../nestjs
npm version 0.4.5 --no-git-tag-version
# Update @blimu/backend dependency to match version
# Replace "workspace:*" with "0.4.5" in package.json

# 2. Build and publish backend first
cd ../backend
yarn build
npm publish --access public

# 3. Wait a few seconds for npm propagation

# 4. Build and publish client
cd ../client
yarn build
npm publish --access public

# 5. Wait a few seconds for npm propagation

# 6. Build and publish nestjs
cd ../nestjs
yarn install  # This will fetch @blimu/backend from npm
yarn build
npm publish --access public
```

## Troubleshooting

### "CLI release v{version} not found" error

This means the CLI release doesn't exist. You must:

1. Create and push the CLI release tag in `blimu-cli` repository
2. Wait for the CLI build workflow to complete
3. Verify the release exists on GitHub
4. Then retry publishing npm packages

### "Failed to download Blimu CLI binary" during npm install

This means the CLI release for the installed package version doesn't exist. The user should:

- Install a different package version that has a corresponding CLI release
- Or wait for the CLI release to be published
