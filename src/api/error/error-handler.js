const errorHandler = (error, req, res, next) => {
	if (res.headerSent) return next(error)
	const { message = 'Internal Server Error', statusCode = 500 } = error

	res.status(statusCode).json({
		error: Array.isArray(message) ? message[0].msg : message,
	})
}

module.exports = errorHandler
