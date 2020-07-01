/**
 * Takes an array, and filters out any null or undefined values from it.
 */
export const compact = array => array.filter(el => el)

/**
 * SHA-256 Hash function.
 */
export async function sha256(message) {
  // encode as UTF-8
  const msgBuffer = new TextEncoder().encode(message)

  // hash the message
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)

  // convert ArrayBuffer to Array
  const hashArray = Array.from(new Uint8Array(hashBuffer))

  // convert bytes to hex string
  const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('')
  return hashHex
}

/**
 * Get the URL parameters
 * source: https://css-tricks.com/snippets/javascript/get-url-variables/
 * @param  {String} url The URL
 * @return {Object}     The URL parameters
 */
export function parseQueryParams(url) {
  var params = {}
  var query = url.search.substring(1)
  var vars = query.split('&')
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=')
    params[pair[0]] = decodeURIComponent(pair[1])
  }
  return params
}

/**
 * Returns response headers.
 */
export const getHeaders = origin => {
  var _headers = new Headers()
  _headers.set('X-Served-By', 'The Tardis')
  _headers.set('X-Powered-By', 'Gallifrey')
  _headers.set('Access-Control-Max-Age', '-1')
  _headers.set('Access-Control-Allow-Origin', '*')
  _headers.set('Access-Control-Allow-Methods', 'GET, POST, HEAD, OPTIONS')
  _headers.set('Access-Control-Allow-Headers', 'Content-Type')
  _headers.set('X-O', origin)
  return _headers
}

const apiPathRegex = /\/api\/(?<endpoint>[^?]*)(?:(?<query>.*))/
export const parseApiPath = text => {
  const match = text.match(apiPathRegex)
  return match ? match.groups : null
}

export const removeCache = (key) =>  kvCache.delete(key);
export const getCache = (key) =>  kvCache.get(key);
export const listCache = (key) =>  kvCache.list({"prefix":key});
export const setCache = (cacheItemAttributes, value) =>  kvCache.put(cacheItemAttributes.Key, value, {expirationTtl:cacheItemAttributes.Expiry});