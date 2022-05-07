const { Router } = require('express')
const { signupValidation, loginValidation, validate } = require('../helper')
const authController = require('../controllers/auth-controller')
const { multerUploadFile, multerValidate, verifyToken } = require('../helper')

const router = Router()

// @route	POST api/auth/signup
// @desc 	Signup user
// @access	Public
router.post(
	'/signup',
	multerUploadFile('image'),
	signupValidation,
	validate,
	multerValidate,
	authController.signup
)

// @route	POST api/auth/login
// @desc 	Login user
// @access	Public
router.post('/login', loginValidation, validate, authController.login)

// @route 	POST api/auth/admin/signup
// @desc 	Signup admin
// @access	Public
router.post(
	'/dashboard/signup',
	multerUploadFile('image'),
	signupValidation,
	validate,
	multerValidate,
	authController.signup
)

// @route 	POST api/auth/admin/login
// @desc 	Login admin
// @access	Public
router.post('/dashboard/login', loginValidation, validate, authController.login)

// @route 	POST api/auth/logout
// @desc 	Logout user/admin
// @access  Private
router.post('/logout', verifyToken, authController.logout)

module.exports = router
