#!/usr/bin/env node

/**
 * Validates that changeset files don't contain major version bumps.
 * This prevents accidental major version releases.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CHANGESET_DIR = path.join(__dirname, '..', '.changeset');
const MAJOR_BUMP_PATTERN = /:\s*major\s*$/m;

function checkChangesets() {
  // Get staged changeset files or all changeset files
  let changesetFiles = [];

  try {
    // Check if we're in a git repo and get staged changeset files
    const stagedFiles = execSync('git diff --cached --name-only --diff-filter=ACMR', {
      encoding: 'utf-8',
      cwd: path.join(__dirname, '..'),
    })
      .trim()
      .split('\n')
      .filter((file) => file.startsWith('.changeset/') && file.endsWith('.md'));

    if (stagedFiles.length > 0) {
      changesetFiles = stagedFiles;
    } else {
      // If no staged files, check all changeset files in the directory
      if (fs.existsSync(CHANGESET_DIR)) {
        changesetFiles = fs
          .readdirSync(CHANGESET_DIR)
          .filter((file) => file.endsWith('.md') && file !== 'README.md')
          .map((file) => path.join('.changeset', file));
      }
    }
  } catch (error) {
    // If not in git or git command fails, check all changeset files
    if (fs.existsSync(CHANGESET_DIR)) {
      changesetFiles = fs
        .readdirSync(CHANGESET_DIR)
        .filter((file) => file.endsWith('.md') && file !== 'README.md')
        .map((file) => path.join('.changeset', file));
    }
  }

  if (changesetFiles.length === 0) {
    // No changeset files to check
    return;
  }

  const repoRoot = path.join(__dirname, '..');
  const majorBumps = [];

  for (const file of changesetFiles) {
    const filePath = path.join(repoRoot, file);

    if (!fs.existsSync(filePath)) {
      continue;
    }

    const content = fs.readFileSync(filePath, 'utf-8');

    // Check if the file contains any "major" bumps
    if (MAJOR_BUMP_PATTERN.test(content)) {
      majorBumps.push(file);
    }
  }

  if (majorBumps.length > 0) {
    console.error('❌ Error: Major version bumps are not allowed in changesets.');
    console.error('\nThe following changeset files contain major bumps:');
    majorBumps.forEach((file) => {
      console.error(`  - ${file}`);
    });
    console.error('\nPlease update these changesets to use "minor" or "patch" instead of "major".');
    console.error('If you need a major version bump, please get explicit approval first.');
    process.exit(1);
  }

  console.log('✓ All changesets are valid (no major bumps found)');
}

checkChangesets();
