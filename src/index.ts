import * as core from "@actions/core";
import { createAppRun } from './apprun'; 
//import { deleteAppRun } from './apprun'; 

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
    const prNumber = process.env.PR_NUMBER!;

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
      prNumber,
      port,
    });

    core.info(`AppRun created: ${app.id} at ${app.url}`);

  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed('Unknown error');
    }
  }
}

run();