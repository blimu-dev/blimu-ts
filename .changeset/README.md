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

Releases are automated via GitHub Actions. The workflow is:

1. **Add changesets**: When you create a PR with changes, add a changeset using `yarn changeset`
2. **Merge PR**: When your PR (with changesets) is merged to `main`, a "Version Packages" PR is automatically created/updated
3. **Review and merge**: Review the version PR (it contains version bumps and changelog updates)
4. **Automatic publish**: When the version PR is merged, packages are automatically published to npm

The "Version Packages" PR is kept up-to-date automatically as new changesets are merged to `main`.

## Manual Release (if needed)

```bash
# Version packages based on changesets
yarn changeset version

# Publish to npm
yarn changeset publish
```
