const scriptName = "/opt/script.js";
const endpoint = "/opt/event";
const scriptNoExtension = scriptName.replace(".js", "");

const getScript = async (request, extensions) => {
  let response = await caches.default.match(request);
  if (!response) {
    response = await fetch(
      "https://plausible.io/js/plausible." + extensions.join(".")
    );
    caches.default.put(request, response.clone());
  }
  return response;
};

const postData = async (request) => {
  const req = new Request(request);
  req.headers.delete("cookie");
  return await fetch("https://plausible.io/api/event", req);
};

export const onRequest: PagesFunction = async (context) => {
  const { request } = context;
  const pathname = new URL(request.url).pathname;
  const [baseUri, ...extensions] = pathname.split(".");

  if (baseUri.endsWith(scriptNoExtension)) {
    return getScript(request, extensions);
  } else if (pathname.endsWith(endpoint)) {
    return postData(request);
  } else if (pathname.endsWith("test")) {
    return new Response("hello world");
  } else {
    return new Response(null, {
      status: 307,
      headers: {
        location: "/404",
      },
    });
  }
};
