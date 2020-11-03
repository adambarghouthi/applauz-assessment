const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()
const port = 3000

const authMiddleware = require('./middleware/authMiddleware')

// users api route
const users = require('./api/users')

// create api routes
const router = express.Router()

router.route('/users')
  .get(users.get)
  .post(users.post)

app
  .use(bodyParser.json()) // middleware to parse json
  .use('/api', authMiddleware, router) // api routes with authentication middleware
  .use(express.static(path.join(__dirname, 'public'))) // serve html & js as static pages

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})