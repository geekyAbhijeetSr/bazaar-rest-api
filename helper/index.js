const {
	signupValidation,
	loginValidation,
	categoryValidation,
	validate,
} = require('./validation')
const { verifyToken, isAdmin, isUser } = require('./authentication')
const { capitalize, categoriesToTree } = require('./utils')

module.exports = {
	start: require('./start'),
	unknownRoutesHandler: require('./unknown-routes-handler'),
	signupValidation,
	loginValidation,
	categoryValidation,
	validate,
	verifyToken,
	isAdmin,
	isUser,
	capitalize,
	categoriesToTree,
}
