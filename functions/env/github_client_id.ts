export const onRequest: PagesFunction<Env> = async (context) => {
  return new Response(context.env.GITHUB_CLIENT_ID);
};
