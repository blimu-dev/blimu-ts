# blimu

Blimu - Authorization as a Service. This package provides the Blimu CLI tool for managing your authorization configuration.

## Installation

```bash
npm install blimu
# or
yarn add blimu
# or
pnpm add blimu
```

After installation, the Blimu CLI binary will be automatically downloaded and made available via the `blimu` command.

## Usage

Once installed, you can use the Blimu CLI to manage your authorization configuration:

```bash
# Validate your Blimu configuration
blimu validate ./blimu/

# Push configuration to an environment
blimu push ./blimu/ --workspace-id <workspace-id> --environment-id <environment-id>

# Pull configuration from an environment
blimu pull ./blimu/ --workspace-id <workspace-id> --environment-id <environment-id>
```

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

## Learn More

Visit [https://blimu.com](https://blimu.com) for documentation and more information.
