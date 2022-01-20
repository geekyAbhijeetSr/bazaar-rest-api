const { Router } = require('express')
const { body } = require('express-validator')

const { validate } = require('../helper')
const authController = require('../controllers/auth-controller')

const router = Router()

// Request	Signup
// POST 	/api/auth/signup
router.post(
	'/signup',
	[
		body('firstname').notEmpty().withMessage('Firstname is required'),
		body('lastname').notEmpty().withMessage('Lastname is required'),
		body('password')
			.isLength({ min: 6 })
			.withMessage('Password must be at least 6 chars long'),
		body('email').isEmail().withMessage('Email is invalid'),
		body('role').notEmpty().withMessage('Role is required'),
	],
	validate,
	authController.signup
)

// Request	Login
// POST 	/api/auth/login
router.post(
	'/login',
	[
		body('email').isEmail().withMessage('Email is invalid'),
		body('password').notEmpty().withMessage('Password is required'),
	],
	validate,
	authController.login
)

module.exports = router
