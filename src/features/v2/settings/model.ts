import {
  createStore,
  combine,
  createEffect,
  createEvent,
  sample,
  Event,
  Effect,
} from "effector";
import { createPendingStore } from "lib/added-effector/create-pending-store";
import { existsSync, writeFileSync, readFileSync } from "fs";
import { PATH_SETTINGS } from "app/const";
import { RunCommandOptions } from "lib/run-command";
import {
  EffectParams,
  EffectResult,
} from "lib/added-effector/create-pipe-promise-effect";

export type HotKey = {
  type: "command";
  targetId: string;
  command: string;
};
export interface Settings {
  cwd: string | null;
  hotKeys: HotKey[];
}

export const readSettings = createEffect<void, Settings | null>({
  handler: () => {
    if (existsSync(PATH_SETTINGS)) {
      return JSON.parse(readFileSync(PATH_SETTINGS).toString());
    }

    return null;
  },
});
export const writeSettings = createEffect<Settings, void>({
  handler: (settings) => {
    writeFileSync(PATH_SETTINGS, JSON.stringify(settings, null, 2));
  },
});

export const initSettings = createEvent<void>();
export const changedCwd = createEvent<string | null>();

export const $cwd = createStore<Settings["cwd"]>(null);
export const $hotKeys = createStore<Settings["hotKeys"]>([
  { type: "command", targetId: "changePathRepo", command: "command+shift+o" },
  { type: "command", targetId: "changeBranch", command: "command+shift+b" },
]);
export const $settings = combine({ cwd: $cwd, hotKeys: $hotKeys });
export const $pendingReadSettings = createPendingStore(readSettings);
export const $runCommandOptions = $cwd.map(
  (cwd): RunCommandOptions => ({
    spawnOptions: { cwd: cwd || "/" },
    commandOptions: {
      onBefore: ({ command, args = [] }) =>
        console.log([command, ...args].join(" ")),
      onClose: (code, { log, ...other }) => {
        if (code) {
          const strlog = log.map(({ data }) => data).join("\n");

          console.error(strlog);
          console.log(other);
        }
      },
    },
  }),
);

export const createDependRunCommandOptions = <P = void>(_: {
  event: Event<P>;
  effect?: Effect<EffectParams<P>, EffectResult>;
}) => {
  if (_.effect) {
    return sample({
      source: $runCommandOptions,
      clock: _.event,
      fn: (options, params) => ({
        params,
        options,
      }),
      target: _.effect,
    });
  }

  return sample({
    source: $runCommandOptions,
    clock: _.event,
    fn: (options, params) => ({
      params,
      options,
    }),
  });
};
