const errorHandler = (err, req, res, next) => {
	if (res.headersSent) {
		return next(err)
	}

	const { message = 'Internal Server Error', statusCode = 500 } = err

	let key = 'error'
	if (Array.isArray(message)) {
		key = 'errors'
	}

	res.status(statusCode).json({
		[key]: message,
	})
}

module.exports = errorHandler
