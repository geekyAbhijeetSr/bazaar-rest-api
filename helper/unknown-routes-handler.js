const { HttpError } = require('../error')

const unknownRoutesHandler = () => {
	const error = new HttpError('Could not find this route.', 404)
	throw error
}

module.exports = unknownRoutesHandler