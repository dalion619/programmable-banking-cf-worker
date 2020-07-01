const Util = require('../util')

export default async request => {
  try {
    const req = new Request(request)
    const url = new URL(req.url)

    if (
      !(url.pathname + url.search).toLowerCase().includes('logbanktransaction')
    ) {
      return null
    }
    let queryParams = Util.parseQueryParams(url)
    let timestamp = queryParams.timestamp //milliseconds since the Unix Epoch e.g. 1588336430191
    let reference = queryParams.reference //environment/account e.g. simulation
    let card = queryParams.card //card number
    let reqJson = await req.json()

    const azFuncResponse = await fetch(
      `https://[Insert-Azure-Function-App-Name].azurewebsites.net/api/LogBankTransaction/${reference}/${timestamp}/${card}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reqJson),
      },
    )

    let response = new Response()
    return response
  } catch (err) {
    console.log(err.message)
    return null
  }
}
