const { check, body, validationResult } = require('express-validator')
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

exports.productValidation = [
	body('name').notEmpty().withMessage('Name is required'),
	body('price').notEmpty().withMessage('Price is required'),
	body('mrp').notEmpty().withMessage('MRP is required'),
	body('stock').notEmpty().withMessage('Stock is required'),
	body('description').notEmpty().withMessage('Description is required'),
	body('category').notEmpty().withMessage('Category is required'),
	body('properties').notEmpty().withMessage('Properties is required'),
	check('image')
		.custom((value, { req }) => {
			if (req.file) {
				return true
			}
			if (req.files) {
				return true
			}
			return false
		})
		.withMessage('Image is required'),
]

exports.validate = (req, res, next) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		const error = new HttpError(errors.array(), 422)
		next(error)
	}
	next()
}
