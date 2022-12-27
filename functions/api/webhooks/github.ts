/**
 * https://docs.github.com/webhooks/
 * https://github.com/settings/apps/u0vc
 */
export const onRequest: PagesFunction<Env> = async (context) => {
  return new Response('no-op');
};
