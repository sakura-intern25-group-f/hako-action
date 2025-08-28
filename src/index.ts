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

    const envVars: Record<string, string> = {
      SAKURA_API_TOKEN: process.env.SAKURA_API_TOKEN!,
      SAKURA_API_SECRET: process.env.SAKURA_API_SECRET!,
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

  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed('Unknown error');
    }
  }
}

run();