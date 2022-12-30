import { Configuration, FrontendApi } from "@ory/client"

export const onRequest: PagesFunction<Env> = async (context) => {
  const { env, request } = context;
  const url = new URL(request.url);
  const { ORY_SDK_URL } = env

  let basePath = ORY_SDK_URL || "https://playground.projects.oryapis.com"
  // if we're on localhost or 127.0.0.1 assume local tunnel
  // https://www.ory.sh/docs/getting-started/local-development#local-development
  if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
    console.log(`==== localhost rewrite ${url}`)
    basePath = `https://${url.hostname}:8789`;
  }

  const ory = new FrontendApi(
    new Configuration({
      basePath,
      baseOptions: {
        withCredentials: true,
      },
    }),
  )

  const cookie = request.headers.get('cookie')
  if (!cookie) {
    return new Response("missing cookie", { status: 400 })
  }

  /**
   * NOTE: this throws an exception in Axios code when run in the CF workers runtime
   * environment `TypeError: adapter is not a function`
   * https://community.cloudflare.com/t/typeerror-e-adapter-s-adapter-is-not-a-function/166469/3?u=uda
   * https://stackoverflow.com/questions/66305856/typeerror-adapter-is-not-a-function-error-when-using-axios-and-webpack-in-chrom
   */
  // const { data, headers, status, statusText } = await ory.toSession({ cookie })
  const oryApiUrl = new URL(basePath)
  return fetch(`${oryApiUrl.origin}/api/hello`, {
    headers: {
      cookie
    },
    credentials: "include",
  })

  // return new Response(`${data}`, {
  //   headers,
  //   status,
  //   statusText
  // })
};
