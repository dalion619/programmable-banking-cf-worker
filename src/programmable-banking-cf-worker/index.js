import corsHandler from './handlers/cors-handler'
import passThroughHandlerPOST from './handlers/pass-through-handler-POST'
import passThroughHandlerGET from './handlers/pass-through-handler-GET'

const Util = require('./util')
const Router = require('./router')
const CacheHelper = require('./cache-helper')

//Incoming request
addEventListener('fetch', event => {
  if (event.request.method.toLowerCase() === 'post') { 
    event.respondWith(routeRequestNoCache(event.request)) //Don't cache POST requests
  } else {
    event.respondWith(checkCacheThenRoute(event.request))
  }
})


async function checkCacheThenRoute(request) {
  let req = request.clone()
  const url = new URL(req.url)
  const cfIP = req.headers.get('cf-connecting-ip')
  const parseResult = Util.parseApiPath(url.pathname + url.search)
  let cacheItemAttributes = await CacheHelper.calcCacheItemAttributes(
    '',
    cfIP,
    parseResult,
  )

  const cache = await Util.getCache(cacheItemAttributes.Key) //Get value from cache
  let res = new Response()

  if (cache) {
    res = new Response(cache, {
      headers: {
        'content-type': 'application/json',
        'cf-kv-hit': cacheItemAttributes.Key,
      },
    })
  } else {
    res = await routeRequest(req) //Route request if cache is empty
    res = new Response(res.body, res)
    res.headers.set('content-type', 'application/json')
    res.headers.set('cf-kv-new', cacheItemAttributes.Key)
  }
  let response = await processResponse(res, request)
  if (response) {
    let responseClone = response.clone();
    let originalResponseBodyClone = new Response(responseClone.body, responseClone)
    originalResponseBodyClone.headers.set('content-type', 'application/json')
    let cloneBodyJson = await originalResponseBodyClone.json()
    let bodyJsonStr = JSON.stringify(cloneBodyJson)
    if (response.ok) {
      await Util.setCache(cacheItemAttributes, bodyJsonStr) //Cache response
    } 
  }
  return response;
}

async function routeRequestNoCache(request) {
  let req = request.clone()
  let res = await routeRequest(req)
  let response = await processResponse(res, request)
  return response
}

async function routeRequest(request) {
  const router = new Router()
  router.options('/', corsHandler)
  router.head('/', corsHandler)
  router.get('/', passThroughHandlerGET)
  router.post('/', passThroughHandlerPOST)

  let response = await router.route(request)
  return response
}

async function processResponse(res, req) {
  if (!res) {
    let response = new Response('Not Allowed', {
      status: 405,
      statusText: 'Not Allowed',
    })
    return response
  } else {
    let response = new Response()
    let origin = req.headers.get('Origin')
    let _headers = Util.getHeaders(origin)
    for (var pair of _headers.entries()) {
      res.headers.set(pair[0], pair[1])
    }
    response = new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers: res.headers,
    })
    return response
  }
}
