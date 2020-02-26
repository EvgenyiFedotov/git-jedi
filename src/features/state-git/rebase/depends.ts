import { merge, forward } from "effector";

import { abortRebase, rebaseEnd } from "./events";
import { clearPathFile } from "../editor";

forward({ from: merge([abortRebase, rebaseEnd]), to: clearPathFile });
