import { isValidDurableObjectIdString } from '../../../src/utils/isValidDurableObjId'
import { parseCookie } from '../../../src/utils/parseCookie'

/**
 * Generate a 'Set-Cookie' header value for the user's session
 * @param host Domain for the cookie
 * @param sessionId Unique identifier for session, or '0' if logging a user out
 * @param maxAgeSec How long the cookie should exist for, in seconds, or 0 for logging a user out
 * @returns Set-Cookie header value
 */
export const genSessionCookie = (
  host: string,
  sessionId = '0',
  maxAgeSec: number = 0
) =>
  [
    `__Secure-SessionId=${sessionId}`,
    'Path=/',
    `Domain=${host}`,
    'SameSite=Lax',
    'Secure',
    'HttpOnly',
    `Max-Age=${maxAgeSec}`,
  ].join('; ')

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { env, request, waitUntil } = context
  const cookie = request.headers.get('cookie') || ''
  const { '__Secure-SessionId': rawDOSessionId } = parseCookie(cookie || '')

  if (isValidDurableObjectIdString(rawDOSessionId)) {

    const endpoint = 'https://do-session.workers.u0.vc'
    const options = {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
        'authorization': context.env.DEV_PASSTHROUGH ? '' : `bearer ${context.env.DEV_PASSTHROUGH}`
      },
    }

    let resp: Promise<Response>
    try {
      const doSessionNamespace = env.DO_SESSION
      const doSessionId = doSessionNamespace.idFromString(rawDOSessionId!)
      const doStub = doSessionNamespace.get(doSessionId)
      resp = doStub.fetch(endpoint, options)
    } catch (err) {
      resp = fetch(endpoint, options)
    }

    waitUntil(resp);
  }

  const url = new URL(request.url)
  return new Response(null, {
    status: 302,
    headers: {
      location: url.origin,
      'set-cookie': genSessionCookie(url.host),
    },
  })
}
