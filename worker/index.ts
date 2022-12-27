/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  // MY_BUCKET: R2Bucket;

  DO_SESSION: DurableObjectNamespace;
  DO_USER: DurableObjectNamespace;

  DEV_PASSTHROUGH: string | undefined;
}

export { DOSession } from "./DOSession";
export { DOUser } from "./DOUser";

const DEV_ROUTE = 'u0-workers.udia.workers.dev'
const BASE_DOMAIN = 'workers.u0.vc'
// const DO_DOMAINS = [
//   `do-session.${BASE_DOMAIN}`,
//   `do-user.${BASE_DOMAIN}`
// ]

/**
 * Proxy out calls to durable objects
 */
export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const auth = req.headers.get('authorization')

    if (!auth || env.DEV_PASSTHROUGH && !auth.includes(env.DEV_PASSTHROUGH)) {
      return new Response('dev-passthrough failed', { status: 403 })
    }

    try {
      let doStubIdentifier: string | null = null;
      let doIdRaw: string | null = req.headers.get('do-id');
      let doNameRaw: string | null = req.headers.get('do-name');
  
      if ((!doIdRaw && !doNameRaw) || (doIdRaw && doNameRaw)) {
        return new Response('either do-id or do-name must exist', { status: 400 })
      }
  
      const url = new URL(req.url);
      const hostname = url.hostname
      let path = url.pathname.split("/").filter(val => Boolean(val))
  
      if ([DEV_ROUTE, BASE_DOMAIN].includes(hostname)) {
        // get stub identifier from first pathname 
        doStubIdentifier = path[0]
        path = path.slice(1)
      } else if (hostname.endsWith(BASE_DOMAIN)) {
        // we are calling a durable object path, like do-session.workers.u0.vc
        doStubIdentifier = hostname.split(BASE_DOMAIN)[0]
      }
  
      let envStub;
      switch (doStubIdentifier) {
        case 'do-session': {
          envStub = env.DO_SESSION;
          break;
        }
        case 'do-user': {
          envStub = env.DO_USER
          break;
        }
        default: {
          return new Response(`invalid stub identifier`, { status: 400 })
        }
      }
  
  
      const doId = doIdRaw ? envStub.idFromString(doIdRaw) : doNameRaw ? envStub.idFromName(doNameRaw) : null;
      if (!doId) {
        return new Response('invalid durable object id', { status: 400 })
      }
  
      url.pathname = '/' + path.join('/')
      return envStub.get(doId).fetch(url.toString(), req)
    } catch (err) {
      return new Response(JSON.stringify(err), { status: 500 })
    }
  }
};
