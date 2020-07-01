const Util = require('./util')

export async function calcCacheItemAttributes(cfUid, cfIP, parsedUrlResult) {
  let { endpoint, query } = parsedUrlResult
  let userIdentifierHash = await Util.sha256(cfUid + cfIP)
  let attributes = {
    Key: '',
    Prefix: endpoint + '-',
    Expiry: 180,
  }

  switch (endpoint) {
    case (endpoint.match(/AccountBalance/) || {}).input:
      attributes.Prefix = await Util.sha256('0107-')
      attributes.Key =
        attributes.Prefix +
        (await Util.sha256(endpoint)) +
        '-' +
        (await Util.sha256(query))
      attributes.Expiry = 3600
      break
    case (endpoint.match(/AccountTransactions/) || {}).input:
      attributes.Prefix = await Util.sha256('0107-')
      attributes.Key =
        attributes.Prefix +
        (await Util.sha256(endpoint)) +
        '-' +
        (await Util.sha256(query))
      attributes.Expiry = 3600
      break
    default:
      attributes.Prefix = await Util.sha256('0107-')
      attributes.Key =
        attributes.Prefix +
        (await Util.sha256(endpoint)) +
        '-' +
        (await Util.sha256(query + userIdentifierHash))
  }

  return attributes
}
