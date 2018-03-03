const Ster = require('.')
const app = new Ster()

app.get('/', (req, res, params) => res.send('hello world', 200))
app.get('/status', (req, res, params) => res.send('OK', 200))
app.get('/cats', (req, res, params) => res.json(['theodore', 'sally', 'glory'], 200))

app.listen()
