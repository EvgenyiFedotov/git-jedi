import { createStore, combine } from "effector";
import { $status } from "features/state-git";
import path from "path";
import { getScopePath } from "lib/scope-path";

export const $types = createStore<string[]>([
  "feat",
  "fix",
  "build",
  "chore",
  "ci",
  "docs",
  "style",
  "refactor",
  "test",
]);

export const $scopes = combine([$status], ([status]) => {
  // TODO Use config (scope-root)
  const scopeRoot = "src/";

  const scopes = status.reduce<Set<string>>((memo, line) => {
    const scopePath = getScopePath(line.path, scopeRoot);

    if (scopePath) {
      memo.add(scopePath);
    }

    return memo;
  }, new Set());

  return Array.from(scopes.values());
});
