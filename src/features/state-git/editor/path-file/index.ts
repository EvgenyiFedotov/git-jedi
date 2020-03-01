import { createStore, createEvent } from "effector";

export const $pathFile = createStore<string>("");

export const changePathFile = createEvent<string>();
export const clearPathFile = createEvent<void>();

$pathFile.on(changePathFile, (_, path) => path);
$pathFile.on(clearPathFile, () => "");
