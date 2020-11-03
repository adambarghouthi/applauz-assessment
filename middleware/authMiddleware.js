function authMiddleware(req, res, next) {
  const { authentication } = req.headers

  if (authentication !== 'secret') {
    return res.status(403).json({ error: 'Unauthorized request.' })
  }

  next()
}

module.exports = authMiddleware