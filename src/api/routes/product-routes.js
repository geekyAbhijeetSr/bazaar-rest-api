const { Router } = require('express')
const { Product } = require('../models')
const productController = require('../controllers/product-controller')
const {
	authentication: { verifyToken, authRole },
	validation: { productValidation, validate },
	pagination: { paginatedResponse, scopedPaginatedResponse },
	permissions: { canDelete },
} = require('../middleware')
const {
	constants: { ROLE },
	multer_: { multerUploadMultiFile },
} = require('../../config')

const router = Router()

const multerFilesFields = [
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
	authRole([ROLE.ADMIN, ROLE.VENDOR]),
	multerUploadMultiFile(multerFilesFields),
	productValidation,
	validate,
	productController.createProduct
)

// @route    GET api/product/get?page=x&limit=y
// @desc     Get all products
// @access   Public
router.get('/get', paginatedResponse(Product), productController.getProducts)

// @route    GET api/product/dashboard-get?page=x&limit=y
// @desc     Get all products
// @access   Private
router.get(
	'/dashboard-get',
	verifyToken,
	scopedPaginatedResponse(Product),
	productController.getProducts
)

// @route	GET api/product/:id
// @desc	Get a product by id
// @access	Public
router.get('/:id', productController.getProductById)

// @route	DELETE api/product/:id
// @desc	Delete a product
// @access	Private (Admin)
router.delete(
	'/:id',
	verifyToken,
	authRole([ROLE.ADMIN, ROLE.VENDOR]),
	canDelete(Product, 'Product not found', 'You are not allowed to delete this product'),
	productController.deleteProduct
)

module.exports = router
