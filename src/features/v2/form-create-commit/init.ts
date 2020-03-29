import * as ef from "effector";
import { $commitTypes } from "features/v2/settings/model";
import { $status } from "features/v2/status/model";
import {
  $commitScopeRoot,
  $commitScopeLength,
} from "features/v2/settings/model";
import * as path from "path";

import * as model from "./model";

// Filter types
const filteredCommitTypes = ef
  .combine([$commitTypes, model.types.$search])
  .map(([commitTypes, search]) => {
    return commitTypes
      .filter((item) =>
        item.toLocaleLowerCase().match(search.toLocaleLowerCase()),
      )
      .map((item) => ({ value: item }));
  });

ef.sample({
  source: filteredCommitTypes,
  clock: filteredCommitTypes,
  target: model.types.setOptions,
});

// Filter scope
const filteredScope = ef
  .combine([
    $status,
    $commitScopeRoot,
    $commitScopeLength,
    model.scopes.$search,
  ])
  .map(([status, scopeRoot, scopeLength, search]) => {
    return status.reduce<Set<string>>((memo, statusFile) => {
      let calcPath = path
        .dirname(statusFile.path)
        .replace(new RegExp(`^${scopeRoot}`, "g"), "")
        .split("/")
        .slice(0, scopeLength || 0)
        .join("/");

      if (calcPath.toLocaleLowerCase().match(search.toLocaleLowerCase())) {
        memo.add(calcPath);
      }

      return memo;
    }, new Set());
  })
  .map((scopes) => Array.from(scopes).map((value) => ({ value })));

ef.sample({
  source: filteredScope,
  clock: filteredScope,
  target: model.scopes.setOptions,
});

// Auto show and change body
const autoShowBody = ef.guard({
  source: model.$countTitleLetters,
  filter: ({ current, total }) => current > total,
});

const autoSetBody = ef.sample({
  source: model.$title,
  clock: autoShowBody,
  fn: (title) => title.split(" ").pop() || "",
});

ef.forward({
  from: autoSetBody,
  to: model.$body,
});

ef.sample({
  source: model.$title,
  clock: autoSetBody,
  fn: (title) => {
    const titleArr = title.split(" ");

    titleArr.pop();

    return titleArr.join(" ");
  },
  target: model.$title,
});

ef.forward({
  from: autoShowBody,
  to: model.visibleBody.show,
});

// Create commit
const creatingCommit = ef.sample({
  source: model.$commit,
  clock: model.createCommit,
});

const checkedCommit = ef.guard({
  source: creatingCommit,
  filter: ({ type, title }) => !!type && !!title,
});

const formattedCommit = ef.sample({
  source: model.$commit,
  clock: checkedCommit,
  fn: (commit) => {
    const result = [];

    // First line
    result.push(
      [
        commit.type,
        commit.scope,
        commit.breakingChangesFlag ? "!" : "",
        ": ",
        commit.title,
      ]
        .filter(Boolean)
        .join(""),
    );

    // Body
    if (commit.body) {
      result.push(`\n${commit.body}`);
    }

    // Breaking changes
    if (commit.breakingChanges) {
      result.push(`\nBREAKING CHANGE: ${commit.breakingChanges}`);
    }

    return result.join("\n");
  },
});

ef.forward({
  from: formattedCommit.map(() => {}),
  to: model.visibleBody.hide,
});

ef.forward({
  from: formattedCommit.map(() => {}),
  to: model.clear,
});

formattedCommit.watch(console.log);

// Clear
ef.forward({
  from: model.clear,
  to: [model.types.clear, model.scopes.clear],
});

ef.forward({
  from: model.clear.map(() => false),
  to: model.$breakingChangesFlag,
});

ef.forward({
  from: model.clear.map(() => ""),
  to: [model.$title, model.$body, model.$breakingChanges],
});
