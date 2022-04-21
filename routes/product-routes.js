const { Router } = require('express')
const productController = require('../controllers/product-controller')
const {
	verifyToken,
	isAdmin,
	multerUploadMultiFile,
	productValidation,
	validate,
	paginatedResponse,
} = require('../helper')
const { Product } = require('../models')

const router = Router()

const fields = [
	{ name: 'image_main', maxCount: 1 },
	{ name: 'image_1', maxCount: 1 },
	{ name: 'image_2', maxCount: 1 },
	{ name: 'image_3', maxCount: 1 },
	{ name: 'image_4', maxCount: 1 },
	{ name: 'image_5', maxCount: 1 },
]

// @route    POST api/product/create
// @desc     Create a product
// @access   Private (Admin)
router.post(
	'/create',
	verifyToken,
	isAdmin,
	multerUploadMultiFile(fields),
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
