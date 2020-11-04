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

module.exports = {
  readFile: readFile,
  writeFile: writeFile
}
