const errorHandler = (err, req, res, next) => {
	if (res.headersSent) {
		return next(err)
	}

	const { message = 'Internal Server Error', statusCode = 500 } = err

	res.status(statusCode).json({
		error: Array.isArray(message) ? message[0].msg : message
	})
}

module.exports = errorHandler
