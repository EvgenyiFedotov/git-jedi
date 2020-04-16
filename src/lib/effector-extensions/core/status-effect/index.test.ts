import * as ef from "effector";

import { createStatusEffect, Status } from ".";

test("pending-done", async () => {
  const event = ef.createEvent();
  const effect = ef.createEffect({
    handler: async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    },
  });
  const { $value } = createStatusEffect(effect);
  const $stack = ef.createStore<Status[]>([]);

  ef.forward({ from: event, to: effect });

  $stack.on($value, (store, value) => [...store, value]);

  event();

  await new Promise((resolve) => effect.finally.watch(resolve));

  expect($stack.getState()).toEqual(["pending", "done"]);
});

test("pending-fail", async () => {
  const event = ef.createEvent();
  const effect = ef.createEffect({
    handler: () => new Promise((_, reject) => setTimeout(reject, 100)),
  });
  const { $value } = createStatusEffect(effect);
  const $stack = ef.createStore<Status[]>([]);

  ef.forward({ from: event, to: effect });

  $stack.on($value, (store, value) => [...store, value]);

  event();

  await new Promise((resolve) => effect.finally.watch(resolve));

  expect($stack.getState()).toEqual(["pending", "fail"]);
});

test("pending-done-clear", async () => {
  const event = ef.createEvent();
  const effect = ef.createEffect({
    handler: () => new Promise((resolve) => setTimeout(resolve, 100)),
  });
  const { $value, clear } = createStatusEffect(effect);
  const $stack = ef.createStore<Status[]>([]);

  ef.forward({ from: event, to: effect });

  $stack.on($value, (store, value) => [...store, value]);

  event();

  await new Promise((resolve) => effect.finally.watch(resolve));

  clear();

  expect($stack.getState()).toEqual(["pending", "done", null]);
});
