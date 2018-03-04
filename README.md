# theodore

http framework

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
