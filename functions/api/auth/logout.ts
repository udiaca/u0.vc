export const parseCookie = (str: string): any =>
  (str.indexOf(';') >= 0 ? str.split(';') : [str,])
    .map(v => v.split('='))
    .filter(v => v.length === 2)
    .reduce((acc, v) => {
      acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
      return acc;
    }, {});

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { env, request, waitUntil } = context;
  const cookie = request.headers.get('cookie') || ''
  const { '__Secure-SessionId': rawDOSessionId } = parseCookie(cookie || '')

  const doSessionNamespace = env.DO_SESSION;
  const doSessionId = doSessionNamespace.idFromString(rawDOSessionId);
  const doStub = doSessionNamespace.get(doSessionId);

  waitUntil(doStub.fetch('https://do-session.workers.u0.vc', {
    method: 'DELETE',
    headers: {
      "content-type": "application/json",
      accept: "application/json",
    }
  }))

  const url = new URL(request.url)
  return new Response(null, {
    status: 302, headers: {
      location: url.origin,
      'set-cookie': `__Secure-SessionId=0; Path=/; Domain=${url.host}; SameSite=Lax; Secure; HttpOnly; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
    }
  })
}