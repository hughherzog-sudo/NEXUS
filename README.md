# NEXUS — AI Agent Command Center

Sci-fi operations dashboard for five business zones, each staffed by AI agents. Built with **React**, **TypeScript**, **Vite**, and **Phaser 3** for live isometric station renders.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Minimum layout width: **1440px**.

## Architecture

| Path | Purpose |
|------|---------|
| `src/data/mockState.ts` | Typed mock state (swap for API later) |
| `public/mockState.json` | JSON stub for backend integration |
| `src/phaser/drawRoom.ts` | Procedural isometric room + agent sprites |
| `src/components/ZonePanel.tsx` | Station bezel, status, Phaser viewport |
| `src/components/JarvisBar.tsx` | Command layer + text input |
| `src/hooks/useNexusState.ts` | State, expand/collapse, ambient ticks |

## Zones

1. **Media Station** (blue) — Script, Voiceover, Editor, Uploader  
2. **Reception Corp** (green) — Lead Finder, Outreach, Receptionist, Closer  
3. **Web Division** (purple) — Prospector, Builder, Delivery  
4. **Trade Desk** (amber) — Scanner, Signal, Executor, Risk  
5. **Kalshi Ops** (coral) — News Scanner, Scorer, Contract Placer  

Click any zone panel to expand agent details.

## Wiring a real backend

Replace `mockState` in `useNexusState.ts` with fetches to your API. Shape must match `NexusState` in `src/types/index.ts`. Call `updateZoneGame()` is already triggered when zone agent data changes.
