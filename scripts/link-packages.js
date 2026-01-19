#!/usr/bin/env node

/**
 * Script to link packages from packages repo using portals
 * Usage: node scripts/link-packages.js
 */

const fs = require('fs');
const path = require('path');
const { globSync } = require('glob');

// Package mappings: package name -> { packages path (relative to root), default version }
// Reads from root package.json resolutions field (portal: paths)
function getPackageMappings(rootDir) {
  const rootPackageJsonPath = path.join(rootDir, 'package.json');
  const rootPackageJson = JSON.parse(fs.readFileSync(rootPackageJsonPath, 'utf8'));
  const mappings = {};

  if (rootPackageJson.resolutions) {
    for (const [packageName, resolution] of Object.entries(rootPackageJson.resolutions)) {
      if (typeof resolution === 'string' && resolution.startsWith('portal:')) {
        const portalPath = resolution.replace(/^portal:/, '');
        const absolutePath = path.resolve(rootDir, portalPath);
        const defaultVersion =
          rootPackageJson.dependencies?.[packageName] ||
          rootPackageJson.devDependencies?.[packageName] ||
          'workspace:*';

        mappings[packageName] = {
          packagesPath: absolutePath,
          defaultVersion: defaultVersion,
        };
      }
    }
  }

  return mappings;
}

function findPackageJsonFiles(rootDir) {
  return globSync('**/package.json', {
    cwd: rootDir,
    ignore: ['**/node_modules/**', '**/dist/**', '**/.yarn/**'],
    absolute: true,
  });
}

function loadLinkState(rootDir) {
  const stateFile = path.join(rootDir, '.link-state.json');
  if (fs.existsSync(stateFile)) {
    return JSON.parse(fs.readFileSync(stateFile, 'utf8'));
  }
  return {};
}

function saveLinkState(rootDir, state) {
  const stateFile = path.join(rootDir, '.link-state.json');
  fs.writeFileSync(stateFile, JSON.stringify(state, null, 2) + '\n', 'utf8');
}

function updateDeps(deps, depsKey, pkg, packageMappings, link, linkState, relativePath, packageJsonDir) {
  if (!deps) return false;
  let modified = false;

  for (const [depName, mapping] of Object.entries(packageMappings)) {
    if (!deps[depName]) continue;
    const currentValue = deps[depName];

    if (link && !currentValue.startsWith('portal:')) {
      const relativePortalPath = path.relative(packageJsonDir, mapping.packagesPath);
      const normalizedPortalPath = relativePortalPath.split(path.sep).join('/');

      if (!linkState[relativePath]) linkState[relativePath] = {};
      if (!linkState[relativePath][depsKey]) linkState[relativePath][depsKey] = {};
      linkState[relativePath][depsKey][depName] = currentValue;

      pkg[depsKey][depName] = `portal:${normalizedPortalPath}`;
      modified = true;
      console.log(`  ✓ Linked ${depName} -> portal:${normalizedPortalPath}`);
    } else if (!link && currentValue.startsWith('portal:')) {
      const storedVersion = linkState[relativePath]?.[depsKey]?.[depName] || mapping.defaultVersion;
      pkg[depsKey][depName] = storedVersion;
      modified = true;
      console.log(`  ✓ Reset ${depName} -> ${storedVersion}`);
    }
  }

  return modified;
}

function updatePackageJson(filePath, rootDir, packageMappings, link = true, linkState = {}) {
  const content = fs.readFileSync(filePath, 'utf8');
  const pkg = JSON.parse(content);
  const relativePath = path.relative(rootDir, filePath);
  const packageJsonDir = path.dirname(filePath);

  const depsModified = updateDeps(pkg.dependencies, 'dependencies', pkg, packageMappings, link, linkState, relativePath, packageJsonDir);
  const devDepsModified = updateDeps(pkg.devDependencies, 'devDependencies', pkg, packageMappings, link, linkState, relativePath, packageJsonDir);

  if (depsModified || devDepsModified) {
    fs.writeFileSync(filePath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
    return true;
  }
  return false;
}

function main() {
  const rootDir = path.resolve(__dirname, '..');
  const link = process.argv[2] !== 'reset';
  const action = link ? 'Linking' : 'Resetting';

  console.log(`${action} packages...\n`);

  const packageMappings = getPackageMappings(rootDir);
  const linkState = loadLinkState(rootDir);
  const packageJsonFiles = findPackageJsonFiles(rootDir);
  let modifiedCount = 0;

  for (const filePath of packageJsonFiles) {
    const relativePath = path.relative(rootDir, filePath);
    if (updatePackageJson(filePath, rootDir, packageMappings, link, linkState)) {
      console.log(`Updated: ${relativePath}`);
      modifiedCount++;
    }
  }

  // Save link state after linking, clear it after resetting
  if (link) {
    saveLinkState(rootDir, linkState);
  } else {
    // Clear link state after reset
    const stateFile = path.join(rootDir, '.link-state.json');
    if (fs.existsSync(stateFile)) {
      fs.unlinkSync(stateFile);
    }
  }

  console.log(`\n${action} complete. Modified ${modifiedCount} package.json file(s).`);
  
  if (link) {
    console.log('\nNext steps:');
    console.log('  1. Run: yarn install');
    console.log('  2. Build the linked packages if needed');
  } else {
    console.log('\nNext steps:');
    console.log('  1. Run: yarn install');
  }
}

main();
