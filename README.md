# Blimu TypeScript SDK

Blimu is an authorization-as-a-service platform that provides unified access control, role-based permissions, and feature management for your applications. This TypeScript SDK allows you to integrate Blimu into your application and manage users, resources, roles, and entitlements programmatically.

## Installation

Install the TypeScript SDK:

```bash
npm install @blimu/backend
# or
yarn add @blimu/backend
```

The Blimu CLI binary is included with the package and will be available after installation. You can access it via:

```bash
npx blimu
```

## Getting Started

### Step 1: Authenticate with Blimu

First, authenticate with the Blimu CLI:

```bash
npx blimu auth login
```

This will open a browser window for OAuth authentication. After successful authentication, your credentials will be stored locally.

You can test your authentication:

```bash
npx blimu auth test
```

### Step 2: Create Your Configuration

Pull your configs from cloud

```bash
npx blimu pull
```

Create a `.blimu` directory in your project root and define your authorization schema using YAML files.

#### Required: `resources.yml`

Define your resources, roles, and relationships:

```yaml
resources:
  organization:
    roles: [guest, viewer, editor, billing, admin]

  workspace:
    roles: [admin, editor, viewer]
    roles_inheritance:
      editor: [organization->admin, organization->editor]
      viewer: [organization->billing]
    relations:
      organization:
        required: true

  project:
    roles: [owner, admin, editor, viewer]
    roles_inheritance:
      editor: [workspace->admin, workspace->editor]
      viewer: [workspace->viewer]
    relations:
      workspace:
        required: true
      organization:
        required: false
```

#### Optional: `entitlements.yml`

Define what actions are allowed based on roles and plans:

```yaml
entitlements:
  organization:create_workspace:
    roles: [admin]
    plans: ['pro', 'enterprise']

  workspace:delete:
    roles: [admin]

  project:deploy:
    roles: [owner, admin]
```

#### Optional: `features.yml`

Define features with metadata and plan scoping:

```yaml
features:
  workspace_management:
    name: 'Workspace Management'
    summary: 'Create and manage multiple workspaces'
    plans: [premium, enterprise]
    entitlements:
      - organization:create_workspace
      - workspace:delete

  advanced_analytics:
    name: 'Advanced Analytics'
    summary: 'Access to detailed analytics and reporting'
    plans: [enterprise]
```

#### Optional: `plans.yml`

Define available billing plans:

```yaml
plans:
  free:
    name: 'Free Plan'
    description: 'Perfect for getting started'

  premium:
    name: 'Premium Plan'
    description: 'For growing teams'

  enterprise:
    name: 'Enterprise Plan'
    description: 'For large organizations'
```

#### Optional: `sdk.yml`

Configure types generation. it will output a `blimu-types.d.ts` file:

```yaml
clients:
  - type: typescript-types
    outDir: '../src'
```

### Step 3: Push Your Configuration

Push your configuration to Blimu:

```bash
npx blimu push --workspace-id <workspace-id> --environment-id <environment-id>
```

The workspace ID and environment ID can be obtained from your Blimu dashboard. If you've configured your current environment, you can omit these flags:

```bash
npx blimu push
```

### Step 4: Generate Your SDK (Optional)

If you've configured `sdk.yml`, generate a custom SDK:

```bash
npx blimu generate --workspace-id <workspace-id> --environment-id <environment-id>
```

Or with your current environment:

```bash
npx blimu generate
```

## SDK Integration

### Initialize the Client

```typescript
import { Blimu } from '@blimu/backend';

const client = new Blimu({
  accessToken: process.env.BLIMU_API_TOKEN, // Your API token
});
```

You can also update the token dynamically:

```typescript
client.setAccessToken('new-token');
```

## SDK Usage Examples

### Users

#### Create a User

```typescript
import { Blimu, Schema } from '@blimu/backend';

const client = new Blimu({
  baseURL: 'https://api.blimu.dev',
  bearer: process.env.BLIMU_API_TOKEN,
});

const user = await client.users.create({
  email: 'user@example.com',
  lookupKey: 'user_123', // Unique identifier in your system
  firstName: 'John',
  lastName: 'Doe',
});

console.log('Created user:', user.id);
```

#### Get a User

```typescript
const user = await client.users.read('user_123');
console.log('User:', user.email, user.firstName, user.lastName);
```

#### List Users

```typescript
const userList = await client.users.list({
  limit: 10,
  page: 1,
});

console.log(`Found ${userList.total} users`);
userList.items.forEach((user) => {
  console.log(user.email);
});
```

