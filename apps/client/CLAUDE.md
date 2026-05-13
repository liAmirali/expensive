# Client App

React 19 + Vite + TanStack Router + Tailwind v4. Persian-language (RTL) expense-splitting SPA.

## Stack
- **Routing**: TanStack Router (file-based, `src/routes/`). Route tree auto-generated — never edit `routeTree.gen.ts`
- **Styling**: Tailwind v4
- **UI components**: shadcn (base) extended with app-specific variants
- **State**: Zustand stores in `src/store/`
- **Path alias**: `@/` → `src/`

## Component Layers
```
src/components/ui/         atoms — pure, no router/store deps (Button, Card, Input, Chip, …)
src/components/composite/  app-aware — may use router or compose atoms (BottomNav, TopBar, EmptyState)
src/components/layout/     AppShell
src/components/views/      page-level views — typed props only, no data fetching
src/routes/                containers — data + state → pass typed props to views
```

**Never** put inline UI logic in route files. Routes fetch/prepare data, views render it.

## Design System


## ESLint Rules to Know
- `react-refresh/only-export-components` — a file with a component must **only** export components. Move shared constants/functions/types to a separate `.ts` file.

## Numerals
Persian numerals util at `src/utils/numerals.ts` — use `toFarsi()` for user-facing numbers, `formatToman()` for amounts.

# Rules
- Alway keep the Container/Presentational pattern. Keep presentational components dumb. Control them with props.
- Use `rounded-card` syntax, NOT `rounded-[var(--radius-card)]` or `rounded-(--radius-card)`
- The app has dir="rtl" on html. Use semantic properties like start and end, instead of left and right to better handle RTL and LTR.
- Every UI atomic component will go under the src/components directory
- Every UI atomic component must have a storybook