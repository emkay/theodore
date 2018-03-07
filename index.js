require('dotenv').config()
const qs = require('querystring')
const turbo = require('turbo-http')
const serverRouter = require('server-router')
const stringify = require('fast-safe-stringify')
const jsonParse = require('fast-json-parse')

class Theodore {
  constructor (opts) {
    this.opts = opts || {}
    this.router = serverRouter()
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
      const reqHeaders = req.getAllHeaders()
      const type = reqHeaders.get('Content-Type')

      res.send = (data, status, headers) => {
        data = data || ''
        data = Buffer.isBuffer(data) ? data : Buffer.from(data)

        res.statusCode = status
        headers = headers || {}

        const keys = Object.keys(headers)
        for (var i = 0; i <= keys.length; i++) {
          res.setHeader(keys[i], headers[keys[i]])
        }

        res.setHeader('content-length', data.length)
        res.write(data)
      }

      res.json = (json, status, headers) => {
        const data = stringify(json)
        headers = headers || {}
        headers['content-type'] = headers['content-type'] || 'application/json'
        res.send(data, status, headers)
      }

      const bodies = []

      req.ondata = (body, start, length) => {
        const part = body.slice(start, length + start).toString()
        bodies.push(part)
      }

      req.onend = () => {
        const b = bodies.join('')

        switch (type) {
          case 'application/json':
            const parsedRes = jsonParse(b)
            req.body = parsedRes.value || parsedRes.err
            break
          case 'application/x-www-form-urlencoded':
            req.body = qs.parse(b)
            break
          case 'text/plain':
          case 'text/html':
          default:
            req.body = b
            break
        }

        handler(req, res, params)
      }
    }

    this.router.route(method, route, _handler)
  }

  listen (port) {
    this.port = port || process.env.PORT || 8080
    this.server = turbo.createServer(this.router.start())
    this.server.listen(this.port)
  }

  close () {
    this.server.close()
  }
}

module.exports = Theodore
