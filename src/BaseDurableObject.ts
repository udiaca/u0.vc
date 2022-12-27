import { Env } from ".";

export class BaseDurableObject implements DurableObject {
  state: DurableObjectState;
  env: Env;

  constructor(state: DurableObjectState, env: Env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const key = url.pathname.split('/').filter(str => !!str).join('.')

    if (!key) {
      if (request.method === 'GET') {
        const start = url.searchParams.get('start') ?? undefined;
        const startAfter = url.searchParams.get('startAfter') ?? undefined;
        const end = url.searchParams.get('end') ?? undefined;
        const prefix = url.searchParams.get('prefix') ?? undefined;
        const reverse = url.searchParams.get('reverse') === 'true'
        const limit = parseInt(url.searchParams.get('limit') || '32')
        const allowConcurrency = url.searchParams.get('allowConcurrency') === 'true';
        const noCache = url.searchParams.get('noCache') === 'true';

        const values = await this.state.storage.list({
          start, startAfter, end, prefix, reverse, limit, allowConcurrency, noCache
        })
        // const values = await this.state.storage.list();
        return new Response(JSON.stringify(Object.fromEntries(values.entries())), {
          status: 200, headers: {
            'content-type': 'application/json'
          }
        });
      } else if (request.method === 'POST' || request.method === 'PUT') {
        await this.state.storage.put(await request.json() as any)
        return new Response(null, { status: 201 })
      } else if (request.method === 'DELETE') {
        // no key but delete? clear all storage
        await this.state.storage.deleteAll();
        return new Response(null, { status: 204 })
      }

      return new Response('pathname must exist', { status: 404 })
    }

    if (request.method === 'GET') {
      const value = await this.state.storage.get<any>(key)
      return new Response(JSON.stringify(value), {
        status: 200, headers: {
          'content-type': 'application/json'
        }
      })
    } else if (request.method === 'POST' || request.method === 'PUT') {
      // store payload in state by pathname key
      await this.state.storage.put(key, await request.json())
      return new Response(null, { status: 201 })
    } else if (request.method === 'DELETE') {
      const deleted = await this.state.storage.delete(key)
      return new Response(null, { status: deleted ? 204 : 404 })
    }
    return new Response('unsupported', { status: 500 });
  }
}
