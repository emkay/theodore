const Theo = require('..')
const test = require('tap').test
const bent = require('bent')

test('basic routes', async t => {
  t.plan(1)
  const app = new Theo()
  app.get('/', (req, res, params) => {
    res.send('hello', 200)
  })
  app.listen()

  const get = bent('string')
  const data = await get('http://localhost:8080/')
  t.equal(data, 'hello')

  app.close()
})
