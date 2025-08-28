"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAppRun = createAppRun;
exports.deleteAppRun = deleteAppRun;
const SAKURA_API_URL = "https://secure.sakura.ad.jp/cloud/api/apprun/1.0/apprun/api/applications";
const SAKURA_API_TOKEN = process.env.SAKURA_API_TOKEN;
const SAKURA_API_SECRET = process.env.SAKURA_API_SECRET;
if (!SAKURA_API_TOKEN) {
    throw new Error("SAKURA_API_TOKENが設定されていません");
}
async function createAppRun(params) {
    const payload = {
        name: `apprun-${params.owner}-${params.repo}-${params.branch}`,
        components: [
            {
                name: "Component01",
                max_cpu: "0.3",
                max_memory: "512Mi",
                deploy_source: {
                    container_registry: {
                        image: params.image,
                    },
                },
                env: Object.entries(params.envVars).map(([key, value]) => ({ key, value })),
                probe: {
                    http_get: {
                        path: "/",
                        port: params.port,
                    },
                },
            },
        ],
    };
    const res = await fetch(SAKURA_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Basic " + btoa(`${SAKURA_API_TOKEN}:${SAKURA_API_SECRET}`),
        },
        body: JSON.stringify(payload),
    });
    if (res.ok) {
        return await res.json();
    }
    const text = await res.text(); //エラーメッセージは文字列で取りたい
    throw new Error(`AppRun create failed: ${res.status} ${text}`);
}
async function deleteAppRun(appID) {
    const url = `${SAKURA_API_URL}/${appID}`;
    const res = await fetch(url, {
        method: "DELETE",
        headers: {
            "Authorization": "Basic " + btoa(`${SAKURA_API_TOKEN}:${SAKURA_API_SECRET}`),
        },
    });
    if (res.ok) {
        return { message: `AppRun ${appID} が削除されました` };
    }
    const text = await res.text();
    throw new Error(`AppRun delete failed: ${res.status} ${text}`);
}
