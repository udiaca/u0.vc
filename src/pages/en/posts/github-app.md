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

Second. --Create a JSON Web Token signed using the PEM file contents, algorithm `RS256`.--
Use the `@octokit/auth-app` library to generate an authentication token for API requests.

NOTE: Key must be converted into `PKCS#8`
```bash
openssl pkcs8 -topk8 -inform PEM -outform PEM -nocrypt -in u0vc.2022-12-26.private-key.pem -out u0vc.2022-12-26.private-key-pkcs8.pem
```

Third. [Ensure that the request to get the authenticated application is working](https://docs.github.com/rest/reference/apps#get-the-authenticated-app).