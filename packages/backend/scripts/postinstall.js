#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const { main } = require('./download-binary');

// Only run download if we're in a production install (not in development)
// Check if we're in node_modules (production install) or in the repo (development)
const isProductionInstall = __dirname.includes('node_modules');

if (isProductionInstall || process.env.BLIMU_DOWNLOAD_CLI !== 'false') {
  // Read version from package.json
  let version;
  try {
    const packageJsonPath = path.join(__dirname, '..', 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    version = packageJson.version;
  } catch (err) {
    console.warn('Warning: Could not read package.json version');
  }

  main(version).catch((error) => {
    // Fail the install if binary download fails - version consistency is critical
    console.error('Error: Failed to download Blimu CLI binary during install.');
    console.error(error.message);
    if (version) {
      console.error(
        `\nThe package requires CLI version v${version}, but it could not be downloaded.`,
      );
      console.error('This ensures version consistency between the npm package and CLI binary.');
      console.error(
        `\nPlease ensure the CLI release v${version} exists, or install a different package version.`,
      );
    }
    process.exit(1);
  });
} else {
  console.log('Skipping Blimu CLI binary download (development mode)');
}
