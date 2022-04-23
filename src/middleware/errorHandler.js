function errorHandler(err, req, res, next) {
    const status = err.status || 500
    const message = err.message || "server ERROR"
    res.status(status).send({ status, message })
}

module.exports = errorHandler