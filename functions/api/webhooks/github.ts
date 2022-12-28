import { createAppAuth } from "@octokit/auth-app";
import { timeSafeCompareStrings } from "@udia/crypt"
/**
 * https://docs.github.com/webhooks/
 * https://github.com/settings/apps/u0vc
 */
export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context

  const blob = await request.blob()
  const bodyBuffer = await blob.arrayBuffer()
  if (!bodyBuffer.byteLength) {
    return new Response("missing request body", { status: 400 })
  }

  const signature = request.headers.get('x-hub-signature-256')
  if (!signature || !signature.startsWith("sha256=")) {
    return new Response("missing valid x-hub-signature-256 header", { status: 400 })
  }

  const { GITHUB_WEBHOOK_SECRET, GITHUB_APP_PEM_KEY_CONTENTS, GITHUB_APP_ID, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GITHUB_APP_INSTALLATION_ID } = env

  if (!GITHUB_WEBHOOK_SECRET) {
    return new Response("missing GITHUB_WEBHOOK_SECRET env variable", { status: 500 })
  }
  if (!GITHUB_APP_INSTALLATION_ID) {
    return new Response("missing GITHUB_APP_INSTALLATION_ID env variable", { status: 500 })
  }

  const keyBytes = new TextEncoder().encode(GITHUB_WEBHOOK_SECRET)

  const cryptoKey = await crypto.subtle.importKey(
    "raw", keyBytes, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  )
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, bodyBuffer)

  // convert signature digest into hexadecimal string
  const hashArray = Array.from(new Uint8Array(sig))
  const hashedBody = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  const generatedSignature = `sha256=${hashedBody}`

  if (!await timeSafeCompareStrings(signature, generatedSignature)) {
    return new Response("x-hub-signature-256 hash mismatch", { status: 400 })
  }

  // const requestWithHeaders = { ...request, headers: Object.fromEntries([...request.headers.entries()]) }
  // console.log(JSON.stringify(requestWithHeaders, undefined, 2))

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

  // we have passed the Github webhook security checks
  // and can now handle business logic appropriately

  const rawReqPayload = await blob.text()
  let reqPayload: any = undefined
  try {
    reqPayload = JSON.parse(rawReqPayload)
  } catch {
    reqPayload = rawReqPayload
  }

  // if a new issue is created, set a label on the issue
  const githubEvent = request.headers.get('x-github-event')
  if (
    githubEvent === 'issues'
    && reqPayload
    && reqPayload['repository']['name']
    && reqPayload['issue']['number']
    && reqPayload['repository']['owner']['login']
  ) {
    const repositoryName = reqPayload['repository']['name']
    const issueNumber = reqPayload['issue']['number']
    const ownerName = reqPayload['repository']['owner']['login']

    const appAuth = createAppAuth({
      appId: GITHUB_APP_ID,
      privateKey: GITHUB_APP_PEM_KEY_CONTENTS,
      clientId: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      installationId: GITHUB_APP_INSTALLATION_ID
    });
    // const { token } = await auth({ type: 'app' })
    const authType = await appAuth({ type: 'installation' })
    const { token } = authType
    const issuesLabelsEndpoint = `https://api.github.com/repos/${ownerName}/${repositoryName}/issues/${issueNumber}/labels`
    return fetch(issuesLabelsEndpoint, {
      body: JSON.stringify({
        labels: ['udia-acknowledged']
      }),
      method: 'POST',
      headers: {
        "authorization": `Bearer ${token}`,
        "user-agent": "u0vc",
        "accept": "application/vnd.github+json"
      }
    })
  }

  return new Response(rawReqPayload, { headers: { 'content-type': 'application/json' } });
};
