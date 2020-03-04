import { createEffect } from "effector";
import { ResolverStoreItem } from "lib/pipe-v2";
import { commandPipeToPromise } from "lib/run-command-v2";

import { add, AddOptions } from "lib/git-proxy/add";
import { checkout, CheckoutOptions } from "lib/git-proxy/checkout";
import { commit, CommitOptions } from "lib/git-proxy/commit";
import { config, ConfigOptions } from "lib/git-proxy/config";
import { diff, DiffOptions } from "lib/git-proxy/diff";
import { fetch, FetchOptions } from "lib/git-proxy/fetch";
import { init, InitOptions } from "lib/git-proxy/init";
import { log, LogOptions } from "lib/git-proxy/log";
import { pull, PullOptions } from "lib/git-proxy/pull";
import { push, PushOptions } from "lib/git-proxy/push";
import { rebase, RebaseOptions } from "lib/git-proxy/rebase";
import { remoteAdd, RemoteAddOptions } from "lib/git-proxy/remote";
import { reset, ResetOptions } from "lib/git-proxy/reset";
import { revParse, RevParseOptions } from "lib/git-proxy/rev-parse";
import { showRef, ShowRefOptions } from "lib/git-proxy/show-ref";
import { stash, StashOptions } from "lib/git-proxy/stash";
import { status, StatusOptions } from "lib/git-proxy/status";

type EffectResult = ResolverStoreItem<string>[];

export const createAdd = () =>
  createEffect<AddOptions, EffectResult>({
    handler: (options) => commandPipeToPromise(add(options)),
  });

export const createChechout = () =>
  createEffect<CheckoutOptions, EffectResult>({
    handler: (options) => commandPipeToPromise(checkout(options)),
  });

export const createCommit = () =>
  createEffect<CommitOptions, EffectResult>({
    handler: (options) => commandPipeToPromise(commit(options)),
  });

export const createConfig = () =>
  createEffect<ConfigOptions, EffectResult>({
    handler: (options) => commandPipeToPromise(config(options)),
  });

export const createDiff = () =>
  createEffect<DiffOptions, EffectResult>({
    handler: (options) => commandPipeToPromise(diff(options)),
  });

export const createFetch = () =>
  createEffect<FetchOptions, EffectResult>({
    handler: (options) => commandPipeToPromise(fetch(options)),
  });

export const createInit = () =>
  createEffect<InitOptions, EffectResult>({
    handler: (options) => commandPipeToPromise(init(options)),
  });

export const createLog = () =>
  createEffect<LogOptions, EffectResult>({
    handler: (options) => commandPipeToPromise(log(options)),
  });

export const createPull = () =>
  createEffect<PullOptions, EffectResult>({
    handler: (options) => commandPipeToPromise(pull(options)),
  });

export const createPush = () =>
  createEffect<PushOptions, EffectResult>({
    handler: (options) => commandPipeToPromise(push(options)),
  });

export const createRebase = () =>
  createEffect<RebaseOptions, EffectResult>({
    handler: (options) => commandPipeToPromise(rebase(options)),
  });

export const createRemoteAdd = () =>
  createEffect<RemoteAddOptions, EffectResult>({
    handler: (options) => commandPipeToPromise(remoteAdd(options)),
  });

export const createReset = () =>
  createEffect<ResetOptions, EffectResult>({
    handler: (options) => commandPipeToPromise(reset(options)),
  });

export const createRevParse = () =>
  createEffect<RevParseOptions, EffectResult>({
    handler: (options) => commandPipeToPromise(revParse(options)),
  });

export const createShowRef = () =>
  createEffect<ShowRefOptions, EffectResult>({
    handler: (options) => commandPipeToPromise(showRef(options)),
  });

export const createStash = () =>
  createEffect<StashOptions, EffectResult>({
    handler: (options) => commandPipeToPromise(stash(options)),
  });

export const createStatus = () =>
  createEffect<StatusOptions, EffectResult>({
    handler: (options) => commandPipeToPromise(status(options)),
  });
