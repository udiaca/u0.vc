/**
 * All API function calls should only be allowed during development.
 * In prod/preview, rely on Astro runtime context to derive these values.
 */
const developmentCheck: PagesFunction<Env> = async ({ env, next }) => {
  try {
    const { APP_ENV } = env;
    if (APP_ENV !== "development") {
      return new Response(
        JSON.stringify({ errors: ["APP_ENV must be development"] }),
        {
          status: 403,
          statusText: "Forbidden",
          headers: {
            'content-type': 'application/json'
          }
        }
      );
    }

    return await next();
  } catch (err) {
    return new Response(JSON.stringify(err), {
      status: 500,
      headers: {
        "content-type": "application/json",
      },
    });
  }
};

export const onRequest = [developmentCheck];
