import * as core from "@actions/core";

try {
  core.debug("run!");
} catch (e) {
  core.error(`${e}`);
}
