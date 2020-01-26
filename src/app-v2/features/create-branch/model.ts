import { createStore, createEvent } from "effector";

export const $nameBranch = createStore<string>("");

export const changeNameBranch = createEvent<
  React.ChangeEvent<HTMLInputElement>
>();
export const createBranch = createEvent<any>();

createBranch.watch(() => {
  console.log($nameBranch.getState());
});

$nameBranch.on(changeNameBranch, (_, event) => event.currentTarget.value);
