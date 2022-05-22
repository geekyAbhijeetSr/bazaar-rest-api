const { Router } = require('express')
const categoryController = require('../controllers/category-controller')
const {
	authentication: { verifyToken, authRole },
	validation: { categoryValidation, validate },
} = require('../middleware')
const {
	multer_: { multerUploadFile, multerValidate },
	constants: { ROLE },
} = require('../../config')

const router = Router()

// @route    POST api/category/create
// @desc     Create a category
// @access   Private (Admin)
router.post(
	'/create',
	verifyToken,
	authRole([[ROLE.ADMIN]]),
	multerUploadFile('image'),
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
	authRole([ROLE.ADMIN]),
	multerUploadFile('image'),
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
	authRole([ROLE.ADMIN]),
	categoryController.toggleActiveCategory
)

// @route    DELETE api/category/:catId
// @desc     Delete a category
// @access   Private (Admin)
router.delete(
	'/:catId',
	verifyToken,
	authRole([ROLE.ADMIN]),
	categoryController.deleteCategory
)

module.exports = router
