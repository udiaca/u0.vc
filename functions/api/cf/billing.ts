export const onRequest: PagesFunction<Env> = async (context) => {
  // Cloudflare API token
  // Account.Billing Read
  const token = context.env.CLOUDFLARE_API_TOKEN_READ_BILLING;

  // test if token is valid
  // const endpoint = "https://api.cloudflare.com/client/v4/user/tokens/verify";

  // get accounts
  // https://api.cloudflare.com/#accounts-properties
  // const endpoint = "https://api.cloudflare.com/client/v4/accounts";

  // get user billing profile
  // https://api.cloudflare.com/#user-billing-profile-properties
  // const endpoint = "https://api.cloudflare.com/client/v4/user/billing/profile";

  // get user billing history
  // https://api.cloudflare.com/#user-billing-history-properties
  const endpoint = "https://api.cloudflare.com/client/v4/user/billing/history";

  // get user subscriptions
  // https://api.cloudflare.com/#user-subscription-properties
  // const endpoint = "https://api.cloudflare.com/client/v4/user/subscriptions";

  return fetch(endpoint, {
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
  });
};
