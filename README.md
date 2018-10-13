# theodore

super fast http framework

[![API Stability](https://img.shields.io/badge/stability-experimental-orange.svg)](https://nodejs.org/api/documentation.html#documentation_stability_index)
[![Build Status](https://travis-ci.org/emkay/theodore.svg?branch=master)](https://travis-ci.org/emkay/theodore)
[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![Standard Version](https://img.shields.io/badge/release-standard%20version-brightgreen.svg)](https://github.com/conventional-changelog/standard-version)

## Install

`npm i theodore`

## Use

```javascript
const Theodore = require('theodore')
const app = new Theodore()

app.get('/', (req, res, params) => res.send('hello world', 200))
app.get('/status', (req, res, params) => res.send('OK', 200))
app.get('/cats', (req, res, params) => res.json(['theodore', 'sally', 'glory'], 200))

app.listen()
```

## How?

`theodore` uses [`turbo-http`](https://github.com/mafintosh/turbo-http) under the hood and adds a router and similar API to other http frameworks. It also adds some convenience methods that allow you to send JSON responses by using the [`fast-safe-stringify`](https://www.npmjs.com/package/fast-safe-stringify) package. When parsing JSON data it is using [`fast-json-parse`](https://www.npmjs.com/package/fast-json-parse).

## API

#### `app = new Theodore()`

Create a new server.

#### `app.{get,post,put,delete}(route, handler(req, res, params))`

Create a route that matches the method and `route`.

#### `req.body`

If the request has a body it will be parsed based on content type and placed in `req.body`.

#### `res.json(json, statusCode)`

Will set the content type and stringify the JSON for you.

#### `res.send(data, statusCode)`

Send a response down the line.
