# blimu

Blimu - Authorization as a Service. This package provides the Blimu CLI tool for managing your authorization configuration and generating type-safe TypeScript types.

## Installation

```bash
npm install blimu
# or
yarn add blimu
# or
pnpm add blimu
```

## Usage

### Codegen Command

Generate type augmentation files from your Blimu configuration:

```bash
# Generate type augmentation with defaults
# Looks for .blimu/config.mjs or .blimu/config.ts in current directory
# Outputs to .blimu/blimu-types.d.ts
blimu codegen

# With custom config path
blimu codegen --config ./custom/path/config.mjs

# With custom output path
blimu codegen --output ./types/blimu-types.d.ts

# With custom SDK package
blimu codegen --sdk-package @blimu/custom-backend

# All options together
blimu codegen --config .blimu/config.mjs --output .blimu/blimu-types.d.ts --sdk-package @blimu/backend
```

#### Command Options

- `--config <path>`: Optional path to Blimu config file. If not provided, the CLI will look for `.blimu/config.mjs` or `.blimu/config.ts` in the current directory.
- `--output <path>`: Optional output path for the generated type augmentation file. Defaults to `.blimu/blimu-types.d.ts`.
- `--sdk-package <name>`: Optional SDK package name. Defaults to `@blimu/backend`.

#### Config File Format

The CLI looks for a Blimu configuration file in the `.blimu/` directory. The config file should export a default object with the following structure:

```javascript
// .blimu/config.mjs
export default {
  resources: {
    workspace: {},
    environment: {},
  },
  entitlements: {
    'workspace:read': {},
    'workspace:create': {},
  },
  plans: {
    free: {
      name: 'Free Plan',
      resource_limits: {
        workspace_count: 1,
      },
    },
    pro: {
      name: 'Pro Plan',
      resource_limits: {
        workspace_count: 10,
      },
    },
  },
};
```

The config file can be:

- `.mjs` (ES Module JavaScript)
- `.js` (JavaScript)
- `.ts` (TypeScript - requires tsx or ts-node)

#### Generated Type Augmentation

The `codegen` command generates a TypeScript declaration file that augments the `@blimu/backend` SDK with union types based on your configuration:

- `ResourceType`: Union of all resource types from your config
- `EntitlementType`: Union of all entitlement types from your config
- `PlanType`: Union of all plan types from your config
- `LimitType`: Union of all resource limit types from your plans
- `UsageLimitType`: Union of all usage-based limit types from your plans

This provides full type safety and autocomplete when using the Blimu SDK in your application.

## SDK Packages

For programmatic access to the Blimu API, use the following SDK packages:

- **`@blimu/backend`** - TypeScript SDK for Blimu Runtime API (resource management, roles, entitlements, usage tracking)
- **`@blimu/client`** - TypeScript SDK for Blimu Client API (authentication, session management)
- **`@blimu/nestjs`** - NestJS integration for Blimu

```bash
npm install @blimu/backend
# or
npm install @blimu/client
# or
npm install @blimu/nestjs
```

## Development

To build the CLI from source:

```bash
yarn build
# or
npm run build
```

To run the CLI in development mode:

```bash
yarn dev
# or
npm run dev
```

## Learn More

Visit [https://blimu.com](https://blimu.com) for documentation and more information.
