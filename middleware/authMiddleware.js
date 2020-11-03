function authMiddleware(req, res) {
  const req.headers.authentication

  if (authentication !== 'secret') {
    return res.status(403).json({ error: 'Unauthorized request.' })
  }

  next()
}

module.exports = authMiddleware