const { body, validationResult } = require('express-validator')
const { HttpError } = require('../error')

exports.signupValidation = [
	body('firstname').notEmpty().withMessage('Firstname is required'),
	body('lastname').notEmpty().withMessage('Lastname is required'),
	body('email').isEmail().withMessage('Email is invalid'),
	body('password')
		.isLength({ min: 8 })
		.withMessage('Password must be at least 8 characters long'),
]

exports.loginValidation = [
	body('email').isEmail().withMessage('Email is invalid'),
	body('password').notEmpty().withMessage('Password is required'),
]

exports.categoryValidation = [
	body('name').notEmpty().withMessage('Name is required'),
]

exports.validate = (req, res, next) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		const error = new HttpError(errors.array(), 422)
		next(error)
	}
	next()
}
