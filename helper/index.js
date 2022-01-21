const {
    signupValidation,
    loginValidation,
    validate
} = require('./validation')

module.exports = {
	start: require('./start'),
	unknownRoutesHandler: require('./unknown-routes-handler'),
	signupValidation,
	loginValidation,
	validate
}