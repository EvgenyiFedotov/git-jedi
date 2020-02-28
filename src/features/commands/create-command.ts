import { v4 as uuid } from "uuid";

import { Command } from "./model/stores";

export const createCommand = (name: string, run: () => any): Command => ({
  id: uuid(),
  name,
  run,
});
