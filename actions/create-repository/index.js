const core = require('@actions/core');
const { Octokit } = require("@octokit/rest");

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
});

// Create a new repository
async function createRepository(organization, name, visibility) {

    return octokit.repos.createInOrg({
        org: organization,
        name: name,
        visibility: visibility,
        auto_init: true,
    }).then((response) => {
        core.setOutput("repository_id", response.data.id);
    }).catch((error) => {
        core.setFailed(error.response.data);
    });

}

// Set branch protection on main
async function setBranchProtection(organization, name, branch) {

    return octokit.repos.updateBranchProtection({
        owner: organization,
        repo: name,
        branch: branch,
        enforce_admins: true,
        required_pull_request_reviews: {
            dismiss_stale_reviews: true,
            require_code_owner_reviews: true,
            required_approving_review_count: 1,
            require_last_push_approval: true,
        },
        required_status_checks: null,
        restrictions: null,
    }).then((response) => {
        core.setOutput("branch_policies", "yes");
    }).catch((error) => {
        core.setFailed(error.response.data);
        core.setOutput("branch_policies", "error");
    });

}

// Get Parameters
const organization = core.getInput('organization_name');
const name = core.getInput('repository_name');
const visibility = core.getInput('repository_visibility');

// Main
async function run() {
    await createRepository(organization, name, visibility);
    await setBranchProtection(organization, name, "main");
}

run();