import { combine, Store } from "effector";
import { Log, Ref } from "lib/api-git";

import { $originalLog } from "../original-log";
import { $byCommitHashRefs } from "../../refs";
import { FormattedLog, formatLog } from "./handlers";

export {
  FormattedCommitMessage,
  FormattedCommit,
  formattedCommitMessageToString,
} from "./handlers";

interface CombineStores {
  originalLog: Store<Log>;
  byCommitHashRefs: Store<Map<string, Ref[]>>;
}

export const $formattedLog = combine<CombineStores, FormattedLog>(
  { originalLog: $originalLog, byCommitHashRefs: $byCommitHashRefs },
  (stores) => formatLog(stores),
);
