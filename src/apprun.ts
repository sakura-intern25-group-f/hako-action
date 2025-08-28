
const SAKURA_API_URL = "https://secure.sakura.ad.jp/cloud/api/apprun/1.0/apprun/api/applications";

export async function createAppRun (params:{
  image: string,
  envVars: Record<string, string>,
  port: number,
  owner: string,
  repo: string,
  branch: string
  }) 
  {

  const SAKURA_API_TOKEN = process.env.SAKURA_API_TOKEN;
  const SAKURA_API_SECRET = process.env.SAKURA_API_SECRET;

  if (!SAKURA_API_TOKEN) {
    throw new Error("SAKURA_API_TOKENが設定されていません");
  }


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