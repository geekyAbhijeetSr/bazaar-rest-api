const { Router } = require('express')
const {
	verifyToken,
	isAdmin,
	categoryValidation,
	multerUploadFile,
	multerValidate,
	validate,
} = require('../helper')
const categoryController = require('../controllers/category-controller')

const router = Router()

// @route    POST api/category/create
// @desc     Create a category
// @access   Private (Admin)
router.post(
	'/create',
	verifyToken,
	isAdmin,
	multerUploadFile,
	categoryValidation,
	validate,
	multerValidate,
	categoryController.createCategory
)

// @route    GET api/category/all
// @desc     Get all categories
// @access   Public
router.get('/all', categoryController.getCategories)

// @route    PUT api/category/:catId
// @desc     Update a category
// @access   Private (Admin)
router.put(
	'/:catId',
	verifyToken,
	isAdmin,
	multerUploadFile,
	categoryValidation,
	validate,
	multerValidate,
	categoryController.updateCategory
)

// @route	put api/category/toggle/:catId
// @desc	toggle category status
// @access	Private (Admin)
router.put(
	'/toggle/:catId',
	verifyToken,
	isAdmin,
	categoryController.toggleActiveCategory
)

// @route    DELETE api/category/:catId
// @desc     Delete a category
// @access   Private (Admin)
router.delete(
	'/:catId',
	verifyToken,
	isAdmin,
	categoryController.deleteCategory
)

module.exports = router
