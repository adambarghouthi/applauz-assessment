const fs = require('fs')

// json file read/write functions
// similar to db connection
function readFile(cb) {
  fs.readFile('./db/users.json', function (err, data) {
    if (err) cb(err, null)
    else cb(null, JSON.parse(data))
  })
}

function writeFile(cb, data) {
  fs.writeFile('./db/users.json', data, function (err) {
    if (err) cb(err, null)
    else cb(null, JSON.parse(data))
  })
}

// Success & error handlers
function handleSuccess(data) {
  return {
    status: 'success',
    body: data
  }
}

function handleError(error) {
  return {
    status: 'error',
    message: error
  }
}

function isHit(query, value) {
  if (Array.isArray(query)) {
    return query.includes(value)
  }

  return query === value
}

function get(req, res) {
  const cb = function(err, users) {
    if (err) return res.json(handleError(err.message))

    // if query is empty
    // it means return all users
    if (!Object.keys(req.query).length) {
      return res.json(handleSuccess(users))
    }

    const fetchedUsers = users.filter(function(user) {
      for (let key in req.query) {
        const value = user[key]

        // splitting query by comma to see if there's
        // more than one search term
        const querySplit = req.query[key].split(',')
        let query

        if (querySplit.length > 1) query = querySplit
        else query = querySplit[0]

        if (isHit(query, value)) return true
      }

      return false
    })

    return res.json(handleSuccess(fetchedUsers))
  }
  
  readFile(cb)
}

function post(req, res) {
  const data = req.body

  const writeCb = function(err, users) {
    if (err) return res.json(handleError(err.message))

    // slicing out and returning only the last users that were created
    return res.json(handleSuccess(users.slice(users.length - data.length)))
  }

  const readCb = function(err, users) {
    if (err) return res.json(handleError(err.message))

    data.forEach(function(user) {
      user.id = users.length + 1 // create user id
      users.push(user)
    })

    writeFile(writeCb, JSON.stringify(users))
  }

  readFile(readCb)
}

module.exports = {
  get: get,
  post: post
}
