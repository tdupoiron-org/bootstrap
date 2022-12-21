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
        core.setOutput("error", error.response.data);
    });

}

// Get Parameters
const organization = core.getInput('organization');
const name = core.getInput('name');
const visibility = core.getInput('visibility');

// Main
createRepository(organization, name, visibility);