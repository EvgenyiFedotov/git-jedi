export interface MessageFormatted {
  type: string;
  scope: string;
  note: string;
}

export const toMessageFormatted = (message: string): MessageFormatted => {
  const regOnlyType = /^([\w_]*):/;
  let matchResult = message.match(regOnlyType);

  if (matchResult) {
    const type = matchResult[1];
    const note = message.replace(regOnlyType, "").trim();

    return { type, note, scope: "" };
  }

  const regWithScope = /^([\w_]*)\(([\w_/-]*)\):/;
  matchResult = message.match(regWithScope);

  if (matchResult) {
    const type = matchResult[1];
    const scope = matchResult[2].trim();
    const note = message.replace(regWithScope, "").trim();

    return { type, note, scope };
  }

  return { type: "", scope: "", note: message };
};

export const toMessage = (message: MessageFormatted): string => {
  return `${message.type}: ${message.note.trim()}`;
};
