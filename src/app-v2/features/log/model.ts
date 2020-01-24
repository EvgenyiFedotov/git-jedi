import { createStore, createEvent } from "effector";
import * as React from "react";

export const $commitMessage = createStore<string>("");

export const changeCommiteMessage = createEvent<
  React.ChangeEvent<HTMLTextAreaElement>
>();
export const formatMessage = createEvent<any>();

$commitMessage
  .on(changeCommiteMessage, (_, { currentTarget: { value } }) => value)
  .on(formatMessage, message => {
    const [firstLine, secondLine, ...otherLines] = message.split("\n");

    if (secondLine === undefined || secondLine === "") {
      return message;
    } else {
      return [firstLine, "", secondLine, ...otherLines].join("\n");
    }
  });
