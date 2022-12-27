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

Step 1. Add Issues Permission within Github App Settings.

Step 2. Setup a webhook to handle events when Issues changes.
