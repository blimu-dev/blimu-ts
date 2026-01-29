import type { Command } from 'commander';
import * as path from 'path';
import * as fs from 'fs';
import * as clack from '@clack/prompts';
import { generateTypeAugmentationFile } from '../utils/type-augmentation-generator';
import { log } from '../utils/logger';
import { findDefaultConfig, getRelativeImportPath } from '../utils/config-loader';

interface CodegenCommandOptions {
  config: string;
  output: string;
}

/**
 * Register the codegen command
 */
export function codegenCommand(program: Command): void {
  program
    .command('codegen')
    .description('Generate type augmentation file from Blimu config')
    .option(
      '--config <path>',
      'Path to Blimu config file (defaults to blimu.config.ts in project root)'
    )
    .option(
      '--output <path>',
      'Output path for generated type augmentation file (defaults to blimu-types.d.ts in project root)'
    )
    .action((options: CodegenCommandOptions) => {
      const spinner = clack.spinner();

      try {
        // Find config file
        const configPath = options.config || findDefaultConfig();
        if (!configPath) {
          clack.cancel(
            'No config file found. Please provide --config or ensure blimu.config.ts exists in project root.'
          );
          process.exit(1);
        }

        // Resolve to absolute path
        const absoluteConfigPath = path.isAbsolute(configPath)
          ? configPath
          : path.resolve(process.cwd(), configPath);

        if (!fs.existsSync(absoluteConfigPath)) {
          clack.cancel(`Config file not found: ${absoluteConfigPath}`);
          process.exit(1);
        }

        log.step(`Using config file: ${absoluteConfigPath}`);

        // Determine output path
        const outputPath = options.output
          ? path.isAbsolute(options.output)
            ? options.output
            : path.resolve(process.cwd(), options.output)
          : path.join(process.cwd(), 'blimu-types.d.ts');

        log.step(`Output: ${outputPath}`);

        // Calculate relative path from output to config for import statement
        const outputDir = path.dirname(outputPath);
        const relativeConfigPath = getRelativeImportPath(outputDir, absoluteConfigPath);

        // Generate type augmentation file
        spinner.start('Generating type augmentation file with type inference...');

        generateTypeAugmentationFile({
          configPath: relativeConfigPath,
          outputPath,
          // Always augment both @blimu/types and @blimu/backend
          // This is an internal implementation detail, not user-configurable
        });

        spinner.stop('⚡️ Successfully generated type augmentation file');

        log.success(`Generated at: ${outputPath}`);
        log.info('💡 Tip: Types are automatically inferred from your config.');
        log.info('   No regeneration needed when you update blimu.config.ts!');
      } catch (error) {
        spinner.stop('❌ Failed to generate type augmentation');
        log.error(
          `Failed to generate type augmentation: ${error instanceof Error ? error.message : String(error)}`
        );
        if (error instanceof Error && error.stack) {
          log.error(error.stack);
        }
        process.exit(1);
      }
    });
}
