/**
 * DO_SESSION (durable object) only accessible in preview and production
 * @param context
 * @returns
 */
export const onRequest: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url)
  // Array(6) [ "", "api", "preview", "cf", "do_session", "<id>" ]
  const parts = url.pathname.split('/').slice(5)
  const id = parts[0] || ''
  const key = parts.slice(1).join('.')
  const doId = context.env.DO_SESSION.idFromString(id)
  const doStub = context.env.DO_SESSION.get(doId)

  let endpoint = 'https://do-session.workers.u0.vc'
  if (key) {
    endpoint += '/' + key
  }
  if (url.search) {
    endpoint += url.search
  }

  const doResp = await doStub.fetch(endpoint, {
    headers: {
      'content-type': 'application/json',
    },
  })
  return new Response(
    JSON.stringify({
      do: await doResp.json(),
      respStatus: doResp.status,
      id,
      endpoint,
    }),
    {
      headers: {
        'content-type': 'application/json',
      },
    }
  )
}
