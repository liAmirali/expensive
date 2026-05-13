# Expensive — Monorepo

## Structure
```
apps/client/   React + Vite + TanStack Router (SPA)
apps/server/   NestJS + Prisma (REST API)
```

## Tooling
- Package manager: **pnpm** (workspaces)
- Run both: `pnpm dev:server` / `pnpm dev:client` from root
- Lint: `eslint.config.mjs` at root

## Rules
- Never `npm install` or `yarn` — always `pnpm`
- Each app has its own `CLAUDE.md` with app-specific rules — read it before touching that app
- Shared types live in `packages/` (if added); don't cross-import between apps directly
