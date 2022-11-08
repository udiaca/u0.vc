import { parseCookie } from './parseCookie'
import type { WorkerRuntime, PagesRuntime } from '@astrojs/cloudflare/runtime'
import { isValidDurableObjectIdString } from './isValidDurableObjId'

export const getUserFromCookie = async (
  rawCookie: string,
  runtime: WorkerRuntime<Env> | PagesRuntime<Env>
) => {
  const { '__Secure-SessionId': rawDOSessionId } = parseCookie(rawCookie || '')

  let user = null

  if (
    rawDOSessionId === '0' ||
    !rawDOSessionId ||
    !isValidDurableObjectIdString(rawDOSessionId)
  ) {
    return user
  }

  const endpoint = 'https://do-session.workers.u0.vc/?prefix=user'
  const options: RequestInit = {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      'authorization': runtime.env.DEV_PASSTHROUGH ? '' : `bearer ${runtime.env.DEV_PASSTHROUGH}`
    },
  };
  let sessionUserRefResp: Response;
  try {
    const doSessionNamespace = runtime.env.DO_SESSION
    const doSessionId = doSessionNamespace.idFromString(rawDOSessionId)
    const doSessionStub = doSessionNamespace.get(doSessionId)
    sessionUserRefResp = await doSessionStub.fetch(endpoint, options)
  } catch (err) {
    // possible fail due to context environment missing DO (development)
    // just fetch the endpoint
    sessionUserRefResp = await fetch(endpoint, options)

  }
  const sessionUserRefPayload = await sessionUserRefResp.json<
    Record<string, string>
  >()
  // should be an object containing { [`user-${now}`]: <DO_User:durableObjectId> }

  const doUserNamespace = runtime.env.DO_USER
  const doUserIdString = Object.values(sessionUserRefPayload)[0] || ''
  const doUserId = doUserNamespace.idFromString(doUserIdString)
  const doUserStub = doUserNamespace.get(doUserId)

  const userResp = await doUserStub.fetch('https://do-user.workers.u0.vc', {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
    },
  })
  user = [doUserIdString, await userResp.json()]

  return user
}
