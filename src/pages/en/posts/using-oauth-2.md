---
layout: ../../../layouts/MarkdownLayout.astro
title: 'Using OAuth 2.0'
draft: true
---

# GitHub

[Building OAuth Apps](https://docs.github.com/en/developers/apps/building-oauth-apps) is the starting point for GitHub's documentation regarding their OAuth identity provider.

## Web application flow

1. Users are redirect to request their GitHub identity
2. Users are redirected back to your site by GitHub
3. Your app access the API with the user's access token

### Request a user's GitHub identity

```
GET https://github.com/login/oauth/authorize
```

Parameters:

- `client_id` Required. OAuth app client ID.
- `redirect_uri` The URL in your application where users will be sent after authorization.
- `login` Suggests a specific account to use for signing in and authorizing
- `scope` A space delimited list of [scopes](https://docs.github.com/en/developers/apps/building-oauth-apps/scopes-for-oauth-apps).
- `state` An unguessable random string
- `allow_signup` should unauthorized users be offered an option to sign up for GitHub during OAuth flow?

# Ory

[Ory is open source identity software](https://www.ory.sh/).
Their mission is to provide a common access control, authorization and identity infrastructure that manages IAM and the associated data created in cloud applications.

## Getting Started

[Develop applications on your local machine](https://www.ory.sh/docs/getting-started/local-development).

```bash
brew install ory/tap/cli
ory version
```

```
Version:    v0.1.48
Git Hash:   a88cf27f5c030ecbb517c91bdac7e57f15df0207
Build Time: 2022-11-07T22:19:14Z
```

To create an Ory project run `ory create project --name "u0.vc"` replacing `u0.vc` with your project name.

### Ory APIs

We will access the Admin and Public APIs associated with the project.

```typescript
import { Configuration, IdentityApi } from '@ory/client'

const identity = new IdentityApi(
  new Configuration({
    basePath: 'https://wonderful-aryabhata-8fbzdlkybk.projects.oryapis.com/',
    baseOptions: {
      withCredentials: true,
    },
  })
)
```

```json
{
  "basePath": "https://wonderful-aryabhata-8fbzdlkybk.projects.oryapis.com/",
  "configuration": {
    "basePath": "https://wonderful-aryabhata-8fbzdlkybk.projects.oryapis.com/",
    "baseOptions": { "withCredentials": true }
  }
}
```

Refer to the [Protocol buffers API](https://www.ory.sh/docs/keto/reference/proto-api) or [HTTP/Rest API](https://www.ory.sh/docs/keto/reference/rest-api) for additional information.

### Tunneling to Local

When developing on our local application (e.g. `localhost` domain) Ory needs to be exposed on the same domain to avoid issues with third-party cookies.

```bash
ory tunnel --dev --project wonderful-aryabhata-8fbzdlkybk https://127.0.0.1:8789 --port 80
```

Observe that port `80` is opened and serving the Ory API through http.
We need to tunnel this through `https` to be consistent with our localhost development environment.

```bash
npm run proxy:https:ory
npx local-ssl-proxy --source 443 --target 80 --key localhost+2-key.pem --cert localhost+2.pem
```

Our application is running on `https://127.0.0.1:8788`.
After starting the Tunnel, test it by performing the registration flow:
[127.0.0.1:4000/ui/registration](http://127.0.0.1:4000/ui/registration)

> Registered a new user locally. Got redirected back to my app afterwards.

The tunnel should allow access to Ory Managed UI:

- `/ui/login`
- `/ui/registration`
- `/ui/settings`
- `/ui/verification`
- `/ui/recovery`
- `/ui/error`

Let's add a functions API endpoint `/api/auth/ory` that returns the authenticated user's identity.

**work in progress**: `functions/api/auth/ory/[[path]].ts`

**update**: instead of dealing with this local tunnel and all of the challenges. rely on the serverless function to proxy out similar to their [official supported next-edge integration](https://github.com/ory/integrations/blob/main/src/next-edge/index.ts)


```typescript
import { Configuration, FrontendApi } from "@ory/client";

/**
 * NOTE: this throws an exception in Axios code when run in the CF workers runtime
 * environment `TypeError: adapter is not a function`
 * https://community.cloudflare.com/t/typeerror-e-adapter-s-adapter-is-not-a-function/166469/3?u=uda
 * https://stackoverflow.com/questions/66305856/typeerror-adapter-is-not-a-function-error-when-using-axios-and-webpack-in-chrom
 */
const ory = new FrontendApi(
  new Configuration({
    oryBasePath,
    baseOptions: {
      withCredentials: true,
    },
  }),
)
const { data, headers, status, statusText } = await ory.toSession({ cookie })
```

> `workaround`: just use fetch and forward the requests without the client, referencing the rest API


```
==== localhost rewrite http://127.0.0.1:8789/api/auth/ory
WARNING: known issue with `fetch()` requests to custom HTTPS ports in published Workers:
 - https://127.0.0.1:8789/api/hello - the custom port will be ignored when the Worker is published using the `wrangler publish` command.

[pages:err] GET /api/auth/ory: TypeError: fetch failed
    at Object.processResponse (/Users/alexander/sandbox/src/github.com/udiaca/u0.vc/node_modules/wrangler/node_modules/undici/lib/fetch/index.js:199:23)
    at /Users/alexander/sandbox/src/github.com/udiaca/u0.vc/node_modules/wrangler/node_modules/undici/lib/fetch/index.js:928:38
    at node:internal/process/task_queues:141:7
    at AsyncResource.runInAsyncScope (node:async_hooks:202:9)
    at AsyncResource.runMicrotask (node:internal/process/task_queues:138:8)
    at processTicksAndRejections (node:internal/process/task_queues:96:5)
[pages:err] Cause: Error: unable to verify the first certificate
    at TLSSocket.onConnectSecure (node:_tls_wrap:1532:34)
    at TLSSocket.emit (node:events:527:28)
    at TLSSocket.emit (node:domain:475:12)
    at TLSSocket._finishInit (node:_tls_wrap:946:8)
    at TLSWrap.ssl.onhandshakedone (node:_tls_wrap:727:12)
    at TLSWrap.callbackTrampoline (node:internal/async_hooks:130:17)
GET /api/auth/ory 500 Internal Server Error (90.44ms)
```

> `workaround`: bind Ory to localhost 80. also proxy out https to 443. Ory is now running on `127.0.0.1`/`localhost`. Ensure that Wrangler local development environment calls are made through `http`.

```typescript
export const onRequest: PagesFunction<Env> = async (context) => {
  const { env, request } = context;
  const url = new URL(request.url);
  const { ORY_SDK_URL } = env

  const oryBasePath = ORY_SDK_URL || "https://playground.projects.oryapis.com"
  const oryApiUrl = new URL(oryBasePath)

  const cookie = request.headers.get('cookie')
  if (!cookie) {
    return new Response("missing cookie", { status: 400 })
  }

  /**
   * Forward the request to ory, but strip out the leading /api/auth/ory/*
   */
  const curPathPrefix = "/api/auth/ory"
  if (!url.pathname.startsWith(curPathPrefix)) {
    return new Response("ory path called outside of /api/auth/ory", { status: 500 })
  }

  const newPath = url.pathname.slice(curPathPrefix.length)
  console.log(`==== ${oryBasePath}${newPath}`)
  return fetch(`${oryApiUrl.origin}${newPath}`, {
    headers: { cookie }
  })
};
```
