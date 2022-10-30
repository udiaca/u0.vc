export const onRequest: PagesFunction<Env> = async (context) => {
  const {
    // Account.Cloudflare Pages Read
    CLOUDFLARE_API_TOKEN_READ_PAGES: token,
    CLOUDFLARE_API_ACCOUNT_ID: cfAccountId,
    CLOUDFLARE_API_PROJECT_NAME: cfProjectName,
  } = context.env;

  const url = new URL(context.request.url);
  const searchParams = url.searchParams.toString();

  // get pages deployments
  // https://api.cloudflare.com/#pages-deployment-get-deployments
  let endpoint = `https://api.cloudflare.com/client/v4/accounts/${cfAccountId}/pages/projects/${cfProjectName}/deployments`;
  if (searchParams) {
    endpoint = `${endpoint}?${searchParams}`;
  }

  return fetch(endpoint, {
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
  });
};
