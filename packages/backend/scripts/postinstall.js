#!/usr/bin/env node

const { main } = require('./download-binary');

// Only run download if we're in a production install (not in development)
// Check if we're in node_modules (production install) or in the repo (development)
const isProductionInstall = __dirname.includes('node_modules');

if (isProductionInstall || process.env.BLIMU_DOWNLOAD_CLI !== 'false') {
  main().catch((error) => {
    // Don't fail the install if binary download fails
    // The binary can be downloaded manually later
    console.warn('Warning: Failed to download Blimu CLI binary during install.');
    console.warn(
      'You can download it manually later or install via: go install github.com/blimu-dev/blimu-cli/cmd/blimucli@latest',
    );
  });
} else {
  console.log('Skipping Blimu CLI binary download (development mode)');
}
