import { createStore, createEvent } from "effector";
import { core } from "../lib/api-git";

const PATH = "PATH";

const defaultPath = localStorage.getItem(PATH) || "./";

const defaultLog = core.logSync({ execOptions: { cwd: defaultPath } });
export const $log = createStore(defaultLog);

const defaultRefs = core.showRefSync({ execOptions: { cwd: defaultPath } });
export const $refs = createStore(defaultRefs);

export const pageMount = createEvent();
