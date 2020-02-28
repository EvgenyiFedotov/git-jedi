import { createStore, Effect } from "effector";

export const createPendingStore = <P, R>(
  effect: Effect<P, R>,
  defaultValue: boolean = false,
) => {
  const $store = createStore<boolean>(defaultValue);

  $store.on(effect, () => true);
  $store.on(effect.finally, () => false);

  return $store;
};
