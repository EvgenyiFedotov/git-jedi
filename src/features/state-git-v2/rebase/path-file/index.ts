import { createStore, createEvent, merge } from "effector";

import { abortRebase, rebaseEnd } from "../events";

export const $pathFile = createStore<string>("");

export const changePathFile = createEvent<string>();

$pathFile.on(changePathFile, (_, path) => path);
$pathFile.on(merge([abortRebase, rebaseEnd]), () => "");
