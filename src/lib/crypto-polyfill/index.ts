import crypto from "crypto";

const _window: any = window;

_window.crypto = {
  ..._window.crypto,
  getRandomValues: (arr: Uint8Array) => crypto.randomBytes(arr.length),
};
