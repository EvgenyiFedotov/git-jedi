import { createStore } from "effector";
import { $contentRebaseTodo } from "features/state-git";

type Tab = "log" | "rebase";

export const $tab = createStore<Tab>("log");

$tab.on($contentRebaseTodo, (_, { ref }) => (ref.length ? "rebase" : "log"));
