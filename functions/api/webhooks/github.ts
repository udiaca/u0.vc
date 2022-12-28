/**
 * https://docs.github.com/webhooks/
 * https://github.com/settings/apps/u0vc
 */
export const onRequest: PagesFunction<Env> = async (context) => {
  const { request } = context
  console.log(request.headers)
  console.log(await request.json())
  return new Response(JSON.stringify(request), { headers: {'content-type': 'application/json'}});
};
