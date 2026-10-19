# Graph Report - ChoiceGuard  (2026-10-20)

## Corpus Check
- 21 files · ~121,920 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 117 nodes · 174 edges · 12 communities (8 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `803f4630`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- UserHealthProfile
- devDependencies
- page.tsx
- compilerOptions
- package.json
- HealthProfileModal.tsx
- include
- tailwind.config.ts
- layout.tsx
- next.config.js
- route.ts

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `UserHealthProfile` - 15 edges
3. `FoodProduct` - 10 edges
4. `RecallNotice` - 7 edges
5. `PantryItem` - 6 edges
6. `calculateChoiceScore()` - 5 edges
7. `include` - 5 edges
8. `scripts` - 4 edges
9. `lib` - 4 edges
10. `NongChoiceChatDrawerProps` - 3 edges

## Surprising Connections (you probably didn't know these)
- `DailyBudgetProps` --references--> `UserHealthProfile`  [EXTRACTED]
  src/components/DailyBudgetRing.tsx → src/types/index.ts
- `HealthProfileModalProps` --references--> `UserHealthProfile`  [EXTRACTED]
  src/components/HealthProfileModal.tsx → src/types/index.ts
- `NavbarProps` --references--> `UserHealthProfile`  [EXTRACTED]
  src/components/Navbar.tsx → src/types/index.ts
- `NongChoiceChatDrawerProps` --references--> `FoodProduct`  [EXTRACTED]
  src/components/NongChoiceChatDrawer.tsx → src/types/index.ts
- `NongChoiceChatDrawerProps` --references--> `UserHealthProfile`  [EXTRACTED]
  src/components/NongChoiceChatDrawer.tsx → src/types/index.ts

## Import Cycles
- None detected.

## Communities (12 total, 4 thin omitted)

### Community 0 - "UserHealthProfile"
Cohesion: 0.29
Nodes (11): NongChoiceChatDrawer(), NongChoiceChatDrawerProps, ScannerSection(), ScannerSectionProps, SmartSwapSection(), SmartSwapSectionProps, calculateChoiceScore(), ScoreBreakdown (+3 more)

### Community 1 - "devDependencies"
Cohesion: 0.13
Nodes (15): autoprefixer, devDependencies, autoprefixer, postcss, tailwindcss, @types/node, @types/react, @types/react-dom (+7 more)

### Community 2 - "page.tsx"
Cohesion: 0.15
Nodes (17): DailyBudgetProps, DailyBudgetRing(), Navbar(), NavbarProps, MOCK_FSMA_CTE_EVENTS, PantryLotTracker(), PantryLotTrackerProps, ProducerDashboard() (+9 more)

### Community 3 - "compilerOptions"
Cohesion: 0.11
Nodes (19): dom, dom.iterable, esnext, compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules (+11 more)

### Community 4 - "package.json"
Cohesion: 0.12
Nodes (16): lucide-react, next, dependencies, lucide-react, next, react, react-dom, name (+8 more)

### Community 5 - "HealthProfileModal.tsx"
Cohesion: 0.50
Nodes (3): HealthProfileModal(), HealthProfileModalProps, HealthCondition

### Community 6 - "include"
Cohesion: 0.25
Nodes (7): next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx, exclude, include

## Knowledge Gaps
- **47 isolated node(s):** `nextConfig`, `name`, `version`, `private`, `dev` (+42 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Why does `compilerOptions` connect `compilerOptions` to `include`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **What connects `nextConfig`, `name`, `version` to the rest of the system?**
  _47 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
- **Should `page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1452991452991453 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._