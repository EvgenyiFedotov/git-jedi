import * as ef from "effector";

import { $cwd } from "../settings";
import { attachRunCommand } from "../run-command";
import * as model from ".";

// Load config
ef.forward({
  from: $cwd,
  to: model.loadConfig,
});

attachRunCommand({
  event: model.loadConfig,
  effect: model.commandConfigL,
});

model.$config.on(model.commandConfigL.done, (_, { result }) => {
  return result.data().reduce<Map<string, string>>((memo, value) => {
    const lines = value.split("\n").filter(Boolean);

    lines.forEach((line) => {
      const [key, value] = line.split("=");

      memo.set(key, value);
    });

    return memo;
  }, new Map());
});

// Build $remotes
model.$remotes.on(model.$config, (_, config) => {
  if (config) {
    const remotes = new Map();

    config.forEach((value, key) => {
      const [rootName, name, propName] = key.split(".");

      if (rootName === "remote") {
        const remote = { fetch: "", url: "" };

        switch (propName) {
          case "fetch":
            remote.fetch = value;
            break;
          case "url":
            remote.url = value;
            break;
        }

        remotes.set(name, remote);
      }
    });

    return remotes;
  }

  return _;
});
