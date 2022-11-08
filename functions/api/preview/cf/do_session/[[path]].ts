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

  let endpoint = 'https://do-session.workers.u0.vc'
  if (key) {
    endpoint += '/' + key
  }
  if (url.search) {
    endpoint += url.search
  }

  const options: RequestInit = {
    headers: {
      'content-type': 'application/json',
      'authorization': context.env.DEV_PASSTHROUGH ? '' : `bearer ${context.env.DEV_PASSTHROUGH}`
    }
  }

  let resp: Response;
  try {
    const doId = context.env.DO_SESSION.idFromString(id)
    const doStub = context.env.DO_SESSION.get(doId)
    resp = await doStub.fetch(endpoint, options)
  } catch (err) {
    // possible fail due to context environment missing DO (development)
    // just fetch the endpoint
    resp = await fetch(endpoint, options)
  }
  return new Response(
    JSON.stringify({
      do: await resp.json(),
      respStatus: resp.status,
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
