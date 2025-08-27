
export async function createAppRun (params:{
  image: string,
  envVars: Record<string, string>,
  }) 
  {
  const SAKURA_API_TOKEN = process.env.SAKURA_API_TOKEN;
  if (!SAKURA_API_TOKEN) {
    throw new Error("SAKURA_API_TOKEN が設定されていません");
  }

  const SAKURA_API_URL = "https://secure.sakura.ad.jp/cloud/api/apprun/1.0/apprun/api/applications";

  const payload = {
    name: "apprun-" + Math.random().toString(36).substring(2, 8),
    port: 8080,
    components: [
      {
        name: "Component01",
        max_cpu: "0.25",
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
            port: 8080,
          },
        },
      },
    ],
  };


  for (let attempt = 1; attempt <= 3; attempt++) {
    const res = await fetch(SAKURA_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SAKURA_API_TOKEN}`,
      },
      body: JSON.stringify(payload),
      
    });

    const text = await res.text();
    if (res.ok) {
      try {
        return JSON.parse(text); // 作成されたオブジェクト（id, urlなど）
      } catch (e) {
        throw new Error("Invalid JSON from AppRun: " + text);
      }
    }

    // 失敗時: ログを残して再試行 or エラーを投げる
    console.error(`AppRun create failed (attempt ${attempt}):`, res.status, text);
    if (attempt < 3) {
      await new Promise((r) => setTimeout(r, 1000 * attempt)); // 簡単なバックオフ
      continue;
    }
    throw new Error(`AppRun create failed after retries: ${res.status} ${text}`);
  }
}