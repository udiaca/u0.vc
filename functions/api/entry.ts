export interface IndexEntryPayload {
  url: string;
  content: string;
  published: string;
  updated: string;
}


interface FTSEntry {
  url: string;
  content: string;
}

const InsertEntry = `
  INSERT OR REPLACE INTO entries (url, published, updated)
  VALUES (?, ?, ?);
`;

const InsertFTS = `
  INSERT OR REPLACE INTO ftsEntries (url, content)
  VALUES (?, ?);
`;[]

const SearchFTS = `
  SELECT * FROM entries
  JOIN ftsEntries ON ftsEntries.url = entries.url
  WHERE ftsEntries = (?);
`;


export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env, request } = context;
  const { D1_U0_VC } = env;

  const url = new URL(request.url)
  const search = url.searchParams.get('q') || ''

  try {
    const result = await D1_U0_VC.prepare(SearchFTS).bind(search).all<FTSEntry>();
    return new Response(JSON.stringify(result), {
      status: 200, headers: {
        'content-type': 'application/json'
      }
    })
  } catch (err) {
    return new Response(`${err}`, { status: 500, headers: { 'content-type': 'application/json' }});
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

  const payload = await request.json<IndexEntryPayload>()

  try {
    const { url, content, published, updated } = payload;
    const result = await D1_U0_VC.batch([
      D1_U0_VC.prepare(InsertEntry).bind(url, published, updated),
      D1_U0_VC.prepare(InsertFTS).bind(url, content)
    ]);
    return new Response(JSON.stringify({ result, url }), {
      status: 200, headers: {
        'content-type': 'application/json'
      }
    });
  } catch (err) {
    const error = JSON.stringify(err) === '{}' ? `${err}` : JSON.stringify(err);
    return new Response(JSON.stringify({ error, request, payload }), { status: 500, headers: { 'content-type': 'application/json' } });
  }
}