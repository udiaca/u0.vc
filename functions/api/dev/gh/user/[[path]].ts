export const onRequest: PagesFunction<Env> = async (context) => {
  const { request } = context;
  const url = new URL(request.url);

  const token = url.pathname.split('/').pop() || ''
  const endpoint = "https://api.github.com/user";

  return fetch(endpoint, {
    headers: {
      authorization: `bearer ${token}`,
      "content-type": "application/json",
      'user-agent': 'UDIA'
    },
  });
};
