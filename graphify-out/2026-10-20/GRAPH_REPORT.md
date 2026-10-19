# Graph Report - ChoiceGuard  (2026-10-19)

## Corpus Check
- 20 files · ~118,859 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 107 nodes · 164 edges · 12 communities (9 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c93129be`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- index.ts
- package.json
- page.tsx
- compilerOptions
- dependencies
- RecallNotice
- include
- lib
- layout.tsx
- tsconfig.json
- next.config.js

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `UserHealthProfile` - 13 edges
3. `FoodProduct` - 10 edges
4. `RecallNotice` - 7 edges
5. `PantryItem` - 6 edges
6. `calculateChoiceScore()` - 5 edges
7. `include` - 5 edges
8. `scripts` - 4 edges
9. `lib` - 4 edges
10. `PantryLotTrackerProps` - 3 edges

## Surprising Connections (you probably didn't know these)
- `DailyBudgetProps` --references--> `UserHealthProfile`  [EXTRACTED]
  src/components/DailyBudgetRing.tsx → src/types/index.ts
- `NavbarProps` --references--> `UserHealthProfile`  [EXTRACTED]
  src/components/Navbar.tsx → src/types/index.ts
- `HealthProfileModalProps` --references--> `UserHealthProfile`  [EXTRACTED]
  src/components/HealthProfileModal.tsx → src/types/index.ts
- `NongChoiceChatDrawerProps` --references--> `FoodProduct`  [EXTRACTED]
  src/components/NongChoiceChatDrawer.tsx → src/types/index.ts
- `PantryLotTrackerProps` --references--> `PantryItem`  [EXTRACTED]
  src/components/PantryLotTracker.tsx → src/types/index.ts

## Import Cycles
- None detected.

## Communities (12 total, 3 thin omitted)

### Community 0 - "index.ts"
Cohesion: 0.20
Nodes (15): HealthProfileModal(), HealthProfileModalProps, NongChoiceChatDrawer(), NongChoiceChatDrawerProps, ScannerSection(), ScannerSectionProps, SmartSwapSection(), SmartSwapSectionProps (+7 more)

### Community 1 - "package.json"
Cohesion: 0.12
Nodes (16): devDependencies, @types/node, @types/react, @types/react-dom, typescript, name, private, scripts (+8 more)

### Community 2 - "page.tsx"
Cohesion: 0.16
Nodes (9): DailyBudgetProps, DailyBudgetRing(), Navbar(), NavbarProps, ProducerDashboard(), SettingsModal(), SettingsModalProps, FOOD_PRODUCTS (+1 more)

### Community 3 - "compilerOptions"
Cohesion: 0.13
Nodes (15): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, module, moduleResolution (+7 more)

### Community 4 - "dependencies"
Cohesion: 0.22
Nodes (9): lucide-react, next, dependencies, lucide-react, next, react, react-dom, react (+1 more)

### Community 5 - "RecallNotice"
Cohesion: 0.43
Nodes (6): PantryLotTracker(), PantryLotTrackerProps, RecallSimulatorModal(), RecallSimulatorModalProps, PantryItem, RecallNotice

### Community 6 - "include"
Cohesion: 0.40
Nodes (5): next-env.d.ts, .next/types/**/*.ts, **/*.ts, **/*.tsx, include

### Community 7 - "lib"
Cohesion: 0.50
Nodes (4): dom, dom.iterable, esnext, lib

## Knowledge Gaps
- **41 isolated node(s):** `nextConfig`, `name`, `version`, `private`, `dev` (+36 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `compilerOptions` connect `compilerOptions` to `tsconfig.json`, `lib`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **What connects `nextConfig`, `name`, `version` to the rest of the system?**
  _41 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._