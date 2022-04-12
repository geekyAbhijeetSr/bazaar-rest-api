const { Router } = require('express')
const productController = require('../controllers/product-controller')
const {
	verifyToken,
	isAdmin,
	multerUploadFiles,
	productValidation,
	validate,
	paginatedResponse,
} = require('../helper')
const { Product } = require('../models')

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
	productController.createProduct
)

// @route    GET api/product/all
// @desc     Get all products
// @access   Public
router.get('/all', paginatedResponse(Product), productController.getAllProducts)

// @route	GET api/product/:id
// @desc	Get a product by id
// @access	Public
router.get('/:id', productController.getProductById)

// @route	DELETE api/product/:id
// @desc	Delete a product
// @access	Private (Admin)
router.delete('/:id', verifyToken, isAdmin, productController.deleteProduct)

module.exports = router
