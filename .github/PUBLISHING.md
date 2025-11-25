# Publishing Guide

This document describes how to publish new versions of `@blimu/backend` and `@blimu/nestjs` to npm.

## Automated Publishing

Publishing is automated via GitHub Actions. When you create a new git tag, the workflow will:

1. Extract the version from the tag (e.g., `v0.4.5` → `0.4.5`)
2. Update both package.json files with the new version
3. Replace `workspace:*` dependency in `@blimu/nestjs` with the actual version
4. Build both packages
5. Publish `@blimu/backend` to npm first
6. Wait for npm propagation
7. Publish `@blimu/nestjs` to npm

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

## Version Format

- Tags should follow semantic versioning: `v0.4.5`, `v1.0.0`, etc.
- The `v` prefix is optional but recommended
- Both packages will be published with the same version number

## Manual Publishing (if needed)

If you need to publish manually:

```bash
# 1. Update versions in both packages
cd packages/backend
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

# 4. Build and publish nestjs
cd ../nestjs
yarn install  # This will fetch @blimu/backend from npm
yarn build
npm publish --access public
```
