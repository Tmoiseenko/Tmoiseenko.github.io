# AGENTS.md — AI Coding Agent Guide

## Project Overview
Single-page developer portfolio built with **Vue 3 + Vite + TypeScript + Tailwind CSS v4**. All visible content is data-driven from one JSON file. No router, no state management, no sub-components — the entire UI lives in `src/App.vue`.

## Architecture
```
src/portfolio.json   ← single source of truth for all personal content
src/types.ts         ← TypeScript interfaces for portfolio.json shape
src/App.vue          ← entire UI (one file, all sections)
src/index.css        ← Tailwind v4 @theme tokens + animation helpers
src/main.ts          ← mounts #root
vite.config.ts       ← exposes GEMINI_API_KEY, HMR config
metadata.json        ← AI Studio app metadata
```

**To add/edit content** (name, bio, skills, projects, experience): edit `src/portfolio.json` only. Do **not** hardcode personal data in `App.vue`.

## Developer Workflows

```bash
npm install          # install dependencies
npm run dev          # dev server on http://localhost:3000 (bound to 0.0.0.0)
npm run build        # vue-tsc type check + vite build → /dist
npm run lint         # vue-tsc --noEmit (type check only, no tests exist)
npm run clean        # rm -rf dist server.js
```

`GEMINI_API_KEY` must be set in `.env.local` for Gemini AI features (see README).

## Styling Conventions

Tailwind CSS v4 is used — theme tokens are defined via `@theme` in `src/index.css`, **not** in a `tailwind.config.js` file.

Custom color tokens (use these, not raw hex):
| Token | Value |
|---|---|
| `bg-bg` | `#020617` (page background) |
| `bg-surface` | semi-transparent dark panel |
| `text-accent` / `border-accent` | `#22d3ee` (cyan) |
| `text-text-muted` | `#94a3b8` (slate-400) |

Custom animation pattern (defined in `index.css`):
```html
<div class="animate-in fade-in slide-in-from-bottom-4" :style="{ animationDelay: `${index * 100}ms` }">
```

Fonts: `font-sans` → Inter, `font-mono` → JetBrains Mono.

## Path Alias
`@` resolves to the **project root** (not `src/`):
```ts
import something from '@/src/...'  // ← correct
import something from '@/...'      // ← from root
```
Defined in both `vite.config.ts` and `tsconfig.json`.

## Data Schema (`src/types.ts`)
Key interfaces: `PortfolioData`, `Project`, `Skill`, `Experience`.
- `Skill.category` is typed as `"frontend" | "backend" | "tools" | "other"` — extend the union in `types.ts` if new categories are needed (e.g. `"cms"` is already used in `portfolio.json` but not in the type).
- `Project.tags[0]` is rendered as the project category label in the card header.

## External Integrations
- **@google/genai**: Gemini API key exposed at `process.env.GEMINI_API_KEY` (injected by Vite). Capability declared in `metadata.json` as `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API`.
- **express**: Listed as a dependency for a potential server-side proxy (`server.js` is referenced in the `clean` script but may not exist yet).
- **lucide-vue-next**: Icon components imported directly into `App.vue` (e.g. `Github`, `Mail`, `Terminal`).

## HMR / AI Studio Notes
`DISABLE_HMR=true` disables file watching and HMR — used in AI Studio to prevent flickering during agent edits. Do not remove this logic from `vite.config.ts`.

