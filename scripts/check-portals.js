#!/usr/bin/env node

/**
 * Script to check if root package.json has portal: entries in resolutions field
 * This prevents committing with linked packages
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const packageJsonPath = path.join(rootDir, 'package.json');

try {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  if (packageJson.resolutions) {
    const portalEntries = [];
    
    for (const [packageName, resolution] of Object.entries(packageJson.resolutions)) {
      if (typeof resolution === 'string' && resolution.startsWith('portal:')) {
        portalEntries.push({ packageName, resolution });
      }
    }
    
    if (portalEntries.length > 0) {
      console.error('\n❌ Error: Found portal: entries in root package.json resolutions field:');
      portalEntries.forEach(({ packageName, resolution }) => {
        console.error(`   - ${packageName}: ${resolution}`);
      });
      console.error('\nPlease run "yarn unlink:packages" before committing.\n');
      process.exit(1);
    }
  }
  
  console.log('✓ No portal: entries found in resolutions field');
  process.exit(0);
} catch (error) {
  console.error(`Error checking package.json: ${error.message}`);
  process.exit(1);
}
