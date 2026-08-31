// Minimal JWT helpers. The app only ever needs to read the payload's
// expiry so the UI doesn't treat a stale/expired token as a live session
// (the signature is the backend's business - this is purely so the client
// stops showing logged-in chrome for a token the API will reject anyway).

export function decodeJwt(token) {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(base64))
  } catch {
    return null
  }
}

export function isTokenExpired(token) {
  if (!token) return true
  const payload = decodeJwt(token)
  if (!payload?.exp) return true
  // exp is in seconds since epoch
  return payload.exp * 1000 <= Date.now()
}
