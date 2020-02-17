import { createStore, combine } from "effector";
import { $status } from "features/state-git";
import path from "path";

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
    const dirname = path.dirname(line.path);

    if (dirname && dirname !== ".") {
      memo.add(dirname.replace(scopeRoot, ""));
    }

    return memo;
  }, new Set());

  return Array.from(scopes.values());
});
