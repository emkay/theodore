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
      const headers = req.getAllHeaders()
      const type = headers.get('Content-Type')

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
            if (parsedRes.err) {
              console.error(Error(parsedRes.err))
            }
            req.body = parsedRes.value
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
