export interface IndexEntryPayload {
  url: string;
  content: string;
  published: string;
  updated: string;
}


const InsertEntry = `
  INSERT INTO entries (url, published, updated)
  VALUES (?, ?, ?);
`;

const InsertFTS = `
  INSERT INTO ftsEntries (url, content)
  VALUES (?, ?);
`;

const SearchFTS = `
  SELECT * FROM ftsEntries(?);
`;


export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env, request } = context;
  const { D1_U0_VC } = env;

  const url = new URL(request.url)
  const search = url.searchParams.get('q') || ''

  try {
    const result = await D1_U0_VC.prepare(SearchFTS).bind(search).all();
    return new Response(JSON.stringify({ result, url }), {
      status: 200, headers: {
        'content-type': 'application/json'
      }
    })
  } catch (err) {
    return new Response(`${err}`, { status: 500 });
  }
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { env, request, waitUntil } = context;
  const { D1_U0_VC, DEV_PASSTHROUGH } = env;

  // we're throwing some data into the search here
  // also let's ensure that the dev passthrough is set

  const auth = request.headers.get('authorization')
  if (!DEV_PASSTHROUGH) {
    return new Response('dev-passthrough not defined', { status: 500 });
  }
  if (!auth || !auth.includes(DEV_PASSTHROUGH)) {
    return new Response('dev-passthrough failed', { status: 403 })
  }

  try {
    const { url, content, published, updated } = await request.json<IndexEntryPayload>()
    const result = await D1_U0_VC.batch([
      D1_U0_VC.prepare(InsertEntry).bind([url, published, updated]),
      D1_U0_VC.prepare(InsertFTS).bind([url, content])
    ]);
    return new Response(JSON.stringify({ result, url }), {
      status: 200, headers: {
        'content-type': 'application/json'
      }
    });
  } catch (err) {
    return new Response(`${err}`, { status: 500 });
  }
}