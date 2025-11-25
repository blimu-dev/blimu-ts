#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BIN_DIR = path.join(__dirname, '..', 'bin');
const GITHUB_REPO = 'blimu-dev/blimu-cli';

// Platform mapping
const platformMap = {
  darwin: 'darwin',
  linux: 'linux',
  win32: 'windows',
};

// Architecture mapping
const archMap = {
  x64: 'amd64',
  arm64: 'arm64',
};

function getPlatformInfo() {
  const platform = process.platform;
  const arch = process.arch;

  const goPlatform = platformMap[platform];
  const goArch = archMap[arch];

  if (!goPlatform || !goArch) {
    throw new Error(
      `Unsupported platform: ${platform}/${arch}. Supported platforms: darwin, linux, win32. Supported architectures: x64, arm64`,
    );
  }

  const binaryName = platform === 'win32' ? 'blimu.exe' : 'blimu';
  const assetName = `blimu-${goPlatform}-${goArch}${platform === 'win32' ? '.exe' : ''}`;

  return {
    platform: goPlatform,
    arch: goArch,
    binaryName,
    assetName,
  };
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https
      .get(url, (response) => {
        if (response.statusCode === 302 || response.statusCode === 301) {
          // Follow redirect
          return downloadFile(response.headers.location, dest).then(resolve).catch(reject);
        }
        if (response.statusCode !== 200) {
          file.close();
          fs.unlinkSync(dest);
          reject(new Error(`Failed to download: ${response.statusCode} ${response.statusMessage}`));
          return;
        }
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      })
      .on('error', (err) => {
        file.close();
        if (fs.existsSync(dest)) {
          fs.unlinkSync(dest);
        }
        reject(err);
      });
  });
}

function getLatestReleaseUrl(assetName) {
  return new Promise((resolve, reject) => {
    https
      .get(
        `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`,
        {
          headers: {
            'User-Agent': 'blimu-ts-installer',
            Accept: 'application/vnd.github.v3+json',
          },
        },
        (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
          res.on('end', () => {
            if (res.statusCode !== 200) {
              reject(new Error(`Failed to fetch latest release: ${res.statusCode}`));
              return;
            }
            try {
              const release = JSON.parse(data);
              const asset = release.assets.find((a) => a.name === assetName);
              if (!asset) {
                reject(new Error(`Asset ${assetName} not found in latest release`));
                return;
              }
              resolve(asset.browser_download_url);
            } catch (err) {
              reject(err);
            }
          });
        },
      )
      .on('error', reject);
  });
}

async function main() {
  try {
    const { binaryName, assetName } = getPlatformInfo();

    // Create bin directory if it doesn't exist
    if (!fs.existsSync(BIN_DIR)) {
      fs.mkdirSync(BIN_DIR, { recursive: true });
    }

    const binaryPath = path.join(BIN_DIR, binaryName);

    // Check if binary already exists and is executable
    if (fs.existsSync(binaryPath)) {
      try {
        // Try to make it executable (Unix only)
        if (process.platform !== 'win32') {
          fs.chmodSync(binaryPath, 0o755);
        }
        console.log(`✅ Blimu CLI binary already exists at ${binaryPath}`);
        return;
      } catch (err) {
        // If we can't check/update permissions, continue to download
      }
    }

    console.log(`📥 Downloading Blimu CLI binary for ${process.platform}/${process.arch}...`);

    // Get latest release download URL
    const downloadUrl = await getLatestReleaseUrl(assetName);
    console.log(`🔗 Download URL: ${downloadUrl}`);

    // Download the binary
    await downloadFile(downloadUrl, binaryPath);

    // Make binary executable (Unix only)
    if (process.platform !== 'win32') {
      fs.chmodSync(binaryPath, 0o755);
    }

    console.log(`✅ Blimu CLI binary downloaded successfully to ${binaryPath}`);
  } catch (error) {
    console.error(`❌ Failed to download Blimu CLI binary: ${error.message}`);
    console.error(`\nYou can manually install it by running:`);
    console.error(`  go install github.com/blimu-dev/blimu-cli/cmd/blimucli@latest`);
    console.error(`\nOr download from: https://github.com/${GITHUB_REPO}/releases/latest`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main, getPlatformInfo };
