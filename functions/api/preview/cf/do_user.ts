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
    {
      "id": "82b1a00cd6334e9098cc4e60d496724f",
      "name": "u0-workers_DOUser",
      "script": "u0-workers",
      "class": "DOUser"
    }
   */
  const namespaceId = '82b1a00cd6334e9098cc4e60d496724f'

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
