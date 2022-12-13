const { Router } = require('express')
const { Product } = require('../models')
const productController = require('../controllers/product-controller')
const { verifyToken, authRole } = require('../middleware/authentication')
const {
	productValidation,
	productValidation2,
	validate,
} = require('../middleware/validation')
const { paginatedResponse, scopedPaginatedResponse } = require('../middleware/pagination')
const { canModify } = require('../middleware/permissions')
const { ROLE } = require('../../config/constants')
const { multerUploadMultiFile } = require('../../config/multer_')

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

// @route	PUT api/product/update/:id
// @desc	Update a product by id
// @access	Private
router.put(
	'/update/:id',
	verifyToken,
	authRole([ROLE.ADMIN, ROLE.VENDOR]),
	canModify(
		Product,
		'Product not found',
		'You are not allowed to update this product'
	),
	multerUploadMultiFile(multerFilesFields),
	productValidation2,
	validate,
	productController.updateProductById
)

// @route	DELETE api/product/remove/:id
// @desc	Delete a product
// @access	Private (Admin)
router.delete(
	'/remove/:id',
	verifyToken,
	authRole([ROLE.ADMIN, ROLE.VENDOR]),
	canModify(
		Product,
		'Product not found',
		'You are not allowed to delete this product'
	),
	productController.deleteProduct
)

module.exports = router
