import { parseSetCookie, serialize } from "../../src/utils/parseCookie"

function filterRequestHeaders(
  headers: Headers,
  forwardAdditionalHeaders?: string[],
): Record<string, string> {
  const defaultForwardedHeaders = [
    "accept",
    "accept-charset",
    "accept-encoding",
    "accept-language",
    "authorization",
    "cache-control",
    "content-type",
    "cookie",
    "host",
    "user-agent",
    "referer",
  ]

  const newHeaders: Record<string, string> = {}

  headers.forEach((value, key) => {
    if (defaultForwardedHeaders.includes(key) || (forwardAdditionalHeaders ?? []).includes(key)) {
      newHeaders[key] = value
    }
  })

  return newHeaders
}

const encode = (v: string) => v

interface CreateApiHandlerOptions {
  /**
   * If set overrides the API Base URL. Usually, this URL
   * is taken from the ORY_KRATOS_URL environment variable.
   *
   * If you don't have a project you can use the playground project SDK URL:
   *
   *  https://playground.projects.oryapis.com
   */
  apiBaseUrlOverride?: string

  /**
   * Per default, this handler will strip the cookie domain from
   * the Set-Cookie instruction which is recommended for most set ups.
   *
   * If you are running this app on a subdomain and you want the session and CSRF cookies
   * to be valid for the whole TLD, you can use this setting to force a cookie domain.
   *
   * Please be aware that his method disables the `dontUseTldForCookieDomain` option.
   */
  forceCookieDomain?: string

  /**
   * Per default the cookie will be set on the hosts top-level-domain. If the app
   * runs on www.example.org, the cookie domain will be set automatically to example.org.
   *
   * Set this option to true to disable that behaviour.
   */
  dontUseTldForCookieDomain?: boolean

  /**
   * If set to true will set the "Secure" flag for all cookies. This might come in handy when you deploy
   * not on Vercel.
   */
  forceCookieSecure?: boolean | undefined

  /**
   * If set to true will fallback to the playground if no other value is set for the Ory SDK URL.
   */
  fallbackToPlayground?: boolean

  /*
   * Per default headers are filtered to forward only a fixed list.
   *
   * If you need to forward additional headers you can use this setting to define them.
   */
  forwardAdditionalHeaders?: string[]
}

function guessCookieDomain(
  url: string | undefined,
  options: CreateApiHandlerOptions,
) {
  if (!url || options.forceCookieDomain) {
    return options.forceCookieDomain
  }

  if (options.dontUseTldForCookieDomain) {
    return undefined
  }

  try {
    const urlObj = new URL(url || "")
    return urlObj.hostname
  } catch {
    return undefined
  }
}

function getBaseUrl(options: CreateApiHandlerOptions, env: Env) {
  let baseUrl = options.fallbackToPlayground
    ? "https://playground.projects.oryapis.com/"
    : ""

  if (env.ORY_SDK_URL) {
    baseUrl = env.ORY_SDK_URL
  }

  if (env.ORY_KRATOS_URL) {
    baseUrl = env.ORY_KRATOS_URL
  }

  if (env.ORY_SDK_URL && env.ORY_KRATOS_URL) {
    throw new Error("Only one of ORY_SDK_URL or ORY_KRATOS_URL can be set.")
  }

  if (options.apiBaseUrlOverride) {
    baseUrl = options.apiBaseUrlOverride
  }

  return baseUrl.replace(/\/$/, "")
}

/**
 * Slack: https://ory-community.slack.com/archives/C010F7Z4XM1/p1672384248090049
 * I am trying to modify the ory/integrations/next-edge logic to work with Cloudflare Functions.
 * I can proxy through to the Ory provided UI using https://u0.vc/ory/ui/welcome but within the Sign In and Sign Up flows the POST request calls the project slug endpoint and subsequently throws a CSRF mismatch error. I suspect that this is due to the returned form not using the proxied endpoint as its form action. Can I get some guidance here?
 * See also: https://github.com/udiaca/u0.vc/blob/preview/functions/ory/%5B%5Bpath%5D%5D.ts
 */
class OryRewriteHandler implements HTMLRewriterElementContentHandlers {
  reqUrl: URL
  baseUrl: string
  constructor(reqUrl: URL, baseUrl: string) {
    this.reqUrl = reqUrl
    this.baseUrl = baseUrl
  }
  element(element: Element) {
    const attributes = ["action", "href"]
    attributes.forEach(attribute => {
      const value = element.getAttribute(attribute)
      if (value && value.indexOf(this.baseUrl) === 0) {
        element.setAttribute(attribute, value.replace(this.baseUrl, `https://${this.reqUrl.host}/ory`))
      }
    })
  }
}

class OryContentHandler implements HTMLRewriterElementContentHandlers {
  reqUrl: URL
  baseUrlHostname: string
  constructor(reqUrl: URL, baseUrl: string) {
    this.reqUrl = reqUrl
    this.baseUrlHostname = new URL(baseUrl).hostname
  }
  text(text: Text) {
    if (text.text && text.text.includes(this.baseUrlHostname)) {
      const newText = text.text.replaceAll(this.baseUrlHostname, `https://${this.reqUrl.host}/ory`)
      text.replace(newText)
    }
  }
}

