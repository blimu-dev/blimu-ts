import * as fs from 'fs';
import * as path from 'path';

/**
 * Options for generating type augmentation file
 */
export interface GenerateTypeAugmentationOptions {
  /** Path to the config file (relative to output directory or absolute) */
  configPath: string;
  /** Output path for the generated type augmentation file */
  outputPath: string;
  /** Types package names to augment (defaults to ['@blimu/types', '@blimu/backend']) */
  typesPackages?: string[];
}

/**
 * Generate type augmentation file for @blimu/types and @blimu/backend using type inference utilities.
 *
 * This generates a .d.ts file that imports the config and uses type inference
 * utilities to automatically extract types from the config structure.
 *
 * @param options - Generation options
 */
export function generateTypeAugmentationFile(options: GenerateTypeAugmentationOptions): void {
  const { configPath, outputPath, typesPackages = ['@blimu/types', '@blimu/backend'] } = options;

  const lines: string[] = [];

  // Header
  const packageNames = typesPackages.join(' and ');
  lines.push('/**');
  lines.push(` * Type Augmentation for ${packageNames}`);
  lines.push(' *');
  lines.push(` * This file augments the ${packageNames} packages with union types`);
  lines.push(' * specific to your environment configuration.');
  lines.push(' *');
  lines.push(' * Types are automatically inferred from your blimu.config.ts file.');
  lines.push(' * No regeneration needed when you update your config!');
  lines.push(' *');
  lines.push(' * Make sure to include this file in your tsconfig.json:');
  lines.push(' * {');
  lines.push(' *   "include": ["blimu-types.d.ts"]');
  lines.push(' * }');
  lines.push(' */');
  lines.push('');

  // Calculate output directory and relative import path
  const outputDir = path.dirname(outputPath);
  const resolvedConfigPath = path.isAbsolute(configPath)
    ? path.resolve(configPath)
    : path.resolve(outputDir, configPath);
  const relativeConfigPath = path.relative(outputDir, resolvedConfigPath);
  // Remove .ts/.mjs/.js extension and ensure it starts with ./
  const importPath = relativeConfigPath.replace(/\.(ts|mjs|js)$/, '');
  const finalImportPath = importPath.startsWith('.') ? importPath : `./${importPath}`;

  // Import config and type utilities
  lines.push(`import type config from '${finalImportPath}';`);
  lines.push('import type {');
  lines.push('  InferResourceTypes,');
  lines.push('  InferEntitlementTypes,');
  lines.push('  InferPlanTypes,');
  lines.push('  InferLimitTypes,');
  lines.push('  InferUsageLimitTypes,');
  lines.push("} from 'blimu';");
  lines.push('');

  // Generate module augmentation for each package
  for (const typesPackage of typesPackages) {
    lines.push(`declare module '${typesPackage}' {`);
    lines.push('  /**');
    lines.push('   * Resource types inferred from your Blimu configuration.');
    lines.push('   */');
    lines.push('  type ResourceType = InferResourceTypes<typeof config>;');
    lines.push('');
    lines.push('  /**');
    lines.push('   * Entitlement types inferred from your Blimu configuration.');
    lines.push('   */');
    lines.push('  type EntitlementType = InferEntitlementTypes<typeof config>;');
    lines.push('');
    lines.push('  /**');
    lines.push('   * Plan types inferred from your Blimu configuration.');
    lines.push('   */');
    lines.push('  type PlanType = InferPlanTypes<typeof config>;');
    lines.push('');
    lines.push('  /**');
    lines.push('   * Limit types inferred from your Blimu configuration.');
    lines.push('   */');
    lines.push('  type LimitType = InferLimitTypes<typeof config>;');
    lines.push('');
    lines.push('  /**');
    lines.push('   * Usage limit types inferred from your Blimu configuration.');
    lines.push('   */');
    lines.push('  type UsageLimitType = InferUsageLimitTypes<typeof config>;');
    lines.push('}');
    lines.push('');
  }

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write file
  fs.writeFileSync(outputPath, lines.join('\n'), 'utf-8');
}