#### Update a User

```typescript
const updatedUser = await client.users.update('user_123', {
  firstName: 'Jane',
  lastName: 'Smith',
  email: 'jane@example.com',
});
```

#### Delete a User

```typescript
await client.users.delete('user_123');
```

### Resources

#### Create a Resource

```typescript
// Create an organization
const organization = await client.resources.create('organization', {
  id: 'org_123',
  name: 'Acme Corp',
});

// Create a workspace with a parent organization
const workspace = await client.resources.create('workspace', {
  id: 'ws_456',
  name: 'Engineering Team',
  parents: [{ id: 'org_123', type: 'organization' }],
});

// Create a project with multiple parents
const project = await client.resources.create('project', {
  id: 'proj_789',
  name: 'Web App',
  parents: [
    { id: 'ws_456', type: 'workspace' },
    { id: 'org_123', type: 'organization' },
  ],
});
```

#### Create a Resource with Roles

You can assign roles to users when creating a resource:

```typescript
const workspace = await client.resources.create('workspace', {
  id: 'ws_456',
  name: 'Engineering Team',
  parents: [{ id: 'org_123', type: 'organization' }],
  roles: [
    { userId: 'user_123', role: 'admin' },
    { userId: 'user_456', role: 'editor' },
  ],
});
```

#### Get a Resource

```typescript
const resource = await client.resources.read('workspace', 'ws_456');
console.log('Resource:', resource.name);
console.log('Parents:', resource.parents);
```

#### List Resources

```typescript
const resources = await client.resources.list('workspace', {
  limit: 20,
  page: 1,
  search: 'Engineering', // Optional search query
});

resources.items.forEach((resource) => {
  console.log(`${resource.name} (${resource.id})`);
});
```

#### Update a Resource

```typescript
// Update resource name
await client.resources.update('workspace', 'ws_456', {
  name: 'Updated Workspace Name',
});

// Add parent relationships
await client.resources.update('workspace', 'ws_456', {
  parents: [
    { id: 'org_123', type: 'organization' },
    { id: 'org_456', type: 'organization' }, // Multiple parents
  ],
});
```

#### Delete a Resource

```typescript
await client.resources.delete('workspace', 'ws_456');
```

### Roles

#### Assign a Role to a User

```typescript
const role = await client.roles.create('user_123', {
  resourceType: 'workspace',
  resourceId: 'ws_456',
  role: 'admin',
});

console.log('Assigned role:', role.role, 'on', role.resourceType);
```

#### List User Roles

```typescript
// List all roles for a user
const roles = await client.roles.list('user_123', {
  limit: 10,
  page: 1,
});

// Filter by resource type
const workspaceRoles = await client.roles.list('user_123', {
  resourceType: 'workspace',
});

// Filter by specific resource
const specificRoles = await client.roles.list('user_123', {
  resourceType: 'workspace',
  resourceId: 'ws_456',
});

roles.roles.forEach((role) => {
  console.log(`${role.role} on ${role.resourceType}/${role.resourceId}`);
});
```

#### Remove a Role

```typescript
await client.roles.delete('user_123', 'workspace', 'ws_456');
```

#### Get Effective User Resources and Roles

Get all resources and roles for a user, including inherited roles:

```typescript
const effectiveRoles = await client.users.listEffectiveUserResourcesRoles('user_123');

effectiveRoles.forEach((item) => {
  console.log(
    `${item.role} on ${item.resource.type}/${item.resource.id}`,
    item.inherited ? '(inherited)' : '(direct)',
  );
});
```

### Entitlements

#### Check an Entitlement

Check if a user has a specific entitlement on a resource:

```typescript
const result = await client.entitlements.checkEntitlement({
  userId: 'user_123',
  entitlement: 'workspace:delete',
  resourceId: 'ws_456',
});

if (result.allowed) {
  console.log('User has permission to delete workspace');
} else {
  console.log('Permission denied:', result.reason);
  console.log('Required roles:', result.requiredRoles);
  console.log('User roles:', result.userRoles);
}
```

### Bulk Operations

#### Bulk Create Resources

```typescript
const result = await client.bulkResources.create('workspace', {
  resources: [
    {
      id: 'ws_1',
      name: 'Workspace 1',
      parents: [{ id: 'org_123', type: 'organization' }],
      roles: [{ userId: 'user_123', role: 'admin' }],
    },
    {
      id: 'ws_2',
      name: 'Workspace 2',
      parents: [{ id: 'org_123', type: 'organization' }],
    },
  ],
});

console.log(`Created ${result.summary.successful} resources`);
if (result.summary.failed > 0) {
  console.log(`Failed: ${result.summary.failed}`);
  result.errors.forEach((error) => {
    console.error(`Error at index ${error.index}: ${error.error}`);
  });
}
```

