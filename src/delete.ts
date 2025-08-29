import * as core from "@actions/core";
import { deleteAppRun } from "./apprun";
import fs from "fs";

try {
  core.debug("delete run!");
} catch (e) {
  core.error(`${e}`);
}

async function run() {
  try {
    const appId = fs.readFileSync(process.env.APP_ID!, "utf-8");
    if (!appId) {
      throw new Error("APP_IDが設定されていません");
    }

    const result = await deleteAppRun(appId);

    core.info(result.message);
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed("Unknown error");
    }
  }
}

run();
