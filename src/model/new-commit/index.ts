import * as ef from "effector";
import { createSearch } from "lib/added-effector/search";
import { dirname } from "path";
import { createFormField } from "lib/added-effector/form-field";

import {
  $commitTypes,
  $commitScopeLength,
  $commitScopeRoot,
} from "../settings";
import { $unstagedFiles } from "../status-files";

const MAX_FIRST_LINE_LENGTH = 80;

const SEPARATOR_LENGTH = 2;

// Type
export const type = createSearch({
  defaultValue: "",
  list: $commitTypes,
  filter: (item, value) =>
    !!item.toLocaleLowerCase().match(value.toLocaleLowerCase()),
  map: (value) => ({ value }),
});

// BreakingChangesFlag
export const breakingChangesFlag = createFormField(false);

// Scope
const $scopePaths = ef
  .combine([$unstagedFiles, $commitScopeRoot, $commitScopeLength])
  .map(([files, scopeRoot, scopeLength]) => {
    const set = files.reduce<Set<string>>((memo, file) => {
      let calcPath = dirname(file.path)
        .replace(new RegExp(`^${scopeRoot}`, "g"), "")
        .split("/")
        .slice(0, scopeLength || 0)
        .join("/");

      memo.add(calcPath);

      return memo;
    }, new Set());

    return Array.from(set);
  });

export const scope = createSearch({
  defaultValue: "",
  list: $scopePaths,
  filter: (item, value) =>
    !!item.toLocaleLowerCase().match(value.toLocaleLowerCase()),
  map: (value) => ({ value }),
});

// Title
export const title = createFormField("", changeText);

export const $titleAddon = ef.combine(
  [type.$value, breakingChangesFlag.$value, scope.$value, title.$value],
  ([type, bchFlag, scope, title]) => ({
    current: title.length,
    total:
      MAX_FIRST_LINE_LENGTH -
      (SEPARATOR_LENGTH + type.length + scope.length + (bchFlag ? 1 : 0)),
  }),
);

// Body
export const body = createFormField("", changeText);

// Breaking Changes
export const breakingChanges = createFormField("", changeText);

function changeText(
  event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
) {
  return event.currentTarget.value;
}
