export const onRequest: PagesFunction<Env> = async (context) => {
  const {
    // Account.Cloudflare Pages Read
    CLOUDFLARE_API_TOKEN_READ_PAGES: token,
    CLOUDFLARE_API_ACCOUNT_ID: cfAccountId,
    CLOUDFLARE_API_PROJECT_NAME: cfProjectName,
  } = context.env;

  // get pages deployments
  // https://api.cloudflare.com/#pages-deployment-get-deployments
  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${cfAccountId}/pages/projects/${cfProjectName}/deployments`;

  return fetch(endpoint, {
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
  });
};
