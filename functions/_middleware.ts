import sentryPlugin from "@cloudflare/pages-plugin-sentry";

export const onRequest: PagesFunction<Env> = (context) =>
  sentryPlugin({ dsn: context.env.SENTRY_DSN })(context);

