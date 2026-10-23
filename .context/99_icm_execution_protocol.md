# 99 ICM Execution & Verification Protocol

## 1. Ground Rules
1. **Zero Phantoms**: Never reference or import unbuilt libraries or fake dependencies.
2. **Surgical Diffs**: Modify only the code directly requested.
3. **Verify Before Finish**: Run tests (`npm test`) and type checks before reporting tasks complete.

## 2. Dynamic Option & Dependency Invariant
When implementing dependent filtering (e.g. Department -> Program -> Course):
* The parent selector change must reset child state.
* The dependent selector must show loading, empty, and error states gracefully.
* Reusable logic must be encapsulated in `useDependentOptions` or `dependent-select.tsx`.

## 3. Knowledge Graph Maintenance
Whenever a major feature or new domain slice is added:
* Run `npm run graph` (`graphify update . --no-cluster`) to keep `graphify-out/graph.json` in sync.
