# Changesets

This repository uses [Changesets](https://github.com/changesets/changesets) for version management and publishing.

## Adding a Changeset

When you make changes that should trigger a release, add a changeset:

```bash
yarn changeset
```

This will:

1. Ask which packages should be released
2. Ask what type of change (major, minor, patch)
3. Ask for a description of the change
4. Create a changeset file in `.changeset/`

## Releasing

Releases are automated via GitHub Actions. When changesets are merged to main:

1. A PR is automatically created with version bumps and changelog updates
2. When that PR is merged, packages are published to npm

## Manual Release (if needed)

```bash
# Version packages based on changesets
yarn changeset version

# Publish to npm
yarn changeset publish
```
