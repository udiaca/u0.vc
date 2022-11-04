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

  const doSessionNamespace = runtime.env.DO_SESSION
  const doSessionId = doSessionNamespace.idFromString(rawDOSessionId)
  const doSessionStub = doSessionNamespace.get(doSessionId)

  // todo- make this more generic for other oauth providers
  const sessionUserRefResp = await doSessionStub.fetch(
    'https://do-session.workers.u0.vc/?prefix=user',
    {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
    }
  )
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
