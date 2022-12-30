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

  // const ory = new FrontendApi(
  //   new Configuration({
  //     oryBasePath,
  //     baseOptions: {
  //       withCredentials: true,
  //     },
  //   }),
  // )

  /**
   * NOTE: this throws an exception in Axios code when run in the CF workers runtime
   * environment `TypeError: adapter is not a function`
   * https://community.cloudflare.com/t/typeerror-e-adapter-s-adapter-is-not-a-function/166469/3?u=uda
   * https://stackoverflow.com/questions/66305856/typeerror-adapter-is-not-a-function-error-when-using-axios-and-webpack-in-chrom
   */
  // const { data, headers, status, statusText } = await ory.toSession({ cookie })


  /**
   * Return the currently authenticated user
   */
  // return fetch(`${oryApiUrl.origin}/sessions/whoami`, {
  //   headers: {
  //     cookie
  //   },
  //   credentials: "include",
  // })

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
    headers: { cookie },
    credentials: "include"
  })
};
