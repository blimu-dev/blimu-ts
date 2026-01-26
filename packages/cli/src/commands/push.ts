import type { Command } from 'commander';
import * as clack from '@clack/prompts';
import { BlimuConfigSchema } from '../config/schema';
import { findDefaultConfig, loadConfig } from '../utils/config-loader';
import { createPlatformApiClient } from '../utils/api-client';

interface PushCommandOptions {
  config?: string;
  workspaceId?: string;
  environmentId?: string;
  platformApiUrl?: string;
  apiKey?: string;
  bearer?: string;
}

/**
 * Register the push command
 */
export function pushCommand(program: Command): void {
  program
    .command('push')
    .description('Push definitions to Blimu API')
    .option(
      '--config <path>',
      'Path to Blimu config file (defaults to blimu.config.ts in project root)'
    )
    .option('--workspace-id <id>', 'Workspace ID (required)')
    .option('--environment-id <id>', 'Environment ID (required)')
    .option('--platform-api-url <url>', 'Override Platform API base URL')
    .action(async (options: PushCommandOptions) => {
      const spinner = clack.spinner();

      try {
        // Validate required options
        if (!options.workspaceId) {
          clack.cancel('Workspace ID is required. Use --workspace-id <id>');
          process.exit(1);
        }

        if (!options.environmentId) {
          clack.cancel('Environment ID is required. Use --environment-id <id>');
          process.exit(1);
        }

        // Create authenticated API client
        let client;
        try {
          spinner.start('Connecting to Blimu API...');
          client = await createPlatformApiClient({
            ...(options.apiKey ? { apiKey: options.apiKey } : {}),
            ...(options.bearer ? { bearer: options.bearer } : {}),
            ...(options.platformApiUrl ? { platformApiUrl: options.platformApiUrl } : {}),
            requireAuth: true,
            spinner,
          });
          spinner.stop('✓ Connected');
        } catch (error) {
          spinner.stop('❌ Failed to connect');
          clack.cancel(error instanceof Error ? error.message : String(error));
          process.exit(1);
        }

        // Find and load config file
        const configPath = options.config ?? findDefaultConfig();
        if (!configPath) {
          clack.cancel(
            'No config file found. Please provide --config or ensure blimu.config.ts exists in project root.'
          );
          process.exit(1);
        }

        clack.log.step(`Loading config from: ${configPath}`);

        spinner.start('Loading and validating config file...');
        const rawConfig = await loadConfig(configPath);
        spinner.stop('✓ Config loaded');

        // Validate config structure
        spinner.start('Validating config structure...');
        const validationResult = BlimuConfigSchema.safeParse(rawConfig);
        if (!validationResult.success) {
          spinner.stop('❌ Config validation failed');
          clack.log.error('Config validation errors:');
          validationResult.error.issues.forEach((err) => {
            clack.log.error(`  - ${err.path.join('.')}: ${err.message}`);
          });
          process.exit(1);
        }
        const config = validationResult.data;
        spinner.stop('✓ Config validated');

        // Push definitions
        spinner.start('Pushing definitions to Blimu...');
        await client.definitions.update(options.workspaceId, options.environmentId, {
          resources: config.resources,
          ...(config.entitlements ? { entitlements: config.entitlements } : {}),
          ...(config.features ? { features: config.features } : {}),
          ...(config.plans ? { plans: config.plans } : {}),
        });
        spinner.stop('✓ Definitions pushed successfully');

        clack.log.success(
          `Successfully pushed definitions to workspace ${options.workspaceId}, environment ${options.environmentId}`
        );
      } catch (error) {
        spinner.stop('❌ Failed to push definitions');
        clack.log.error(
          `Failed to push definitions: ${error instanceof Error ? error.message : String(error)}`
        );
        if (error instanceof Error && error.stack) {
          clack.log.error(error.stack);
        }
        process.exit(1);
      }
    });
}
