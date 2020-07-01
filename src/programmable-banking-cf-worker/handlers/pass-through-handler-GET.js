const Util = require('../util')

export default async request => {
  try {
    let req = request.clone()
    const url = new URL(req.url)
    let response = new Response()
    let accountId = url.pathname.split('/').pop()
    if ((url.pathname + url.search).toLowerCase().includes('accountbalance')) {
      const accountBalanceResponseJson = await fetch(
        `https://[Insert-Azure-Function-App-Name].azurewebsites.net/api/AccountBalance/${accountId}`,
      ).then(res => res.json())

      response = new Response(
        JSON.stringify(accountBalanceResponseJson),
        response,
      )
    } else if (
      (url.pathname + url.search).toLowerCase().includes('accounttransactions')
    ) {
      const accountTransactionsResponseJson = await fetch(
        `https://[Insert-Azure-Function-App-Name].azurewebsites.net/api/AccountTransactions/${accountId}`,
      ).then(res => res.json())

      response = new Response(
        JSON.stringify(accountTransactionsResponseJson),
        response,
      )
    } else {
      return null
    }

    return response
  } catch (err) {
    console.log(err.message)
    return null
  }
}
