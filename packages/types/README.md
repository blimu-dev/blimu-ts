# @blimu/types

TypeScript type definitions for Blimu simple types.

## Overview

This package provides base type definitions for Blimu's simple types (ResourceType, EntitlementType, PlanType, etc.). These types are augmented by customer configuration via the `blimu codegen` command, which generates union types based on your Blimu configuration.

## Installation

```bash
npm install @blimu/types
# or
yarn add @blimu/types
# or
pnpm add @blimu/types
```

## Usage

After running `blimu codegen` in your project, the types in this package will be augmented with union types based on your configuration:

```typescript
import type { ResourceType, EntitlementType } from '@blimu/types';

// After codegen, ResourceType might be:
// type ResourceType = 'organization' | 'workspace' | 'project';

// EntitlementType might be:
// type EntitlementType = 'organization:create_workspace' | 'workspace:delete';
```

## Types

- **ResourceType**: Resource type identifiers
- **EntitlementType**: Entitlement type identifiers
- **PlanType**: Plan type identifiers
- **LimitType**: Resource-based limit type identifiers
- **UsageLimitType**: Usage-based limit type identifiers

## Type Augmentation

To augment these types with your configuration:

1. Create a Blimu config file (`.blimu/config.mjs` or `.blimu/config.ts`)
2. Run `blimu codegen`
3. The generated `.blimu/blimu-types.d.ts` file will augment these types

## Learn More

Visit [https://blimu.com](https://blimu.com) for documentation and more information.
