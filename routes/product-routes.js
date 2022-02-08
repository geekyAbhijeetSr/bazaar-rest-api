const { Router } = require('express')
const { productValidation, validate } = require('../helper')
const {
	verifyToken,
	isAdmin,
	multerUploadFiles,
	multerValidate,
} = require('../helper')

const router = Router()

// @route    POST api/product/create
// @desc     Create a product
// @access   Private (Admin)
router.post(
	'/create',
	multerUploadFiles,
	productValidation,
	validate,
	multerValidate,
	(req, res, next) => {
		res.json({
			message: 'Create a Product',
		})
	}
)

// // @route    GET api/category/all
// // @desc     Get all categories
// // @access   Public
// router.get('/all', categoryController.getCategories)

// // @route    PUT api/category/:id
// // @desc     Update a category
// // @access   Private (Admin)
// router.put(
// 	'/:catId',
// 	verifyToken,
// 	isAdmin,
// 	categoryValidation,
// 	validate,
// 	categoryController.updateCategory
// )

// // @route    DELETE api/category/:catId
// // @desc     Delete a category
// // @access   Private (Admin)
// router.delete(
// 	'/:catId',
// 	verifyToken,
// 	isAdmin,
// 	categoryController.deleteCategory
// )

module.exports = router
