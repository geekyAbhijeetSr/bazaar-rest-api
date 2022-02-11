const { Router } = require('express')
const productController = require('../controllers/product-controller')
const {
	verifyToken,
	isAdmin,
	multerUploadFiles,
	multerValidate,
	productValidation,
	validate,
} = require('../helper')

const router = Router()

// @route    POST api/product/create
// @desc     Create a product
// @access   Private (Admin)
router.post(
	'/create',
	verifyToken,
	isAdmin,
	multerUploadFiles,
	productValidation,
	validate,
	multerValidate,
	productController.createProduct
)

module.exports = router
