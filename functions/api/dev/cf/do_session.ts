export const onRequest: PagesFunction<Env> = async (context) => {
  const {
    // Account.Workers Scripts
    CLOUDFLARE_API_TOKEN_READ_WORKERS: token,
    CLOUDFLARE_API_ACCOUNT_ID: cfAccountId,
  } = context.env;

  const url = new URL(context.request.url);
  const searchParams = url.searchParams.toString();

  // get pages deployments
  // https://api.cloudflare.com/#pages-deployment-get-deployments
  // let endpoint = `https://api.cloudflare.com/client/v4/accounts/${cfAccountId}/workers/durable_objects/namespaces`;

  /**
   * {
      "id": "0e5ce1a5e22a4df195d54d4b07e0ac40",
      "name": "u0-workers_DOSession",
      "script": "u0-workers",
      "class": "DOSession"
    }
   */
  const namespaceId = '0e5ce1a5e22a4df195d54d4b07e0ac40'

  let endpoint = `https://api.cloudflare.com/client/v4/accounts/${cfAccountId}/workers/durable_objects/namespaces/${namespaceId}/objects`;
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
