export const onRequest: PagesFunction<Env> = async (context) => {
  // Cloudflare API token
  // Account.Billing Read
  const token = context.env.CLOUDFLARE_API_TOKEN_READ_BILLING;

  // get user billing history
  // https://api.cloudflare.com/#user-billing-history-properties
  const endpoint = "https://api.cloudflare.com/client/v4/user/billing/history";

  return fetch(endpoint, {
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
  });
};
