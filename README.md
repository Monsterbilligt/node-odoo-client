# node-odoo-client

Promise-based abtraction over xmlrpc api for Odoo 10. [Web Service API documentation](https://www.odoo.com/documentation/10.0/api_integration.html).

## Usage

`npm install git+ssh://git@github.com:Monsterbilligt/node-odoo-client#v0.0.1`

```js
const { createClient } = require('node-odoo-client')

const credentials = {
  host: 'example.odoo.com',
  database: 'my-database',
  username: 'admin',
  password: 'my-secret',
  port: 8069
}

(async () => {
  const client = await createClient(credentials)

  const partners = await client.search(
    'res.partner',
    [['is_company', '=', True], ['customer', '=', True]]
  )

  const [firstPartner] = await client.read('res.partner', [partners[0]])

  console.log(firstPartner)
})()
```
