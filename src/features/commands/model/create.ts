import { createEvent } from "effector";
import { v4 as uuid } from "uuid";

import { addCommand } from "./events";

export const createCommand = (title: string, id: string = uuid()) => {
  const event = createEvent<void>();

  addCommand({ id, title, event });

  return event;
};
