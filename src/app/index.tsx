import * as React from "react";
import { execSync } from "child_process";
import * as gitApi from "../lib/git-api";
import * as gitFs from "../lib/git-fs";

export const App = () => {
  const [branch, setBranch] = React.useState<string>(gitApi.getBranch());

  console.log(gitApi.getParentBranch());

  return (
    <div>
      <Commit branch={branch} />

      <Branches onClick={nextBranch => setBranch(nextBranch)} />

      {/* <Log branch="master" /> */}

      <Log />

      <Status />
    </div>
  );
};

interface BranchesProps {
  onClick?: (branch: string) => void;
}

const Branches: React.FC<BranchesProps> = props => {
  const { onClick = () => {} } = props;

  const branches = gitApi.getBranches();

  return (
    <div>
      <h2>Branches</h2>
      <div>
        {branches.map((branch, index) => (
          <div
            key={index}
            style={{ marginBottom: "1rem", cursor: "pointer" }}
            onClick={() => onClick(branch)}
          >
            {branch}
          </div>
        ))}
      </div>
    </div>
  );
};

interface LogProps {
  branch: string;
  parentBranch: string;
}

const Log: React.FC = props => {
  const branchLog = gitApi.getLogBranch({
    range: [gitApi.getParentBranch(), gitApi.getBranch()]
  });

  return (
    <div>
      <h2>Log: {gitApi.getBranch()}</h2>

      <div>
        {Array.from(branchLog).map(([commit, log]) => (
          <div key={commit} style={{ marginBottom: "1rem" }}>
            <div>
              {log.commit} {log.parentCommit}
            </div>
            <div>{log.author}</div>
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

      <textarea
        value={message}
        onChange={event => setMessage(event.currentTarget.value)}
      />

      <button
        onClick={() => {
          if (message) {
            const path = `./chats/${props.branch}`;

            execSync(`mkdir -p ${path}`);
            gitFs.createMessage(props.branch, message);
          }
        }}
      >
        Send
      </button>
    </div>
  );
};
