const { Router } = require('express')

const { signupValidation, loginValidation, validate } = require('../helper')
const authController = require('../controllers/auth-controller')

const router = Router()

// Request	Signup user
// POST 	/api/auth/signup
router.post(
	'/signup',
	signupValidation,
	validate,
	authController.signup
)

// Request	Login user
// POST 	/api/auth/login
router.post(
	'/login',
	loginValidation,
	validate,
	authController.login
)

// Request	Signup admin
// POST 	/api/auth/admin/signup
router.post(
	'/admin/signup',
	signupValidation,
	validate,
	authController.signup
)

// Request	Login admin
// POST 	/api/auth/admin/login
router.post(
	'/admin/login',
	loginValidation,
	validate,
	authController.login
)

module.exports = router
