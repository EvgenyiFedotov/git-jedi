import { createStore, Effect } from "effector";

export const createPendingStore = <P, R>(
  effect: Effect<P, R>,
  defaultValue: null | boolean = null,
) => {
  const $store = createStore<null | boolean>(defaultValue);

  $store.on(effect, () => true);
  $store.on(effect.finally, () => false);

  return $store;
};
