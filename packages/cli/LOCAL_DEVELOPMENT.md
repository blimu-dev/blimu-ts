# Local Development Testing Guide

This guide explains how to test the CLI against local development servers.

## Local Development URLs

The CLI is configured to use the following URLs for local development:

- **Platform API**: `https://platform-api.dev-blimu.dev`
- **Runtime API**: `https://runtime-api.dev-blimu.dev`

These URLs are automatically used when the environment is set to `local-dev`.

## Setting Up Local Development

### Option 1: Using RC Config File (Recommended)

Create or edit `~/.blimurc.json` (or `~/.config/blimu/config.json` on Linux):

```json
{
  "blimuInternalEnvironment": "local-dev"
}
```

This will automatically use the local development URLs for all CLI commands.

### Option 2: Using CLI Flags

You can override the environment and URLs per command:

```bash
# Login with local-dev environment
blimu login --exec-env local-dev

# Push with local URLs
blimu push \
  --workspace-id <workspace-id> \
  --environment-id <environment-id> \
  --runtime-api-url https://runtime-api.dev-blimu.dev \
  --platform-api-url https://platform-api.dev-blimu.dev
```

### Option 3: Environment Variable (Future)

You can also set the environment in your shell:

```bash
export BLIMU_ENVIRONMENT=local-dev
```

## Testing the CLI

### 1. Build the CLI

```bash
cd packages/cli
yarn build
```

### 2. Login to Local Development

```bash
# If you have RC config set to local-dev
blimu login

# Or explicitly specify
blimu login --exec-env local-dev
```

### 3. Test Push Command

```bash
# Create a test config file
cat > blimu.config.json << EOF
{
  "resources": {
    "workspace": {
      "roles": ["admin", "editor", "viewer"],
      "is_tenant": true
    }
  }
}
EOF

# Push to local development
blimu push \
  --workspace-id <your-workspace-id> \
  --environment-id <your-environment-id> \
  --config blimu.config.json
```

### 4. Verify URLs Are Correct

The CLI will automatically use:

- `https://runtime-api.dev-blimu.dev` for OAuth/token operations
- `https://platform-api.dev-blimu.dev` for platform API operations

when `blimuInternalEnvironment` is set to `local-dev`.

## Environment Mapping

| Environment  | Platform API                         | Runtime API                         |
| ------------ | ------------------------------------ | ----------------------------------- |
| `local-dev`  | `https://platform-api.dev-blimu.dev` | `https://runtime-api.dev-blimu.dev` |
| `local-prod` | `https://platform.blimu.dev`         | `https://runtime.blimu.dev`         |
| `cloud-dev`  | `https://platform.blimu.dev`         | `https://runtime.blimu.dev`         |
| `cloud-prod` | `https://platform.blimu.dev`         | `https://runtime.blimu.dev`         |

## Troubleshooting

### URLs Not Updating

If the URLs aren't updating, check:

1. **RC Config File**: Ensure `~/.blimurc.json` has `"blimuInternalEnvironment": "local-dev"`
2. **Credentials**: After changing environment, you may need to login again:
   ```bash
   blimu login --exec-env local-dev
   ```
3. **CLI Flags**: Use `--runtime-api-url` and `--platform-api-url` to override

### Client ID Errors

If you see "Client ID not configured", you need to update `packages/cli/src/config/client-ids.ts` with the actual OAuth client ID for `local-dev` environment.
