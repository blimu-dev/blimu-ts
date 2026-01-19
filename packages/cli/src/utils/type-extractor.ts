import * as path from 'path';

/**
 * Extracted types from customer config
 */
export interface ExtractedTypes {
  resourceTypes?: string[];
  entitlementTypes?: string[];
  planTypes?: string[];
  limitTypes?: string[];
  usageLimitTypes?: string[];
}

/**
 * Customer config structure (from .blimu config files)
 */
export interface BlimuConfig {
  resources?: Record<string, unknown> | undefined;
  entitlements?: Record<string, unknown> | undefined;
  plans?: Record<string, PlanConfig> | undefined;
  features?: Record<string, unknown> | undefined;
}

export interface PlanConfig {
  name?: string;
  summary?: string;
  description?: string;
  resource_limits?: Record<string, number>;
  usage_based_limits?: Record<string, { value: number; period: string }>;
}

/**
 * Extract types from customer config file (TS or MJS)
 *
 * @param configPath - Path to the config file
 * @returns Extracted types
 */
export async function extractTypesFromConfig(configPath: string): Promise<ExtractedTypes> {
  const config = await loadConfigFile(configPath);
  return extractTypes(config);
}

/**
 * Load config file (supports TS and MJS)
 */
async function loadConfigFile(filePath: string): Promise<BlimuConfig> {
  const ext = path.extname(filePath);

  if (ext === '.mjs' || ext === '.js') {
    // Dynamic import for MJS/JS files
    const module = (await import(path.resolve(filePath))) as {
      default?: BlimuConfig | (() => Promise<BlimuConfig> | BlimuConfig);
      config?: BlimuConfig | (() => Promise<BlimuConfig> | BlimuConfig);
      [key: string]: unknown;
    };
    // Config should be exported as default or named export
    const configValue = module.default ?? module.config ?? module;
    const config: BlimuConfig | (() => Promise<BlimuConfig> | BlimuConfig) = configValue as
      | BlimuConfig
      | (() => Promise<BlimuConfig> | BlimuConfig);

    // If it's a function (factory), call it
    if (typeof config === 'function') {
      const result = await config();
      return result;
    }

    return config;
  } else if (ext === '.ts') {
    // For TS files, use tsx to load them
    // This requires tsx to be available
    try {
      // Use dynamic import with tsx loader
      const module = (await import(path.resolve(filePath))) as {
        default?: BlimuConfig | (() => Promise<BlimuConfig> | BlimuConfig);
        config?: BlimuConfig | (() => Promise<BlimuConfig> | BlimuConfig);
        [key: string]: unknown;
      };
      const configValue = module.default ?? module.config ?? module;
      const config: BlimuConfig | (() => Promise<BlimuConfig> | BlimuConfig) = configValue as
        | BlimuConfig
        | (() => Promise<BlimuConfig> | BlimuConfig);

      if (typeof config === 'function') {
        const result = await config();
        return result;
      }

      return config;
    } catch (error) {
      throw new Error(
        `Failed to load TypeScript config file. Make sure tsx is available or use .mjs instead. Error: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  } else {
    throw new Error(`Unsupported config file format: ${ext}. Supported: .mjs, .js, .ts`);
  }
}

/**
 * Extract types from config object
 */
function extractTypes(config: BlimuConfig): ExtractedTypes {
  const extracted: ExtractedTypes = {};

  // Extract resource types (keys from resources object)
  if (config.resources) {
    extracted.resourceTypes = Object.keys(config.resources);
  }

  // Extract entitlement types (keys from entitlements object)
  if (config.entitlements) {
    extracted.entitlementTypes = Object.keys(config.entitlements);
  }

  // Extract plan types (keys from plans object)
  if (config.plans) {
    extracted.planTypes = Object.keys(config.plans);
  }

  // Extract limit types from plans
  const limitTypes = new Set<string>();
  const usageLimitTypes = new Set<string>();

  if (config.plans) {
    for (const plan of Object.values(config.plans)) {
      // Resource limits
      if (plan.resource_limits) {
        for (const limitType of Object.keys(plan.resource_limits)) {
          limitTypes.add(limitType);
        }
      }

      // Usage-based limits
      if (plan.usage_based_limits) {
        for (const limitType of Object.keys(plan.usage_based_limits)) {
          usageLimitTypes.add(limitType);
        }
      }
    }
  }

  if (limitTypes.size > 0) {
    extracted.limitTypes = Array.from(limitTypes);
  }

  if (usageLimitTypes.size > 0) {
    extracted.usageLimitTypes = Array.from(usageLimitTypes);
  }

  return extracted;
}
