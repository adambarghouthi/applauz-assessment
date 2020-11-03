async function get(req, res) {
  res.json({ success: true })
}

async function post(req, res) {
  res.json({ success: true })
}

module.exports = {
  get: get,
  post: post
}
