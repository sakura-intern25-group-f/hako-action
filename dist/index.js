"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const apprun_1 = require("./apprun");
//import { deleteAppRun } from './apprun';
const fs_1 = __importDefault(require("fs"));
try {
    core.debug("run!");
}
catch (e) {
    core.error(`${e}`);
}
async function run() {
    try {
        const image = process.env.DOCKER_IMAGE;
        const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 80;
        const owner = process.env.OWNER;
        const repo = process.env.REPOSITORY;
        const branch = process.env.BRANCH;
        const envVars = {
            OWNER: owner,
            REPOSITORY: repo,
            BRANCH: branch,
        };
        const app = await (0, apprun_1.createAppRun)({
            image,
            envVars,
            owner,
            repo,
            branch,
            port,
        });
        core.info(`AppRun created: ${app.id} at ${app.url}`);
        fs_1.default.writeFileSync("./apprun-id.txt", app.id);
        if (app.id && app.public_url) {
            core.info(`AppRun App ID: ${app.id}`);
            core.info(`AppRun public URL: ${app.public_url}`);
            core.setOutput("app_id", app.id);
            core.setOutput("public_url", app.public_url);
        }
        core.setOutput("status", "success");
    }
    catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message);
        }
        else {
            core.setFailed("Unknown error");
        }
        core.setOutput("status", "failure");
    }
}
run();