const rewriteOryLocationHeader = (location: string, baseUrl: string, reqUrl: URL) => {
  // our location is the Ory provided project slug uri (e.g. https://*.projects.oryapis.com/path)
  // so we need to replace this with /ory/path
  if (location.indexOf(baseUrl) === 0) {
    return location.replace(
      baseUrl,
      "/ory",
    )
  }

  // our location is redirecting to an ory managed endpoint but does not have /ory prefix
  if (
    location.indexOf("/api/kratos/public/") === 0 ||
    location.indexOf("/self-service/") === 0 ||
    location.indexOf("/ui/") === 0
  ) {
    return "/ory" + location
  }

  try {
    const locationUrl = new URL(location)
    const search = locationUrl.searchParams
    const redirectUri = search.get('redirect_uri')
    // we may have a GitHub OpenID Connect flow callback
    // and we need to convert the redirect_uri_mismatch to equal our CF functions proxy endpoint
    if (redirectUri) {
      let rewrittenRedirectUri = rewriteOryLocationHeader(redirectUri, baseUrl, reqUrl)
      if (rewrittenRedirectUri.indexOf("/ory") === 0) {
        // redirect_uri needs to go back to original request origin
        rewrittenRedirectUri = `${reqUrl.origin}${rewrittenRedirectUri}`
      }

      search.set("redirect_uri", rewrittenRedirectUri)
      location = `${locationUrl.origin}${locationUrl.pathname}?${search.toString()}`
    }
  } catch {}
  return location
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request: req, env } = context

  const reqUrl = new URL(req.url)
  const search = reqUrl.searchParams
  const path = reqUrl.pathname.replace(/^\/ory/, "")

  const options: CreateApiHandlerOptions = {
    fallbackToPlayground: true,
    dontUseTldForCookieDomain: false,
    forwardAdditionalHeaders: [],
    forceCookieSecure: true
  }
  const baseUrl = getBaseUrl(options, env)
  const url = `${baseUrl}${path}?${search.toString()}`

  // if (path === "/ui/welcome") {
  //   // A special for redirecting to the home page
  //   // if we were being redirected to the hosted UI
  //   // welcome page.
  //   return new Response(null, { status: 303, headers: { 'location': '/' } })
  // }

  // const isTls = reqUrl.protocol === 'https:'
  const isTls = true;

  const forwardToOryHeaders = filterRequestHeaders(
    req.headers,
    options.forwardAdditionalHeaders,
  )

  forwardToOryHeaders["X-Ory-Base-URL-Rewrite"] = "false"
  forwardToOryHeaders["Ory-Base-URL-Rewrite"] = "false"
  forwardToOryHeaders["Ory-No-Custom-Domain-Redirect"] = "true"

  const newOryRequestInit = {
    redirect: 'manual' as const,
    headers: forwardToOryHeaders,
    // credentials: "include" as const,
  }
  const toOryRequest = new Request(url, new Request(req, newOryRequestInit));
  const oryResp = await fetch(toOryRequest)
  const fwdResp = new Response(oryResp.body, { headers: oryResp.headers, status: oryResp.status, statusText: oryResp.statusText })

  const location = oryResp.headers.get('location')
  if (location) {
    fwdResp.headers.set('location', rewriteOryLocationHeader(location, baseUrl, reqUrl))
  }

  const secure =
    options.forceCookieSecure === undefined
      ? isTls
      : options.forceCookieSecure

  const forwardedHost = req.headers.get('x-forwarded-host')
  const host = forwardedHost || req.headers.get('host') || reqUrl.host

  const domain = guessCookieDomain(host, options)

  const setCookieHeader = oryResp.headers.get('set-cookie') || ""

  console.log(`==== typeof setCookieHeader: ${typeof setCookieHeader}`)
  console.log(`==== setCookieHeader: ${setCookieHeader}`)

  const fwdSetCookieHeaders = parseSetCookie(setCookieHeader)
    .map((cookie) => ({
      ...cookie,
      domain,
      secure,
      encode,
    }))
    .map(({ value, name, ...options }: any) =>
      serialize(name, value, options),
    )

  console.log(`==== typeof fwdSetCookieHeaders: ${typeof fwdSetCookieHeaders}`)
  console.log(`==== fwdSetCookieHeaders: ${JSON.stringify(fwdSetCookieHeaders)}`)

  fwdSetCookieHeaders.forEach(fwdSetCookieHeader => {
    fwdResp.headers.append('set-cookie', fwdSetCookieHeader)
  })

  // gross hack to rewrite the form action to use our proxied endpoint
  return new HTMLRewriter()
    .on('form', new OryRewriteHandler(reqUrl, baseUrl))
    .on('a', new OryRewriteHandler(reqUrl, baseUrl))
    .on('div', new OryContentHandler(reqUrl, baseUrl))
    .transform(fwdResp);

  // return fwdResp
};
