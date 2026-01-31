import type { Command } from 'commander';
import type { BlimuConfig } from '../config/schema';
import { BlimuConfigSchema } from '../config/schema';
import { log } from '../utils/logger';
import { findDefaultConfig, loadConfig } from '../utils/config-loader';
import { createPlatformApiClient } from '../utils/api-client';
import { createTaskRunner } from '../ui/task-runner.js';
import { getDefaultWorkspaceId } from '../auth/preferences';
import { shouldPrompt } from '../utils/interactive';
import { promptSelect, type SelectOption } from '../ui/prompts.js';
import type { BlimuCli } from '../api-sdk';

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
    .option('--workspace-id <id>', 'Workspace ID (prompts if not specified)')
    .option('--environment-id <id>', 'Environment ID (prompts if not specified)')
    .option('--platform-api-url <url>', 'Override Platform API base URL')
    .action(async (options: PushCommandOptions) => {
      try {
        // Step 1: Connect to API
        const connectRunner = await createTaskRunner();
        const connectGroup = connectRunner.group('Connecting to Blimu');

        let client: BlimuCli | undefined;
        await connectGroup.task('Authenticate', async (task) => {
          client = await createPlatformApiClient({
            ...(options.apiKey ? { apiKey: options.apiKey } : {}),
            ...(options.bearer ? { bearer: options.bearer } : {}),
            ...(options.platformApiUrl ? { platformApiUrl: options.platformApiUrl } : {}),
            requireAuth: true,
          });
          task.succeed('Connected');
        });

        if (!client) {
          connectGroup.error('Failed to connect to Blimu API');
          await connectRunner.wait();
          process.exit(1);
        }

        connectGroup.success('Ready');
        await connectRunner.wait();

        // Step 2: Get or prompt for workspace ID
        let workspaceId = options.workspaceId ?? getDefaultWorkspaceId();

        if (!workspaceId) {
          if (shouldPrompt()) {
            const { data: workspaces } = await client.workspaces.list();

            if (workspaces.length === 0) {
              log.error('No workspaces found. Please create a workspace first.');
              process.exit(1);
            }

            const workspaceChoices: SelectOption[] = workspaces.map(
              (ws: { id: string; name: string }) => ({
                label: ws.name,
                value: ws.id,
                description: `ID: ${ws.id}`,
              })
            );

            const selected = await promptSelect({
              title: 'Select a workspace:',
              choices: workspaceChoices,
            });

            if (!selected) {
              log.error('Workspace selection cancelled');
              process.exit(1);
            }

            workspaceId = selected;
          } else {
            log.error(
              'No workspace specified. Use --workspace-id <id> or run `blimu login` to set a default workspace.'
            );
            process.exit(1);
          }
        }

        // Step 3: Get or prompt for environment ID
        let environmentId = options.environmentId;

        if (!environmentId) {
          if (shouldPrompt()) {
            const { data: environments } = await client.environments.list(workspaceId);

            if (environments.length === 0) {
              log.error(
                'No environments found in this workspace. Please create an environment first.'
              );
              process.exit(1);
            }

            const envChoices: SelectOption[] = environments.map(
              (env: { id: string; name: string; variant: string }) => ({
                label: `${env.name} (${env.variant})`,
                value: env.id,
                description: `ID: ${env.id}`,
              })
            );

            const selected = await promptSelect({
              title: 'Select an environment:',
              choices: envChoices,
            });

            if (!selected) {
              log.error('Environment selection cancelled');
              process.exit(1);
            }

            environmentId = selected;
          } else {
            log.error('No environment specified. Use --environment-id <id>');
            process.exit(1);
          }
        }

        // Step 4: Find and load config file
        const configPath = options.config ?? findDefaultConfig();
        if (!configPath) {
          log.error(
            'No config file found. Please provide --config or ensure blimu.config.ts exists in project root.'
          );
          process.exit(1);
        }

        // Step 5: Push definitions (new runner for the actual push)
        const pushRunner = await createTaskRunner();
        const pushGroup = pushRunner.group('Pushing definitions');

        pushGroup.info(`Config: ${configPath}`);
        pushGroup.info(`Workspace: ${workspaceId}`);
        pushGroup.info(`Environment: ${environmentId}`);

        let config: BlimuConfig | undefined;

        await pushGroup.task('Load and validate config', async (task) => {
          task.update('Loading config file...');
          const rawConfig = await loadConfig(configPath);

          task.update('Validating schema...');
          const validationResult = BlimuConfigSchema.safeParse(rawConfig);
          if (!validationResult.success) {
            task.fail('Config validation failed');
            pushGroup.error('Config validation errors:');
            validationResult.error.issues.forEach((err) => {
              pushGroup.error(`  - ${err.path.join('.')}: ${err.message}`);
            });
            await pushRunner.wait();
            process.exit(1);
          }
          config = validationResult.data;
          task.succeed('Config validated');
        });

        await pushGroup.task('Push to environment', async (task) => {
          if (!client) throw new Error('Client is not connected');
          if (!config) throw new Error('Config is not loaded');

          await client.definitions.update(workspaceId, environmentId, {
            resources: config.resources,
            ...(config.entitlements ? { entitlements: config.entitlements } : {}),
            ...(config.features ? { features: config.features } : {}),
            ...(config.plans ? { plans: config.plans } : {}),
          });
          task.succeed('Pushed successfully');
        });

        pushGroup.success('Definitions updated');

        await pushRunner.wait();
      } catch (error) {
        log.error(
          `Failed to push definitions: ${error instanceof Error ? error.message : String(error)}`
        );
        if (error instanceof Error && error.stack) {
          console.error(error.stack);
        }
        process.exit(1);
      }
    });
}
