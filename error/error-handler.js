const errorHandler = (err, req, res, next) => {
	if (res.headersSent) {
		return next(err)
	}

	const { message = 'Internal Server Error', statusCode = 500 } = err

	res.status(statusCode).json({
		message: message
	})
}

module.exports = errorHandler
