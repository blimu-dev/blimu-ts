#!/usr/bin/env node

const { main } = require('./download-binary');

// Only run download if we're in a production install (not in development)
// Check if we're in node_modules (production install) or in the repo (development)
const isProductionInstall = __dirname.includes('node_modules');

if (isProductionInstall || process.env.BLIMU_DOWNLOAD_CLI !== 'false') {
  // Always download the latest CLI version
  main(null).catch((error) => {
    // Fail the install if binary download fails
    console.error('Error: Failed to download Blimu CLI binary during install.');
    console.error(error.message);
    console.error('\nThe package will download the latest available CLI version.');
    console.error('\nYou can manually install it by running:');
    console.error('  go install github.com/blimu-dev/blimu-cli/cmd/blimucli@latest');
    process.exit(1);
  });
} else {
  console.log('Skipping Blimu CLI binary download (development mode)');
}
