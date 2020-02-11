import { createStore, createEvent } from "effector";

import { abortRebase } from "../events";

export const $pathFile = createStore<string>("");

export const changePathFile = createEvent<string>();

$pathFile.on(changePathFile, (_, path) => path);
$pathFile.on(abortRebase, () => "");
