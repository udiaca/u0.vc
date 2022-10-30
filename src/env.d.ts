/// <reference types="astro/client" />

declare const __GITHUB_CLIENT_ID: string;

interface CFPagesStage {
  name: string; // "queued"
  started_on: string; // "2022-10-28T04:28:12.030693Z"
  ended_on: string; // "2022-10-28T04:28:12.016318Z"
  status: string; // "success"
}

interface CFPagesDeployment {
  id: string; // "63276571-bf4a-4418-9b92-d87608db7860"
  short_id: string; // "63276571"
  project_id: string; // "d43fcccb-b64f-4e06-8eab-5a1d6ca4cf9e"
  project_name: string; // "u0-vc"
  environment: string; // "production"
  url: string; // "https://63276571.u0-vc.pages.dev"
  created_on: string; // "2022-10-28T04:28:11.946679Z"
  modified_on: string; // "2022-10-28T04:28:56.79233Z"
  latest_stage: {
    name: string; // "deploy"
    started_on: string; // "2022-10-28T04:28:49.860161Z"
    ended_on: string; // "2022-10-28T04:28:56.79233Z"
    status: string; // "success"
  };
  deployment_trigger: {
    type: string; // "github:push"
    metadata: {
      branch: string; // "main"
      commit_hash: string; // "989be900e37178f9a39f86c62b2d49c068dd2b03"
      commit_message: string; // "improved error pages"
      commit_dirty: boolean; // false
    };
  };
  stages: CFPagesStage[];
  build_config: {
    build_command: string; // "npm run build"
    destination_dir: string; // "dist"
    root_dir: string; // ""
    web_analytics_tag: null;
    web_analytics_token: null;
  };
  source: {
    type: string; // "github"
    config: {
      owner: string; // "udiaca"
      repo_name: string; // "u0.vc"
      production_branch: string; // "main"
      pr_comments_enabled: boolean; //false
    };
  };
  env_vars: Record<string, string>;
  compatibility_flags: string[]; // []
  build_image_major_version: number; // 1
  usage_model: null;
  aliases: string[] | null;
  is_skipped: boolean; // false
  production_branch: string; // "main"
}
