const core = require('@actions/core');
const { Octokit } = require("@octokit/rest");
//const { createAppAuth } = require("@octokit/auth-app");

/*const octokit = new Octokit({
    authStrategy: createAppAuth,
    auth: {
        appId: process.env.APP_ID,
        privateKey: process.env.PRIVATE_KEY,
        installationId: process.env.INSTALLATION_ID,
    },
});*/

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
    }).catch((error) => {
        core.setFailed(error);
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