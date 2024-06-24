const core = require('@actions/core');
const { Octokit } = require("@octokit/rest");
const { createAppAuth } = require("@octokit/auth-app");

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
        core.setOutput("repository_url", response.data.html_url);
        core.setOutput("status", "success");
    }).catch((error) => {
        console.log(error);
        core.setOutput("error", error);
        core.setOutput("status", "error");
    });

}

// Add maintainer
async function addMaintainer(organization, name, maintainer) {

    return octokit.repos.addCollaborator({
        owner: organization,
        repo: name,
        username: maintainer,
        permission: "maintain",
    }).then((response) => {
        core.setOutput("status", "success");
    }).catch((error) => {
        console.log(error);
        core.setOutput("error", error);
        core.setOutput("status", "error");
    });

}

// Get Parameters
const organization = core.getInput('organization_name');
const name = core.getInput('repository_name');
const visibility = core.getInput('repository_visibility');
const maintainer = core.getInput('maintainer');

// Main
async function run() {
    await createRepository(organization, name, visibility);
    await addMaintainer(organization, name, maintainer);
}

run();