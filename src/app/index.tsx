import * as React from "react";
import * as fs from "fs";
import { execSync } from "child_process";

export const App = () => {
  return (
    <div>
      <Branches />

      <Log branch="master" />

      <Log branch="next" />

      <Status />

      <Commit branch="next" />
    </div>
  );
};

interface LogProps {
  branch: string;
}

const Branches: React.FC = () => {
  const branches = execSync("git branch -a -l").toString();

  return (
    <div>
      <h2>Branches</h2>
      <div>
        {branches.split("\n").map((branch, index) => (
          <div key={index} style={{ marginBottom: "1rem" }}>
            {branch}
          </div>
        ))}
      </div>
    </div>
  );
};

const getBranchLog = (branch: string) => {
  const log = fs.readFileSync(`./.git/logs/refs/heads/${branch}`, "utf8");
  const logRows = log.split("\n").filter(Boolean);

  const formatedLogRows = logRows.map(row => {
    const [info, note] = row.split("	");
    const [
      parentCommit,
      commit,
      author,
      authorEmail,
      dateTime,
      dateTimeZone
    ] = info.split(" ");

    return {
      parentCommit,
      commit,
      author,
      authorEmail,
      dateTime,
      dateTimeZone,
      note
    };
  });

  return formatedLogRows;
};

const Log: React.FC<LogProps> = props => {
  const { branch } = props;
  const branchLog = getBranchLog(branch);

  return (
    <div>
      <h2>Log</h2>

      <div>
        {branchLog.map((log, index) => (
          <div key={index} style={{ marginBottom: "1rem" }}>
            {log.author} {log.commit} {log.note}
          </div>
        ))}
      </div>
    </div>
  );
};

const Status: React.FC = () => {
  const status = execSync("git status -s").toString();

  return (
    <div>
      <h2>Status</h2>

      <div>
        {status.split("\n").map((status, index) => (
          <div key={index} style={{ marginBottom: "1rem" }}>
            {status}
          </div>
        ))}
      </div>
    </div>
  );
};

const createDirChatBranch = (branch: string) => {
  if (!fs.existsSync("./chats")) {
    fs.mkdirSync("./chats");
  }

  const branchPath = `./chats/${branch}`;
  if (!fs.existsSync(branchPath)) {
    fs.mkdirSync(branchPath);
  }
};

const createFileMessages = (branch: string, message: string) => {
  const path = `./chats/${branch}/messages`;

  // execSync("git pull");

  if (!fs.existsSync(path)) {
    fs.writeFileSync(path, JSON.stringify([{ message }]));
  } else {
    const messages = JSON.parse(fs.readFileSync(path, "utf-8"));

    messages.push({ message });

    fs.writeFileSync(path, JSON.stringify(messages));
  }

  execSync(`git add ${path}`);
  execSync('git commit -m "message"');
};

interface CommitProps {
  branch: string;
}

const Commit: React.FC<CommitProps> = props => {
  const [message, setMessage] = React.useState<string>("");

  return (
    <div>
      <h2>Commit</h2>

      <input
        type="text"
        value={message}
        onChange={event => setMessage(event.currentTarget.value)}
      />

      <button
        onClick={() => {
          createDirChatBranch(props.branch);
          createFileMessages(props.branch, "test message");
        }}
      >
        Send
      </button>
    </div>
  );
};
