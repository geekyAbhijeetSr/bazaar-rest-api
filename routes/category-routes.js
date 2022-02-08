const { Router } = require('express')
const { categoryValidation, validate } = require('../helper')
const { verifyToken, isAdmin } = require('../helper')
const categoryController = require('../controllers/category-controller')

const router = Router()

// @route    POST api/category/create
// @desc     Create a category
// @access   Private (Admin)
router.post(
	'/create',
	verifyToken,
	isAdmin,
	categoryValidation,
	validate,
	categoryController.createCategory
)

// @route    GET api/category/all
// @desc     Get all categories
// @access   Public
router.get('/all', categoryController.getCategories)

// @route    PUT api/category/:id
// @desc     Update a category
// @access   Private (Admin)
router.put(
	'/:catId',
	verifyToken,
	isAdmin,
	categoryValidation,
	validate,
	categoryController.updateCategory
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
