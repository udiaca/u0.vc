interface Env {
  APP_ENV: "development" | "production" | "preview" | undefined;
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  CLOUDFLARE_API_TOKEN_READ_BILLING: string;
  CLOUDFLARE_API_TOKEN_READ_PAGES: string;
  CLOUDFLARE_API_ACCOUNT_ID: string;
  CLOUDFLARE_API_PROJECT_NAME: string;
  CLOUDFLARE_API_TOKEN_READ_WORKERS: string;

  DO_SESSION: DurableObjectNamespace;
}
