const Theo = require('..')
const test = require('tap').test
const bent = require('bent')

test('basic routes', async t => {
  t.plan(9)

  const app = new Theo()
  app.get('/', (req, res, params) => {
    res.send('hello', 200)
  })

  app.post('/', (req, res, params) => {
    t.equal(req.body, 'hello')
    res.send('post hello', 200)
  })

  app.put('/', (req, res, params) => {
    t.equal(req.body, 'hey')
    res.send('put hello', 200)
  })

  app.delete('/things', (req, res, params) => {
    res.send('delete hello', 200)
  })

  app.listen(8080, () => t.ok('onlisten'))

  let data

  const get = bent('string')
  data = await get('http://localhost:8080/')
  t.equal(data, 'hello')

  const getText = bent('string', {'Content-Type': 'text/plain'})
  data = await getText('http://localhost:8080/')
  t.equal(data, 'hello')

  const getHtml = bent('string', {'Content-Type': 'text/html'})
  data = await getHtml('http://localhost:8080/')
  t.equal(data, 'hello')

  const post = bent('POST', 'string')
  data = await post('http://localhost:8080/', Buffer.from('hello'))
  t.equal(data, 'post hello')

  const put = bent('PUT', 'string')
  data = await put('http://localhost:8080/', Buffer.from('hey'))
  t.equal(data, 'put hello')

  const del = bent('DELETE', 'string')
  data = await del('http://localhost:8080/things')
  t.equal(data, 'delete hello')

  app.close()
})

test('send json', async t => {
  t.plan(3)

  const app = new Theo()

  app.get('/', (req, res, params) => {
    res.json({hello: true}, 200)
  })

  app.post('/', (req, res, params) => {
    t.equal(req.body.hello, true)
    res.send('OK', 200)
  })

  app.listen()

  let data

  const get = bent('json')
  data = await get('http://localhost:8080/')
  t.equal(data.hello, true)

  const post = bent('POST', 'string', {'Content-Type': 'application/json'})
  data = await post('http://localhost:8080/', {hello: true})
  t.equal(data, 'OK')

  app.close()
})

test('form post', async t => {
  t.plan(2)

  const app = new Theo()

  app.post('/', (req, res, params) => {
    t.equal(req.body.hello, 'world')
    res.send('OK', 200)
  })

  app.listen()

  let data

  const post = bent('POST', 'string', {'Content-Type': 'application/x-www-form-urlencoded'})
  data = await post('http://localhost:8080/', Buffer.from('hello=world'))
  t.equal(data, 'OK')

  app.close()
})

test('res.send data', async t => {
  t.plan(2)

  const app = new Theo()

  app.get('/', (req, res, params) => {
    res.send(null, 200)
  })

  app.get('/buffer', (req, res, params) => {
    res.send(Buffer.from('OK'), 200)
  })

  app.listen()

  let data

  const get = bent('string')
  data = await get('http://localhost:8080/')
  t.equal(data, '')

  data = await get('http://localhost:8080/buffer')
  t.equal(data, 'OK')

  app.close()
})

test('bad json data', async t => {
  t.plan(3)

  const app = new Theo()

  app.post('/', (req, res, params) => {
    t.equal(req.body.name, 'SyntaxError')
    t.equal(req.body.message, 'Unexpected end of JSON input')
    res.send('OK', 200)
  })

  app.listen()

  let data

  const post = bent('POST', 'string', {'Content-Type': 'application/json'})
  data = await post('http://localhost:8080/', Buffer.from('{"hello"'))
  t.equal(data, 'OK')

  app.close()
})

test('get address', t => {
  t.plan(1)

  const app = new Theo()
  app.get('/', (req, res, params) => res.send(''))
  app.listen(8080, () => {
    const address = app.address()

    t.equal(typeof address, 'object')

    app.close()
  })
})
