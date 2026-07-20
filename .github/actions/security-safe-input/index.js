const core = require('@actions/core');

async function run() {
    try {
        const prTitle = core.input('pr-title');
        if (prTitle.startWith('feat')) {
            core.info('PR is a feature');
        } else {
            core.setFailed('PR is not a feature');
        }
    } catch (e) {
        core.setFailed(e.message);
    }
}

run();