import React from "react";
import { createStore, createEvent } from "effector";
import { notification } from "antd";

import { BaseOptions } from "../api-git";

const CWD = "CWD";

const defaultPath = localStorage.getItem(CWD) || "./";

export const $cwd = createStore<string>(defaultPath);
export const $baseOptions = createStore<BaseOptions>({
  execOptions: { cwd: $cwd.getState() },
  onExec: command => console.log(command),
  onReject: ({ error }, { command, options }) => {
    notification.error({
      message: "Application error",
      description: (
        <div>
          <div>
            <b>{options && options.key}</b>
          </div>
          <div>{command}</div>
          <div>{options && JSON.stringify(options.execOptions, null, 2)}</div>
          <div>{error.message}</div>
        </div>
      ),
      duration: 0,
      placement: "bottomRight"
    });
  }
});

export const changePath = createEvent<string>();

$cwd
  .on(changePath, (_, path) => path)
  .watch(path => localStorage.setItem(CWD, path));

$baseOptions.on($cwd, (_, cwd) => ({ execOptions: { cwd } }));