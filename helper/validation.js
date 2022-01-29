const { body, validationResult } = require('express-validator')
const { HttpError } = require('../error')

const signupValidation = [
	body('firstname').notEmpty().withMessage('Firstname is required'),
	body('lastname').notEmpty().withMessage('Lastname is required'),
	body('email').isEmail().withMessage('Email is invalid'),
	body('password')
		.isLength({ min: 8 })
		.withMessage('Password must be at least 8 characters long'),
]

const loginValidation = [
	body('email').isEmail().withMessage('Email is invalid'),
	body('password').notEmpty().withMessage('Password is required'),
]

const validate = (req, res, next) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		const error = new HttpError(errors.array(), 422)
		next(error)
	}
	next()
}

module.exports = {
	validate,
	signupValidation,
	loginValidation,
}
