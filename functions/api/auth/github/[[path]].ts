import { parseCookie } from "../logout";

/**
 * https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps#1-request-a-users-github-identity
 * @param context 
 * @returns 
 */
const requestIdentity: PagesFunction<Env> = async (context) => {
  const { env, request } = context;
  const url = new URL(request.url)
  const id = env.DO_SESSION.newUniqueId().toString()

  const requestIdentityEndpoint = "https://github.com/login/oauth/authorize"

  const requestParameters = new URLSearchParams({
    client_id: env.GITHUB_CLIENT_ID,
    redirect_uri: url.origin + '/api/auth/github/callback',
    scope: 'read:user user:email',
    state: id,
    allow_signup: 'true'
  })

  const location = requestIdentityEndpoint + '?' + requestParameters.toString()

  return new Response(null, {
    status: 302,
    statusText: 'Found',
    headers: {
      location,
      'set-cookie': `__Secure-SessionId=${id}; Path=/; Domain=${url.host}; SameSite=Lax; Secure; HttpOnly`
    }
  })
}

/**
 * https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps#2-users-are-redirected-back-to-your-site-by-github
 * @param context
 * @returns
 */
const handleRedirect: PagesFunction<Env> = async (context) => {
  const { env, request, waitUntil } = context;
  const url = new URL(request.url)

  const code = url.searchParams.get('code') || ''
  const state = url.searchParams.get('state') || ''
  const cookie = request.headers.get('cookie') || ''
  const { '__Secure-SessionId': expectedState } = parseCookie(cookie || '')

  // If the states don't match, then a third party created the request, and you should abort the process.
  if (state !== expectedState) {
    return new Response(
      JSON.stringify({ error: 'state mismatch', state, expectedState, cookie }),
      {
        status: 400,
        headers: {
          'content-type': 'application/json',
          'set-cookie': `__Secure-SessionId=0; expires=Thu, 01 Jan 1970 00:00:00 GMT`
        }
      }
    );
  }

  // get the github access token payload
  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code
    }),
    headers: {
      'content-type': 'application/json',
      'accept': 'application/json'
    }
  })

  const { access_token, token_type, scope } = await response.json<Record<string, string>>()

  // store the github oauth token into the durable object for authed session
  const doId = env.DO_SESSION.idFromString(state)
  const doStub = env.DO_SESSION.get(doId)
  waitUntil(doStub.fetch('https://do-session.workers.u0.vc/oauth-github', {
    method: 'POST',
    body: JSON.stringify({
      type: 'github',
      access_token,
      token_type,
      scope
    }),
    headers: {
      'content-type': 'application/json',
      'accept': 'application/json'
    }
  }))

  // redirect back to the web application
  return new Response(null, {
    status: 302, statusText: 'Found', headers: {
      location: url.origin
    }
  })
}

/**
 * OAuth2 Integration with GitHub
 * https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps
 *
 * @param context
 * @returns 
 */
export const onRequest: PagesFunction<Env> = async (context) => {
  const { request } = context;
  const url = new URL(request.url)

  if (url.pathname.endsWith('/authorize') && request.method === 'POST') {
    return requestIdentity(context)
  } else if (url.pathname.endsWith('/callback')) {
    return handleRedirect(context)
  }
  return new Response(null, { status: 400 })
}