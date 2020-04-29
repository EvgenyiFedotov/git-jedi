import * as ef from "effector";
import { configL } from "features/commands";
import { attachEffect, attachStore } from "lib/effector-extensions/core/attach";

type Remote = {
  fetch: string;
  url: string;
};

export const commandConfigL = ef.createEffect({
  handler: configL,
});

export const runConfigL = attachEffect(commandConfigL);

export const $config = attachStore<Map<string, string>>(
  commandConfigL,
  new Map(),
);
export const $remotes = $config.map<Map<string, Remote>>((config) => {
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
});
