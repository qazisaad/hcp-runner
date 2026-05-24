# Architecture

## Repositories

The runner is intentionally structured as a standalone public project.

- `packages/hcp-protocol`: public protocol types and schemas
- `packages/hcp-runner`: local runner CLI and daemon
- `apps/mock-control-plane`: local test control plane for third-party validation

## Boundary

The runner connects outbound to a control plane. The browser and hosted app do not require inbound network access to the user's machine.

Provider executable paths, home directories, launch arguments, and persistent environment variables remain runner-local by default.

## MCP SDK Boundary

The runner should use the official Model Context Protocol TypeScript SDK for MCP protocol mechanics.

SDK responsibilities:

- Streamable HTTP client transport
- MCP client connection lifecycle
- tool discovery
- tool calls
- standard MCP protocol errors
- auth-provider hooks for request credentials
- MCP server primitives for mock servers and examples

Runner responsibilities:

- decide which MCP transports are allowed by HCP policy
- map HCP `McpServerAttachment` records into SDK clients
- enforce `allowed_tools` and `denied_tools`
- attach MCP servers only to workflow-launched harness sessions
- redact inputs, outputs, and headers before logging
- emit HCP MCP events
- close clients and remove temporary config at session end
- rely on the control plane for lease minting and revocation decisions

The SDK should sit behind a small runner-owned wrapper so SDK version changes do not leak into harness adapters.
