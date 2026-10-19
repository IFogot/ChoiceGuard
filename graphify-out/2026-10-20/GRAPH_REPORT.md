# Graph Report - ChoiceGuard  (2026-10-20)

## Corpus Check
- 22 files · ~119,030 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 116 nodes · 171 edges · 12 communities (8 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e83b5531`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- UserHealthProfile
- devDependencies
- page.tsx
- compilerOptions
- package.json
- HealthProfileModal.tsx
- SettingsModal.tsx
- tailwind.config.ts
- layout.tsx
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
- `HealthProfileModalProps` --references--> `UserHealthProfile`  [EXTRACTED]
  src/components/HealthProfileModal.tsx → src/types/index.ts
- `NongChoiceChatDrawerProps` --references--> `FoodProduct`  [EXTRACTED]
  src/components/NongChoiceChatDrawer.tsx → src/types/index.ts
- `DailyBudgetProps` --references--> `UserHealthProfile`  [EXTRACTED]
  src/components/DailyBudgetRing.tsx → src/types/index.ts
- `NavbarProps` --references--> `UserHealthProfile`  [EXTRACTED]
  src/components/Navbar.tsx → src/types/index.ts
- `PantryLotTrackerProps` --references--> `PantryItem`  [EXTRACTED]
  src/components/PantryLotTracker.tsx → src/types/index.ts

## Import Cycles
- None detected.

## Communities (12 total, 4 thin omitted)

### Community 0 - "UserHealthProfile"
Cohesion: 0.23
Nodes (12): DailyBudgetProps, DailyBudgetRing(), Navbar(), NavbarProps, ScannerSection(), ScannerSectionProps, SmartSwapSection(), SmartSwapSectionProps (+4 more)

### Community 1 - "devDependencies"
Cohesion: 0.13
Nodes (15): autoprefixer, devDependencies, autoprefixer, postcss, tailwindcss, @types/node, @types/react, @types/react-dom (+7 more)

### Community 2 - "page.tsx"
Cohesion: 0.19
Nodes (13): NongChoiceChatDrawer(), NongChoiceChatDrawerProps, PantryLotTracker(), PantryLotTrackerProps, ProducerDashboard(), RecallSimulatorModal(), RecallSimulatorModalProps, FOOD_PRODUCTS (+5 more)

### Community 3 - "compilerOptions"
Cohesion: 0.07
Nodes (26): dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx (+18 more)

### Community 4 - "package.json"
Cohesion: 0.12
Nodes (16): lucide-react, next, dependencies, lucide-react, next, react, react-dom, name (+8 more)

### Community 5 - "HealthProfileModal.tsx"
Cohesion: 0.50
Nodes (3): HealthProfileModal(), HealthProfileModalProps, HealthCondition

## Knowledge Gaps
- **45 isolated node(s):** `nextConfig`, `name`, `version`, `private`, `dev` (+40 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **What connects `nextConfig`, `name`, `version` to the rest of the system?**
  _45 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.07407407407407407 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._