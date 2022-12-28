---
layout: ../../../layouts/MarkdownLayout.astro
title: "GitHub App"
description: "How do I make the source code part of the content?"
draft: true
---

# Creating a GitHub App

[Creating a GitHub App](https://docs.github.com/en/developers/apps/building-github-apps/creating-a-github-app) such that I can access meta details of the u0.vc repository.

> Created. Application details are available within [github.com/settings/apps/u0vc](https://github.com/settings/apps/u0vc)


# Authentication

## Generating a private key

[Private keys are generated after a GitHub App is created.](https://docs.github.com/en/developers/apps/building-github-apps/authenticating-with-github-apps#generating-a-private-key) Private keys are used to sign access token requests.

> Created. I put the private key in the root of the repository and added a specific gitignore entry.
> I also verified the PEM using:

> `openssl rsa -in u0vc.2022-12-26.private-key.pem -pubout -outform DER | openssl sha256 -binary | openssl base64`

## Authenticating as a GitHub App

[Authenticating as a GitHub App](https://docs.github.com/en/developers/apps/building-github-apps/authenticating-with-github-apps#authenticating-as-a-github-app) requires using the PEM key to sign a [JSON Web Token](https://jwt.io/introduction) and encode it using the `RS256` algorithm.

---

Refer to:

- `functions/api/github/[[path]].ts`

First. Store the PEM file contents in an environment variable. Also set the client application id in the environment variables as well.

Second. -Create a JSON Web Token signed using the PEM file contents, algorithm `RS256`.-
Use the `@octokit/auth-app` library to generate an authentication token for API requests.

NOTE: Key must be converted into `PKCS#8`
```bash
openssl pkcs8 -topk8 -inform PEM -outform PEM -nocrypt -in u0vc.2022-12-26.private-key.pem -out u0vc.2022-12-26.private-key-pkcs8.pem
```

Third. [Ensure that the request to get the authenticated application is working](https://docs.github.com/rest/reference/apps#get-the-authenticated-app).

> I can now make requests to `https://127.0.0.1:8788/api/github/app` and it returns:

```json
{
  "id": 275937,
  "slug": "u0vc",
  "node_id": "A_kwDOACodr84ABDXh",
  "owner": {
    "login": "awwong1",
    "id": 2760111,
    "node_id": "MDQ6VXNlcjI3NjAxMTE=",
    "avatar_url": "https://avatars.githubusercontent.com/u/2760111?v=4",
    "gravatar_id": "",
    "url": "https://api.github.com/users/awwong1",
    "html_url": "https://github.com/awwong1",
    "followers_url": "https://api.github.com/users/awwong1/followers",
    "following_url": "https://api.github.com/users/awwong1/following{/other_user}",
    "gists_url": "https://api.github.com/users/awwong1/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/awwong1/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/awwong1/subscriptions",
    "organizations_url": "https://api.github.com/users/awwong1/orgs",
    "repos_url": "https://api.github.com/users/awwong1/repos",
    "events_url": "https://api.github.com/users/awwong1/events{/privacy}",
    "received_events_url": "https://api.github.com/users/awwong1/received_events",
    "type": "User",
    "site_admin": false
  },
  "name": "u0vc",
  "description": "GitHub Application for Udia.\r\n\r\nI want the content within https://u0.vc to be closely coupled with its underlying source code.",
  "external_url": "https://u0.vc",
  "html_url": "https://github.com/apps/u0vc",
  "created_at": "2022-12-26T18:14:56Z",
  "updated_at": "2022-12-27T00:11:32Z",
  "permissions": {
    "contents": "read",
    "metadata": "read"
  },
  "events": [],
  "installations_count": 1
}
```

## Using the GitHub API in your app

Now that we have our App, let's [use the github api and add a new label to issues opened in the repository](https://docs.github.com/en/developers/apps/guides/using-the-github-api-in-your-app).
NOTE: The Github documentation steps are written for `Ruby`, but we can tweak it slightly for our Cloudflare Pages app.

### Webhook Initial Setup

[Setup a webhook to handle events when Issues changes](https://docs.github.com/en/developers/webhooks-and-events/webhooks/webhook-events-and-payloads#issues).

> Created a stub webhook endpoint at `functions/api/webhooks/github.ts`
>
> Went into [github.com/udiaca/u0.vc/settings/hooks](https://github.com/udiaca/u0.vc/settings/hooks) and added a new webhook.
>
> [Let's expose localhost to the internet using](https://docs.github.com/en/developers/webhooks-and-events/webhooks/creating-webhooks#exposing-localhost-to-the-internet) [`ngrok`](https://ngrok.com/).
>
> `ngrok http https://127.0.0.1:8788`
>
> - This is less than ideal due to the fact that ngrok is a freemium tiered service and that the forwarding URL changes each time.
>
> [Then we ensure that this webhook is added to the repository.](https://github.com/udiaca/u0.vc/settings/hooks)

[Make sure to test the webhooks thoroughly by redelivering historical events.](https://docs.github.com/en/developers/webhooks-and-events/webhooks/testing-webhooks)

> Yep! The `ping` event appears to be delivered successfully.

```json
{
  "zen": "Practicality beats purity.",
  "hook_id": 394316130,
  "hook": {
    "type": "Repository",
    "id": 394316130,
    "name": "web",
    "active": true,
    "events": [
      "*"
    ],
    "config": {
      "content_type": "form",
      "insecure_ssl": "0",
      "url": "https://64f1-2a09-bac1-14a0-110-00-21e-ac.ngrok.io/api/webhooks/github"
    },
    "updated_at": "2022-12-28T01:21:45Z",
    "created_at": "2022-12-28T01:21:45Z",
    "url": "https://api.github.com/repos/udiaca/u0.vc/hooks/394316130",
    "test_url": "https://api.github.com/repos/udiaca/u0.vc/hooks/394316130/test",
    "ping_url": "https://api.github.com/repos/udiaca/u0.vc/hooks/394316130/pings",
    "deliveries_url": "https://api.github.com/repos/udiaca/u0.vc/hooks/394316130/deliveries",
    "last_response": {
      "code": null,
      "status": "unused",
      "message": null
    }
  },
  "repository": {
    "id": 539781213,
    "node_id": "R_kgDOICxoXQ",
    "name": "u0.vc",
    "full_name": "udiaca/u0.vc",
    "private": false,
    "owner": {
      "login": "udiaca",
      "id": 102311358,
      "node_id": "O_kgDOBhklvg",
      "avatar_url": "https://avatars.githubusercontent.com/u/102311358?v=4",
      "gravatar_id": "",
      "url": "https://api.github.com/users/udiaca",
      "html_url": "https://github.com/udiaca",
      "followers_url": "https://api.github.com/users/udiaca/followers",
      "following_url": "https://api.github.com/users/udiaca/following{/other_user}",
      "gists_url": "https://api.github.com/users/udiaca/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/udiaca/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/udiaca/subscriptions",
      "organizations_url": "https://api.github.com/users/udiaca/orgs",
      "repos_url": "https://api.github.com/users/udiaca/repos",
      "events_url": "https://api.github.com/users/udiaca/events{/privacy}",
      "received_events_url": "https://api.github.com/users/udiaca/received_events",
      "type": "Organization",
      "site_admin": false
    },
    "html_url": "https://github.com/udiaca/u0.vc",
    "description": null,
    "fork": false,
    "url": "https://api.github.com/repos/udiaca/u0.vc",
    "forks_url": "https://api.github.com/repos/udiaca/u0.vc/forks",
    "keys_url": "https://api.github.com/repos/udiaca/u0.vc/keys{/key_id}",
    "collaborators_url": "https://api.github.com/repos/udiaca/u0.vc/collaborators{/collaborator}",
    "teams_url": "https://api.github.com/repos/udiaca/u0.vc/teams",
    "hooks_url": "https://api.github.com/repos/udiaca/u0.vc/hooks",
    "issue_events_url": "https://api.github.com/repos/udiaca/u0.vc/issues/events{/number}",
    "events_url": "https://api.github.com/repos/udiaca/u0.vc/events",
    "assignees_url": "https://api.github.com/repos/udiaca/u0.vc/assignees{/user}",
    "branches_url": "https://api.github.com/repos/udiaca/u0.vc/branches{/branch}",
    "tags_url": "https://api.github.com/repos/udiaca/u0.vc/tags",
    "blobs_url": "https://api.github.com/repos/udiaca/u0.vc/git/blobs{/sha}",
    "git_tags_url": "https://api.github.com/repos/udiaca/u0.vc/git/tags{/sha}",
    "git_refs_url": "https://api.github.com/repos/udiaca/u0.vc/git/refs{/sha}",
    "trees_url": "https://api.github.com/repos/udiaca/u0.vc/git/trees{/sha}",
    "statuses_url": "https://api.github.com/repos/udiaca/u0.vc/statuses/{sha}",
    "languages_url": "https://api.github.com/repos/udiaca/u0.vc/languages",
    "stargazers_url": "https://api.github.com/repos/udiaca/u0.vc/stargazers",
    "contributors_url": "https://api.github.com/repos/udiaca/u0.vc/contributors",
    "subscribers_url": "https://api.github.com/repos/udiaca/u0.vc/subscribers",
    "subscription_url": "https://api.github.com/repos/udiaca/u0.vc/subscription",
    "commits_url": "https://api.github.com/repos/udiaca/u0.vc/commits{/sha}",
    "git_commits_url": "https://api.github.com/repos/udiaca/u0.vc/git/commits{/sha}",
    "comments_url": "https://api.github.com/repos/udiaca/u0.vc/comments{/number}",
    "issue_comment_url": "https://api.github.com/repos/udiaca/u0.vc/issues/comments{/number}",
    "contents_url": "https://api.github.com/repos/udiaca/u0.vc/contents/{+path}",
    "compare_url": "https://api.github.com/repos/udiaca/u0.vc/compare/{base}...{head}",
    "merges_url": "https://api.github.com/repos/udiaca/u0.vc/merges",
    "archive_url": "https://api.github.com/repos/udiaca/u0.vc/{archive_format}{/ref}",
    "downloads_url": "https://api.github.com/repos/udiaca/u0.vc/downloads",
    "issues_url": "https://api.github.com/repos/udiaca/u0.vc/issues{/number}",
    "pulls_url": "https://api.github.com/repos/udiaca/u0.vc/pulls{/number}",
    "milestones_url": "https://api.github.com/repos/udiaca/u0.vc/milestones{/number}",
    "notifications_url": "https://api.github.com/repos/udiaca/u0.vc/notifications{?since,all,participating}",
    "labels_url": "https://api.github.com/repos/udiaca/u0.vc/labels{/name}",
    "releases_url": "https://api.github.com/repos/udiaca/u0.vc/releases{/id}",
    "deployments_url": "https://api.github.com/repos/udiaca/u0.vc/deployments",
    "created_at": "2022-09-22T03:26:08Z",
    "updated_at": "2022-12-14T05:49:28Z",
    "pushed_at": "2022-12-27T23:18:41Z",
    "git_url": "git://github.com/udiaca/u0.vc.git",
    "ssh_url": "git@github.com:udiaca/u0.vc.git",
    "clone_url": "https://github.com/udiaca/u0.vc.git",
    "svn_url": "https://github.com/udiaca/u0.vc",
    "homepage": "https://u0.vc",
    "size": 1263,
    "stargazers_count": 0,
    "watchers_count": 0,
    "language": "Python",
    "has_issues": true,
    "has_projects": true,
    "has_downloads": true,
    "has_wiki": true,
    "has_pages": false,
    "has_discussions": false,
    "forks_count": 0,
    "mirror_url": null,
    "archived": false,
    "disabled": false,
    "open_issues_count": 3,
    "license": {
      "key": "agpl-3.0",
      "name": "GNU Affero General Public License v3.0",
      "spdx_id": "AGPL-3.0",
      "url": "https://api.github.com/licenses/agpl-3.0",
      "node_id": "MDc6TGljZW5zZTE="
    },
    "allow_forking": true,
    "is_template": false,
    "web_commit_signoff_required": false,
    "topics": [

    ],
    "visibility": "public",
    "forks": 0,
    "open_issues": 3,
    "watchers": 0,
    "default_branch": "preview"
  },
  "sender": {
    "login": "awwong1",
    "id": 2760111,
    "node_id": "MDQ6VXNlcjI3NjAxMTE=",
    "avatar_url": "https://avatars.githubusercontent.com/u/2760111?v=4",
    "gravatar_id": "",
    "url": "https://api.github.com/users/awwong1",
    "html_url": "https://github.com/awwong1",
    "followers_url": "https://api.github.com/users/awwong1/followers",
    "following_url": "https://api.github.com/users/awwong1/following{/other_user}",
    "gists_url": "https://api.github.com/users/awwong1/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/awwong1/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/awwong1/subscriptions",
    "organizations_url": "https://api.github.com/users/awwong1/orgs",
    "repos_url": "https://api.github.com/users/awwong1/repos",
    "events_url": "https://api.github.com/users/awwong1/events{/privacy}",
    "received_events_url": "https://api.github.com/users/awwong1/received_events",
    "type": "User",
    "site_admin": false
  }
}
```

### Secure Webhook with Secret

[Secure the webhooks with a secret token as well before deploying this out to production.](https://docs.github.com/en/developers/webhooks-and-events/webhooks/securing-your-webhooks)

---

I generated a new random secret and set the environment variable `GITHUB_WEBHOOK_SECRET`.

`xxd -l 32 -c 32 -p < /dev/random`

[This secret is used to hash our webhook requests and then stored in the header as `x-hub-signature-256`.](https://docs.github.com/en/developers/webhooks-and-events/webhooks/securing-your-webhooks#validating-payloads-from-github)

```typescript
export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context
  const { GITHUB_WEBHOOK_SECRET } = env

  const blob = await request.blob()
  const bodyBuffer = await blob.arrayBuffer()
  const signature = request.headers.get('x-hub-signature-256')
  const keyBytes = new TextEncoder().encode(GITHUB_WEBHOOK_SECRET)
  const cryptoKey = await crypto.subtle.importKey(
    "raw", keyBytes, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  )
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, bodyBuffer)

  // convert signature digest into hexadecimal string
  const hashArray = Array.from(new Uint8Array(sig))
  const hashedBody = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  const generatedSignature = `sha256=${hashedBody}`

  if (signature != generatedSignature) {
    return new Response("x-hub-signature-256 hash mismatch", { status: 400 })
  }

  // we have passed the Github webhook security checks
  // and can now handle business logic appropriately here
  return new Response(await blob.text(), { headers: { 'content-type': 'application/json' } });
};
```

