/* Not finished */

const core = require('@actions/core');
const exec = require('@actions/exec');

/* 1. Parse inputs             # Before able to parse or receive input, must define inputs in the action.yml file */
const validateBranchName = ({ branchName }) => /^[a-zA-Z0-9_\-\.\/]+$/.test(branchName)
const workingDir = ({ dirName }) => /^[a-zA-Z0-9_\-\/]+$/.test(dirName)

async function run() {
    /* 1.1 base-branch from which to check for updates */
    const baseBranch = core.getInput('base-branch');

    /* 1.2 target-branch to use to create the PR */
    const targetBranch = core.getInput('target-branch');

    /* 1.3 Github Token for authentication purposes (to create PRs) */
    const ghToken = core.getInput('gh-token');

    /* 1.4 working directory to check for dependencies */
    const workingDir = core.getInput('working-directory')

    const debug = core.getBooleanInput('debug');

    core.setSecret(ghToken);

    if (!validateBranchName({ branchName: baseBranch })) {
        core.setFailed('Invalid base branch name. Branch name should only include characters, numbers, hyphens, underscores, periods and forward slashes.')
        return;
    }

    if (!validateBranchName({ branchName: targetBranch })) {
        core.setFailed('Invalid target branch name. Branch name should only include characters, numbers, hyphens, underscores, periods and forward slashes.')
        return;
    }

    if (validateDirectoryName({ dirName: workingDir })) {
        core.setFailed('Invalid working directory name. Directory name should only include characters, numbers, hyphens, underscores and forward slashes.')
        return;
    }

    core.info(`[js-dependency-update] : base branch is ${baseBranch}`)
    core.info(`[js-dependency-update] : target branch is ${targetBranch}`)
    core.info(`[js-dependency-update] : working directory is ${workingDir}`)

    /* 2. Execute the npm update command within the working direcotry */
    await exec.exec('nmp update', [], {
        cwd: workingDir
    });

    /* 3. Check whether there are modified package.json files */
    const gitStatus = await exec.getExecOutput('git status -s package*.json', [], {
        cwd: workingDir
    });

    if (gitStatus.stdout.length > 0) {
        core.info('[js-dependency-update] : There are updates available')
    } else {
        core.info('[js-dependency-update] : No updates at this time')
    }
    /*
    4. If there are modified files
        4.1 Add and commit files to the target-branch
        4.2 Create a PR to the base-branch using the oktokit API (GitHub API)
    5. Otherwise, conclude custom action
    */
    core.info("I am a custom JS action");
}

run()