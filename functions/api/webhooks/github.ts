import { timeSafeCompareStrings } from "@udia/crypt"
/**
 * https://docs.github.com/webhooks/
 * https://github.com/settings/apps/u0vc
 */
export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context

  const blob = await request.blob()
  const bodyBuffer = await blob.arrayBuffer()
  if (!bodyBuffer.byteLength) {
    return new Response("missing request body", { status: 400 })
  }

  const signature = request.headers.get('x-hub-signature-256')
  if (!signature || !signature.startsWith("sha256=")) {
    return new Response("missing valid x-hub-signature-256 header", { status: 400 })
  }

  const { GITHUB_WEBHOOK_SECRET } = env
  if (!GITHUB_WEBHOOK_SECRET) {
    return new Response("missing GITHUB_WEBHOOK_SECRET env variable", { status: 500 })
  }

  const keyBytes = new TextEncoder().encode(GITHUB_WEBHOOK_SECRET)

  const cryptoKey = await crypto.subtle.importKey(
    "raw", keyBytes, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  )
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, bodyBuffer)

  // convert signature digest into hexadecimal string
  const hashArray = Array.from(new Uint8Array(sig))
  const hashedBody = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  const generatedSignature = `sha256=${hashedBody}`

  if (!await timeSafeCompareStrings(signature, generatedSignature)) {
    return new Response("x-hub-signature-256 hash mismatch", { status: 400 })
  }

  // we have passed the Github webhook security checks
  // and can now handle business logic appropriately
  return new Response(await blob.text(), { headers: { 'content-type': 'application/json' } });
};
