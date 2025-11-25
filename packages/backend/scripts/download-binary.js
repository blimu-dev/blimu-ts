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

function getReleaseUrl(version, assetName) {
  return new Promise((resolve, reject) => {
    // If no version provided, fall back to latest (for backward compatibility)
    const tag = version ? `tags/v${version}` : 'latest';
    const url = `https://api.github.com/repos/${GITHUB_REPO}/releases/${tag}`;

    https
      .get(
        url,
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
            if (res.statusCode === 404) {
              reject(
                new Error(
                  `CLI release v${version} not found. Please ensure the CLI release exists before installing this package version.`,
                ),
              );
              return;
            }
            if (res.statusCode !== 200) {
              reject(
                new Error(
                  `Failed to fetch ${version ? `release v${version}` : 'latest release'}: ${res.statusCode} ${res.statusMessage}`,
                ),
              );
              return;
            }
            try {
              const release = JSON.parse(data);
              const asset = release.assets.find((a) => a.name === assetName);
              if (!asset) {
                reject(
                  new Error(
                    `Asset ${assetName} not found in ${version ? `release v${version}` : 'latest release'}`,
                  ),
                );
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

async function main(version) {
  try {
    // If version not provided, try to read from package.json
    if (!version) {
      try {
        const packageJsonPath = path.join(__dirname, '..', 'package.json');
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        version = packageJson.version;
      } catch (err) {
        // If we can't read package.json, fall back to latest
        console.warn('Warning: Could not read package.json version, falling back to latest CLI release');
      }
    }

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
        if (version) {
          console.log(`✅ Blimu CLI binary (v${version}) already exists at ${binaryPath}`);
        } else {
          console.log(`✅ Blimu CLI binary already exists at ${binaryPath}`);
        }
        return;
      } catch (err) {
        // If we can't check/update permissions, continue to download
      }
    }

    if (version) {
      console.log(`📥 Downloading Blimu CLI binary v${version} for ${process.platform}/${process.arch}...`);
    } else {
      console.log(`📥 Downloading Blimu CLI binary (latest) for ${process.platform}/${process.arch}...`);
    }

    // Get release download URL
    const downloadUrl = await getReleaseUrl(version, assetName);
    console.log(`🔗 Download URL: ${downloadUrl}`);

    // Download the binary
    await downloadFile(downloadUrl, binaryPath);

    // Make binary executable (Unix only)
    if (process.platform !== 'win32') {
      fs.chmodSync(binaryPath, 0o755);
    }

    if (version) {
      console.log(`✅ Blimu CLI binary v${version} downloaded successfully to ${binaryPath}`);
    } else {
      console.log(`✅ Blimu CLI binary downloaded successfully to ${binaryPath}`);
    }
  } catch (error) {
    console.error(`❌ Failed to download Blimu CLI binary: ${error.message}`);
    if (version) {
      console.error(`\nVersion ${version} of the CLI binary is required but not available.`);
      console.error(`Please ensure the CLI release v${version} exists in the blimu-cli repository.`);
      console.error(`\nYou can manually install it by running:`);
      console.error(`  go install github.com/blimu-dev/blimu-cli/cmd/blimucli@v${version}`);
      console.error(`\nOr download from: https://github.com/${GITHUB_REPO}/releases/tag/v${version}`);
    } else {
      console.error(`\nYou can manually install it by running:`);
      console.error(`  go install github.com/blimu-dev/blimu-cli/cmd/blimucli@latest`);
      console.error(`\nOr download from: https://github.com/${GITHUB_REPO}/releases/latest`);
    }
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main, getPlatformInfo };
