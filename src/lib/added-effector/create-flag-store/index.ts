import { createStore, Event } from "effector";

export const createFlagStore = (
  _: { show: Event<void>; hide: Event<void> },
  defaultValue: boolean = false,
) => {
  const $store = createStore<boolean>(defaultValue);

  $store.on(_.show, () => true);
  $store.on(_.hide, () => false);

  return $store;
};
