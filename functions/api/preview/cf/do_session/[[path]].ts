/**
 * DO_SESSION (durable object) only accessible in preview and production
 * @param context 
 * @returns 
 */
export const onRequest: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const id = url.pathname.split("/").pop() || ''
  const doId = context.env.DO_SESSION.idFromString(id)
  const doStub = context.env.DO_SESSION.get(doId)
  return doStub.fetch('https://do-session.workers.u0.vc/oauth-github', { headers: {
    'content-type': 'application/json',
    'accept': 'application/json'
  }})
};
