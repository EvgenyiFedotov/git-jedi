import { createStore, createEvent } from "effector";

import { clear } from "./events";

export const $pathFile = createStore<string>("");

export const changePath = createEvent<string>();

$pathFile.on(changePath, (_, path) => path);
$pathFile.on(clear, () => "");
