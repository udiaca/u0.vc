---
layout: ../../../layouts/MarkdownLayout.astro
title: "Cookies Overview"
draft: true
---

# HTTP Cookies

[Using HTTP cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies) is an important tool for web development.

Cookies are small pieces of data stored within your web browser. (e.g. _Inspector_ > _Storage_ > _Cookies_)

The browser may store this cookie and send it to the server with each request.

A server may send one or more [`set-cookie`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie) HTTP headers with each response.

You can specify an expiration date or time period after which the cookie shouldn't be sent.

You can set paths, or restrict the cookie to a specific domain.

## Lifetime of a cookie

- **Session cookies** are deleted when the current session ends.
  - The browser defines the "current session" duration. Some browsers use "session restoring when restarting", causing session cookies to last indefinitely.
- **Permanent cookies** are deleted at a date specified by the `Expires` attribute or after a period of time specified by the `Max-Age` attribute.

For example:

```
Set-Cookie: id=a3fWa; Expires=Thu, 31 Oct 2021 07:28:00 GMT;
```

## Authentication cookie

Set a `session` cookie for the domain `u0.vc` that are:

- sent when a user is navigating to the origin site (even from an external site) (`SameSite=Lax` attribute)
- only set from a secure (HTTPS) page (`__Secure-` prefix)
- only sent to secure (HTTPS) page (`Secure` attribute)
- not accessible from JavaScript (`HttpOnly` attribute)

```
Set-Cookie: __Secure-Auth=<auth-cookie>; Domain=u0.vc SameSite=Lax; Secure; HttpOnly
```
