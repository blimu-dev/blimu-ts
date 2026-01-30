import type { Command } from 'commander';
import * as path from 'path';
import * as fs from 'fs';
import { generateTypeAugmentationFile } from '../utils/type-augmentation-generator';
import { findDefaultConfig, getRelativeImportPath } from '../utils/config-loader';
import { createTaskRunner } from '../ui/task-runner.js';

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
    .action(async (options: CodegenCommandOptions) => {
      const runner = await createTaskRunner();
      try {
        // Find config file
        const configPath = options.config || findDefaultConfig();
        if (!configPath) {
          runner.error(
            'No config file found. Please provide --config or ensure blimu.config.ts exists in project root.'
          );
          await runner.wait();
          process.exit(1);
        }

        // Resolve to absolute path
        const absoluteConfigPath = path.isAbsolute(configPath)
          ? configPath
          : path.resolve(process.cwd(), configPath);

        if (!fs.existsSync(absoluteConfigPath)) {
          runner.error(`Config file not found: ${absoluteConfigPath}`);
          await runner.wait();
          process.exit(1);
        }

        runner.info(`Using config file: ${absoluteConfigPath}`);

        // Determine output path
        const outputPath = options.output
          ? path.isAbsolute(options.output)
            ? options.output
            : path.resolve(process.cwd(), options.output)
          : path.join(process.cwd(), 'blimu-types.d.ts');

        runner.info(`Output: ${outputPath}`);

        const codegenGroup = runner.group('Generating type augmentation');

        await codegenGroup.task('Generate types', (task) => {
          // Calculate relative path from output to config for import statement
          const outputDir = path.dirname(outputPath);
          const relativeConfigPath = getRelativeImportPath(outputDir, absoluteConfigPath);

          task.update('Generating type augmentation file with type inference...');

          generateTypeAugmentationFile({
            configPath: relativeConfigPath,
            outputPath,
            // Always augment both @blimu/types and @blimu/backend
            // This is an internal implementation detail, not user-configurable
          });

          task.succeed('Type augmentation file generated');
        });

        runner.success(`Generated at: ${outputPath}`);
        runner.info('💡 Tip: Types are automatically inferred from your config.');
        runner.info('   No regeneration needed when you update blimu.config.ts!');

        await runner.wait();
      } catch (error) {
        runner.error(
          `Failed to generate type augmentation: ${error instanceof Error ? error.message : String(error)}`
        );
        if (error instanceof Error && error.stack) {
          runner.error(error.stack);
        }
        await runner.wait();
        process.exit(1);
      }
    });
}
