import { genSessionCookie } from '../logout'
import { parseCookie } from '../../../../src/utils/parseCookie'

/**
 * https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps#1-request-a-users-github-identity
 * @param context
 * @returns
 */
const requestIdentity: PagesFunction<Env> = async (context) => {
  const { env, request, waitUntil } = context
  const url = new URL(request.url)

  if (!env.DO_SESSION) {
    return new Response(
      JSON.stringify({
        error: 'DO_SESSION binding not supported in local dev',
      }),
      {
        status: 400,
        headers: {
          'content-type': 'application/json',
          'set-cookie': genSessionCookie(url.host),
        },
      }
    )
  }

  const id = env.DO_SESSION.newUniqueId()

  const requestIdentityEndpoint = 'https://github.com/login/oauth/authorize'

  const requestParameters = new URLSearchParams({
    client_id: env.GITHUB_CLIENT_ID,
    redirect_uri: url.origin + '/api/auth/github/callback',
    scope: 'read:user user:email',
    state: id.toString(),
    allow_signup: 'true',
  })

  const doStub = env.DO_SESSION.get(id)
  waitUntil(
    doStub.fetch('https://do-session.workers.u0.vc', {
      method: 'POST',
      body: JSON.stringify({
        createdAt: new Date().toISOString(),
        latestCf: (request as any).cf || null,
      }),
      headers: {
        'content-type': 'application/json',
      },
    })
  )

  const location = requestIdentityEndpoint + '?' + requestParameters.toString()

  return new Response(null, {
    status: 302,
    statusText: 'Found',
    headers: {
      location,
      'set-cookie': genSessionCookie(url.host, id.toString(), 31557600),
    },
  })
}

/**
 * https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps#2-users-are-redirected-back-to-your-site-by-github
 * @param context
 * @returns
 */
const handleRedirect: PagesFunction<Env> = async (context) => {
  const { env, request, waitUntil } = context
  const url = new URL(request.url)

  const code = url.searchParams.get('code') || ''
  const state = url.searchParams.get('state') || ''
  const cookie = request.headers.get('cookie') || ''
  const { '__Secure-SessionId': expectedState } = parseCookie(cookie || '')

  // If the states don't match, then a third party created the request, and you should abort the process.
  if (state !== expectedState) {
    return new Response(
      JSON.stringify({
        error: 'state mismatch',
        state,
        expectedState,
        cookie,
      }),
      {
        status: 400,
        headers: {
          'content-type': 'application/json',
          'set-cookie': genSessionCookie(url.host),
        },
      }
    )
  }

  // get the github access token payload
  let payload: Record<string, string> = {}
  try {
    const response = await fetch(
      'https://github.com/login/oauth/access_token',
      {
        method: 'POST',
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
        }),
        headers: {
          'content-type': 'application/json',
          accept: 'application/json',
        },
      }
    )
    payload = await response.json<Record<string, string>>()
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: 'github request exception',
        state,
        expectedState,
        cookie,
        err,
      }),
      {
        status: 400,
        headers: {
          'content-type': 'application/json',
          'set-cookie': genSessionCookie(url.host),
        },
      }
    )
  }

  const { access_token, token_type, scope } = payload

  // fetch the github user and attach it to our user object.
  const ghResp = await fetch(
    new Request('https://api.github.com/user', {
      headers: {
        authorization: `${token_type} ${access_token}`,
        'content-type': 'application/json',
        'user-agent': 'UDIA',
      },
    })
  )
  const githubUser = (await ghResp.json()) as any
  if (!githubUser.id) {
    throw new Error('githubUser returned without id')
  }

  // store the github oauth token into the durable object for auth'd session
  // and create an user object containing the session reference
  const doSessionId = env.DO_SESSION.idFromString(state)
  const doSessionStub = env.DO_SESSION.get(doSessionId)

  const doUserId = env.DO_USER.idFromName(`github-${githubUser.id}`)
  const doUserStub = env.DO_USER.get(doUserId)

  const now = Date.now()

  waitUntil(
    Promise.all([
      doSessionStub.fetch('https://do-session.workers.u0.vc', {
        method: 'POST',
        body: JSON.stringify({
          'oauth-github': {
            type: 'github',
            access_token,
            token_type,
            scope,
          },
          [`user-${now}`]: doUserId.toString(),
        }),
        headers: {
          'content-type': 'application/json',
          accept: 'application/json',
        },
      }),
      doUserStub.fetch('https://do-user.workers.u0.vc', {
        method: 'POST',
        body: JSON.stringify({
          [`session-${now}`]: doSessionId.toString(),
          githubUser,
        }),
      }),
    ])
  )

  // redirect back to the web application
  return new Response(null, {
    status: 302,
    statusText: 'Found',
    headers: {
      location: url.origin,
    },
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
  const { request } = context
  const url = new URL(request.url)

  if (url.pathname.endsWith('/authorize') && request.method === 'POST') {
    return requestIdentity(context)
  } else if (url.pathname.endsWith('/callback')) {
    return handleRedirect(context)
  }
  return new Response(null, { status: 400 })
}
