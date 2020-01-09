import * as React from "react";
import * as gitApi from "../lib/git-api";

export const App = () => {
  const currBranch = gitApi.getCurrentBranch();

  console.log(currBranch);

  return (
    <div>
      <Commit branch={currBranch} />

      <Branches />

      <Log branch="master" />

      <Log branch={currBranch} />

      <Status />
    </div>
  );
};

interface LogProps {
  branch: string;
}

const Branches: React.FC = () => {
  const branches = gitApi.getBranches();

  return (
    <div>
      <h2>Branches</h2>
      <div>
        {branches.map((branch, index) => (
          <div key={index} style={{ marginBottom: "1rem" }}>
            {branch}
          </div>
        ))}
      </div>
    </div>
  );
};

const Log: React.FC<LogProps> = props => {
  const { branch } = props;
  const branchLog = gitApi.getBranchLog(branch);

  return (
    <div>
      <h2>Log</h2>

      <div>
        {branchLog.map((log, index) => (
          <div key={index} style={{ marginBottom: "1rem" }}>
            <div>{log.author}</div>
            <div>{log.commit}</div>
            <div>{log.note}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Status: React.FC = () => {
  const status = gitApi.getStatus();

  return (
    <div>
      <h2>Status</h2>

      <div>
        {status.map((status, index) => (
          <div key={index} style={{ marginBottom: "1rem" }}>
            {status}
          </div>
        ))}
      </div>
    </div>
  );
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
          if (message) {
            const path = `./chats/${props.branch}`;

            gitApi.createDirChatBranch(path);
            gitApi.createMessage(props.branch, message);
          }
        }}
      >
        Send
      </button>
    </div>
  );
};
