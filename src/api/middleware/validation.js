const { check, body, validationResult } = require('express-validator')
const { HttpError } = require('../error')
const {
	fs_: { removeLocalFile },
} = require('../helper')

// Auth validation
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

// Attribute validation
exports.attriCollectionValidation = [
	body('name').notEmpty().withMessage('Name is required'),
]

exports.attributeValidation = [
	body('name').notEmpty().withMessage('Name is required'),
]

// Category validation
exports.categoryValidation = [
	body('name').notEmpty().withMessage('Name is required'),
]

// Product validation
exports.productValidation = [
	body('name').notEmpty().withMessage('Name is required'),
	body('brand').notEmpty().withMessage('Brand name is required'),
	body('description').notEmpty().withMessage('Description is required'),
	body('topLevelCat').notEmpty().withMessage('Top level category is required'),
	body('secondLevelCat')
		.notEmpty()
		.withMessage('Second level category is required'),
	body('thirdLevelCat')
		.notEmpty()
		.withMessage('Third level category is required'),
	body('properties').notEmpty().withMessage('Properties is required'),
	body('mrp').notEmpty().withMessage('MRP is required'),
	body('price').notEmpty().withMessage('Price is required'),
	body('stock').notEmpty().withMessage('Stock is required'),
	check('image_main').custom((value, { req }) => {
		if (req.files.image_main && !req.multerError) {
			return true
		}
		const message = req.multerError || 'Main image is required'
		throw new Error(message)
	}),
]

exports.validate = (req, res, next) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		if (req.file) {
			removeLocalFile(req.file.path)
		}
		if (req.files) {
			if (Array.isArray(req.files)) {
				req.files.forEach(file => {
					removeLocalFile(file.path)
				})
			} else if (typeof req.files === 'object') {
				const keys = Object.keys(req.files)
				keys.forEach(key => {
					req.files[key].forEach(file => {
						removeLocalFile(file.path)
					})
				})
			}
		}
		const error = new HttpError(errors.array(), 422)
		next(error)
	}
	next()
}
