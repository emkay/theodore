require('dotenv').config()
const turbo = require('turbo-http')
const serverRouter = require('server-router')
const stringify = require('fast-safe-stringify')

class Ster {
  constructor (opts) {
    this.opts = opts || {}
    this.router = serverRouter({ default: '/notFoundHandlerRoute' })
  }

  get (route, handler) {
    this.route('GET', route, handler)
  }

  post (route, handler) {
    this.route('POST', route, handler)
  }

  put (route, handler) {
    this.route('PUT', route, handler)
  }

  delete (route, handler) {
    this.route('DELETE', route, handler)
  }

  route (method, route, handler) {
    const _handler = (req, res, params) => {
      res.send = (data, status, headers) => {
        data = data || ''
        data = Buffer.isBuffer(data) ? data : Buffer.from(data)

        status = status || res.statusCode
        res.statusCode = status

        headers = headers || {}

        Object.keys(headers).forEach(header => {
          res.setHeader(header, headers[header])
        })

        res.setHeader('content-length', data.length)
        res.end(data)
      }

      res.json = (json, status, headers) => {
        const data = stringify(json)
        headers = headers || {}
        headers['content-type'] = headers['content-type'] || 'application/json'
        res.send(data, status, headers)
      }

      handler(req, res, params)
    }

    this.router.route(method, route, _handler)
  }

  listen (port) {
    this.port = port || process.env.PORT || 8080
    turbo.createServer(this.router.start()).listen(this.port)
  }
}

module.exports = Ster
