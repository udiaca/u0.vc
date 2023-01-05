interface Env {
  APP_ENV: "development" | "production" | "preview" | undefined;
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  CLOUDFLARE_API_TOKEN_READ_BILLING: string;
  CLOUDFLARE_API_TOKEN_READ_PAGES: string;
  CLOUDFLARE_API_ACCOUNT_ID: string;
  CLOUDFLARE_API_PROJECT_NAME: string;
  CLOUDFLARE_API_TOKEN_READ_WORKERS: string;
  DEV_PASSTHROUGH: string | undefined;
  GITHUB_APP_ID: string | undefined;
  GITHUB_APP_PEM_KEY_CONTENTS: string | undefined;
  GITHUB_APP_INSTALLATION_ID: string | undefined;
  GITHUB_WEBHOOK_SECRET: string | undefined;
  ORY_SDK_URL: string | undefined;
  ORY_KRATOS_URL: string | undefined;

  DO_SESSION: DurableObjectNamespace;
  DO_USER: DurableObjectNamespace;

  R2_U0_VC: R2Bucket;
  D1_U0_VC: D1Database;
  U0_WORKERS: Fetcher;
}
