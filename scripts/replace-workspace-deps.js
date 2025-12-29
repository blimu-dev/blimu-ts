#!/usr/bin/env node

/**
 * Script to replace workspace:* dependencies with actual versions before publishing to npm.
 * This ensures that published packages reference actual npm versions instead of workspace protocols.
 */

const fs = require('fs');
const path = require('path');

const PACKAGES_DIR = path.join(__dirname, '..', 'packages');

/**
 * Read package.json file
 */
function readPackageJson(packagePath) {
  const packageJsonPath = path.join(packagePath, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
}

/**
 * Write package.json file
 */
function writePackageJson(packagePath, packageJson) {
  const packageJsonPath = path.join(packagePath, 'package.json');
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
}

/**
 * Replace workspace:* dependencies with actual versions
 */
function replaceWorkspaceDeps(packageJson, allPackages) {
  let modified = false;

  // Process dependencies
  if (packageJson.dependencies) {
    for (const [depName, depVersion] of Object.entries(packageJson.dependencies)) {
      if (depVersion === 'workspace:*') {
        const depPackage = allPackages.find((pkg) => pkg.name === depName);
        if (depPackage) {
          packageJson.dependencies[depName] = depPackage.version;
          modified = true;
          console.log(`  ✓ Replaced ${depName}: workspace:* → ${depPackage.version}`);
        } else {
          console.warn(`  ⚠ Warning: Could not find package ${depName} for workspace dependency`);
        }
      }
    }
  }

  // Process devDependencies
  if (packageJson.devDependencies) {
    for (const [depName, depVersion] of Object.entries(packageJson.devDependencies)) {
      if (depVersion === 'workspace:*') {
        const depPackage = allPackages.find((pkg) => pkg.name === depName);
        if (depPackage) {
          packageJson.devDependencies[depName] = depPackage.version;
          modified = true;
          console.log(`  ✓ Replaced ${depName}: workspace:* → ${depPackage.version} (dev)`);
        } else {
          console.warn(`  ⚠ Warning: Could not find package ${depName} for workspace dependency`);
        }
      }
    }
  }

  // Process peerDependencies (usually these shouldn't be workspace:*, but handle it just in case)
  if (packageJson.peerDependencies) {
    for (const [depName, depVersion] of Object.entries(packageJson.peerDependencies)) {
      if (depVersion === 'workspace:*') {
        const depPackage = allPackages.find((pkg) => pkg.name === depName);
        if (depPackage) {
          // For peerDependencies, use a version range instead of exact version
          packageJson.peerDependencies[depName] = `>=${depPackage.version}`;
          modified = true;
          console.log(`  ✓ Replaced ${depName}: workspace:* → >=${depPackage.version} (peer)`);
        } else {
          console.warn(`  ⚠ Warning: Could not find package ${depName} for workspace dependency`);
        }
      }
    }
  }

  return modified;
}

/**
 * Main function
 */
function main() {
  console.log('🔍 Scanning packages for workspace dependencies...\n');

  // Read all packages
  const packages = [];
  const packageDirs = fs.readdirSync(PACKAGES_DIR);

  for (const dir of packageDirs) {
    const packagePath = path.join(PACKAGES_DIR, dir);
    if (!fs.statSync(packagePath).isDirectory()) {
      continue;
    }

    const packageJson = readPackageJson(packagePath);
    if (packageJson && packageJson.name) {
      packages.push({
        name: packageJson.name,
        version: packageJson.version,
        path: packagePath,
        json: packageJson,
      });
    }
  }

  console.log(`Found ${packages.length} packages:\n`);
  packages.forEach((pkg) => {
    console.log(`  - ${pkg.name}@${pkg.version}`);
  });
  console.log('');

  // Process each package
  let totalModified = 0;
  for (const pkg of packages) {
    console.log(`📦 Processing ${pkg.name}...`);
    const modified = replaceWorkspaceDeps(pkg.json, packages);
    if (modified) {
      writePackageJson(pkg.path, pkg.json);
      totalModified++;
      console.log(`  ✅ Updated ${pkg.name}\n`);
    } else {
      console.log(`  ℹ️  No workspace dependencies found\n`);
    }
  }

  if (totalModified > 0) {
    console.log(`\n✅ Successfully updated ${totalModified} package(s)`);
    process.exit(0);
  } else {
    console.log('\n✅ No workspace dependencies to replace');
    process.exit(0);
  }
}

main();
