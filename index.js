const xmlrpc = require('davexmlrpc')

const promisify = (func) => (...args) => new Promise((resolve, reject) => {
  func(...args, (err, result) => {
    if (err) {
      reject(err)
    } else {
      resolve(result)
    }
  })
})

exports.createClient = async function createClient (options) {
  const commonEndpoint = `https://${options.host}/xmlrpc/2/common`
  const objectEndpoint = `https://${options.host}/xmlrpc/2/object`

  const db = options.database
  const username = options.username
  const password = options.password
  const format = 'xml'

  const client = {}

  const hasConnection = !!(await promisify((cb) => xmlrpc.client(commonEndpoint, 'version', [], format, cb))())

  if (hasConnection) {
    const uid = await promisify((cb) => xmlrpc.client(commonEndpoint, 'authenticate', [db, username, password, {}], format, cb))()

    client.hasAccess = (model) => new Promise((resolve, reject) => {
      xmlrpc.client(
        objectEndpoint,
        'execute_kw',
        [db, uid, password, model, 'check_access_rights', ['read']],
        format,
        (err, result) => {
          if (err) {
            reject(err)
          } else {
            resolve(result)
          }
        }
      )
    })
    client.search = (model, params) => new Promise((resolve, reject) => {
      xmlrpc.client(
        objectEndpoint,
        'execute_kw',
        [db, uid, password, model, 'search', [params]],
        format,
        (err, result) => {
          if (err) {
            reject(err)
          } else {
            resolve(result)
          }
        }
      )
    })
    client.read = (model, ids) => new Promise((resolve, reject) => {
      xmlrpc.client(
        objectEndpoint,
        'execute_kw',
        [db, uid, password, model, 'read', [ids]],
        format,
        (err, result) => {
          if (err) {
            reject(err)
          } else {
            resolve(result)
          }
        }
      )
    })
  } else {
    throw new Error('No connection!')
  }

  return client
}
