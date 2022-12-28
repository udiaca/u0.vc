import { createAppAuth } from "@octokit/auth-app"

/**
 * GitHub App Authenticated API Request
https://docs.github.com/en/developers/apps/building-github-apps/authenticating-with-github-apps#authenticating-as-a-github-app
 *
 * @param context
 * @returns
 */
export const onRequest: PagesFunction<Env> = async (context) => {
  const { env, request } = context
  const url = new URL(request.url)

  const { GITHUB_APP_PEM_KEY_CONTENTS, GITHUB_APP_ID, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = env

  if (!GITHUB_APP_PEM_KEY_CONTENTS) {
    return new Response(`no GITHUB_APP_PEM_KEY_CONTENTS set`, { status: 500 })
  }
  if (!GITHUB_APP_ID) {
    return new Response(`no GITHUB_APP_ID set`, { status: 500 })
  }
  if (!GITHUB_CLIENT_ID) {
    return new Response(`no GITHUB_CLIENT_ID set`, { status: 500 })
  }
  if (!GITHUB_CLIENT_SECRET) {
    return new Response('no GITHUB_CLIENT_SECRET set', { status: 500 })
  }

  const appAuth = createAppAuth({
    appId: GITHUB_APP_ID,
    privateKey: GITHUB_APP_PEM_KEY_CONTENTS,
    clientId: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
  });

  // const appAuthentication = await auth({
  //   type: "oauth-app",
  // });
  
  const { token } = await appAuth({ type: 'app' })

  return fetch("https://api.github.com/app", {
    headers: {
      "authorization": `Bearer ${token}`,
      // "authorization": appAuthentication.headers.authorization,
      "user-agent": "u0vc",
      "accept": "application/vnd.github+json"
    }
  })
}
