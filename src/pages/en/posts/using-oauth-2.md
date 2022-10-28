---
layout: ../../../layouts/MarkdownLayout.astro
title: "Using OAuth 2.0"
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

