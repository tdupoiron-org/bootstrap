const core = require('@actions/core');
const { Octokit } = require("@octokit/rest");
const { createAppAuth } = require("@octokit/auth-app");

console.log("Creating a new repository...");
console.log("Organization: " + process.env.INPUT_ORGANIZATION_NAME);
console.log("Repository Name: " + process.env.INPUT_REPOSITORY_NAME);
console.log("Visibility: " + process.env.INPUT_REPOSITORY_VISIBILITY);

console.log("App ID: " + process.env.APP_ID);
console.log("Installation ID: " + process.env.INSTALLATION_ID);
console.log("Private Key: " + process.env.PRIVATE_KEY);

const octokit = new Octokit({
    authStrategy: createAppAuth,
    auth: {
        appId: process.env.APP_ID,
        privateKey: process.env.PRIVATE_KEY,
        installationId: process.env.INSTALLATION_ID,
    },
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
    }).catch((error) => {
        core.setFailed(error.response.data);
    });

}

// Get Parameters
const organization = core.getInput('organization_name');
const name = core.getInput('repository_name');
const visibility = core.getInput('repository_visibility');

// Main
async function run() {
    await createRepository(organization, name, visibility);
}

run();