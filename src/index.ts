import * as core from "@actions/core";
import { createAppRun } from './apprun'; 
//import { deleteAppRun } from './apprun'; 
import fs from 'fs';

try {
  core.debug("run!");
} catch (e) {
  core.error(`${e}`);
}

async function run() {
  try {
    const image = process.env.DOCKER_IMAGE!;
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 80;
    const owner = process.env.OWNER!;
    const repo = process.env.REPOSITORY!;
    const branch = process.env.BRANCH!;

    const envVars: Record<string, string> = {
      OWNER: owner,
      REPOSITORY: repo,
      BRANCH: branch,
    };

    const app = await createAppRun({
      image,
      envVars,
      owner,
      repo,
      branch,
      port,
    });

    core.info(`AppRun created: ${app.id} at ${app.url}`);
    fs.writeFileSync('./apprun-id.txt', app.id);

    if (app.id && app.public_url) {
      core.setOutput("AppRun App ID: ", app.id);
      core.info(`AppRun public URL: ${app.public_url}`);
      core.setOutput("app_id", app.id);
      core.setOutput("public_url", app.public_url);
    }
    core.setOutput("status", "success");
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed("Unknown error");
    }
    core.setOutput("status", "failure");
  }
}

run();
