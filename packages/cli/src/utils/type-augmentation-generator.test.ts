import { describe, expect, it } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { generateTypeAugmentationFile } from './type-augmentation-generator';

describe('generateTypeAugmentationFile', () => {
  it('should generate type augmentation file with correct imports', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'blimu-test-'));
    const outputPath = path.join(tempDir, 'blimu-types.d.ts');
    const configPath = './blimu.config';

    try {
      generateTypeAugmentationFile({
        configPath,
        outputPath,
      });

      const content = fs.readFileSync(outputPath, 'utf-8');

      // Check for config import
      expect(content).toContain(`import type config from '${configPath}';`);

      // Check for type utility imports
      expect(content).toContain('InferResourceTypes');
      expect(content).toContain('InferEntitlementTypes');
      expect(content).toContain('InferPlanTypes');
      expect(content).toContain('InferLimitTypes');
      expect(content).toContain('InferUsageLimitTypes');

      // Check for module augmentation for both default packages
      expect(content).toContain("declare module '@blimu/types' {");
      expect(content).toContain("declare module '@blimu/backend' {");

      // Check for type definitions (should appear twice, once per package)
      const resourceTypeMatches = content.match(
        /type ResourceType = InferResourceTypes<typeof config>;/g
      );
      expect(resourceTypeMatches).toHaveLength(2);
      expect(content).toContain('type EntitlementType = InferEntitlementTypes<typeof config>;');
      expect(content).toContain('type PlanType = InferPlanTypes<typeof config>;');
      expect(content).toContain('type LimitType = InferLimitTypes<typeof config>;');
      expect(content).toContain('type UsageLimitType = InferUsageLimitTypes<typeof config>;');

      // Check for documentation comments
      expect(content).toContain('Type Augmentation for @blimu/types and @blimu/backend');
      expect(content).toContain('No regeneration needed when you update your config!');
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('should use custom types packages', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'blimu-test-'));
    const outputPath = path.join(tempDir, 'blimu-types.d.ts');
    const customPackages = ['@custom/types', '@custom/backend'];

    try {
      generateTypeAugmentationFile({
        configPath: './blimu.config',
        outputPath,
        typesPackages: customPackages,
      });

      const content = fs.readFileSync(outputPath, 'utf-8');
      expect(content).toContain(`declare module '${customPackages[0]}' {`);
      expect(content).toContain(`declare module '${customPackages[1]}' {`);
      expect(content).toContain('Type Augmentation for @custom/types and @custom/backend');
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('should create output directory if it does not exist', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'blimu-test-'));
    const nestedDir = path.join(tempDir, 'nested', 'deep', 'path');
    const outputPath = path.join(nestedDir, 'blimu-types.d.ts');

    try {
      generateTypeAugmentationFile({
        configPath: './blimu.config',
        outputPath,
      });

      expect(fs.existsSync(outputPath)).toBe(true);
      const content = fs.readFileSync(outputPath, 'utf-8');
      expect(content).toContain('declare module');
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('should handle absolute config paths correctly', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'blimu-test-'));
    const outputPath = path.join(tempDir, 'blimu-types.d.ts');
    const configPath = path.join(tempDir, 'blimu.config.ts');

    try {
      generateTypeAugmentationFile({
        configPath,
        outputPath,
      });

      const content = fs.readFileSync(outputPath, 'utf-8');
      // Should use relative path in import (same directory)
      expect(content).toContain("import type config from './blimu.config';");
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('should handle nested config paths correctly', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'blimu-test-'));
    const outputPath = path.join(tempDir, 'src', 'blimu-types.d.ts');
    const configPath = path.join(tempDir, 'blimu.config.ts');

    try {
      generateTypeAugmentationFile({
        configPath,
        outputPath,
      });

      const content = fs.readFileSync(outputPath, 'utf-8');
      // Should use relative path going up one directory
      expect(content).toContain("import type config from '../blimu.config';");
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });
});
