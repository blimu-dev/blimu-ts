# Publishing Guide

This document describes how to publish new versions of `@blimu/backend`, `@blimu/client`, `@blimu/nestjs`, `@blimu/react`, `@blimu/types`, and `blimu` CLI to npm.

## Automated Publishing with Changesets

Publishing is fully automated via GitHub Actions using Changesets. The workflow consists of two main steps:

### 1. Creating a Changeset

When you make changes that should be included in the next release:

```bash
yarn changeset
```

This will:
- Prompt you to select which packages changed
- Ask for the type of change (patch, minor, or major)
- Request a description of the changes

The changeset file will be committed to your PR.

### 2. Version and Publish Workflow

When PRs with changesets are merged to `main`:

1. **Version PR Creation** (automated):
   - The `version.yml` workflow creates a PR titled "chore: version packages"
   - This PR updates package versions and CHANGELOGs based on all merged changesets
   - Major version bumps are prevented during pre-1.0 development

2. **Publishing** (automated):
   - When the version PR is merged, the `publish.yml` workflow triggers
   - Builds all packages
   - Replaces `workspace:*` dependencies with actual versions
   - Publishes to npm with provenance (`--provenance` flag)
   - Creates git tag (e.g., `v1.2.0`)
   - Creates GitHub Release with changelog notes

## Linked Versioning

All packages use linked versioning - they are published together with the same version number:
- `@blimu/backend`
- `@blimu/client`
- `@blimu/nestjs`
- `@blimu/react`
- `@blimu/types`
- `blimu` (CLI)

## Prerequisites

### GitHub Secrets Required

- `NPM_TOKEN`: npm access token with publish permissions for `@blimu` scope
  - Generate at: https://www.npmjs.com/settings/YOUR_USERNAME/tokens
  - Use "Automation" token type for CI/CD
  - Add to GitHub repository secrets

### Permissions

The workflows require:
- `contents: write` - For creating tags and releases
- `id-token: write` - For npm provenance (OIDC)

## Manual Publishing (Emergency Only)

If you need to publish manually (e.g., CI failure):

```bash
# 1. Create changeset
yarn changeset

# 2. Version packages
yarn changeset version

# 3. Build packages
yarn build

# 4. Replace workspace dependencies
yarn replace-workspace-deps

# 5. Publish with provenance
yarn changeset publish --provenance

# 6. Create git tag
VERSION=$(node -e "console.log(require('./packages/backend/package.json').version)")
git tag -a "v${VERSION}" -m "Release v${VERSION}"
git push origin "v${VERSION}"

# 7. Create GitHub release
gh release create "v${VERSION}" --title "v${VERSION}" --notes "Release notes here"
```

## Version Format

- Use semantic versioning: `MAJOR.MINOR.PATCH`
- During pre-1.0: Only `minor` and `patch` versions allowed
- After 1.0: All version types allowed

Examples:
- `1.0.0` → `1.0.1` (patch)
- `1.0.1` → `1.1.0` (minor)
- `1.1.0` → `2.0.0` (major, after 1.0 only)

## Troubleshooting

### "No changesets found" error

Make sure you've created a changeset file using `yarn changeset` before merging your PR.

### Publishing fails with authentication error

Check that:
1. `NPM_TOKEN` secret is set in GitHub repository settings
2. Token has publish permissions for `@blimu` scope
3. Token hasn't expired

### Workspace dependencies error

The `replace-workspace-deps` script should handle this automatically. If it fails:
1. Check that all packages are using `workspace:*` for internal dependencies
2. Verify all packages have been versioned correctly

### Provenance fails

Ensure:
1. Workflow has `id-token: write` permission
2. npm registry URL is set to `https://registry.npmjs.org`
3. Node.js setup includes `registry-url` configuration

## Best Practices

1. **One changeset per PR**: Keep changes focused
2. **Descriptive changeset messages**: They become part of the CHANGELOG
3. **Review version PR**: Check that versions and CHANGELOGs look correct before merging
4. **Test locally**: Run `yarn build` before creating PR to catch build errors early
5. **CI must pass**: Never merge if CI checks are failing

## CI/CD Workflows

- `.github/workflows/ci.yml` - Runs tests, linting, type checking, and builds on PRs
- `.github/workflows/version.yml` - Creates version PR when changesets are merged
- `.github/workflows/publish.yml` - Publishes packages when version PR is merged

## Package Structure

```
packages/
├── backend/     - Server-side SDK
├── client/      - Client-side SDK
├── nestjs/      - NestJS integration
├── react/       - React components and hooks
├── types/       - Shared TypeScript types
└── cli/         - CLI tool (published as "blimu")
```

All packages are built to `dist/` with:
- CommonJS output (`.js`)
- ES modules output (`.mjs`)
- TypeScript declarations (`.d.ts`)
- Source maps (`.js.map`, `.mjs.map`)
