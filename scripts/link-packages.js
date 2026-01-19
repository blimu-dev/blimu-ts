#!/usr/bin/env node

/**
 * Script to link packages from packages repo using portals via resolutions
 * Usage: node scripts/link-packages.js [reset]
 *
 * This script modifies only the root package.json resolutions field,
 * allowing Yarn to resolve all @blimu/* packages via portals without
 * modifying individual package.json files.
 */

const fs = require('fs');
const path = require('path');

// Default package mappings: package name -> portal path (relative to root)
// These are used if resolutions field doesn't exist
const DEFAULT_PACKAGE_MAPPINGS = {
  '@blimu/fetch': 'portal:../packages/packages/fetch',
  '@blimu/codegen': 'portal:../packages/packages/codegen',
};

const LINK_STATE_FILE = '.link-state.json';

function loadLinkState(rootDir) {
  const stateFile = path.join(rootDir, LINK_STATE_FILE);
  if (fs.existsSync(stateFile)) {
    return JSON.parse(fs.readFileSync(stateFile, 'utf8'));
  }
  return { resolutions: {} };
}

function saveLinkState(rootDir, state) {
  const stateFile = path.join(rootDir, LINK_STATE_FILE);
  fs.writeFileSync(stateFile, JSON.stringify(state, null, 2) + '\n', 'utf8');
}

function updateRootPackageJson(rootDir, link = true) {
  const packageJsonPath = path.join(rootDir, 'package.json');
  const content = fs.readFileSync(packageJsonPath, 'utf8');
  const pkg = JSON.parse(content);
  const linkState = loadLinkState(rootDir);

  // Initialize resolutions if it doesn't exist
  if (!pkg.resolutions) {
    pkg.resolutions = {};
  }

  if (link) {
    // Link: add portal resolutions (store original values if they exist)
    if (!linkState.resolutions) {
      linkState.resolutions = {};
    }
    
    // Track if resolutions field existed before (for reset logic)
    if (linkState.originalResolutions === undefined) {
      linkState.originalResolutions = pkg.resolutions ? JSON.parse(JSON.stringify(pkg.resolutions)) : null;
      linkState.createdResolutions = !pkg.resolutions;
    }
    
    for (const [packageName, portalPath] of Object.entries(DEFAULT_PACKAGE_MAPPINGS)) {
      // Store original resolution if it exists and is different from portal
      if (pkg.resolutions[packageName] && !pkg.resolutions[packageName].startsWith('portal:')) {
        linkState.resolutions[packageName] = pkg.resolutions[packageName];
      } else if (!pkg.resolutions[packageName]) {
        // Mark that this package didn't have a resolution before
        linkState.resolutions[packageName] = null;
      }
      
      // Set portal resolution
      pkg.resolutions[packageName] = portalPath;
      console.log(`  ✓ Linked ${packageName} -> ${portalPath}`);
    }

    // Save original resolutions (only for packages we're managing)
    saveLinkState(rootDir, linkState);
  } else {
    // Reset: restore original resolutions or remove portal entries
    const originalResolutions = linkState.resolutions || {};
    
    for (const packageName of Object.keys(DEFAULT_PACKAGE_MAPPINGS)) {
      if (originalResolutions[packageName] !== undefined) {
        if (originalResolutions[packageName] === null) {
          // No original resolution existed, remove the portal entry
          delete pkg.resolutions[packageName];
          console.log(`  ✓ Removed portal resolution for ${packageName}`);
        } else {
          // Restore original resolution
          pkg.resolutions[packageName] = originalResolutions[packageName];
          console.log(`  ✓ Reset ${packageName} -> ${originalResolutions[packageName]}`);
        }
      } else if (pkg.resolutions[packageName]?.startsWith('portal:')) {
        // No state found, but portal exists - remove it
        delete pkg.resolutions[packageName];
        console.log(`  ✓ Removed portal resolution for ${packageName}`);
      }
    }

    // Remove empty resolutions object if we created it
    if (linkState.createdResolutions && Object.keys(pkg.resolutions || {}).length === 0) {
      delete pkg.resolutions;
      console.log('  ✓ Removed resolutions field (was created by link script)');
    } else if (linkState.originalResolutions && !linkState.createdResolutions) {
      // Restore original resolutions if they existed before
      pkg.resolutions = linkState.originalResolutions;
      console.log('  ✓ Restored original resolutions field');
    } else if (linkState.originalResolutions === null && Object.keys(pkg.resolutions || {}).length === 0) {
      // We created it and now it's empty, remove it
      delete pkg.resolutions;
      console.log('  ✓ Removed resolutions field (was created by link script)');
    }

    // Clear link state after reset
    const stateFile = path.join(rootDir, LINK_STATE_FILE);
    if (fs.existsSync(stateFile)) {
      fs.unlinkSync(stateFile);
    }
  }

  // Write updated package.json
  fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
  return true;
}

function main() {
  const rootDir = path.resolve(__dirname, '..');
  const link = process.argv[2] !== 'reset';
  const action = link ? 'Linking' : 'Resetting';

  console.log(`${action} packages via resolutions...\n`);

  try {
    updateRootPackageJson(rootDir, link);
    console.log(`\n${action} complete. Updated root package.json resolutions.`);

    if (link) {
      console.log('\nNext steps:');
      console.log('  1. Run: yarn install');
      console.log('  2. Build the linked packages if needed');
    } else {
      console.log('\nNext steps:');
      console.log('  1. Run: yarn install');
    }
  } catch (error) {
    console.error(`\nError: ${error.message}`);
    process.exit(1);
  }
}

main();
