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
      'set-cookie': `__Secure-SessionId=${id}; Domain=${url.host}; SameSite=Lax; Secure; HttpOnly`
    }
  })
}

const handleRedirect: PagesFunction<Env> = async (context) => {
  return new Response('todo')
}

/**
 * OAuth2 Integration with GitHub
 * https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps
 *
 * @param context
 * @returns 
 */
export const onRequest: PagesFunction<Env> = async (context) => {
  const { env, request } = context;
  const url = new URL(request.url)

  if (url.pathname === '/authorize') {
    return requestIdentity(context)
  } else if (url.pathname === '/callback') {
    return handleRedirect(context)
  }

  const id = env.DO_SESSION.newUniqueId()
  const doStub = env.DO_SESSION.get(id)
  return doStub.fetch(request)
}