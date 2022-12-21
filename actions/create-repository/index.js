const core = require('@actions/core');
const { Octokit } = require("@octokit/rest");

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
});

// Create a new repository
function createRepository(organization, name, visibility) {

    octokit.repos.createInOrg({
        org: organization,
        name: name,
        visibility: visibility,
    }).then((response) => {
        core.setOutput("repository_id", response.data.id);
    }).catch((error) => {
        core.setFailed(error.response.data);
    });

}

// Get Parameters
const organization = core.getInput('organization_name');
const name = core.getInput('repository_name');
const visibility = core.getInput('repository_visibility');

// Main
createRepository(organization, name, visibility);