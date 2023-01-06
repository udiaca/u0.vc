// ---
/**
 * Logic for [...path] and [path] are identical.
 * 1. Try adding in the language tag to path
 * 2. Attempt to fetch the file from our public Cloudflare R2 bucket
 * 3. Return 404.
 *
 * If any step fails with an exception, return 500.
 */
// import { bestMatch } from "@udia/mime-parser";
// import { languageTags } from "../i18n/languages";

export async function get({ request, params }) {
  // const acceptLanguage = request.headers.get("accept-language");
  // let language = "en";
  // if (acceptLanguage) {
  //   language = bestMatch(languageTags, acceptLanguage) || "en";
  // }

  const { path } = params
  // const langPath = `/${language}/${path}`;
  // const pages = await glob("./**/*");
  // const urls = pages.map((page) => page.url);
  // let redirectTo = null;
  // if (urls.includes(langPath)) {
  //   redirectTo = langPath;
  // }

  let redirectTo = null
  console.log(`==== path ${path}`)
  const forceRedirectEn = ['', 'all', 'identity', 'author']
  if (path === '/') {
    redirectTo = '/en'
  } else if (forceRedirectEn.indexOf(path) >= 0) {
    redirectTo = `/en/${path}`
  }

  const reqUrl = new URL(request.url)
  if (redirectTo) {
    return new Response(null, {
      status: 302,
      headers: {
        // location: reqUrl.origin + redirectTo,
        location: redirectTo
      },
    })
  }

  let fallbackBody = 'not found'
  let fallbackStatus = 404
  try {
    const runtime = Reflect.get(request, Symbol.for('runtime'))
    const { R2_U0_VC } = runtime.env
    console.log(`==== ${reqUrl.pathname}`)

    const r2ObjBody = await R2_U0_VC.get(reqUrl.pathname.replace(/^\//, ''))
    if (r2ObjBody !== null) {
      const headers = new Headers();
      r2ObjBody.writeHttpMetadata(headers);
      headers.set('etag', r2ObjBody.httpEtag);
      return new Response(r2ObjBody.body, { headers })
    }

  } catch (error) {
    console.log(error)
    fallbackBody = error;
    fallbackStatus = 500
  }

  return new Response(fallbackBody, {
    status: fallbackStatus,
  })
}
// ---

// {
//   redirectTo ? (
//     <meta http-equiv="refresh" content={`0;url=${redirectTo}${Astro.url.search}`} />
//   ) : null
// }
// <BaseLayout title={pageStatusText}>
//   <h1>{pageStatusText}</h1>
//   <code><pre>{JSON.stringify(Astro.response, undefined, 2)}</pre></code>
// </BaseLayout>
