export const onRequest: PagesFunction<Env> = async (context) => {
  const { ASSETS, ...env } = context.env;

  const sortedEnv = Object.keys(env)
    .sort()
    .reduce((result, key) => {
      result[key] = env[key];
      return result;
    }, {});

  return new Response(JSON.stringify(sortedEnv), {
    headers: {
      "content-type": "application/json",
    },
  });
};
