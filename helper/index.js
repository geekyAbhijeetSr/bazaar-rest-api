const { signupValidation, loginValidation, validate } = require('./validation')
const { verifyToken, isAdmin, isUser } = require('./authentication')
const { capitalize } = require('./utils')

module.exports = {
	start: require('./start'),
	unknownRoutesHandler: require('./unknown-routes-handler'),
	signupValidation,
	loginValidation,
	validate,
	verifyToken,
	isAdmin,
	isUser,
	capitalize,
}
