import * as React from "react";
import * as ReactDOM from "react-dom";
import { readFileSync } from "fs";

const root = readFileSync("./.git/logs/refs/heads/master", "utf8");

const Index = () => {
  return (
    <div>
      {root.split("\n").map((log, index) => (
        <div key={index}>{log}</div>
      ))}
    </div>
  );
};

ReactDOM.render(<Index />, document.getElementById("app"));