#### Bulk Create Roles

```typescript
const result = await client.bulkRoles.create({
  roles: [
    {
      userId: 'user_123',
      resourceType: 'workspace',
      resourceId: 'ws_456',
      role: 'admin',
    },
    {
      userId: 'user_456',
      resourceType: 'workspace',
      resourceId: 'ws_456',
      role: 'editor',
    },
  ],
});

console.log(`Created ${result.summary.successful} roles`);
```

## TypeScript Support

This SDK is written in TypeScript and provides full type safety:

```typescript
import { Blimu, Schema } from '@blimu/backend';

const client = new Blimu({
  baseURL: 'https://api.blimu.dev',
  bearer: process.env.BLIMU_API_TOKEN,
});

// All methods are fully typed
const user: Schema.User = await client.users.read('user_123');

// Request bodies are typed
const createBody: Schema.UserCreateBody = {
  email: 'user@example.com',
  lookupKey: 'user_123',
  firstName: 'John',
  lastName: 'Doe',
};

// Response types are inferred
const result = await client.users.create(createBody);
// result is typed as Schema.User
```

### Using Schema Types

All types are available under the `Schema` namespace:

```typescript
import { Schema } from '@blimu/backend';

// Use any model type
const user: Schema.User = {
  id: 'user_123',
  email: 'user@example.com',
  // ... other fields
};

const resource: Schema.Resource = {
  id: 'ws_456',
  type: 'workspace',
  name: 'My Workspace',
  // ... other fields
};

const entitlementCheck: Schema.EntitlementCheckBody = {
  userId: 'user_123',
  entitlement: 'workspace:delete',
  resourceId: 'ws_456',
};
```

## Error Handling

The SDK throws `ApiError` for API errors:

```typescript
import { Blimu, ApiError } from '@blimu/backend';

const client = new Blimu({
  baseURL: 'https://api.blimu.dev',
  bearer: process.env.BLIMU_API_TOKEN,
});

try {
  const user = await client.users.read('invalid_user_id');
} catch (error) {
  if (error instanceof ApiError) {
    console.error('API Error:', error.status, error.message);
    console.error('Response data:', error.data);
    console.error('Response headers:', error.headers);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## Node.js Usage

For Node.js environments, you may need to provide a fetch implementation:

```bash
npm install undici
```

```typescript
import { fetch } from 'undici';
import { Blimu } from '@blimu/backend';

const client = new Blimu({
  baseURL: 'https://api.blimu.dev',
  bearer: process.env.BLIMU_API_TOKEN,
  fetch,
});
```

## Available Services

### UsersService

- `create(body: UserCreateBody)` - Create a user
- `read(userId: string)` - Get a user by ID
- `update(userId: string, body: UserUpdateBody)` - Update a user
- `delete(userId: string)` - Delete a user
- `list(query?: UsersListQuery)` - List users
- `listEffectiveUserResourcesRoles(userId: string)` - List effective user resources and roles

### ResourcesService

- `create(resourceType: ResourceType, body: ResourceCreateBody)` - Create a resource
- `read(resourceType: ResourceType, resourceId: string)` - Read a resource
- `update(resourceType: ResourceType, resourceId: string, body: ResourceUpdateBody)` - Update a resource
- `delete(resourceType: ResourceType, resourceId: string)` - Delete a resource
- `list(resourceType: ResourceType, query?: ResourcesListQuery)` - List resources

### RolesService

- `create(userId: string, body: RoleCreateBody)` - Assign a role to a user on a resource
- `delete(userId: string, resourceType: ResourceType, resourceId: string)` - Remove a role
- `list(userId: string, query?: RolesListQuery)` - List user roles

### EntitlementsService

- `checkEntitlement(body: EntitlementCheckBody)` - Check if a user has a specific entitlement on a resource

### BulkResourcesService

- `create(resourceType: ResourceType, body: ResourceBulkCreateBody)` - Bulk create resources

### BulkRolesService

- `create(body: RoleBulkCreateBody)` - Bulk create roles

## Contributing

This SDK is auto-generated from the Blimu API specification. Please do not edit the generated files directly. If you find issues, please report them in the main project repository.

## License

This SDK is generated from the Blimu API specification.
