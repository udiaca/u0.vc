export const getCached = async (req: Request): Promise<Response> => {
  // let response = await caches.default.match(req);
  // if (!response) {
  //   response = await fetch(req);
  //   caches.default.put(req, response.clone())
  // }
  // return response;
  return await fetch(req);
}