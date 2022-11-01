export const onRequest: PagesFunction<Env> = async (context) => {
  return new Response(JSON.stringify({ now: new Date().toISOString() }), {
    headers: {
      "content-type": "application/json",
    },
  });
};
